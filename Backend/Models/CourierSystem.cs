using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace CourierSystem.Models
{
    public class Delivery
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("deliveryId")]
        public string DeliveryId { get; set; }

        [BsonElement("orderId")]
        public string OrderId { get; set; }

        [BsonElement("orderDate")]
        public DateTime OrderDate { get; set; }

        [BsonElement("estimatedDeliveryDate")]
        public DateTime EstimatedDeliveryDate { get; set; }

        [BsonElement("city")]
        public string City { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } // "Pending", "Completed", "Rejected"

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }

    public class DeliverySummary
    {
        public int TotalDeliveries { get; set; }
        public int PendingDeliveries { get; set; }
        public int CompletedDeliveries { get; set; }
        public int RejectedDeliveries { get; set; }
        public List<Delivery> RecentDeliveries { get; set; }
    }

    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string DeliveriesCollectionName { get; set; } = null!;
    }
}
