using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;


namespace Backend.Models
{
    [BsonIgnoreExtraElements]
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("order_id")]
        public string OrderId { get; set; }

        [BsonElement("customerId")]
        public string CustomerId { get; set; }

        [BsonElement("product_id")]
        public List<string> ProductIds { get; set; }

        [BsonElement("quantity")]
        public List<int> Quantities { get; set; }

        [BsonElement("total_amount")]
        public double TotalAmount { get; set; }

        [BsonElement("orderDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime OrderDate { get; set; }

        [BsonElement("status")]
        public string Status { get; set; }
    }
}