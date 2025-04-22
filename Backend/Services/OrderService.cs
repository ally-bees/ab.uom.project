using Backend.Models;
using Backend.Models.DTOs;
using MongoDB.Driver;

namespace Backend.Services
{
    public class OrderService
{
    private readonly IMongoCollection<Order> _orders;

    public OrderService(MongoDBService mongoDBService)
    {
        _orders = mongoDBService.GetOrdersCollection();
    }

   public async Task<List<StatusCountDto>> GetOrderCountsByStatusesAsync(List<string> statuses)
{
    // Case-insensitive filter for statuses
    var filter = Builders<Order>.Filter.In(o => o.Status, statuses.Select(s => s.ToLower()));  // Ensure we convert the list of statuses to lowercase

    // Perform the query
    var orders = await _orders.Find(filter).ToListAsync();

    // Log the number of orders found (optional)
    Console.WriteLine($"Found {orders.Count} orders with statuses {string.Join(", ", statuses)}");

    // Group orders by status and count the occurrences
    var grouped = orders
        .GroupBy(o => o.Status.ToLower())  
        .Select(g => new StatusCountDto
        {
            Status = g.Key,  // Status from grouping (already in lowercase)
            Count = g.Count()
        })
        .ToList();

    return grouped;
}

}
}