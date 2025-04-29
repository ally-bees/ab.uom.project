using AuthAPI.Models.DTOs;
using AuthAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RegisterAsync(registerDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try{
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
        
            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }

        catch(Exception ex){
            Console.WriteLine($"Login error: {ex.Message}");
            return StatusCode(500, new { Success = false, Message = "An internal server error occurred." });
        }
    }

    
}