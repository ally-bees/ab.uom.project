using AuthAPI.Models;
using AuthAPI.Models.DTOs;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using System.Text;
using Backend.Services;

namespace AuthAPI.Services;
public class AuthService
{
    private readonly UserService _userService;
    private readonly JwtSettings _jwtSettings;
    private readonly HoneycombService _honeycombService;
    private readonly IEmailService _emailService;

    public AuthService(UserService userService, IOptions<JwtSettings> jwtSettings, HoneycombService honeycombService, IEmailService emailService)
    {
        _userService = userService;
        _jwtSettings = jwtSettings.Value;
        _honeycombService = honeycombService;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // First, check if the honeycomb ID exists in the honeycomb database
        var honeycombUser = await _honeycombService.GetByHoneycombIdAsync(registerDto.HoneyCombId);
        if (honeycombUser == null)
        {
            return new AuthResponseDto { 
                Success = false, 
                Message = "Invalid Honeycomb ID. Please check and try again." 
            };
        }

        // Verify the email matches the one associated with the honeycomb ID
        if (!honeycombUser.Email.Equals(registerDto.Email, StringComparison.OrdinalIgnoreCase))
        {
            return new AuthResponseDto { 
                Success = false, 
                Message = "The email address does not match the Honeycomb ID record." 
            };
        }

        // Check if email already exists in the users collection
        var existingUserByEmail = await _userService.GetByEmailAsync(registerDto.Email);
        if (existingUserByEmail != null)
        {
            return new AuthResponseDto { Success = false, Message = "Email already registered" };
        }

        // Check if username already exists
        var existingUserByUsername = await _userService.GetByUsernameAsync(registerDto.Username);
        if (existingUserByUsername != null)
        {
            return new AuthResponseDto { Success = false, Message = "Username already taken" };
        }

        // Check if special ID already exists
        var existingUserByHoneycombId = await _userService.GetByHoneyCombIdAsync(registerDto.HoneyCombId);
        if (existingUserByHoneycombId != null)
        {
            return new AuthResponseDto { Success = false, Message = "This Honeycomb ID is already registered" };
        }

        // Hash password using BCrypt (consistent with reset password)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        // Create new user with role from honeycomb database
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            Salt = string.Empty, // Not needed with BCrypt
            HoneyCombId = registerDto.HoneyCombId,
            CompanyId = honeycombUser.CompanyId,
            Roles = honeycombUser.Roles // Get role from honeycomb data
        };

        // Save user to database
        await _userService.CreateAsync(user);

        // Generate JWT token
        var token = GenerateJwtToken(user);

        try
        {
            _ = _emailService.SendWelcomeEmailAsync(user.Email, user.Username)
                .ContinueWith(t => 
                {
                    if (t.IsFaulted)
                    {
                        Console.WriteLine($"Error sending welcome email: {t.Exception?.InnerException?.Message ?? t.Exception?.Message}");
                    }
                    else
                    {
                        Console.WriteLine($" Welcome email sent successfully to {user.Email}");
                    }
                });
        }
        catch (Exception ex)
        {
            // Log the error but don't fail registration
            Console.WriteLine($"Failed to trigger welcome email: {ex.Message}");
        }

        return new AuthResponseDto
        {
            Success = true,
            Token = token,
            Message = "Registration successful",
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                HoneyCombId = user.HoneyCombId,
                Role = user.Roles
            }
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        try
        {
            Console.WriteLine($" Login attempt for email: {loginDto.Email}");
            
            // Find user by email
            var user = await _userService.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                Console.WriteLine($" User not found for email: {loginDto.Email}");
                return new AuthResponseDto { Success = false, Message = "Invalid email or password" };
            }

            // Verify password using BCrypt
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                Console.WriteLine($" Password verification failed for user: {user.Username}");
                return new AuthResponseDto { Success = false, Message = "Invalid email or password" };
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                Message = "Login successful",
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    HoneyCombId = user.HoneyCombId,
                    Role = user.Roles
                }
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($" Login error: {ex.Message}");
            Console.WriteLine($" Stack trace: {ex.StackTrace}");
            throw;
        }
    }

    private string GenerateJwtToken(User user)
    {
        try{
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(_jwtSettings.ExpiresInMinutes);

        var claims = new List<Claim>
        {
            new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Email),
            new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("username", user.Username),
            new Claim("HoneyCombId", user.HoneyCombId),
            new Claim(ClaimTypes.Role, user.Roles)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
        }
        catch (Exception ex)
        {
            // Log the exception
            Console.WriteLine($"Error generating JWT token: {ex.Message}");
            throw new Exception("Error generating authentication token", ex);
        }
    }

    public async Task<string> GeneratePasswordResetTokenAsync(User user)
    {
        // Create a JWT token valid for short time
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("UserId", user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(30), // Token valid for 30 mins
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<bool> ResetPasswordAsync(string token, string newPassword)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = jwtToken.Claims.First(x => x.Type == "UserId").Value;

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return false;

            // Hash the new password using BCrypt
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _userService.UpdateUserAsync(user);

            return true;
        }
        catch
        {
            return false;
        }
    }
}