using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
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

            await _chatService.SendMessageAsync(message);
            return Ok();
        }
    }
}
