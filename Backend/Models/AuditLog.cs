using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [BsonIgnoreExtraElements]
    public class AuditLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [BsonElement("user_id")]
        public string? UserId { get; set; }

        [BsonElement("username")]
        public string? Username { get; set; }

        [BsonElement("user_email")]
        public string? UserEmail { get; set; }

        [BsonElement("user_role")]
        public string? UserRole { get; set; }

        [BsonElement("action")]
        public string Action { get; set; } = string.Empty;

        [BsonElement("action_type")]
        public string ActionType { get; set; } = string.Empty; // Login, Create, Update, Delete, Export, etc.

        [BsonElement("resource")]
        public string? Resource { get; set; } // Which resource was affected (User, Order, Product, etc.)

        [BsonElement("resource_id")]
        public string? ResourceId { get; set; }

        [BsonElement("details")]
        public string? Details { get; set; }

        [BsonElement("ip_address")]
        public string? IpAddress { get; set; }

        [BsonElement("user_agent")]
        public string? UserAgent { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = "Success"; // Success, Failed, Pending

        [BsonElement("error_message")]
        public string? ErrorMessage { get; set; }

        [BsonElement("session_id")]
        public string? SessionId { get; set; }

        [BsonElement("module")]
        public string? Module { get; set; } // Admin, Sales, Inventory, etc.

        [BsonElement("severity")]
        public string Severity { get; set; } = "Info"; // Info, Warning, Error, Critical

        [BsonElement("old_values")]
        public object? OldValues { get; set; }

        [BsonElement("new_values")]
        public object? NewValues { get; set; }

        [BsonElement("duration_ms")]
        public long? DurationMs { get; set; }

        [BsonElement("is_system_log")]
        public bool IsSystemLog { get; set; } = false;
    }

    public class AuditLogFilter
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? UserId { get; set; }
        public string? Username { get; set; }
        public string? ActionType { get; set; }
        public string? Resource { get; set; }
        public string? Status { get; set; }
        public string? Severity { get; set; }
        public string? Module { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }

    public class AuditLogSummary
    {
        public long TotalLogs { get; set; }
        public long SuccessCount { get; set; }
        public long FailedCount { get; set; }
        public long PendingCount { get; set; }
        public Dictionary<string, long> ActionTypeCounts { get; set; } = new();
        public Dictionary<string, long> ModuleCounts { get; set; } = new();
        public Dictionary<string, long> SeverityCounts { get; set; } = new();
        public List<AuditLog> RecentLogs { get; set; } = new();
    }
} 