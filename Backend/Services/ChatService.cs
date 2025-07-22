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

        public ChatService(IMongoDatabase database)
        {
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

        public async Task<DeleteResult> DeleteMessageAsync(string id)
        {
            var filter = Builders<ChatMessage>.Filter.Eq(m => m.Id, id);
            return await _messages.DeleteOneAsync(filter);
        }

        public async Task<UpdateResult> UpdateMessageAsync(string id, string newText)
        {
            var filter = Builders<ChatMessage>.Filter.Eq(m => m.Id, id);
            var update = Builders<ChatMessage>.Update
                .Set(m => m.Text, newText)
                .Set(m => m.Timestamp, System.DateTime.UtcNow); // Update timestamp to reflect edit time

            return await _messages.UpdateOneAsync(filter, update);
        }

        public async Task<ChatMessage?> GetMessageByIdAsync(string id)
        {
            var filter = Builders<ChatMessage>.Filter.Eq(m => m.Id, id);
            return await _messages.Find(filter).FirstOrDefaultAsync();
        }
    }
}