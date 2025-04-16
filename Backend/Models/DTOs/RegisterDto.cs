
using System.ComponentModel.DataAnnotations;

namespace AuthAPI.Models.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public string HoneyCombId { get; set; }
    }
}