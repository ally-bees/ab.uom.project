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
