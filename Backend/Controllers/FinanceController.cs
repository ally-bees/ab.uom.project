using Backend.Models;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceController : ControllerBase
    {
        private readonly FinanceService _financeService;

        public FinanceController(FinanceService financeService)
        {
            _financeService = financeService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Finance>>> Get()
        {
            var finances = await _financeService.GetAsync();
            return Ok(finances);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Finance>> GetById(string id)
        {
            var finance = await _financeService.GetByIdAsync(id);

            if (finance == null)
                return NotFound();

            return Ok(finance);
        }
    }
}
