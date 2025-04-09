using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    [BsonIgnoreExtraElements] // <- VERY IMPORTANT!
    public class Inventory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("product_id")]
        public string ProductId { get; set; }

        [BsonElement("product_name")]
        public string ProductName { get; set; }

        [BsonElement("quantity_available")]
        public int QuantityAvailable { get; set; }

        [BsonElement("availability_status")]
        public bool AvailabilityStatus { get; set; }

        [BsonElement("price")]
        public double Price { get; set; }

        [BsonElement("category")]
        public string Category { get; set; }
    }
}
