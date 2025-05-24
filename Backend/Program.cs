using MongoDB.Driver;
using Backend.Models;
using Backend.Services;
using System.Net;
using Backend.Settings;
using AuthAPI.Settings;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// Bind configuration sections
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoSettings"));
builder.Services.Configure<MongoDbSetings>(builder.Configuration.GetSection("MongoDbSetings"));


// General MongoDB Client (main DB)
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var mongoSettings = builder.Configuration.GetSection("MongoSettings").Get<MongoSettings>();
    return new MongoClient(mongoSettings.ConnectionURI);
});

// General MongoDB Database
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var mongoSettings = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
    return mongoClient.GetDatabase(mongoSettings.DatabaseName);
});


// Register services
builder.Services.AddSingleton<Auditservice>();
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<SalesService>();
builder.Services.AddSingleton<CustomerCountService>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddSingleton<InventoryService>();
builder.Services.AddSingleton<ExpenseService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for Angular frontend
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

// Test MongoDB connection endpoint
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
