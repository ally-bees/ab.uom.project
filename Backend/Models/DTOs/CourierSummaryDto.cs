using System.Text.Json.Serialization;

namespace Backend.Models.DTOs
{
    public class CourierSummaryDto
    {
        [JsonPropertyName("total")]
        public int Total { get; set; }

        [JsonPropertyName("pending")]
        public int Pending { get; set; }

        [JsonPropertyName("completed")]
        public int Completed { get; set; }

        [JsonPropertyName("rejected")]
        public int Rejected { get; set; }
    }
}

