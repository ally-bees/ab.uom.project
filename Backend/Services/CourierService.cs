using CourierSystem.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CourierSystem.Services
{
    public class DeliveryService
    {
        private readonly IMongoCollection<Delivery> _deliveriesCollection;

        public DeliveryService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _deliveriesCollection = mongoDatabase.GetCollection<Delivery>(databaseSettings.Value.DeliveriesCollectionName);
        }

        public async Task<List<Delivery>> GetAsync() =>
            await _deliveriesCollection.Find(_ => true).ToListAsync();

        public async Task<Delivery?> GetAsync(string id) =>
            await _deliveriesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<Delivery?> GetByDeliveryIdAsync(string deliveryId) =>
            await _deliveriesCollection.Find(x => x.DeliveryId == deliveryId).FirstOrDefaultAsync();

        public async Task CreateAsync(Delivery newDelivery) =>
            await _deliveriesCollection.InsertOneAsync(newDelivery);

        public async Task UpdateAsync(string id, Delivery updatedDelivery) =>
            await _deliveriesCollection.ReplaceOneAsync(x => x.Id == id, updatedDelivery);

        public async Task RemoveAsync(string id) =>
            await _deliveriesCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<DeliverySummary> GetDeliverySummaryAsync(DateTime startDate, DateTime endDate)
        {
            var filter = Builders<Delivery>.Filter.And(
                Builders<Delivery>.Filter.Gte(d => d.OrderDate, startDate),
                Builders<Delivery>.Filter.Lte(d => d.OrderDate, endDate)
            );

            var deliveries = await _deliveriesCollection.Find(filter).ToListAsync();

            return new DeliverySummary
            {
                TotalDeliveries = deliveries.Count,
                PendingDeliveries = deliveries.Count(d => d.Status == "Pending"),
                CompletedDeliveries = deliveries.Count(d => d.Status == "Completed"),
                RejectedDeliveries = deliveries.Count(d => d.Status == "Rejected"),
                RecentDeliveries = deliveries.OrderByDescending(d => d.OrderDate).Take(10).ToList()
            };
        }
    }
}
