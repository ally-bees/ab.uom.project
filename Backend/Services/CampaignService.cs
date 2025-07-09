using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services
{
    public class CampaignService
    {
        private readonly IMongoCollection<Campaign> _campaignsCollection;

        public CampaignService(IMongoDatabase database)
        {
            _campaignsCollection = database.GetCollection<Campaign>("campaign");
        }

        public async Task<List<Campaign>> GetAllAsync()
        {
            return await _campaignsCollection.Find(campaign => true).ToListAsync(); // Returns all campaign documents.
        }
    }
}