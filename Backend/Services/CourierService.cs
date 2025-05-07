using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Models.DTOs;
using MongoDB.Driver;
using System.Linq;

namespace Backend.Services
{
    public class CourierService
    {
        private readonly IMongoCollection<Courier> _couriers;

        public CourierService(IMongoDatabase database)
        {
            _couriers = database.GetCollection<Courier>("courier");
        }

        public async Task<List<Courier>> GetAllAsync()
        {
            return await _couriers.Find(courier => true).ToListAsync();
        }

        public async Task<Courier> GetByIdAsync(string id)
        {
            return await _couriers.Find(courier => courier.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Courier courier)
        {
            await _couriers.InsertOneAsync(courier);
        }

        public async Task UpdateAsync(string id, Courier updatedCourier)
        {
            await _couriers.ReplaceOneAsync(courier => courier.Id == id, updatedCourier);
        }

        public async Task DeleteAsync(string id)
        {
            await _couriers.DeleteOneAsync(courier => courier.Id == id);
        }

        public async Task<CourierSummaryDto> GetSummaryAsync(DateTime from, DateTime to)
        {
            var couriers = await _couriers.Find(courier => courier.Date >= from && courier.Date <= to).ToListAsync();
            return new CourierSummaryDto
            {
                Total = couriers.Count,
                Pending = couriers.Count(c => c.Status == "pending"),
                Completed = couriers.Count(c => c.Status == "completed"),
                Rejected = couriers.Count(c => c.Status == "rejected")
            };
        }

        public async Task<List<Courier>> GetRecentDeliveriesAsync(int count)
        {
            return await _couriers.Find(courier => true).SortByDescending(c => c.Date).Limit(count).ToListAsync();
        }
    }
}
