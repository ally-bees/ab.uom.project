using AuthAPI.Models;
using AuthAPI.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

namespace AuthAPI.Services;
public class UserService
{
    private readonly IMongoCollection<User> _usersCollection;

    public UserService(IOptions<MongoDbSetings> mongoDbSettings)
    {
        var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.AdminDatabaseName);
        _usersCollection = mongoDatabase.GetCollection<User>(mongoDbSettings.Value.UsersCollectionName);
    }

    public async Task<bool> GetAnyUser()
    {
        return await _usersCollection.Find(_ => true).AnyAsync();
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        return await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<User> GetByUsernameAsync(string username)
    {
        return await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User> GetByRolesAsync(string role)
    {
        return await _usersCollection.Find(u => u.Roles == role).FirstOrDefaultAsync();
    }
    public async Task<User> GetBySpecialIdAsync(string honeycombId)
    {
        return await _usersCollection.Find(u => u.HoneyCombId == honeycombId).FirstOrDefaultAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        await _usersCollection.InsertOneAsync(user);
        return user;
    }

    public (string passwordHash, string salt) HashPassword(string password)
    {
        using var hmac = new HMACSHA512();
        var salt = Convert.ToBase64String(hmac.Key);
        var passwordHash = Convert.ToBase64String(
            hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        
        return (passwordHash, salt);
    }

    public bool VerifyPassword(string password, string storedHash, string storedSalt)
    {
        using var hmac = new HMACSHA512(Convert.FromBase64String(storedSalt));
        var computedHash = Convert.ToBase64String(
            hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        
        return computedHash == storedHash;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _usersCollection.Find(_ => true).ToListAsync();
    }

    public async Task<User> GetByIdAsync(string id)
    {
        return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task UpdateUserAsync(User user)
    {
        await _usersCollection.ReplaceOneAsync(u => u.Id == user.Id, user);
    }
}