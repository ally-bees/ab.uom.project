using CourierSystem.Models;
using CourierSystem.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CourierSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveriesController : ControllerBase
    {
        private readonly DeliveryService _deliveryService;

        public DeliveriesController(DeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        [HttpGet]
        public async Task<List<Delivery>> Get() =>
            await _deliveryService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Delivery>> Get(string id)
        {
            var delivery = await _deliveryService.GetAsync(id);

            if (delivery is null)
            {
                return NotFound();
            }

            return delivery;
        }

        [HttpGet("byDeliveryId/{deliveryId}")]
        public async Task<ActionResult<Delivery>> GetByDeliveryId(string deliveryId)
        {
            var delivery = await _deliveryService.GetByDeliveryIdAsync(deliveryId);

            if (delivery is null)
            {
                return NotFound();
            }

            return delivery;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Delivery newDelivery)
        {
            await _deliveryService.CreateAsync(newDelivery);

            return CreatedAtAction(nameof(Get), new { id = newDelivery.Id }, newDelivery);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Delivery updatedDelivery)
        {
            var delivery = await _deliveryService.GetAsync(id);

            if (delivery is null)
            {
                return NotFound();
            }

            updatedDelivery.Id = delivery.Id;
            updatedDelivery.UpdatedAt = DateTime.Now;

            await _deliveryService.UpdateAsync(id, updatedDelivery);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var delivery = await _deliveryService.GetAsync(id);

            if (delivery is null)
            {
                return NotFound();
            }

            await _deliveryService.RemoveAsync(id);

            return NoContent();
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DeliverySummary>> GetSummary([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _deliveryService.GetDeliverySummaryAsync(startDate, endDate);
        }
    }
}
