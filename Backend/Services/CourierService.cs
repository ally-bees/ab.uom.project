using System.Collections.Generic; // Provides generic collection types like List<T>.
using System.Threading.Tasks; // Enables asynchronous programming.
using Backend.Models; // Imports the Courier model.
using Backend.Models.DTOs; // Imports the CourierSummaryDto for summary responses.
using MongoDB.Driver; // Provides MongoDB client interfaces.
using System.Linq; // Provides LINQ methods like Count and FirstOrDefault.

namespace Backend.Services
{
    public class CourierService
    {
        private readonly IMongoCollection<Courier> _courier; // Reference to the "courier" MongoDB collection.

        public CourierService(IMongoDatabase database)
        {
            _courier = database.GetCollection<Courier>("courier"); // Initializes the MongoDB collection.
        }

        public async Task<List<Courier>> GetAllAsync()
        {
            return await _courier.Find(courier => true).ToListAsync(); // Returns all courier documents.
        }

        public async Task<Courier> GetByIdAsync(string id)
        {
            return await _courier.Find(courier => courier.Id == id).FirstOrDefaultAsync(); // Finds courier by ID or returns null.
        }

        public async Task CreateAsync(Courier courier)
        {
            await _courier.InsertOneAsync(courier); // Inserts a new courier document into the collection.
        }

        public async Task UpdateAsync(string id, Courier updatedCourier)
        {
            await _courier.ReplaceOneAsync(courier => courier.Id == id, updatedCourier); // Replaces the document with the given ID.
        }

        public async Task DeleteAsync(string id)
        {
            await _courier.DeleteOneAsync(courier => courier.Id == id); // Deletes the courier document with the specified ID.
        }

        public async Task<List<object>> GetTopCountriesPercentageAsync() // top 3 contries
            {
                var couriers = await _courier.Find(courier => true).ToListAsync();

                // Extract country from destination and group
                var countryCounts = couriers
                    .Select(c => c.Destination?.Split(',').LastOrDefault()?.Trim())
                    .Where(country => !string.IsNullOrWhiteSpace(country))
                    .GroupBy(country => country)
                    .Select(g => new { Country = g.Key, Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .ToList();

                int total = countryCounts.Sum(x => x.Count);

                var top3 = countryCounts
                    .Take(3)
                    .Select(x => new
                    {
                        name = x.Country,
                        percentage = Math.Round((x.Count * 100.0) / total, 2)
                    })
                    .ToList<object>();

                return top3;
            }


        public async Task<CourierSummaryDto> GetSummaryAsync(DateTime from, DateTime to)
        {
            var courier = await _courier.Find(courier => courier.Date >= from && courier.Date <= to).ToListAsync(); // Retrieves couriers within date range.
            return new CourierSummaryDto
            {
                Total = courier.Count, // Total couriers in the range.
                Pending = courier.Count(c => c.Status == "pending"), // Count of couriers with "pending" status.
                Completed = courier.Count(c => c.Status == "completed"), // Count of completed deliveries.
                Rejected = courier.Count(c => c.Status == "rejected") // Count of rejected or failed deliveries.
            };
        }

        public async Task<List<Courier>> GetRecentDeliveriesAsync(int count)
        {
            return await _courier.Find(courier => true).SortByDescending(c => c.Date).Limit(count).ToListAsync(); // Returns most recent deliveries limited by count.
        }
    }
}
