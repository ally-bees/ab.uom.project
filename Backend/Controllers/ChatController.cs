using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Hubs;
using Backend.Services;
using Microsoft.AspNetCore.SignalR;  
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(IChatService chatService, IHubContext<ChatHub> hubContext)
        {
            _chatService = chatService;
            _hubContext = hubContext;
        }

        [HttpGet("messages")]
        public async Task<ActionResult<List<ChatMessage>>> GetMessages([FromQuery] string sender, [FromQuery] string receiver)
        {
            var messages = await _chatService.GetMessagesBetweenAsync(sender, receiver);
            return Ok(messages);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Text))
                return BadRequest("Invalid message");

            // Save to database first
            await _chatService.SendMessageAsync(message);

            // Broadcast to all clients via SignalR
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message);

            return Ok();
        }
    }
}