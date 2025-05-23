using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Courier
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("order_id")]
        public string OrderId { get; set; }

        [BsonElement("courier_id")]
        public string CourierId { get; set; }

        [BsonElement("destination")]
        public string Destination { get; set; }

        [BsonElement("date")]
        public DateTime Date { get; set; }

        [BsonElement("estimate_date")]
        public DateTime EstimateDate { get; set; }

        [BsonElement("status")]
        public string Status { get; set; }
    }
}
