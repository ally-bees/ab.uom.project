using Backend.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class SalesService
    {
        private readonly MongoDBService _mongoDBService;

        public SalesService(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        public async Task<List<Sale>> GetAllSalesAsync()
        {
            return await _mongoDBService.GetAllSalesAsync();
        }

        public async Task<Sale> GetSaleByIdAsync(string id)
        {
            return await _mongoDBService.GetSaleByIdAsync(id);
        }

        public async Task<List<Sale>> GetSalesByDateRangeAsync(string startDate, string endDate)
        {
            // Fetch all sales from the MongoDB service
            var sales = await _mongoDBService.GetAllSalesAsync();

            // Convert startDate and endDate to DateTime for comparison
            DateTime startDateTime = DateTime.Parse(startDate);
            DateTime endDateTime = DateTime.Parse(endDate);

            // Filter sales based on the provided date range
            return sales.Where(s => s.SaleDate >= startDateTime && s.SaleDate <= endDateTime).ToList();
        }

        public async Task<object> GetSalesSummaryAsync()
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            return new
            {
                TotalSales = sales.Sum(s => s.Amount),
                TotalOrders = sales.Sum(s => s.OrderIds.Count),
                TotalItemsSold = sales.Sum(s => s.OrderIds.Count)  // Adjust if item count is needed from elsewhere
            };
        }

        public async Task CreateSaleAsync(Sale sale)
        {
            await _mongoDBService.CreateSaleAsync(sale);
        }

        public async Task UpdateSaleAsync(string id, Sale sale)
        {
            await _mongoDBService.UpdateSaleAsync(id, sale);
        }

        public async Task DeleteSaleAsync(string id)
        {
            await _mongoDBService.DeleteSaleAsync(id);
        }
    }
}
