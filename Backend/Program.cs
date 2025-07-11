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
using BCrypt.Net;
DotNetEnv.Env.Load(@"C:\Users\Thilinika\Desktop\Me\New folder\Project new\project new\ab.uom.project\.env");

// ✅ Set license before anything else
QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

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
    options.AddPolicy("AllowAngularApp",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

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
