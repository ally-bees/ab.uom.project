using auditpagebackend.Models;
using auditpagebackend.Collection; 
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace auditpagebackend.Service
{
    public class MongoDBService
    {
        private readonly IMongoCollection<Table> _CollectionAudit;

        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            var database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _CollectionAudit = database.GetCollection<Table>(mongoDBSettings.Value.CollectionName);
        }

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

                if (matchingDocs.Count > 0)
                {
                    var pipeline = new BsonDocument[]
                    {
                        new BsonDocument("$match", filter.ToBsonDocument()),
                        new BsonDocument("$group", new BsonDocument
                        {
                            { "_id", BsonNull.Value },
                            { "TotalValue", new BsonDocument("$sum", "$value") },
                            { "TotalTax", new BsonDocument("$sum", "$tax") },
                            { "TotalNetValue", new BsonDocument("$sum", "$netvalue") }
                        })
                    };

                    var result = await _CollectionAudit.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync();
                    
                    if (result != null)
                    {
                        Console.WriteLine("Aggregation results found");
                        return new Dictionary<string, double>
                        {
                            { "TotalValue", result["TotalValue"]?.ToDouble() ?? 0 },
                            { "TotalTax", result["TotalTax"]?.ToDouble() ?? 0 },
                            { "TotalNetValue", result["TotalNetValue"]?.ToDouble() ?? 0 }
                        };
                    }
                }

                double totalValue = 0, totalTax = 0, totalNetValue = 0;
                
                foreach (var doc in matchingDocs)
                {
                    totalValue += doc.Value ?? 0;
                    totalTax += doc.Tax ?? 0;
                    totalNetValue += doc.NetValue ?? 0;
                }
                
                Console.WriteLine($"Calculated totals manually: Value={totalValue}, Tax={totalTax}, NetValue={totalNetValue}");
                
                return new Dictionary<string, double>
                {
                    { "TotalValue", totalValue },
                    { "TotalTax", totalTax },
                    { "TotalNetValue", totalNetValue }
                };
            }
    
        public async Task<Dictionary<int,double>> GetlastthreetaxAsync(){
            
            var result = new Dictionary<int,double>();
            var currentYear=DateTime.Now.Year;

            var allDocs = await _CollectionAudit.Find(_ => true).ToListAsync();

            for (int year = currentYear; year > currentYear - 3; year--)
            {
                var yearDocs = allDocs.Where(doc =>
                {
                    if (!string.IsNullOrWhiteSpace(doc.Date) &&
                        DateTime.TryParse(doc.Date, out var parsedDate))
                    {
                        return parsedDate.Year == year;
                    }
                    return false;
                });

                result[year] = yearDocs.Sum(doc => doc.Tax ?? 0);
            }
            return result;
        }
    }
    
}

