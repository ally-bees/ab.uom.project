using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourierController : ControllerBase
    {
        private readonly CourierService _courierService;

        public CourierController(CourierService courierService)
        {
            _courierService = courierService;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Courier>>> GetAllCouriers([FromQuery] string companyId)
        {
            if (string.IsNullOrEmpty(companyId))
                return BadRequest("CompanyId is required");

            var couriers = await _courierService.GetAllByCompanyIdAsync(companyId);
            return Ok(couriers);
        }

        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<Courier>>> GetRecent([FromQuery] int count = 6, [FromQuery] string companyId = "")
        {
            if (string.IsNullOrEmpty(companyId))
                return BadRequest("CompanyId is required");

            var couriers = await _courierService.GetRecentByCompanyIdAsync(count, companyId);
            return Ok(couriers);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<CourierSummaryDto>> GetSummary([FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] string companyId)
        {
            if (string.IsNullOrEmpty(companyId))
                return BadRequest("CompanyId is required");

            var summary = await _courierService.GetSummaryAsync(from, to, companyId);
            return Ok(summary);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Courier>> GetById(string id)
        {
            var courier = await _courierService.GetByIdAsync(id);
            if (courier == null)
                return NotFound();

            return courier;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Courier courier)
        {
            await _courierService.CreateAsync(courier);
            return CreatedAtAction(nameof(GetById), new { id = courier.Id }, courier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Courier courier)
        {
            var existingCourier = await _courierService.GetByIdAsync(id);
            if (existingCourier == null)
                return NotFound();

            courier.Id = id;
            await _courierService.UpdateAsync(id, courier);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingCourier = await _courierService.GetByIdAsync(id);
            if (existingCourier == null)
                return NotFound();

            await _courierService.DeleteAsync(id);
            return NoContent();
        }
    }
}
