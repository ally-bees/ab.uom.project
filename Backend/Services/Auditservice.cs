using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson; 
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Backend.Services
{
    public class Auditservice
    {
        private readonly IMongoCollection<Table> _CollectionAudit;
        private readonly IMongoCollection<AuditLog> _auditLogsCollection;

        public Auditservice(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var settings = mongoDBSettings.Value;

            var client = new MongoClient(settings.ConnectionString);    
            var database = client.GetDatabase(settings.DatabaseName); 

            _CollectionAudit = database.GetCollection<Table>("audit");
            _auditLogsCollection = database.GetCollection<AuditLog>("audit_logs");
        }

        // Existing methods for Table collection
        public async Task<List<Table>> GetFilteredAsync(DateTime? from, DateTime? to)
        {
            if (!from.HasValue || !to.HasValue)
            {
                var allRecords = await _CollectionAudit.Find(FilterDefinition<Table>.Empty).ToListAsync();
                return allRecords;
            }

            var fromString = from.Value.ToString("yyyy-MM-dd");
            var toString = to.Value.ToString("yyyy-MM-dd");

            var filter = Builders<Table>.Filter.And(
                Builders<Table>.Filter.Gte(t => t.Date, fromString),
                Builders<Table>.Filter.Lte(t => t.Date, toString)
            );

            return await _CollectionAudit.Find(filter).ToListAsync(); 
        }

        public async Task<Dictionary<string, double>> GetTotalSumsAsync(string from, string to)
        {
            DateTime fromDate, toDate;
            
            if (!DateTime.TryParse(from, out fromDate))
            {
                Console.WriteLine($"Failed to parse from date: {from}");
                fromDate = DateTime.MinValue;
            }
            
            if (!DateTime.TryParse(to, out toDate))
            {
                Console.WriteLine($"Failed to parse to date: {to}");
                toDate = DateTime.Now;
            }

            var fromDateStr = fromDate.ToString("yyyy-MM-dd");
            var toDateStr = toDate.ToString("yyyy-MM-dd");

            Console.WriteLine($"Calculating totals from {fromDateStr} to {toDateStr}");

            var filter = Builders<Table>.Filter.And(
                Builders<Table>.Filter.Gte(t => t.Date, fromDateStr),
                Builders<Table>.Filter.Lte(t => t.Date, toDateStr)
            );

            Console.WriteLine($"Filter: {filter.ToBsonDocument()}");

            var matchingDocs = await _CollectionAudit.Find(filter).ToListAsync();
            Console.WriteLine($"Found {matchingDocs.Count} documents matching the date range");

            var totals = new Dictionary<string, double>
            {
                ["total_value"] = matchingDocs.Sum(doc => doc.Value ?? 0),
                ["total_tax"] = matchingDocs.Sum(doc => doc.Tax ?? 0),
                ["total_netvalue"] = matchingDocs.Sum(doc => doc.NetValue ?? 0)
            };

            return totals;
        }

        public async Task<Dictionary<string, double>> GetlastthreetaxAsync()
        {
            var currentYear = DateTime.Now.Year;
            var summary = new Dictionary<string, double>();

            for (int year = currentYear - 2; year <= currentYear; year++)
            {
                var fromDate = new DateTime(year, 1, 1).ToString("yyyy-MM-dd");
                var toDate = new DateTime(year, 12, 31).ToString("yyyy-MM-dd");

                var filter = Builders<Table>.Filter.And(
                    Builders<Table>.Filter.Gte(t => t.Date, fromDate),
                    Builders<Table>.Filter.Lte(t => t.Date, toDate)
                );

                var yearDocs = await _CollectionAudit.Find(filter).ToListAsync();
                var yearTotal = yearDocs.Sum(doc => doc.Tax ?? 0);
                summary[$"tax_{year}"] = yearTotal;
            }

            return summary;
        }

        // New Audit Log methods
        public async Task<AuditLog> CreateAuditLogAsync(AuditLog auditLog)
        {
            await _auditLogsCollection.InsertOneAsync(auditLog);
            return auditLog;
        }

        public async Task<List<AuditLog>> GetAuditLogsAsync(AuditLogFilter filter)
        {
            var builder = Builders<AuditLog>.Filter;
            var filterDefinition = builder.Empty;

            // Date range filter
            if (filter.FromDate.HasValue || filter.ToDate.HasValue)
            {
                var dateFilter = builder.Empty;
                if (filter.FromDate.HasValue)
                    dateFilter &= builder.Gte(x => x.Timestamp, filter.FromDate.Value);
                if (filter.ToDate.HasValue)
                    dateFilter &= builder.Lte(x => x.Timestamp, filter.ToDate.Value.AddDays(1));
                filterDefinition &= dateFilter;
            }

            // User filters
            if (!string.IsNullOrEmpty(filter.UserId))
                filterDefinition &= builder.Eq(x => x.UserId, filter.UserId);
            if (!string.IsNullOrEmpty(filter.Username))
                filterDefinition &= builder.Regex(x => x.Username, new MongoDB.Bson.BsonRegularExpression(filter.Username, "i"));

            // Action and resource filters
            if (!string.IsNullOrEmpty(filter.ActionType))
                filterDefinition &= builder.Eq(x => x.ActionType, filter.ActionType);
            if (!string.IsNullOrEmpty(filter.Resource))
                filterDefinition &= builder.Eq(x => x.Resource, filter.Resource);

            // Status and severity filters
            if (!string.IsNullOrEmpty(filter.Status))
                filterDefinition &= builder.Eq(x => x.Status, filter.Status);
            if (!string.IsNullOrEmpty(filter.Severity))
                filterDefinition &= builder.Eq(x => x.Severity, filter.Severity);

            // Module filter
            if (!string.IsNullOrEmpty(filter.Module))
                filterDefinition &= builder.Eq(x => x.Module, filter.Module);

            var sort = Builders<AuditLog>.Sort.Descending(x => x.Timestamp);
            var skip = (filter.Page - 1) * filter.PageSize;

            return await _auditLogsCollection
                .Find(filterDefinition)
                .Sort(sort)
                .Skip(skip)
                .Limit(filter.PageSize)
                .ToListAsync();
        }

        public async Task<long> GetAuditLogsCountAsync(AuditLogFilter filter)
        {
            var builder = Builders<AuditLog>.Filter;
            var filterDefinition = builder.Empty;

            // Apply same filters as GetAuditLogsAsync but without pagination
            if (filter.FromDate.HasValue || filter.ToDate.HasValue)
            {
                var dateFilter = builder.Empty;
                if (filter.FromDate.HasValue)
                    dateFilter &= builder.Gte(x => x.Timestamp, filter.FromDate.Value);
                if (filter.ToDate.HasValue)
                    dateFilter &= builder.Lte(x => x.Timestamp, filter.ToDate.Value.AddDays(1));
                filterDefinition &= dateFilter;
            }

            if (!string.IsNullOrEmpty(filter.UserId))
                filterDefinition &= builder.Eq(x => x.UserId, filter.UserId);
            if (!string.IsNullOrEmpty(filter.Username))
                filterDefinition &= builder.Regex(x => x.Username, new MongoDB.Bson.BsonRegularExpression(filter.Username, "i"));
            if (!string.IsNullOrEmpty(filter.ActionType))
                filterDefinition &= builder.Eq(x => x.ActionType, filter.ActionType);
            if (!string.IsNullOrEmpty(filter.Resource))
                filterDefinition &= builder.Eq(x => x.Resource, filter.Resource);
            if (!string.IsNullOrEmpty(filter.Status))
                filterDefinition &= builder.Eq(x => x.Status, filter.Status);
            if (!string.IsNullOrEmpty(filter.Severity))
                filterDefinition &= builder.Eq(x => x.Severity, filter.Severity);
            if (!string.IsNullOrEmpty(filter.Module))
                filterDefinition &= builder.Eq(x => x.Module, filter.Module);

            return await _auditLogsCollection.CountDocumentsAsync(filterDefinition);
        }

        public async Task<AuditLogSummary> GetAuditLogSummaryAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var builder = Builders<AuditLog>.Filter;
            var filterDefinition = builder.Empty;

            if (fromDate.HasValue || toDate.HasValue)
            {
                var dateFilter = builder.Empty;
                if (fromDate.HasValue)
                    dateFilter &= builder.Gte(x => x.Timestamp, fromDate.Value);
                if (toDate.HasValue)
                    dateFilter &= builder.Lte(x => x.Timestamp, toDate.Value.AddDays(1));
                filterDefinition &= dateFilter;
            }

            var summary = new AuditLogSummary();

            // Get total counts
            summary.TotalLogs = await _auditLogsCollection.CountDocumentsAsync(filterDefinition);
            summary.SuccessCount = await _auditLogsCollection.CountDocumentsAsync(filterDefinition & builder.Eq(x => x.Status, "Success"));
            summary.FailedCount = await _auditLogsCollection.CountDocumentsAsync(filterDefinition & builder.Eq(x => x.Status, "Failed"));
            summary.PendingCount = await _auditLogsCollection.CountDocumentsAsync(filterDefinition & builder.Eq(x => x.Status, "Pending"));

            // Get action type counts
            var actionTypePipeline = new[]
            {
                new BsonDocument("$match", filterDefinition.ToBsonDocument()),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$action_type" },
                    { "count", new BsonDocument("$sum", 1) }
                })
            };
            var actionTypeResults = await _auditLogsCollection.Aggregate<BsonDocument>(actionTypePipeline).ToListAsync();
            foreach (var result in actionTypeResults)
            {
                summary.ActionTypeCounts[result["_id"].AsString] = result["count"].AsInt64;
            }

            // Get module counts
            var modulePipeline = new[]
            {
                new BsonDocument("$match", filterDefinition.ToBsonDocument()),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$module" },
                    { "count", new BsonDocument("$sum", 1) }
                })
            };
            var moduleResults = await _auditLogsCollection.Aggregate<BsonDocument>(modulePipeline).ToListAsync();
            foreach (var result in moduleResults)
            {
                summary.ModuleCounts[result["_id"].AsString] = result["count"].AsInt64;
            }

            // Get severity counts
            var severityPipeline = new[]
            {
                new BsonDocument("$match", filterDefinition.ToBsonDocument()),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$severity" },
                    { "count", new BsonDocument("$sum", 1) }
                })
            };
            var severityResults = await _auditLogsCollection.Aggregate<BsonDocument>(severityPipeline).ToListAsync();
            foreach (var result in severityResults)
            {
                summary.SeverityCounts[result["_id"].AsString] = result["count"].AsInt64;
            }

            // Get recent logs
            summary.RecentLogs = await _auditLogsCollection
                .Find(filterDefinition)
                .Sort(Builders<AuditLog>.Sort.Descending(x => x.Timestamp))
                .Limit(10)
                .ToListAsync();

            return summary;
        }

        public async Task<List<string>> GetDistinctValuesAsync(string field)
        {
            var filter = FilterDefinition<AuditLog>.Empty;
            return await _auditLogsCollection.Distinct<string>(field, filter).ToListAsync();
        }

        public async Task<bool> DeleteAuditLogsAsync(DateTime beforeDate)
        {
            var filter = Builders<AuditLog>.Filter.Lt(x => x.Timestamp, beforeDate);
            var result = await _auditLogsCollection.DeleteManyAsync(filter);
            return result.DeletedCount > 0;
        }
    }
}

