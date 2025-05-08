using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/courier-analytics")]
    public class CourierAnalyticsController : ControllerBase
    {
        private readonly CourierService _courierService;

        public CourierAnalyticsController(CourierService courierService)
        {
            _courierService = courierService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var summary = await _courierService.GetSummaryAsync(from, to);
            return Ok(summary);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentDeliveries([FromQuery] int count = 10)
        {
            var deliveries = await _courierService.GetRecentDeliveriesAsync(count);
            return Ok(deliveries);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCouriers()
        {
            var couriers = await _courierService.GetAllAsync();
            return Ok(couriers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourierById(string id)
        {
            var courier = await _courierService.GetByIdAsync(id);
            if (courier == null)
            {
                return NotFound();
            }
            return Ok(courier);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourier([FromBody] Courier courier)
        {
            await _courierService.CreateAsync(courier);
            return CreatedAtAction(nameof(GetCourierById), new { id = courier.Id }, courier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourier(string id, [FromBody] Courier updatedCourier)
        {
            var existingCourier = await _courierService.GetByIdAsync(id);
            if (existingCourier == null)
            {
                return NotFound();
            }
            await _courierService.UpdateAsync(id, updatedCourier);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourier(string id)
        {
            var existingCourier = await _courierService.GetByIdAsync(id);
            if (existingCourier == null)
            {
                return NotFound();
            }
            await _courierService.DeleteAsync(id);
            return NoContent();
        }
    }
}
