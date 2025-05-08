using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
        public async Task<ActionResult<List<Courier>>> GetAll()
        {
            return await _courierService.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Courier>> GetById(string id)
        {
            var courier = await _courierService.GetByIdAsync(id);
            if (courier == null)
            {
                return NotFound();
            }
            return courier;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Courier courier)
        {
            await _courierService.CreateAsync(courier);
            return CreatedAtAction(nameof(GetById), new { id = courier.Id }, courier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Courier updatedCourier)
        {
            var courier = await _courierService.GetByIdAsync(id);
            if (courier == null)
            {
                return NotFound();
            }

            await _courierService.UpdateAsync(id, updatedCourier);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var courier = await _courierService.GetByIdAsync(id);
            if (courier == null)
            {
                return NotFound();
            }

            await _courierService.DeleteAsync(id);
            return NoContent();
        }
    }
}
