// using AuthAPI.Models.DTOs;
// using AuthAPI.Services;
// using Backend.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Backend.Controllers;

// [Route("api/[controller]")]
// [ApiController]
// public class AuthController : ControllerBase
// {
//     private readonly AuthService _authService;
//     private readonly UserService _userService;
//     private readonly IEmailService _emailService;

//     private readonly IPasswordResetService _passwordResetService;

//     public AuthController(AuthService authService, IEmailService emailService, UserService userService, IPasswordResetService passwordResetService)
//     {
//         _authService = authService;
//         _emailService = emailService;
//         _userService = userService;
//         _passwordResetService = passwordResetService;
//     }

//     [HttpPost("register")]
//     public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
//     {
//         if (!ModelState.IsValid)
//         {
//             return BadRequest(ModelState);
//         }

//         var result = await _authService.RegisterAsync(registerDto);
        
//         if (!result.Success)
//         {
//             return BadRequest(result);
//         }

//         return Ok(result);
//     }

//     [HttpPost("login")]
//     public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
//     {
//         try{
//             if (!ModelState.IsValid)
//             {
//                 return BadRequest(ModelState);
//             }

//             var result = await _authService.LoginAsync(loginDto);
        
//             if (!result.Success)
//             {
//                 return Unauthorized(result);
//             }

//             return Ok(result);
//         }

//         catch(Exception ex){
//             Console.WriteLine($"Login error: {ex.Message}");
//             return StatusCode(500, new { Success = false, Message = "An internal server error occurred." });
//         }
//     }

//     [HttpPost("forgot-password")]
//     public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto requestDto)
//     {
//         if (string.IsNullOrEmpty(requestDto.Email))
//         {
//             return BadRequest(new { Success = false, Message = "Email is required." });
//         }

//         try
//         {
//             // Find the user by email
//             var user = await _userService.GetByEmailAsync(requestDto.Email);
            
//             // Always return OK, even if user not found (security best practice)
//             if (user != null)
//             {
//                 // Generate password reset token
//                 var token = await _authService.GeneratePasswordResetTokenAsync(user);
                
//                 // Send email with reset link
//                 await SendPasswordResetEmailAsync(user.Email, token);
//             }

//             return Ok(new { Success = true, Message = "..., you will receive a password reset link." });
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Forgot password error: {ex.Message}");
//             // Still return OK for secuirty (don't reveal if email exists)
//             return Ok(new { Success = true, Message = "If your email exists in our database, you will receive a password reset link." });
//         }
//     }

//     [HttpPost("reset-password")]
//     public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto requestDto)
//     {
//         if (string.IsNullOrEmpty(requestDto.Token) || string.IsNullOrEmpty(requestDto.NewPassword))
//         {
//             return BadRequest(new { Success = false, Message = "Token and new password are required." });
//         }

//         try
//         {
//             var result = await _authService.ResetPasswordAsync(requestDto.Token, requestDto.NewPassword);
            
//             if (result)
//             {
//                 return Ok(new { Success = true, Message = "Password has been reset successfully." });
//             }
//             else
//             {
//                 return BadRequest(new { Success = false, Message = "Invalid or expired token." });
//             }
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Reset password error: {ex.Message}");
//             return StatusCode(500, new { Success = false, Message = "An error occurred while resetting your password." });
//         }
//     }


//     // Helper method for sending password reset emails
//     private async Task SendPasswordResetEmailAsync(string email, string token)
//     {
//         var resetLink = $"http://localhost:4200/reset-password?token={token}";
        
//         string emailBody = $@"
//             <h2>Reset Your Password</h2>
//             <p>You requested to reset your password for your InstaDash account.</p>
//             <p>Please click the link below to reset your password:</p>
//             <p><a href='{resetLink}'>Reset My Password</a></p>
//             <p>If you did not request a password reset, please ignore this email.</p>
//             <p>This link will expire in 30 minutes for security reasons.</p>
//             <p>Thank you,<br>The InstaDash Team</p>
//         ";
        
//         await _emailService.SendEmailAsync(
//             email,
//             "Reset Your InstaDash Password",
//             emailBody
//         );

//     }
// }

using AuthAPI.Models.DTOs;
using AuthAPI.Services;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserService _userService;
        private readonly IEmailService _emailService;
        private readonly IPasswordResetService _passwordResetService;

        public AuthController(
            AuthService authService,
            IEmailService emailService,
            UserService userService,
            IPasswordResetService passwordResetService)
        {
            _authService = authService;
            _emailService = emailService;
            _userService = userService;
            _passwordResetService = passwordResetService;
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
            try
            {
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
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return StatusCode(500, new { Success = false, Message = "An internal server error occurred." });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if user exists - use the correct method name
                var user = await _userService.GetByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    // Don't reveal if email exists or not for security
                    return Ok(new { success = true, message = "If the email exists, a password reset link will be sent." });
                }

                // Generate reset token
                var resetToken = await _passwordResetService.GenerateResetTokenAsync(user.Id, user.Email);

                // Send reset email
                var resetUrl = "http://localhost:4200/reset-password"; // Your frontend reset page URL
                await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken, resetUrl);

                return Ok(new { success = true, message = "Password reset link has been sent to your email." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Forgot password error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred while processing your request." });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate reset token
                var passwordReset = await _passwordResetService.ValidateResetTokenAsync(resetPasswordDto.Token, resetPasswordDto.Email);
                if (passwordReset == null)
                {
                    return BadRequest(new { success = false, message = "Invalid or expired reset token." });
                }

                // Update user password using AuthService
                var result = await _authService.ResetPasswordAsync(resetPasswordDto.Token, resetPasswordDto.NewPassword);
                if (!result)
                {
                    return BadRequest(new { success = false, message = "Failed to reset password." });
                }

                // Mark token as used
                await _passwordResetService.MarkTokenAsUsedAsync(resetPasswordDto.Token);

                return Ok(new { success = true, message = "Password has been reset successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Reset password error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred while resetting your password." });
            }
        }

        //test email setup
        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
        {
            try
            {
                await _emailService.SendEmailAsync(
                    request.Email, 
                    "Test Email from Allybees", 
                    "<h1>🎉 Email Test Successful!</h1><p>Your email configuration is working correctly!</p>",
                    true
                );
                
                return Ok(new { success = true, message = "Test email sent successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message, details = ex.ToString() });
            }
        }

        public class TestEmailRequest
        {
            public string Email { get; set; } = string.Empty;
        }
    }
    
    
}