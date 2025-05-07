using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InventoryService
    {
        private readonly IMongoCollection<Inventory> _inventoryCollection;
        private readonly IMongoCollection<Order> _orderCollection;

        public InventoryService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);

            _inventoryCollection = database.GetCollection<Inventory>("inventory");
            _orderCollection = database.GetCollection<Order>("orders"); // <-- new line
        }

        public async Task<List<Inventory>> GetAllAsync() =>
            await _inventoryCollection.Find(_ => true).ToListAsync();

        public async Task<Inventory> GetByIdAsync(string id) =>
            await _inventoryCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<Inventory> GetByProductIdAsync(string productId) =>
            await _inventoryCollection.Find(x => x.ProductId == productId).FirstOrDefaultAsync();

        public async Task CreateAsync(Inventory item) =>
            await _inventoryCollection.InsertOneAsync(item);

        public async Task UpdateAsync(string id, Inventory item) =>
            await _inventoryCollection.ReplaceOneAsync(x => x.Id == id, item);

        public async Task DeleteAsync(string id) =>
            await _inventoryCollection.DeleteOneAsync(x => x.Id == id);

        // ✅ New method for top-selling products
        public async Task<List<Inventory>> GetBestSellingProductsAsync(int limit = 10)
        {
            var orders = await _orderCollection.Find(_ => true).ToListAsync();

            var productSales = new Dictionary<string, int>();

            foreach (var order in orders)
            {
                foreach (var detail in order.OrderDetails)
                {
                    if (productSales.ContainsKey(detail.ProductId))
                        productSales[detail.ProductId] += detail.Quantity;
                    else
                        productSales[detail.ProductId] = detail.Quantity;
                }
            }

            var topProductIds = productSales
                .OrderByDescending(x => x.Value)
                .Take(limit)
                .Select(x => x.Key)
                .ToList();

            var filter = Builders<Inventory>.Filter.In(i => i.ProductId, topProductIds);
            var products = await _inventoryCollection.Find(filter).ToListAsync();

            // Optional: sort by sales count
            products = products.OrderByDescending(p => productSales[p.ProductId]).ToList();

            return products;
        }
    }
}
