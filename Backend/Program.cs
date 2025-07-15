using System.Net;
using System.Text;
using AuthAPI.Models.DTOs;
using AuthAPI.Services;
using Backend.Models;
using Backend.Services;
using Hangfire;
using Hangfire.Mongo;
using Hangfire.Mongo.Migration.Strategies;
using Hangfire.Mongo.Migration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using QuestPDF.Infrastructure;
using Hangfire.MemoryStorage; // Or Hangfire.SqlServer if you're using SQL Server

DotNetEnv.Env.Load(Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"));
//DotNetEnv.Env.Load(@"C:\Users\pramu\OneDrive\Desktop\git_projects\ab.uom.project\.env");
Console.WriteLine("✅ EMAIL_USER from .env: " + Environment.GetEnvironmentVariable("EMAIL_USER"));
Console.WriteLine("EMAIL_PASSWORD is empty = " + string.IsNullOrEmpty(Environment.GetEnvironmentVariable("EMAIL_PASSWORD")));

QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

// === Load Configuration Files ===
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// === Strongly Typed Configuration Bindings ===
builder.Services.Configure<Backend.Models.MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));
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
    var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    if (mongoDbSettings == null || string.IsNullOrEmpty(mongoDbSettings.DatabaseName))
        throw new InvalidOperationException("MongoDBSettings or DatabaseName is missing in the configuration file.");
    return mongoClient.GetDatabase(mongoDbSettings.DatabaseName);
});

// === Register Backend Services ===
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<MongoDbCustomerInsightService>();
builder.Services.AddSingleton<Auditservice>();
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
        builder.Configuration.GetSection("MongoDBSettings").Get<Backend.Models.MongoDBSettings>().ConnectionString,
        "hangfire-db",
        new MongoStorageOptions
        {
            CheckConnection = false, // Disable connection ping check
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

// === CORS Configuration ===
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



// Add Authorization
builder.Services.AddAuthorization();

// Add Hangfire services
builder.Services.AddHangfire(config => 
{
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
          .UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UseMemoryStorage(); // Or use SQL Server for production
});

builder.Services.AddHangfireServer();

var app = builder.Build();

// === Middleware ===
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// === Static Files ===
app.UseStaticFiles(); // Enable serving static files from wwwroot

app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

// === Map Controllers ===
app.MapControllers();

// === Hangfire Dashboard ===
app.UseHangfireDashboard();

// === Recurring Report Job ===
RecurringJob.AddOrUpdate<ReportJobService>(
    "check-and-send-reports",
    job => job.ProcessScheduledReportsAsync(),
    "* * * * *"
);

// === Diagnostic Endpoints ===
app.MapGet("/test-env", () =>
{
    var user = Environment.GetEnvironmentVariable("EMAIL_USER");
    var passwordSet = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("EMAIL_PASSWORD"));
    return Results.Ok(new { EMAIL_USER = user, PasswordSet = passwordSet });
});

app.MapGet("/test-database-connection", async (IMongoClient mongoClient) =>
{
    try
    {
        var mongoDbSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
        var databaseName = mongoDbSettings != null && !string.IsNullOrEmpty(mongoDbSettings.DatabaseName)
            ? mongoDbSettings.DatabaseName
            : "ab-uom";
        var database = mongoClient.GetDatabase(databaseName);
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
