// Services/PasswordResetService.cs
using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    public interface IPasswordResetService
    {
        Task<string> GenerateResetTokenAsync(string userId, string email);
        Task<PasswordReset?> ValidateResetTokenAsync(string token, string email);
        Task MarkTokenAsUsedAsync(string token);
        Task CleanupExpiredTokensAsync();
    }

    public class PasswordResetService : IPasswordResetService
    {
        private readonly IMongoCollection<PasswordReset> _passwordResetCollection;

        public PasswordResetService(IOptions<MongoDBSettings> mongoDbSettings)
        {
            var settings = mongoDbSettings.Value;
            var mongoClient = new MongoClient(settings.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.UserDetailsdatabase);
            _passwordResetCollection = mongoDatabase.GetCollection<PasswordReset>(settings.PasswordResetCollectionName);
        }

        public async Task<string> GenerateResetTokenAsync(string userId, string email)
        {
            // Invalidate any existing tokens for this user
            await _passwordResetCollection.UpdateManyAsync(
                pr => pr.UserId == userId && !pr.IsUsed,
                Builders<PasswordReset>.Update.Set(pr => pr.IsUsed, true)
            );

            // Generate secure token
            var token = GenerateSecureToken();

            var passwordReset = new PasswordReset
            {
                UserId = userId,
                Email = email,
                ResetToken = token,
                ExpiresAt = DateTime.UtcNow.AddHours(1), // Token expires in 1 hour
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            await _passwordResetCollection.InsertOneAsync(passwordReset);
            return token;
        }

        public async Task<PasswordReset?> ValidateResetTokenAsync(string token, string email)
        {
            Console.WriteLine($"🔍 [PasswordResetService] Validating token: {token}");
            Console.WriteLine($"🔍 [PasswordResetService] For email: {email}");
            Console.WriteLine($"🔍 [PasswordResetService] Current UTC time: {DateTime.UtcNow}");

            var passwordReset = await _passwordResetCollection
                .Find(pr => pr.ResetToken == token && 
                           pr.Email == email && 
                           !pr.IsUsed && 
                           pr.ExpiresAt > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (passwordReset == null)
            {
                Console.WriteLine(" [PasswordResetService] No matching token found, checking all tokens for this email...");
                
                // Debug: Check if there are any tokens for this email
                var allTokensForEmail = await _passwordResetCollection
                    .Find(pr => pr.Email == email)
                    .ToListAsync();
                
                Console.WriteLine($" [PasswordResetService] Found {allTokensForEmail.Count} tokens for email {email}");
                
                foreach (var tokenInfo in allTokensForEmail)
                {
                    Console.WriteLine($" [PasswordResetService] Token: {tokenInfo.ResetToken}");
                    Console.WriteLine($" [PasswordResetService] IsUsed: {tokenInfo.IsUsed}");
                    Console.WriteLine($" [PasswordResetService] ExpiresAt: {tokenInfo.ExpiresAt}");
                    Console.WriteLine($" [PasswordResetService] CreatedAt: {tokenInfo.CreatedAt}");
                    Console.WriteLine($" [PasswordResetService] Expired: {tokenInfo.ExpiresAt <= DateTime.UtcNow}");
                    Console.WriteLine("---");
                }
            }
            else
            {
                Console.WriteLine("✅ [PasswordResetService] Token validation successful");
            }

            return passwordReset;
        }

        public async Task MarkTokenAsUsedAsync(string token)
        {
            await _passwordResetCollection.UpdateOneAsync(
                pr => pr.ResetToken == token,
                Builders<PasswordReset>.Update
                    .Set(pr => pr.IsUsed, true)
                    .Set(pr => pr.UsedAt, DateTime.UtcNow)
            );
        }

        public async Task CleanupExpiredTokensAsync()
        {
            await _passwordResetCollection.DeleteManyAsync(
                pr => pr.ExpiresAt < DateTime.UtcNow || pr.IsUsed
            );
        }

        private static string GenerateSecureToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[32];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
}