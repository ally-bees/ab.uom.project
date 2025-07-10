using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CampaignController : ControllerBase
    {
        private readonly CampaignService _campaignService;

        public CampaignController(CampaignService campaignService)
        {
            _campaignService = campaignService;
        }

        // Full campaign details
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var campaigns = await _campaignService.GetAllAsync();
            return Ok(campaigns);
        }

        // Summary: CamId, Description, SpentAmount
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _campaignService.GetSummaryAsync();
            return Ok(summary);
        }

        // Table-ready campaign data
        [HttpGet("table")]
        public async Task<IActionResult> GetTableData()
        {
            var tableData = await _campaignService.GetTableDataAsync();
            return Ok(tableData);
        }
    }
}
