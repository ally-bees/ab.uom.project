using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using auditpagebackend.Service;
using auditpagebackend.Models;
using auditpagebackend.Collection;


namespace auditpagebackend.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class TableController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public TableController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        // GET: api/table
        // Get all table
        [HttpGet("table")]
        public async Task<ActionResult<List<Table>>> GetFilteredAsync([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var records = await _mongoDBService.GetFilteredAsync(from, to);
            return Ok(records ?? new List<Table>());
        }


        [HttpGet("totals")]
        public async Task<IActionResult> GetTotalSums(string from = "", string to = "")
        {
            if (string.IsNullOrEmpty(from) || string.IsNullOrEmpty(to))
            {
                from = DateTime.MinValue.ToString("yyyy-MM-dd");
                to = DateTime.Now.ToString("yyyy-MM-dd");
            }

            var totals = await _mongoDBService.GetTotalSumsAsync(from, to);
            return Ok(totals);
        }

        
        [HttpGet("tax-sum/last-3-years")]
        public async Task<IActionResult> Getlastthreetax()
        {
            var summary = await _mongoDBService.GetlastthreetaxAsync();
            return Ok(summary);
        }

    }
}