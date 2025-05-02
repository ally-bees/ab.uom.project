namespace Backend.Models
{
    public class SalesViewModel
    {
        public List<Sale> Sales { get; set; }
        public List<Order> RelatedOrders { get; set; }
        public List<Inventory> RelatedInventory { get; set; }
        
        public double TotalRevenue { get; set; }
        public int TotalItems { get; set; }
        public int TotalOrders { get; set; }
    }
}