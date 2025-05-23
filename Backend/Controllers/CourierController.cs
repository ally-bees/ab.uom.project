using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/courier")]
    public class CourierController : ControllerBase
    {
        private readonly CourierService _courierService;

        public CourierController(CourierService courierService)
        {
            _courierService = courierService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            try
            {
                var summary = await _courierService.GetSummaryAsync(from, to);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentDeliveries([FromQuery] int count = 10)
        {
            try
            {
                var deliveries = await _courierService.GetRecentDeliveriesAsync(count);
                return Ok(deliveries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCouriers()
        {
            try
            {
                var couriers = await _courierService.GetAllAsync();
                return Ok(couriers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourierById(string id)
        {
            try
            {
                var courier = await _courierService.GetByIdAsync(id);
                if (courier == null)
                {
                    return NotFound();
                }
                return Ok(courier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourier([FromBody] Courier courier)
        {
            if (courier == null)
                return BadRequest("Courier data is required.");

            try
            {
                await _courierService.CreateAsync(courier);
                return CreatedAtAction(nameof(GetCourierById), new { id = courier.Id }, courier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourier(string id, [FromBody] Courier updatedCourier)
        {
            if (updatedCourier == null)
                return BadRequest("Updated courier data is required.");

            try
            {
                var existingCourier = await _courierService.GetByIdAsync(id);
                if (existingCourier == null)
                {
                    return NotFound();
                }
                await _courierService.UpdateAsync(id, updatedCourier);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourier(string id)
        {
            try
            {
                var existingCourier = await _courierService.GetByIdAsync(id);
                if (existingCourier == null)
                {
                    return NotFound();
                }
                await _courierService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

