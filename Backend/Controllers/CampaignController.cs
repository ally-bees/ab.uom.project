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
    }
}
