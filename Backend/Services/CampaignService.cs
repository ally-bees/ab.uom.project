using Backend.Models;
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

        // Get all campaigns
        public async Task<List<Campaign>> GetAllAsync() =>
            await _campaigns.Find(_ => true).ToListAsync();
    }
}
