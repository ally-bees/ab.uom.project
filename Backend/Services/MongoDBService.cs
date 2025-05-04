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
        private readonly IMongoCollection<Expense> _expensesCollection;
        private readonly IMongoCollection<Automation> _automationCollection;

        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            
            _salesCollection = mongoDatabase.GetCollection<Sale>("sales");
            _ordersCollection = mongoDatabase.GetCollection<Order>("orders");
            _inventoryCollection = mongoDatabase.GetCollection<Inventory>("inventory");
             _expensesCollection = mongoDatabase.GetCollection<Expense>("expenses");
             _automationCollection = mongoDatabase.GetCollection<Automation>("automation");


            // Create indexes for better query performance
            
            // Sales collection indexes
            var saleVendorIndexKeysDefinition = Builders<Sale>.IndexKeys.Ascending(s => s.VendorId);
            _salesCollection.Indexes.CreateOne(new CreateIndexModel<Sale>(saleVendorIndexKeysDefinition));
            
            var saleDateIndexKeysDefinition = Builders<Sale>.IndexKeys.Ascending(s => s.Date);
            _salesCollection.Indexes.CreateOne(new CreateIndexModel<Sale>(saleDateIndexKeysDefinition));
            
            // Orders collection indexes
            var orderIdIndexKeysDefinition = Builders<Order>.IndexKeys.Ascending(o => o.OrderId);
            _ordersCollection.Indexes.CreateOne(new CreateIndexModel<Order>(orderIdIndexKeysDefinition));
            
            var customerIdIndexKeysDefinition = Builders<Order>.IndexKeys.Ascending(o => o.CustomerId);
            _ordersCollection.Indexes.CreateOne(new CreateIndexModel<Order>(customerIdIndexKeysDefinition));
            
            var orderDateIndexKeysDefinition = Builders<Order>.IndexKeys.Ascending(o => o.OrderDate);
            _ordersCollection.Indexes.CreateOne(new CreateIndexModel<Order>(orderDateIndexKeysDefinition));
            
            // Inventory collection indexes
            var productIdIndexKeysDefinition = Builders<Inventory>.IndexKeys.Ascending(i => i.ProductId);
            _inventoryCollection.Indexes.CreateOne(new CreateIndexModel<Inventory>(productIdIndexKeysDefinition));
            
            var categoryIndexKeysDefinition = Builders<Inventory>.IndexKeys.Ascending(i => i.Category);
            _inventoryCollection.Indexes.CreateOne(new CreateIndexModel<Inventory>(categoryIndexKeysDefinition));
        
            var expenseDateIndexKeysDefinition = Builders<Expense>.IndexKeys.Ascending(e => e.Date);
            _expensesCollection.Indexes.CreateOne(new CreateIndexModel<Expense>(expenseDateIndexKeysDefinition));
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
            await _ordersCollection.Find(o => o.OrderId  == orderId).FirstOrDefaultAsync();
            
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
        // Expense methods
        public async Task<List<Expense>> GetAllExpensesAsync() => 
            await _expensesCollection.Find(_ => true).Sort(Builders<Expense>.Sort.Descending(e => e.Date)).Limit(10).ToListAsync();
    
        public async Task<Expense> GetExpenseByIdAsync(string id) => 
            await _expensesCollection.Find(e => e.Id == id).FirstOrDefaultAsync();
    
        public async Task CreateExpenseAsync(Expense expense) => 
            await _expensesCollection.InsertOneAsync(expense);
    
        public async Task UpdateExpenseAsync(string id, Expense expense) => 
            await _expensesCollection.ReplaceOneAsync(e => e.Id == id, expense);
    
        public async Task DeleteExpenseAsync(string id) => 
            await _expensesCollection.DeleteOneAsync(e => e.Id == id);

            // Automation methods
public async Task<List<Automation>> GetAllAutomationsAsync() =>
    await _automationCollection.Find(_ => true).ToListAsync();

public async Task<Automation?> GetAutomationByIdAsync(string id) =>
    await _automationCollection.Find(a => a.Id == id).FirstOrDefaultAsync();

public async Task CreateAutomationAsync(Automation automation) =>
    await _automationCollection.InsertOneAsync(automation);

public async Task UpdateAutomationAsync(string id, Automation automation) =>
    await _automationCollection.ReplaceOneAsync(a => a.Id == id, automation);

public async Task DeleteAutomationAsync(string id) =>
    await _automationCollection.DeleteOneAsync(a => a.Id == id);

    public IMongoCollection<Automation> GetAutomationCollection()
    {
        return _automationCollection;
    }

    }

}