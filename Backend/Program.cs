
using AuthAPI.Models.DTOs;
using AuthAPI.Services;
using AuthAPI.Settings;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true) // Add this line
    .AddEnvironmentVariables();

// add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Use TLS 1.2
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// === Configuration Bindings ===
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings")); // Backend Mongo
//builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));   // Auth Mongo
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));


// === MongoDB Setup ===
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    if (mongoDbSettings?.ConnectionString == null)
        throw new InvalidOperationException("MongoDB connection string is not configured.");
    return new MongoClient(mongoDbSettings.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    return mongoClient.GetDatabase("ab-uom");
});



// Backend-related services

// Register services
builder.Services.AddSingleton<MongoDbCustomerInsightService>();
builder.Services.AddSingleton<Auditservice>();

builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<SalesService>();
builder.Services.AddSingleton<CustomerCountService>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddSingleton<InventoryService>();
builder.Services.AddSingleton<ExpenseService>();

// Auth & User services
builder.Services.AddSingleton<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<UserManagementService>();

builder.Services.AddSingleton<IPasswordResetService, PasswordResetService>();
builder.Services.AddSingleton<IUserDetailsService, UserDetailsService>();
builder.Services.AddScoped<HoneycombService>();

// System Configuration Service
builder.Services.AddSingleton<ISystemConfigurationService, SystemConfigurationService>();

// Audit Log Service
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IAuditLogService, AuditLogService>();

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

//add autherization
builder.Services.AddAuthorization();

var app = builder.Build();

// === Middleware Pipeline ===
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
        var database = mongoClient.GetDatabase("ab-uom");
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