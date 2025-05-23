using MongoDB.Driver;
using auditpagebackend.Collection;

namespace auditpagebackend.Models
{
    public class MongoDBSettings
    {
        public string ConnectionURI { get; set; } = "mongodb+srv://ab_uom:RENJcutwO9Ne3cP6@cluster0-uom.s9ggq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-UOM";
        public string DatabaseName { get; set; } = "ab-uom";
        public string CollectionName { get; set; } = "audit";
    }
}