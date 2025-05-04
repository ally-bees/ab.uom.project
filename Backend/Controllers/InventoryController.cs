using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryService _inventoryService;

        public InventoryController(InventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inventory = await _inventoryService.GetAllAsync();
            return Ok(inventory);
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetByProductId(string productId)
        {
            var item = await _inventoryService.GetByProductIdAsync(productId);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Inventory item)
        {
            await _inventoryService.CreateAsync(item);
            return CreatedAtAction(nameof(GetByProductId), new { productId = item.ProductId }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Inventory item)
        {
            var existing = await _inventoryService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            item.Id = id;
            await _inventoryService.UpdateAsync(id, item);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _inventoryService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _inventoryService.DeleteAsync(id);
            return NoContent();
        }
    }
}
