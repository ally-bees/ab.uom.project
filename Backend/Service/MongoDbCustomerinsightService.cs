using Backendcustomerinsight.Models;
using Backendcustomerinsight.Collection; 
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backendcustomerinsight.Service
{
    public class MongoDBService
    {
        private readonly IMongoCollection<Customer> _CollectionCus;
        private readonly IMongoCollection<Order> _CollectionOrdet;

        private readonly IMongoCollection<Inventory> _CollectionInven;

        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            var database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _CollectionOrdet = database.GetCollection<Order>(mongoDBSettings.Value.CollectionName1);
            _CollectionCus = database.GetCollection<Customer>(mongoDBSettings.Value.CollectionName2);
            _CollectionInven = database.GetCollection<Inventory>(mongoDBSettings.Value.CollectionName3);

        }

        public async Task<(string Name, string Location)> GetTopCustomerByOrderCountAsync()
        {
            // Step 1: Group Orders by CustomerId, Count Orders, Sort Descending, Get Top 1
            var group = await _CollectionOrdet.Aggregate()
                .Group(o => o.CustomerId, g => new { CustomerId = g.Key, OrderCount = g.Count() })
                .SortByDescending(g => g.OrderCount)
                .Limit(1)
                .FirstOrDefaultAsync();

            if (group == null || string.IsNullOrEmpty(group.CustomerId))
                return ("", "");

            // Step 2: Fetch Customer by Id
            var customer = await _CollectionCus
                .Find(c => c.Customer_id == group.CustomerId)
                .FirstOrDefaultAsync();

            if (customer == null)
                return ("", "");

            return (customer.Name ?? "", customer.Location ?? "");
        }

        public async Task<(string ProductId, string Name)> GetTopProductByOrderCountAsync()
        {
            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$unwind", "$orderDetails"),
                new BsonDocument("$group", new BsonDocument
            {
                { "_id", "$orderDetails.productId" },
                { "count", new BsonDocument("$sum", 1) }
            }),
            new BsonDocument("$sort", new BsonDocument("count", -1)),
            new BsonDocument("$limit", 1)
        };

            var group = await _CollectionOrdet.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync();

            if (group == null || !group.Contains("_id") || group["_id"].IsBsonNull)
            {
                return ("", "");
            }


            var topProductId = group["_id"].AsString;

            var filter = Builders<Inventory>.Filter.Eq("product_id", topProductId);
            var product = await _CollectionInven.Find(filter).FirstOrDefaultAsync();

            if (product == null)
            {
                return ("", "");
            }

            return (product.ProductId, product.Name);
        }


        public async Task<List<Customer>> GettableAsync(DateTime? from, DateTime? to)
        {
            if (!from.HasValue || !to.HasValue)
            {
                var allRecords = await _CollectionCus.Find(FilterDefinition<Customer>.Empty).ToListAsync();
                return allRecords;

            }

            var fromString = from.Value.ToString("yyyy-MM-dd");
            var toString = to.Value.ToString("yyyy-MM-dd");

            var filter = Builders<Customer>.Filter.And(
                Builders<Customer>.Filter.Gte(t => t.Estimate_date, fromString),
                Builders<Customer>.Filter.Lte(t => t.Estimate_date, toString)
            );

            return await _CollectionCus.Find(filter).ToListAsync();
        }

        public async Task<Phurrate> Getphurchaserate(string? pid)
        {
            //get product name for phurchase rate
            var product = await _CollectionInven.Find(i => i.ProductId == pid).FirstOrDefaultAsync();
            string productName = product?.Name ?? "Unknown Product";

            //get total quantity sold for phurchase rate
            var ordersWithProduct = await _CollectionOrdet
                .Find(o => o.OrderDetails.Any(od => od.ProductId == pid))
                .ToListAsync();

            int totalSold = ordersWithProduct
                .SelectMany(o => o.OrderDetails)
                .Where(od => od.ProductId == pid)
                .Sum(od => od.Quantity);

            //get total customer count
            var customerCount = await _CollectionCus.CountDocumentsAsync(FilterDefinition<Customer>.Empty);

            //get phurchase value
            var productvalue = await _CollectionInven.Find(j => j.ProductId == pid).FirstOrDefaultAsync();
            double value = productvalue?.Price ?? 0.0;


            return new Phurrate
            {
                ProductName = productName,
                ProductSoldCount = totalSold,
                TotalCustomerCount = (int)customerCount,
                Value = value
            };

        }


        public async Task<List<LocationCustomerCount>> GetCustomerCountByLocationAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument
                {
                    { "$group", new BsonDocument
                    {
                        { "_id", "$location" },
                        { "count", new BsonDocument("$sum", 1) }
                    }
                    }
                },
                new BsonDocument
                {
                    { "$project", new BsonDocument
                    {
                        { "_id", 0 },
                        { "location", "$_id" },
                        { "count", 1 }
                    }
                    }
                }
            };

            var result = await _CollectionCus.Aggregate<BsonDocument>(pipeline).ToListAsync();

            // Convert BsonDocument to your POCO
            var output = result.Select(doc => new LocationCustomerCount
            {
                Location = doc["location"].AsString,
                Count = doc["count"].AsInt32
            }).ToList();

            return output;
        }

        public async Task<Activeinactive> Getactiveinactive()
        {
            var active = await _CollectionCus
                .CountDocumentsAsync(a => a.Status == "active");


            var inactive = await _CollectionCus
                .CountDocumentsAsync(a => a.Status == "inactive");


            return new Activeinactive
            {
                ACount = active,
                IACount = inactive
            };


        }

    }
   
    
}

