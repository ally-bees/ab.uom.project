using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

[BsonIgnoreExtraElements]
public class Campaign
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("spentAmount")]
    public double SpentAmount { get; set; }

    [BsonElement("noOfVisitors")]
    public int NoOfVisitors { get; set; }

    [BsonElement("noOfCustomers")]
    public int NoOfCustomers { get; set; }

    // Add other fields as needed (e.g., name, platform, etc.)
}