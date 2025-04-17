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
        public async Task<ActionResult<List<Table>>> GetAllAsync()
        {
            var Table = await _mongoDBService.GetAllAsync();
            return Ok(Table);
        }

        [HttpGet("totals")]
public async Task<IActionResult> GetTotalSums()
{
    var totals = await _mongoDBService.GetTotalSumsAsync();
    return Ok(totals);
}

    }
}
