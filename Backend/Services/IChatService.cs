using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IChatService
    {
        Task<List<ChatMessage>> GetMessagesBetweenAsync(string sender, string receiver);
        Task SendMessageAsync(ChatMessage message);
    }
}
