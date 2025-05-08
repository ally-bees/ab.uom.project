using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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

        // Removed vendorId-based filter since it's no longer part of the data

        [HttpGet("date-range")]
        public async Task<IActionResult> GetByDateRange([FromQuery] string startDate, [FromQuery] string endDate)
        {
            var sales = await _salesService.GetSalesByDateRangeAsync(startDate, endDate);
            return Ok(sales);
        }
        
        [HttpGet("year/{year}")]
        public async Task<IActionResult> GetByYear(int year)
        {
            var sales = await _salesService.GetSalesByYearAsync(year);
            return Ok(sales);
        }


        // TotalSales, TotalOrders, TotalItemsSold summary
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
            return CreatedAtAction(nameof(Get), new { saleId = sale.SaleId }, sale);
        }

        [HttpPut("{saleId}")]
        public async Task<IActionResult> Update(string saleId, [FromBody] Sale sale)
        {
            var existingSale = await _salesService.GetSaleByIdAsync(saleId);
            if (existingSale == null)
                return NotFound();

            sale.Id = saleId;
            await _salesService.UpdateSaleAsync(saleId, sale);
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
