using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

[BsonIgnoreExtraElements]
public class Campaign
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
[BsonElement("camId")] 
        public required string CampaignId { get; set; }

        [BsonElement("platform")]
        public required string Platform { get; set;}

        [BsonElement("description")]
        public required string Description { get; set;}

        [BsonElement("clickThroughRate")]
        public required double ClickThroughRate { get; set;}

        [BsonElement("cpc")]
        public required double Cpc { get; set;}

        [BsonElement("spentAmount")]
        public required double SpentAmount { get; set;}

        [BsonElement("noOfVisitors")]
        public required int NoOfVisitors { get; set;}

        [BsonElement("noOfCustomers")]
        public required int NoOfCustomers { get; set;}

        [BsonElement("date")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public required DateTime CampaignDate { get; set;}


    // Add other fields as needed (e.g., name, platform, etc.)
}