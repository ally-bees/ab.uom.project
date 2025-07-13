using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Threading.Tasks;
using System.Linq;

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

        [HttpGet("performance")]
        public async Task<IActionResult> GetCampaignPerformance()
        {
            var campaigns = await _campaignService.GetAllAsync();
            
            // Transform to appropriate format
            var results = campaigns.Select(c => new {
                id = c.Id,
                name = c.Description ?? "Campaign " + c.CamId,
                impressions = FormatNumber(c.NoOfVisitors * 10), // Each visitor sees multiple impressions
                clicks = ((c.NoOfVisitors > 0 ? (double)c.NoOfCustomers / c.NoOfVisitors * 100 : 0)).ToString("0.##"),
                cpc = (c.NoOfCustomers > 0 ? c.SpentAmount / c.NoOfCustomers : 0).ToString("0.##"),
                spend = c.SpentAmount.ToString("#,##0.##"),
                icon = GetInitial(c.Description ?? c.Platform ?? "C"),
                color = GetColorForPlatform(c.Platform ?? "other")
            }).ToList();
            
            return Ok(results);
        }

        private string FormatNumber(int number)
        {
            if (number >= 1000000)
                return $"{(number / 1000000.0).ToString("0.#")}M";
            if (number >= 1000)
                return $"{(number / 1000.0).ToString("0.#")}k";
            return number.ToString();
        }

        private string GetInitial(string text)
        {
            return !string.IsNullOrEmpty(text) ? text.Substring(0, 1).ToUpper() : "C";
        }

        private string GetColorForPlatform(string platform)
        {
            return platform.ToLower() switch
            {
                "google" => "#34A853",
                "tiktok" => "#00F2EA",
                "instagram" => "#C13584",
                "facebook" => "#1877F2",
                "twitter" => "#1DA1F2",
                _ => "#" + new Random().Next(0x1000000).ToString("X6") // Random color
            };
        }
    }
}
