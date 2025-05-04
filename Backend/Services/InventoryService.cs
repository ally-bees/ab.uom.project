using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InventoryService
    {
        private readonly IMongoCollection<Inventory> _inventoryCollection;

        public InventoryService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _inventoryCollection = database.GetCollection<Inventory>("inventory");
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
    }
}
