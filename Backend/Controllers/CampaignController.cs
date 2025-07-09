using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/campaign")]
    public class CampaignController : ControllerBase
    {
        private readonly CampaignService _campaignService;

        public CampaignController(CampaignService campaignService)
        {
            _campaignService = campaignService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCampaigns()
        {
            try
            {
                var campaigns = await _campaignService.GetAllAsync();
                return Ok(campaigns);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 Internal Server Error if an exception occurs.
            }
        }
    }
}