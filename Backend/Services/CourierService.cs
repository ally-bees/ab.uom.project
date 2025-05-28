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
        private readonly IMongoCollection<Courier> _courier;

        public CourierService(IMongoDatabase database)
        {
            _courier = database.GetCollection<Courier>("courier");
        }

        public async Task<List<Courier>> GetAllAsync()
        {
            return await _courier.Find(courier => true).ToListAsync();
        }

        public async Task<Courier> GetByIdAsync(string id)
        {
            return await _courier.Find(courier => courier.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Courier courier)
        {
            await _courier.InsertOneAsync(courier);
        }

        public async Task UpdateAsync(string id, Courier updatedCourier)
        {
            await _courier.ReplaceOneAsync(courier => courier.Id == id, updatedCourier);
        }

        public async Task DeleteAsync(string id)
        {
            await _courier.DeleteOneAsync(courier => courier.Id == id);
        }

        public async Task<CourierSummaryDto> GetSummaryAsync(DateTime from, DateTime to)
        {
            var courier = await _courier.Find(courier => courier.Date >= from && courier.Date <= to).ToListAsync();
            return new CourierSummaryDto
            {
                Total = courier.Count,
                Pending = courier.Count(c => c.Status == "pending"),
                Completed = courier.Count(c => c.Status == "completed"),
                Rejected = courier.Count(c => c.Status == "rejected")
            };
        }

        public async Task<List<Courier>> GetRecentDeliveriesAsync(int count)
        {
            return await _courier.Find(courier => true).SortByDescending(c => c.Date).Limit(count).ToListAsync();
        }
    }
}
