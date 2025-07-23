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

        [HttpGet("total-revenue")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            var totalRevenue = await _salesService.GetTotalSalesCostAsync();
            if(totalRevenue == 0)
                return Ok(0);
            return Ok(totalRevenue);
        }

        [HttpGet("today-cost")]
        public async Task<IActionResult> GetTodayRevenue()
        {
            var todayRevenue = await _salesService.GetTodaySalesRevenueAsync();
            if(todayRevenue == 0)
                return Ok(0);
            return Ok(todayRevenue);
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

         [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlySales()
        {
            try
            {
                var monthlySales = await _salesService.GetMonthlySalesAsync();
                return Ok(monthlySales);
            }
            catch (System.Exception ex)
            {
                // Log exception if needed
                return StatusCode(500, "An error occurred while retrieving monthly sales data.");
            }
        }

        [HttpGet("year-data")]
        public async Task<IActionResult> GetYearlySales()
        {
            try
            {
                var monthlySales = await _salesService.GetYearlySalesAsync(DateTime.Now.Year);
                return Ok(monthlySales);
            }
            catch (System.Exception ex)
            {
                // Log exception if needed
                return StatusCode(500, "An error occurred while retrieving monthly sales data.");
            }
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
