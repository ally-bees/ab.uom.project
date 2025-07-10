using Backend.Models;
using Backend.Models.DTOs;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class CampaignService
    {
        private readonly IMongoCollection<Campaign> _campaigns;

        public CampaignService(IMongoDatabase database)
        {
            _campaigns = database.GetCollection<Campaign>("campaigns");
        }

        // 💼 Full campaign objects
        public async Task<List<Campaign>> GetAllAsync() =>
            await _campaigns.Find(_ => true).ToListAsync();

        // 💡 Summary: CamId + Description + SpentAmount
        public async Task<List<CampaignSummaryDto>> GetSummaryAsync()
        {
            var projection = Builders<Campaign>.Projection
                .Include(c => c.CamId)
                .Include(c => c.Description)
                .Include(c => c.SpentAmount);

            return await _campaigns.Find(_ => true)
                .Project<CampaignSummaryDto>(projection)
                .ToListAsync();
        }

        // 🧾 Table-friendly fields for DataGrid or table display
        public async Task<List<CampaignTableDto>> GetTableDataAsync()
        {
            var projection = Builders<Campaign>.Projection
                .Include(c => c.CamId)
                .Include(c => c.Description)
                .Include(c => c.ClickThroughRate)
                .Include(c => c.Cpc)
                .Include(c => c.SpentAmount)
                .Include(c => c.NoOfVisitors)
                .Include(c => c.NoOfCustomers)
                .Include(c => c.Date);

            return await _campaigns.Find(_ => true)
                .Project<CampaignTableDto>(projection)
                .ToListAsync();
        }
    }
}
