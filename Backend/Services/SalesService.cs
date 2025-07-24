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

        // Get total sales Revenue for a company
        public async Task<double> GetTotalSalesCostAsync(string? companyId = null)
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            
            // Debug the sales data
            Console.WriteLine($"GetTotalSalesCostAsync - Total sales records: {sales.Count}");
            Console.WriteLine($"GetTotalSalesCostAsync - Looking for company ID: {companyId ?? "null"}");
            
            // Show some sample company IDs from the data
            var sampleCompanyIds = sales.Take(5).Select(s => s.CompanyId).Distinct();
            Console.WriteLine($"GetTotalSalesCostAsync - Sample company IDs in data: {string.Join(", ", sampleCompanyIds)}");
            
            // Filter by company ID if provided
            if (!string.IsNullOrEmpty(companyId))
            {
                var beforeCount = sales.Count;
                sales = sales.Where(s => s.CompanyId == companyId).ToList();
                var afterCount = sales.Count;
                
                Console.WriteLine($"GetTotalSalesCostAsync - Filtered from {beforeCount} to {afterCount} records for company ID {companyId}");
            }
            
            // Calculate sum
            var sum = sales.Sum(s => s.Amount);
            Console.WriteLine($"GetTotalSalesCostAsync - Total sum: {sum}");
            
            return sum;
        }

        // Get today sales Revenue for a company
        public async Task<double> GetTodaySalesRevenueAsync(string? companyId = null)
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            
            Console.WriteLine($"GetTodaySalesRevenueAsync - Total sales records: {sales.Count}");
            Console.WriteLine($"GetTodaySalesRevenueAsync - Today's date: {DateTime.Today.ToString("yyyy-MM-dd")}");
            
            // Filter by today's date - ONLY today's date, no fallback to other dates
            var todaySales = sales.Where(s => s.SaleDate.Date == DateTime.Today).ToList();
            Console.WriteLine($"GetTodaySalesRevenueAsync - Sales from today: {todaySales.Count}");
            
            // Check for debug purposes if we actually have data
            if (todaySales.Count == 0)
            {
                Console.WriteLine("GetTodaySalesRevenueAsync - WARNING: No sales found for today's date.");
                // Return 0 if there are no sales today
                // This is intentional - we want the exact revenue of today's sales
            }
            
            // Filter by company ID if provided
            if (!string.IsNullOrEmpty(companyId))
            {
                var beforeCount = todaySales.Count;
                todaySales = todaySales.Where(s => s.CompanyId == companyId).ToList();
                var afterCount = todaySales.Count;
                
                Console.WriteLine($"GetTodaySalesRevenueAsync - Filtered from {beforeCount} to {afterCount} records for company ID {companyId}");
            }
            
            // Calculate sum
            var sum = todaySales.Sum(s => s.Amount);
            Console.WriteLine($"GetTodaySalesRevenueAsync - Total sum: {sum}");
            
            return sum;
        }

        public async Task<List<double>> GetMonthlySalesAsync()
        {
            var sales = await _mongoDBService.GetAllSalesAsync();

            var now = DateTime.UtcNow;
            var currentMonth = now.Month;
            var currentYear = now.Year;

            // Filter sales for current month and year
            var filteredSales = sales.Where(s =>
                s.SaleDate.Month == currentMonth &&
                s.SaleDate.Year == currentYear
            );

            // Group sales by day and sum the Amount
            var grouped = filteredSales
                .GroupBy(s => s.SaleDate.Day)
                .Select(g => new
                {
                    Day = g.Key,
                    Total = g.Sum(x => x.Amount)  // double sum here
                })
                .ToList();

            int daysInMonth = DateTime.DaysInMonth(currentYear, currentMonth);
            var dailySales = new List<double>(new double[daysInMonth]);  // initialize with zeros

            // Fill the daily sales list with the sums
            foreach (var item in grouped)
            {
                dailySales[item.Day - 1] = item.Total;
            }

            return dailySales;
        }

        public async Task<List<double>> GetYearlySalesAsync(int year)
        {
            // Load all sales (you can optimize later if needed)
            var sales = await _mongoDBService.GetAllSalesAsync();

            // Filter sales only in the given year
            var yearlySales = sales.Where(s => s.SaleDate.Year == year);

            // Initialize list for 12 months (Jan to Dec) with zeros
            var monthlyTotals = new double[12];

            // Sum amounts grouped by month
            foreach (var sale in yearlySales)
            {
                int monthIndex = sale.SaleDate.Month - 1;
                monthlyTotals[monthIndex] += sale.Amount;
            }

            return monthlyTotals.ToList();
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
