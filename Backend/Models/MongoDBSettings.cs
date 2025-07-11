namespace Backend.Models
{
    public class MongoDBSettings
    {
        public required string ConnectionString { get; set; }
        public required string DatabaseName { get; set; }

        public string AdminDatabaseName { get; set; }                     // ✅ Needed
        public string UsersCollectionName { get; set; }                   // ✅ Needed
        public string UserDetailsCollectionName { get; set; }            // ✅ Needed
        public string UserDetailsdatabase { get; set; }                   // ✅ Needed (we’ll improve name later)
        public string PasswordResetCollectionName { get; set; }          // ✅ Needed
        public string HoneyCombCollectionName { get; set; }              // ✅ Needed
        public string HoneyCombDatabaseName { get; set; }                // ✅ Optional (if used)
    }
}
