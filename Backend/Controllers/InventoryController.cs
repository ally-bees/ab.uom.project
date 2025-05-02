using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public InventoryController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        // Get all inventory items
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inventory = await _mongoDBService.GetAllInventoryAsync();
            return Ok(inventory);
        }

        // Get inventory by productId (from route)
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetByProductIdRoute(string productId)
        {
            var item = await _mongoDBService.GetInventoryByProductIdAsync(productId);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        // Get inventory by productId (from sub-route)
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProductId(string productId)
        {
            var item = await _mongoDBService.GetInventoryByProductIdAsync(productId);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        // Add new inventory item
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Inventory item)
        {
            await _mongoDBService.CreateInventoryAsync(item);
            return CreatedAtAction(nameof(GetByProductId), new { productId = item.ProductId }, item);
        }

        // Update inventory item by objectId
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Inventory item)
        {
            var existingItem = await _mongoDBService.GetInventoryByIdAsync(id);
            if (existingItem == null)
                return NotFound();

            item.Id = id;
            await _mongoDBService.UpdateInventoryAsync(id, item);
            return NoContent();
        }

        // Delete inventory item by objectId
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _mongoDBService.GetInventoryByIdAsync(id);
            if (item == null)
                return NotFound();

            await _mongoDBService.DeleteInventoryAsync(id);
            return NoContent();
        }
    }
}
