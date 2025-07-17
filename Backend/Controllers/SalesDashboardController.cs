using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesDashboardController : ControllerBase
    {
        private readonly SalesService _salesService;
        private readonly MongoDBService _mongoDBService;

        public SalesDashboardController(SalesService salesService, MongoDBService mongoDBService)
        {
            _salesService = salesService;
            _mongoDBService = mongoDBService;
        }

        // Get all sales, orders, and inventory data
       [HttpGet]
public async Task<IActionResult> GetDashboardData()
{
    var sales = await _mongoDBService.GetAllSalesAsync();
    var orders = await _mongoDBService.GetAllOrdersAsync();
    var inventory = await _mongoDBService.GetAllInventoryAsync();

    var totalRevenue = sales.Sum(s => s.Amount);
    var totalItems = orders.Sum(o => o.OrderDetails.Sum(od => od.Quantity));
    var totalOrders = orders.Count;

    var viewModel = new SalesViewModel
    {
        Sales = sales,
        RelatedOrders = orders,
        RelatedInventory = inventory,
        TotalRevenue = totalRevenue,
        TotalItems = totalItems,
        TotalOrders = totalOrders
    };

    return Ok(viewModel);
}


        // Get dashboard data within a date range
        [HttpGet("date-range")]
        public async Task<IActionResult> GetDashboardDataByDateRange([FromQuery] string startDate, [FromQuery] string endDate)
        {
            try
            {
                // Parse the input dates
                DateTime startDateTime = DateTime.Parse(startDate);
                DateTime endDateTime = DateTime.Parse(endDate);

                // Get sales data within the given date range
                var sales = await _salesService.GetSalesByDateRangeAsync(startDate, endDate);

                // Calculate total revenue, total items, and total orders
                var totalRevenue = sales.Sum(s => s.Amount);
                var totalItems = sales.Sum(s => s.OrderIds.Count); // Assuming OrderIds holds the count of orders
                var totalOrders = sales.Count;

                // Return the summary in a structured response
                var summary = new
                {
                    TotalRevenue = totalRevenue,
                    TotalItems = totalItems,
                    TotalOrders = totalOrders
                };

                return Ok(summary);
            }
            catch (FormatException ex)
            {
                return BadRequest($"Invalid date format: {ex.Message}");
            }
        }

        // Get sales, orders, and inventory data filtered by saleId
        [HttpGet("sale/{saleId}")]
        public async Task<IActionResult> GetDashboardDataBySaleId(string saleId)
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            var targetSale = sales.FirstOrDefault(s => s.SaleId == saleId);

            if (targetSale == null)
                return NotFound($"Sale with SaleId {saleId} not found.");

            var allOrders = await _mongoDBService.GetAllOrdersAsync();

            var relatedOrders = allOrders
                .Where(o => targetSale.OrderIds.Contains(o.OrderId))
                .ToList();

            var productIds = relatedOrders
                .SelectMany(o => o.OrderDetails.Select(od => od.ProductId))
                .Distinct()
                .ToList();

            var inventory = await _mongoDBService.GetAllInventoryAsync();
            var relatedInventory = inventory
                .Where(i => productIds.Contains(i.ProductId))
                .ToList();

            var totalRevenue = targetSale.Amount;
            var totalItems = relatedOrders.Sum(o => o.OrderDetails.Sum(od => od.Quantity));
            var totalOrders = relatedOrders.Count;

            var viewModel = new SalesViewModel
            {
                Sales = new List<Sale> { targetSale },
                RelatedOrders = relatedOrders,
                RelatedInventory = relatedInventory,
                TotalRevenue = totalRevenue,
                TotalItems = totalItems,
                TotalOrders = totalOrders
            };

            return Ok(viewModel);
        }
    }
}
