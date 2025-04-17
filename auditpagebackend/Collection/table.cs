using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace auditpagebackend.Collection
{
    [BsonIgnoreExtraElements] // Optional: ignores unmatched fields like 'names' instead of 'name'
    public class Table
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("date")]
        public DateTime? Date { get; set; }

        [BsonElement("audit_id")]
        public string? AuditId { get; set; }

        [BsonElement("sales_id")]
        [JsonPropertyName("salesId")]
        public string? SalesId { get; set; }

        [BsonElement("names")]
        public string? Name { get; set; }

        [BsonElement("value")]
        public double? Value { get; set; }  // Use double to match 79.99

        [BsonElement("tax")]
        public double? Tax { get; set; }

        [BsonElement("netvalue")]
        public double? NetValue { get; set; }
    }
}
