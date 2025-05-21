using MongoDB.Driver;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _ordersCollection;

        public OrderService(IMongoDatabase database)
        {
            _ordersCollection = database.GetCollection<Order>("orders");
        }

        // Get all orders
        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _ordersCollection.Find(order => true).ToListAsync();
        }

        // Get an order by OrderId
        public async Task<Order> GetOrderByOrderIdAsync(string orderId)
        {
            return await _ordersCollection
                .Find(order => order.OrderId == orderId)
                .FirstOrDefaultAsync();
        }
        public async Task<Dictionary<string, int>> GetOrderCountsByStatusesAsync(List<string> statuses)
        {
            var filter = Builders<Order>.Filter.In(o => o.Status, statuses);

            var group = await _ordersCollection
                .Aggregate()
                .Match(filter)
                .Group(
                    o => o.Status,
                    g => new { Status = g.Key, Count = g.Count() }
                )
                .ToListAsync();

            return group.ToDictionary(x => x.Status, x => x.Count);
        }


        // Create a new order
        public async Task CreateOrderAsync(Order newOrder)
        {
            await _ordersCollection.InsertOneAsync(newOrder);
        }

        // Update an existing order
        public async Task UpdateOrderAsync(string orderId, Order updatedOrder)
        {
            await _ordersCollection.ReplaceOneAsync(
                order => order.OrderId == orderId,
                updatedOrder
            );
        }

        // Delete an order by OrderId
        public async Task DeleteOrderAsync(string orderId)
        {
            await _ordersCollection.DeleteOneAsync(order => order.OrderId == orderId);
        }
    }
}
