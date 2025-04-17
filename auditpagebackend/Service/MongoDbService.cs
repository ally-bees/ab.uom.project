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

        public async Task<List<Table>> GetAllAsync()
        {
            return await _CollectionAudit.Find(_ => true).ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetTotalSumsAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument
                {
                    { "$group", new BsonDocument
                        {
                            { "_id", BsonNull.Value },
                            { "TotalValue", new BsonDocument("$sum", "$value") },
                            { "TotalTax", new BsonDocument("$sum", "$tax") },
                            { "TotalNetValue", new BsonDocument("$sum", "$netvalue") }
                        }
                    }
                }
            };
        
            var result = await _CollectionAudit.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync();

                return new Dictionary<string, int>
                {
                    { "TotalValue", Convert.ToInt32(result?["TotalValue"].ToDouble() ?? 0) },
                    { "TotalTax", Convert.ToInt32(result?["TotalTax"].ToDouble() ?? 0) },
                    { "TotalNetValue", Convert.ToInt32(result?["TotalNetValue"].ToDouble() ?? 0) }
                };

        }

        
    }
}
