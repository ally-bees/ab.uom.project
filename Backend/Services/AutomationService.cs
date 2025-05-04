using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Backend.Services
{
   public class AutomationService
{
    private readonly MongoDBService _mongoDBService;
    private readonly IMongoCollection<Automation> _automationCollection;

    public AutomationService(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
        _automationCollection = _mongoDBService.GetAutomationCollection();
    }

    public async Task<List<Automation>> GetAllAsync()
    {
        return await _automationCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Automation?> GetByIdAsync(string id)
    {
        return await _automationCollection.Find(a => a.Id == id).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Automation automation)
    {
        await _automationCollection.InsertOneAsync(automation);
    }

    public async Task UpdateAsync(string id, Automation automation)
    {
        await _automationCollection.ReplaceOneAsync(a => a.Id == id, automation);
    }

    public async Task DeleteAsync(string id)
    {
        await _automationCollection.DeleteOneAsync(a => a.Id == id);
    }
}
}
