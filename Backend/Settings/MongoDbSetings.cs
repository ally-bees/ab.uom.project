namespace AuthAPI.Settings
{
    public class MongoDbSetings
    {
        public string ConnectionString { get; set; }
        
        public string AdminDatabaseName { get; set; }
        public string UsersCollectionName { get; set; }
    }
}