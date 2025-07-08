using System.Net;
using System.Text;
using AuthAPI.Models.DTOs;
using AuthAPI.Services;
using AuthAPI.Settings;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// === Configuration ===
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Use TLS 1.2
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// === Services Registration ===
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// === Configuration Bindings ===
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// === MongoDB Setup ===
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    if (mongoDbSettings == null || string.IsNullOrEmpty(mongoDbSettings.ConnectionString) || string.IsNullOrEmpty(mongoDbSettings.DatabaseName))
    {
        throw new InvalidOperationException("MongoDBSettings are missing or incomplete in the configuration file.");
    }
    return new MongoClient(mongoDbSettings.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    return mongoClient.GetDatabase(mongoDbSettings.DatabaseName);
});

// === Backend Services ===
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<SalesService>();
builder.Services.AddSingleton<CustomerCountService>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddSingleton<InventoryService>();
builder.Services.AddSingleton<ExpenseService>();
builder.Services.AddSingleton<AutomationService>();
builder.Services.AddSingleton<FinanceService>();
builder.Services.AddSingleton<MongoDbCustomerInsightService>();
builder.Services.AddSingleton<Auditservice>();

// === Auth & User Services ===
builder.Services.AddSingleton<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<UserManagementService>();
builder.Services.AddSingleton<IPasswordResetService, PasswordResetService>();
builder.Services.AddSingleton<IUserDetailsService, UserDetailsService>();

// === CORS ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// === JWT Authentication ===
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (jwtSettings == null)
    throw new InvalidOperationException("JWT settings are not configured properly.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
    };
});

// === Role-based Authorization ===
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("RequireUserRole", policy =>
        policy.RequireRole("User"));
});

// === App Middleware Pipeline ===
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// === MongoDB Connection Test Endpoint ===
app.MapGet("/test-database-connection", async (IMongoClient mongoClient) =>
{
    try
    {
        var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
        var database = mongoClient.GetDatabase(mongoDbSettings.DatabaseName);
        var collectionNames = await database.ListCollectionNamesAsync();
        var collections = await collectionNames.ToListAsync();
        return Results.Ok(new { Connected = true, Collections = collections });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, title: "Database Connection Error");
    }
});

app.Run();
