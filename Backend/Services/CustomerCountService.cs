using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public class CustomerCountService
    {
        private readonly IMongoCollection<Customer> _customers;

        public CustomerCountService(IConfiguration config)
        {
            var mongoDbSettings = config.GetSection("MongoDBSettings").Get<MongoDBSettings>();
            var client = new MongoClient(mongoDbSettings.ConnectionString);
            var database = client.GetDatabase(mongoDbSettings.DatabaseName);
            _customers = database.GetCollection<Customer>("customers");
        }

        public async Task<long> GetCustomerCountAsync()
        {
            return await _customers.CountDocumentsAsync(FilterDefinition<Customer>.Empty);
        }
    }
}
