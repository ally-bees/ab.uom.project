using System.Net;
using System.Text;
using AuthAPI.Models.DTOs;
using AuthAPI.Services;
using AuthAPI.Settings;
using Backend.Models;
using Backend.Services;
using Hangfire;
using Hangfire.Mongo;
using Hangfire.Mongo.Migration.Strategies;
using Hangfire.Mongo.Migration;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;

// Load environment variables if needed (commented out, enable if necessary)
// DotNetEnv.Env.Load(@"C:\Users\Thilinika\Desktop\Me\New folder\Project new\project new\ab.uom.project\.env");

// Set QuestPDF license before anything else
QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

// Add configuration files including local overrides
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Use TLS 1.2
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// Configure strongly typed settings objects
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// === MongoDB Setup ===
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    if (mongoDbSettings == null || string.IsNullOrEmpty(mongoDbSettings.ConnectionString))
        throw new InvalidOperationException("MongoDBSettings are missing or incomplete in the configuration file.");
    return new MongoClient(mongoDbSettings.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    return mongoClient.GetDatabase(mongoDbSettings.DatabaseName ?? "ab-uom");
});

// Register backend services
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<SalesService>();
builder.Services.AddSingleton<CustomerCountService>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddSingleton<InventoryService>();
builder.Services.AddSingleton<ExpenseService>();
builder.Services.AddSingleton<FinanceService>();
builder.Services.AddSingleton<AutomationService>();
builder.Services.AddSingleton<ReportGenerator>();
builder.Services.AddSingleton<ReportJobService>();

// Additional backend services (from dev branch)
builder.Services.AddSingleton<MongoDbCustomerInsightService>();
builder.Services.AddSingleton<Auditservice>();

// Auth & User services
builder.Services.AddSingleton<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddSingleton<UserManagementService>();
builder.Services.AddSingleton<IPasswordResetService, PasswordResetService>();
builder.Services.AddSingleton<IUserDetailsService, UserDetailsService>();
builder.Services.AddScoped<HoneycombService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Hangfire configuration
builder.Services.AddHangfire(config =>
    config.UseMongoStorage(
        builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>().ConnectionString,
        "hangfire-db",
        new MongoStorageOptions
        {
            MigrationOptions = new MongoMigrationOptions
            {
                MigrationStrategy = new MigrateMongoMigrationStrategy(),
                // BackupStrategy = new CollectionMongoBackupStrategy() // optional
            }
        }
    )
);
builder.Services.AddHangfireServer();

// Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for Angular app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Authentication setup
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

// Add Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthentication();  // <--- IMPORTANT: add Authentication middleware
app.UseAuthorization();

app.MapControllers();

// Hangfire dashboard
app.UseHangfireDashboard();

// Schedule recurring job for reports
RecurringJob.AddOrUpdate<ReportJobService>(
    "check-and-send-reports",
    job => job.ProcessScheduledReportsAsync(),
    "* * * * *"
);

// MongoDB connection test endpoint (diagnostic)
app.MapGet("/test-database-connection", async (IMongoClient mongoClient) =>
{
    try
    {
        var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
        var database = mongoClient.GetDatabase(mongoDbSettings.DatabaseName ?? "ab-uom");
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
