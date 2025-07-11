using System.Net;
using QuestPDF.Infrastructure;                       // ✅ Needed for QuestPDF license
using Backend.Models;
using Backend.Services;
using Hangfire;
using Hangfire.Mongo;
using Hangfire.Mongo.Migration.Strategies;
using Hangfire.Mongo.Migration;
using MongoDB.Driver;
using DotNetEnv;
Env.Load(); 

// ✅ Set license before anything else
QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

// === Configuration ===
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Use TLS 1.2
// Enable TLS 1.2
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// Configure MongoDB settings
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

var mongoSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();

if (mongoSettings == null || string.IsNullOrEmpty(mongoSettings.ConnectionString) || string.IsNullOrEmpty(mongoSettings.DatabaseName))
{
    throw new InvalidOperationException("MongoDBSettings are missing or incomplete in the configuration file.");
}

var mongoClient = new MongoClient(mongoSettings.ConnectionString);
var mongoDatabase = mongoClient.GetDatabase(mongoSettings.DatabaseName);

// Register services
builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);
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

// Hangfire configuration
builder.Services.AddHangfire(config =>
    config.UseMongoStorage(
        mongoSettings.ConnectionString,
        "hangfire-db",
        new MongoStorageOptions
        {
            MigrationOptions = new MongoMigrationOptions
            {
                MigrationStrategy = new MigrateMongoMigrationStrategy(),
                // BackupStrategy = new CollectionMongoBackupStrategy()
            }
        }
    )
);
builder.Services.AddHangfireServer();

// Swagger + Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for Angular
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
app.UseAuthorization();
app.MapControllers();

// Hangfire dashboard
app.UseHangfireDashboard();

// Schedule recurring job
RecurringJob.AddOrUpdate<ReportJobService>(
    "check-and-send-reports",
    job => job.ProcessScheduledReportsAsync(),
    "* * * * *"
);

app.Run();
