using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace AuthAPI.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Salt { get; set; }

        [Required]
        public string HoneyCombId { get; set; }

        [Required]
        public string Roles { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}