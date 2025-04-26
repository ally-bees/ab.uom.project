using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services
{
    public class MongoDBService
    {
        private readonly IMongoCollection<Sale> _salesCollection;
        private readonly IMongoCollection<Order> _ordersCollection;
        private readonly IMongoCollection<Inventory> _inventoryCollection;

        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);

            _salesCollection = mongoDatabase.GetCollection<Sale>("sales");
            _ordersCollection = mongoDatabase.GetCollection<Order>("orders");
            _inventoryCollection = mongoDatabase.GetCollection<Inventory>("inventory");

            // Create indexes for better query performance

            // Sales collection indexes
            var saleIdIndex = Builders<Sale>.IndexKeys.Ascending(s => s.SaleId);
            _salesCollection.Indexes.CreateOne(new CreateIndexModel<Sale>(saleIdIndex));

            var saleDateIndex = Builders<Sale>.IndexKeys.Ascending(s => s.SaleDate);
            _salesCollection.Indexes.CreateOne(new CreateIndexModel<Sale>(saleDateIndex));

            // Orders collection indexes
            var orderIdIndex = Builders<Order>.IndexKeys.Ascending(o => o.OrderId);
            _ordersCollection.Indexes.CreateOne(new CreateIndexModel<Order>(orderIdIndex));

            var customerIdIndex = Builders<Order>.IndexKeys.Ascending(o => o.CustomerId);
            _ordersCollection.Indexes.CreateOne(new CreateIndexModel<Order>(customerIdIndex));

            var orderDateIndex = Builders<Order>.IndexKeys.Ascending(o => o.OrderDate);
            _ordersCollection.Indexes.CreateOne(new CreateIndexModel<Order>(orderDateIndex));

            // Inventory collection indexes
            var productIdIndex = Builders<Inventory>.IndexKeys.Ascending(i => i.ProductId);
            _inventoryCollection.Indexes.CreateOne(new CreateIndexModel<Inventory>(productIdIndex));

            var categoryIndex = Builders<Inventory>.IndexKeys.Ascending(i => i.Category);
            _inventoryCollection.Indexes.CreateOne(new CreateIndexModel<Inventory>(categoryIndex));
        }

        // Sales methods
        public async Task<List<Sale>> GetAllSalesAsync() =>
            await _salesCollection.Find(_ => true).ToListAsync();

        public async Task<Sale> GetSaleByIdAsync(string id) =>
            await _salesCollection.Find(s => s.Id == id).FirstOrDefaultAsync();

        public async Task CreateSaleAsync(Sale sale) =>
            await _salesCollection.InsertOneAsync(sale);

        public async Task UpdateSaleAsync(string id, Sale sale) =>
            await _salesCollection.ReplaceOneAsync(s => s.Id == id, sale);

        public async Task DeleteSaleAsync(string id) =>
            await _salesCollection.DeleteOneAsync(s => s.Id == id);

        // Orders methods
        public async Task<List<Order>> GetAllOrdersAsync() =>
            await _ordersCollection.Find(_ => true).ToListAsync();

        public async Task<Order> GetOrderByOrderIdAsync(string orderId) =>
            await _ordersCollection.Find(o => o.OrderId == orderId).FirstOrDefaultAsync();

        public async Task CreateOrderAsync(Order order) =>
            await _ordersCollection.InsertOneAsync(order);

        public async Task UpdateOrderAsync(string id, Order order) =>
            await _ordersCollection.ReplaceOneAsync(o => o.Id == id, order);

        public async Task DeleteOrderAsync(string id) =>
            await _ordersCollection.DeleteOneAsync(o => o.Id == id);

        // Inventory methods
        public async Task<List<Inventory>> GetAllInventoryAsync() =>
            await _inventoryCollection.Find(_ => true).ToListAsync();

        public async Task<Inventory> GetInventoryByIdAsync(string id) =>
            await _inventoryCollection.Find(i => i.Id == id).FirstOrDefaultAsync();

        public async Task<Inventory> GetInventoryByProductIdAsync(string productId) =>
            await _inventoryCollection.Find(i => i.ProductId == productId).FirstOrDefaultAsync();

        public async Task CreateInventoryAsync(Inventory inventory) =>
            await _inventoryCollection.InsertOneAsync(inventory);

        public async Task UpdateInventoryAsync(string id, Inventory inventory) =>
            await _inventoryCollection.ReplaceOneAsync(i => i.Id == id, inventory);

        public async Task DeleteInventoryAsync(string id) =>
            await _inventoryCollection.DeleteOneAsync(i => i.Id == id);

        public IMongoCollection<Order> GetOrdersCollection()
        {
            return _ordersCollection;
        }
    }
}
