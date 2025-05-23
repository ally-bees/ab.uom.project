using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backendcustomerinsight.Collection
{
    [BsonIgnoreExtraElements]
    public class OrderDetail
    {
        [BsonElement("productId")]
        public string ProductId { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("price")]
        public double Price { get; set; } 
    }
}