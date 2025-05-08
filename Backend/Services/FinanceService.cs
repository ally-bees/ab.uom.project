using MongoDB.Driver;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class FinanceService
    {
        private readonly IMongoCollection<Finance> _financeCollection;

        public FinanceService(IMongoDatabase database)
        {
            _financeCollection = database.GetCollection<Finance>("finance");
        }

        public async Task<List<Finance>> GetAsync()
        {
            return await _financeCollection.Find(f => true).ToListAsync();
        }

        public async Task<Finance> GetByIdAsync(string id)
        {
            return await _financeCollection.Find(f => f.Id == id).FirstOrDefaultAsync();
        }
    }
}
