using MongoDB.Driver;
using Backendcustomerinsight.Collection;

namespace Backendcustomerinsight.Models
{
    public class MongoDBSettings
    {
        public string ConnectionURI { get; set; } = "mongodb+srv://ab_uom:RENJcutwO9Ne3cP6@cluster0-uom.s9ggq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-UOM";
        public string DatabaseName { get; set; } = "ab-uom";
        public string CollectionName1 { get; set; } = "orders";
        public string CollectionName2 { get; set; } = "customers";
        public string CollectionName3 { get; set; } = "inventory";

    }
}