using AuthAPI.Models;
using AuthAPI.Models.DTOs;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using System.Text;

namespace AuthAPI.Services;
public class AuthService
{
    private readonly UserService _userService;
    private readonly JwtSettings _jwtSettings;
    


    public AuthService(UserService userService, IOptions<JwtSettings> jwtSettings)
    {
        _userService = userService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if email already exists
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
        var existingUserBySpecialId = await _userService.GetBySpecialIdAsync(registerDto.HoneyCombId);
        if (existingUserBySpecialId != null)
        {
            return new AuthResponseDto { Success = false, Message = "Special ID already registered" };
        }

        // Hash password
        var (passwordHash, salt) = _userService.HashPassword(registerDto.Password);

        // Create new user
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            Salt = salt,
            HoneyCombId = registerDto.HoneyCombId,
            Roles = registerDto.Role
        };

        // Save user to database
        await _userService.CreateAsync(user);

        // Generate JWT token
        var token = GenerateJwtToken(user);

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
        // Find user by email
        var user = await _userService.GetByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return new AuthResponseDto { Success = false, Message = "Invalid email or password" };
        }

        // Verify password
        if (!_userService.VerifyPassword(loginDto.Password, user.PasswordHash, user.Salt))
        {
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
            new Claim("honeycombId", user.HoneyCombId),
            //new Claim("role", user.Roles)
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

        // Hash the new password
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