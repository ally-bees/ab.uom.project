using MongoDB.Driver;
using Backend.Models;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class ChatService : IChatService
    {
        private readonly IMongoCollection<ChatMessage> _messages;

        public ChatService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            
            _messages = database.GetCollection<ChatMessage>("messages");
        }

        public async Task<List<ChatMessage>> GetMessagesBetweenAsync(string sender, string receiver)
        {
            var filter = Builders<ChatMessage>.Filter.Or(
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.Sender, sender),
                    Builders<ChatMessage>.Filter.Eq(m => m.Receiver, receiver)
                ),
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.Sender, receiver),
                    Builders<ChatMessage>.Filter.Eq(m => m.Receiver, sender)
                )
            );

            return await _messages.Find(filter)
                .SortBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task SendMessageAsync(ChatMessage message)
        {
            await _messages.InsertOneAsync(message);
        }
    }
}
