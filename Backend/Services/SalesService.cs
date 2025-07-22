using Backend.Models;
using Backend.Models.DTOs;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;   
using Backend.Models.DTOs;

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

        // Get total sales Revenue
        public async Task<double> GetTotalSalesCostAsync()
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            return sales.Sum(s=> s.Amount);
        }

        // Get today sales Revenue
        public async Task<double> GetTodaySalesRevenueAsync()
        {
            var sales = await _mongoDBService.GetAllSalesAsync();
            return sales
                .Where(s=> s.SaleDate.Date == DateTime.Today)
                .Sum(s => s.Amount);
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

        // Aggregate sales, orders, and inventory for a date range and company
        public async Task<List<SalesAggregatedDto>> GetAggregatedSalesDataAsync(DateTime startDate, DateTime endDate, string companyId)
        {
            var sales = (await _mongoDBService.GetAllSalesAsync()).Where(s => s.CompanyId == companyId).ToList();
            var orders = (await _mongoDBService.GetAllOrdersAsync()).Where(o => o.CompanyId == companyId).ToList();
            var inventory = (await _mongoDBService.GetAllInventoryAsync()).Where(p => p.CompanyId == companyId).ToList();

            var filteredSales = sales.Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate).ToList();

            var result = new List<SalesAggregatedDto>();

            foreach (var sale in filteredSales)
            {
                foreach (var orderId in sale.OrderIds)
                {
                    var order = orders.FirstOrDefault(o => o.OrderId == orderId);
                    if (order != null && order.OrderDetails != null)
                    {
                        foreach (var detail in order.OrderDetails)
                        {
                            var prod = inventory.FirstOrDefault(p => p.ProductId == detail.ProductId);
                            result.Add(new SalesAggregatedDto
                            {
                                SaleId = sale.SaleId,
                                SalesDate = sale.SaleDate,
                                OrderId = order.OrderId,
                                ProductId = detail.ProductId,
                                ProductName = prod?.Name ?? string.Empty,
                                Category = prod?.Category ?? string.Empty,
                                Quantity = detail.Quantity,
                                Price = detail.Price,
                                CompanyId = sale.CompanyId ?? string.Empty
                            });
                        }
                    }
                }
            }
            return result;
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
