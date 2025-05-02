using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public OrdersController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _mongoDBService.GetAllOrdersAsync();
            return Ok(orders);
        }

       [HttpGet("{orderId}")]
        public async Task<IActionResult> GetByOrderId(string orderId)
        {
            var order = await _mongoDBService.GetOrderByOrderIdAsync(orderId);
            if (order == null)
                return NotFound();
            return Ok(order);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order order)
        {
            await _mongoDBService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetByOrderId), new { id = order.Id }, order);
        }

        [HttpPut("{orderId}")]
        public async Task<IActionResult> Update(string orderId, [FromBody] Order order)
        {
            var existingOrder = await _mongoDBService.GetOrderByOrderIdAsync(orderId);
            if (existingOrder == null)
                return NotFound();

            order.Id = orderId;
            await _mongoDBService.UpdateOrderAsync(orderId, order);
            return NoContent();
        }

        [HttpDelete("{orderId}")]
        public async Task<IActionResult> Delete(string orderId)
        {
            var order = await _mongoDBService.GetOrderByOrderIdAsync(orderId);
            if (order == null)
                return NotFound();

            await _mongoDBService.DeleteOrderAsync(orderId);
            return NoContent();
        }
    }
}