using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerCountController : ControllerBase
    {
        private readonly CustomerCountService _customerService;

        public CustomerCountController(CustomerCountService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetCustomerCount()
        {
            var count = await _customerService.GetCustomerCountAsync();
            return Ok(count);
        }
    }
}
