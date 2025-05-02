using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesDashboardController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public SalesDashboardController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            // Get all data from collections
            var sales = await _mongoDBService.GetAllSalesAsync();
            var orders = await _mongoDBService.GetAllOrdersAsync();
            var inventory = await _mongoDBService.GetAllInventoryAsync();

            // Create a view model
            var viewModel = new SalesViewModel
            {
                Sales = sales,
                RelatedOrders = orders,
                RelatedInventory = inventory,
                TotalRevenue = sales.Sum(s => s.TotalSales),
                TotalItems = sales.Sum(s => s.TotalItemsSold),
                TotalOrders = sales.Sum(s => s.TotalOrdersCount)
            };

            return Ok(viewModel);
        }

        [HttpGet("vendor/{vendorId}")]
        public async Task<IActionResult> GetDashboardDataByVendor(string vendorId)
        {
            // Get vendor-specific data
            var sales = await _mongoDBService.GetAllSalesAsync();
            var vendorSales = sales.Where(s => s.VendorId == vendorId).ToList();
            
            // Get related orders based on sales data
            var orders = await _mongoDBService.GetAllOrdersAsync();
            var productIds = vendorSales.SelectMany(s => s.ProductIds).Distinct().ToList();
            var relatedOrders = orders.Where(o => o.ProductIds.Any(p => productIds.Contains(p))).ToList();
            
            // Get related inventory
            var inventory = await _mongoDBService.GetAllInventoryAsync();
            var relatedInventory = inventory.Where(i => productIds.Contains(i.ProductId)).ToList();
            
            // Create a view model
            var viewModel = new SalesViewModel
            {
                Sales = vendorSales,
                RelatedOrders = relatedOrders,
                RelatedInventory = relatedInventory,
                TotalRevenue = vendorSales.Sum(s => s.TotalSales),
                TotalItems = vendorSales.Sum(s => s.TotalItemsSold),
                TotalOrders = vendorSales.Sum(s => s.TotalOrdersCount)
            };

            return Ok(viewModel);
        }
    }
}