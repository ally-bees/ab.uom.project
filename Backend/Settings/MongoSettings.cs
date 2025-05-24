using MongoDB.Driver;
using Backend.Models;

namespace Backend.Settings
{
    public class MongoSettings
    {
        public string ConnectionURI { get; set; } 
        public string DatabaseName { get; set; } 
        public string CollectionName { get; set; } 
    }
}