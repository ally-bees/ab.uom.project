using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
namespace Backend.Models
{
    [BsonIgnoreExtraElements]
    public class Sale
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("sale_id")]
        public string SaleId { get; set; }

        [BsonElement("vendor_id")]
        public string VendorId { get; set; }

        [BsonElement("product_id")]
        public List<string> ProductIds { get; set; }

        [BsonElement("date")]
        public string Date { get; set; }

        [BsonElement("total_sales")]
        public double TotalSales { get; set; }

        [BsonElement("total_orders_count")]
        public int TotalOrdersCount { get; set; }

        [BsonElement("total_items_sold")]
        public int TotalItemsSold { get; set; }
    }
}