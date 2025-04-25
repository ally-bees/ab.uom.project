using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

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

        // Get all sales, orders, and inventory data
        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            // Get all data from collections
            var sales = await _mongoDBService.GetAllSalesAsync();
            var orders = await _mongoDBService.GetAllOrdersAsync();
            var inventory = await _mongoDBService.GetAllInventoryAsync();

            // Create a view model with total revenue, total items, and total orders
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

        // Get sales, orders, and inventory data filtered by vendor
        [HttpGet("vendor/{vendorId}")]
        public async Task<IActionResult> GetDashboardDataByVendor(string vendorId)
        {
            // Get all sales and filter by vendorId
            var sales = await _mongoDBService.GetAllSalesAsync();
            var vendorSales = sales.Where(s => s.VendorId == vendorId).ToList();

            // Get all orders
            var orders = await _mongoDBService.GetAllOrdersAsync();
            
            // Get productIds from vendor sales
            var productIds = vendorSales.SelectMany(s => s.ProductIds).Distinct().ToList();
            
            // Filter orders to find those with matching productIds in orderDetails
            var relatedOrders = orders.Where(o => o.OrderDetails.Any(od => productIds.Contains(od.ProductId))).ToList();

            // Get all inventory
            var inventory = await _mongoDBService.GetAllInventoryAsync();
            
            // Filter inventory to match the productIds
            var relatedInventory = inventory.Where(i => productIds.Contains(i.ProductId)).ToList();

            // Create a view model for vendor-specific data
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
