using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Globalization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class MongoDbCustomerInsightService
    {
        private readonly IMongoCollection<Customerr> _CollectionCus;
        private readonly IMongoCollection<Order> _CollectionOrdet;

        private readonly IMongoCollection<Inventory> _CollectionInven;

        public MongoDbCustomerInsightService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var settings = mongoDBSettings.Value;

            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _CollectionOrdet = database.GetCollection<Order>("orders");
            _CollectionCus = database.GetCollection<Customerr>("customers");
            _CollectionInven = database.GetCollection<Inventory>("inventory");

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


        public async Task<List<Customerr>> GettableAsync(DateTime? from, DateTime? to)
        {
            if (!from.HasValue || !to.HasValue)
            {
                var allRecords = await _CollectionCus.Find(FilterDefinition<Customerr>.Empty).ToListAsync();
                return allRecords;

            }

            var fromString = from.Value.ToString("yyyy-MM-dd");
            var toString = to.Value.ToString("yyyy-MM-dd");

            var filter = Builders<Customerr>.Filter.And(
                Builders<Customerr>.Filter.Gte(t => t.Estimate_date, fromString),
                Builders<Customerr>.Filter.Lte(t => t.Estimate_date, toString)
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
            var customerCount = await _CollectionCus.CountDocumentsAsync(FilterDefinition<Customerr>.Empty);

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

        public async Task<Dictionary<string, decimal>> GetMonthlyPurchaseByProductAsync(string productId, int year)
        {
            var start = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var end = new DateTime(year + 1, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            var pipeline = new List<BsonDocument>
    {
        new BsonDocument("$match", new BsonDocument
        {
            { "orderDate", new BsonDocument { { "$gte", start }, { "$lt", end } } }
        }),
        new BsonDocument("$unwind", "$orderDetails"),
        new BsonDocument("$match", new BsonDocument("orderDetails.productId", productId)),
        new BsonDocument("$group", new BsonDocument
        {
            { "_id", new BsonDocument("month", new BsonDocument("$month", "$orderDate")) },
            { "total", new BsonDocument("$sum", new BsonDocument("$multiply", new BsonArray {
                "$orderDetails.quantity", "$orderDetails.price"
            })) }
        }),
        new BsonDocument("$sort", new BsonDocument("_id.month", 1))
    };

            var result = await _CollectionOrdet.Aggregate<BsonDocument>(pipeline).ToListAsync();

            var monthlyData = new Dictionary<string, decimal>();
            foreach (var doc in result)
            {
                int month = doc["_id"]["month"].AsInt32;
                decimal total = doc["total"].ToDecimal();
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(month);
                monthlyData[monthName] = total;
            }

            return monthlyData;
        }

        //just to operate with database 
        //not for application


        public async Task CreateAsync(Customerr customer)
        {
            await _CollectionCus.InsertOneAsync(customer);
        }

        public async Task<Customerr> GetByCustomerIdAsync(string customerId)
        {
            var filter = Builders<Customerr>.Filter.Eq(x => x.Customer_id, customerId);
            return await _CollectionCus.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAsync(string customerId, Customerr updatedCustomer)
        {
            var filter = Builders<Customerr>.Filter.Eq(x => x.Customer_id, customerId);
            var result = await _CollectionCus.ReplaceOneAsync(filter, updatedCustomer);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string customerId)
        {
            var filter = Builders<Customerr>.Filter.Eq(x => x.Customer_id, customerId);
            var result = await _CollectionCus.DeleteOneAsync(filter);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }


    }


}

