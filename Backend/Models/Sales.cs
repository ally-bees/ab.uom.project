using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Backend.Models
{
    [BsonIgnoreExtraElements]
    public class Sale
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("sales_id")] 
        public string SaleId { get; set; } = string.Empty;

        [BsonElement("orderIds")]
        public List<string> OrderIds { get; set; } = new();

        [BsonElement("saledate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime SaleDate { get; set; }

        [BsonElement("amount")]
        public double Amount { get; set; }
    }
}
