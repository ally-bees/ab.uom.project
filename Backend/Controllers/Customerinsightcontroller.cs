using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly MongoDbCustomerInsightService  _mongoDbCustomerinsightService;

        public CustomerController(MongoDbCustomerInsightService  mongoDbCustomerinsightService)
        {
            _mongoDbCustomerinsightService = mongoDbCustomerinsightService;
        }

        [HttpGet("top-customer")]
        public async Task<IActionResult> GetTopCustomer()
        {
            var (name, location) = await _mongoDbCustomerinsightService.GetTopCustomerByOrderCountAsync();

            if (string.IsNullOrEmpty(name))
                return NotFound("No customer found.");

            return Ok(new { Name = name, Location = location });
        }


        [HttpGet("top-product")]
        public async Task<IActionResult> GetTopProduct()
        {
            var (ProductId, Name) = await _mongoDbCustomerinsightService.GetTopProductByOrderCountAsync();

            if (string.IsNullOrEmpty(Name))
                return NotFound("No product found.");

            return Ok(new { ProductId, Name });
        }


        [HttpGet("custable")]
        public async Task<ActionResult<List<Customerr>>> GettableAsync([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var records = await _mongoDbCustomerinsightService.GettableAsync(from, to);
            return Ok(records ?? new List<Customerr>());
        }

        [HttpGet("location-count")]
        public async Task<ActionResult<List<LocationCustomerCount>>> GetCustomerCountByLocation()
        {
            var result = await _mongoDbCustomerinsightService.GetCustomerCountByLocationAsync();
            return Ok(result);
        }

        [HttpGet("product-stats/{productId}")]
        public async Task<IActionResult> GetProductStats(string productId)
        {
            var result = await _mongoDbCustomerinsightService.Getphurchaserate(productId);
            return Ok(result);
        }

        [HttpGet("active-and-inactive")]
        public async Task<IActionResult> Getactiveinactive()
        {
            var result = await _mongoDbCustomerinsightService.Getactiveinactive();
            return Ok(result);
        }

    }
}