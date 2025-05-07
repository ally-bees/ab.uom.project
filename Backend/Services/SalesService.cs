using Backend.Models;
using MongoDB.Driver;
using System;
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

        // Get all sales
        public async Task<List<Sale>> GetAllSalesAsync()
        {
            return await _mongoDBService.GetAllSalesAsync();
        }

        // Get sale by ID
        public async Task<Sale> GetSaleByIdAsync(string id)
        {
            return await _mongoDBService.GetSaleByIdAsync(id);
        }

        // Get sales within a date range
        public async Task<List<Sale>> GetSalesByDateRangeAsync(string startDate, string endDate)
        {
            var sales = await _mongoDBService.GetAllSalesAsync();

            DateTime startDateTime = DateTime.Parse(startDate);
            DateTime endDateTime = DateTime.Parse(endDate);

            return sales
                .Where(s => s.SaleDate >= startDateTime && s.SaleDate <= endDateTime)
                .ToList();
        }

        // NEW: Get sales by year
        public async Task<List<Sale>> GetSalesByYearAsync(int year)
        {
            var sales = await _mongoDBService.GetAllSalesAsync();

            return sales
                .Where(s =>
                {
                    if (DateTime.TryParse(s.SaleDate.ToString(), out DateTime saleDate))
                    {
                        return saleDate.Year == year;
                    }
                    return false;
                })
                .ToList();
        }

        // Get summary of sales
        public async Task<object> GetSalesSummaryAsync()
        {
            var sales = await _mongoDBService.GetAllSalesAsync();

            return new
            {
                TotalSales = sales.Sum(s => s.Amount),
                TotalOrders = sales.Sum(s => s.OrderIds.Count),
                TotalItemsSold = sales.Sum(s => s.OrderIds.Count) // Adjust logic if needed
            };
        }

        // Create a sale
        public async Task CreateSaleAsync(Sale sale)
        {
            await _mongoDBService.CreateSaleAsync(sale);
        }

        // Update a sale
        public async Task UpdateSaleAsync(string id, Sale sale)
        {
            await _mongoDBService.UpdateSaleAsync(id, sale);
        }

        // Delete a sale
        public async Task DeleteSaleAsync(string id)
        {
            await _mongoDBService.DeleteSaleAsync(id);
        }
    }
}
