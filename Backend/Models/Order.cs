using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Backend.Models
{
    [BsonIgnoreExtraElements]
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("order_id")]
        public string OrderId { get; set; } = string.Empty;

        [BsonElement("customerId")]
        public string CustomerId { get; set; } = string.Empty;

        [BsonElement("orderDetails")]
        public List<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

        [BsonElement("totalAmount")]
        public double TotalAmount { get; set; }

        [BsonElement("orderDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime? OrderDate { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = string.Empty;
    }

    public class OrderDetail
    {
        [BsonElement("productId")]
        public string ProductId { get; set; } = string.Empty;

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("price")]
        public double Price { get; set; }
    }
}
