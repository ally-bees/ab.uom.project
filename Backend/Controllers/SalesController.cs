using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly SalesService _salesService;
        private readonly MongoDBService _mongoDBService;

        public SalesController(SalesService salesService, MongoDBService mongoDBService)
        {
            _salesService = salesService;
            _mongoDBService = mongoDBService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sales = await _salesService.GetAllSalesAsync();
            return Ok(sales);
        }

        [HttpGet("{saleId}")]
        public async Task<IActionResult> Get(string saleId)
        {
            var sale = await _salesService.GetSaleByIdAsync(saleId);
            if (sale == null)
                return NotFound();
            return Ok(sale);
        }

        [HttpGet("vendor/{vendorId}")]
        public async Task<IActionResult> GetByVendorId(string vendorId)
        {
            var sales = await _salesService.GetSalesByVendorIdAsync(vendorId);
            return Ok(sales);
        }

        [HttpGet("daterange")]
        public async Task<IActionResult> GetByDateRange([FromQuery] string startDate, [FromQuery] string endDate)
        {
            var sales = await _salesService.GetSalesByDateRangeAsync(startDate, endDate);
            return Ok(sales);
        }

        //totalSales, totalOrders , totalItemsSold
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _salesService.GetSalesSummaryAsync();
            return Ok(summary);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Sale sale)
        {
            await _salesService.CreateSaleAsync(sale);
            return CreatedAtAction(nameof(Get), new { id = sale.Id }, sale);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Sale sale)
        {
            var existingSale = await _salesService.GetSaleByIdAsync(id);
            if (existingSale == null)
                return NotFound();

            sale.Id = id;
            await _salesService.UpdateSaleAsync(id, sale);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var sale = await _salesService.GetSaleByIdAsync(id);
            if (sale == null)
                return NotFound();

            await _salesService.DeleteSaleAsync(id);
            return NoContent();
        }
    }
}