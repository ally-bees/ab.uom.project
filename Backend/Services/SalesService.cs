using Backend.Models;
using MongoDB.Driver;

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

        public async Task<List<Sale>> GetSalesByVendorIdAsync(string vendorId)
        {
            // Implement this functionality with MongoDB service
            var sales = await _mongoDBService.GetAllSalesAsync();
            return sales.Where(s => s.VendorId == vendorId).ToList();
        }

        public async Task<List<Sale>> GetSalesByDateRangeAsync(string startDate, string endDate)
        {
            // Implement this functionality with MongoDB service
            var sales = await _mongoDBService.GetAllSalesAsync();
            return sales.Where(s => string.Compare(s.Date, startDate) >= 0 && string.Compare(s.Date, endDate) <= 0).ToList();
        }

        public async Task<object> GetSalesSummaryAsync()
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            return new
            {
                TotalSales = sales.Sum(s => s.TotalSales),
                TotalOrders = sales.Sum(s => s.TotalOrdersCount),
                TotalItemsSold = sales.Sum(s => s.TotalItemsSold)
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