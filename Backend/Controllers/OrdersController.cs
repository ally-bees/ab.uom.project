using Backend.Models;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetByOrderId(string orderId)
        {
            var order = await _orderService.GetOrderByOrderIdAsync(orderId);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDTO dto)
        {
            var order = new Order
            {
                OrderId = dto.OrderId,
                CustomerId = dto.CustomerId,
                OrderDetails = dto.OrderDetails.ConvertAll(d => new OrderDetail
                {
                    ProductId = d.ProductId,
                    Quantity = d.Quantity,
                    Price = d.Price
                }),
                TotalAmount = dto.TotalAmount,
               OrderDate = dto.OrderDate ?? DateTime.Now,
                Status = dto.Status
            };

            await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetByOrderId), new { orderId = order.OrderId }, order);
        }

        [HttpPut("{orderId}")]
        public async Task<IActionResult> Update(string orderId, [FromBody] OrderCreateDTO dto)
        {
            var existingOrder = await _orderService.GetOrderByOrderIdAsync(orderId);
            if (existingOrder == null)
                return NotFound();

            var updatedOrder = new Order
            {
                Id = existingOrder.Id,
                OrderId = orderId,
                CustomerId = dto.CustomerId,
                OrderDetails = dto.OrderDetails.ConvertAll(d => new OrderDetail
                {
                    ProductId = d.ProductId,
                    Quantity = d.Quantity,
                    Price = d.Price
                }),
                TotalAmount = dto.TotalAmount,
                OrderDate = dto.OrderDate ?? DateTime.Now,
                Status = dto.Status
            };

            await _orderService.UpdateOrderAsync(orderId, updatedOrder);
            return NoContent();
        }

        [HttpDelete("{orderId}")]
        public async Task<IActionResult> Delete(string orderId)
        {
            var order = await _orderService.GetOrderByOrderIdAsync(orderId);
            if (order == null)
                return NotFound();

            await _orderService.DeleteOrderAsync(orderId);
            return NoContent();
        }

        [HttpPost("status-count")]
        public async Task<IActionResult> GetOrderCountsByStatuses([FromBody] List<string> statuses)
        {
            var counts = await _orderService.GetOrderCountsByStatusesAsync(statuses);
            return Ok(counts);
        }
    }
}
