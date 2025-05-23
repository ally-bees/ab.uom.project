using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backendcustomerinsight.Service;
using Backendcustomerinsight.Models;
using Backendcustomerinsight.Collection;


namespace Backendcustomerinsight.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly MongoDBService _mongoDbCustomerinsightService;

        public CustomerController(MongoDBService mongoDbCustomerinsightService)
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
        public async Task<ActionResult<List<Customer>>> GettableAsync([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var records = await _mongoDbCustomerinsightService.GettableAsync(from, to);
            return Ok(records ?? new List<Customer>());
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