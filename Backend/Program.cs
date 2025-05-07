using System.Net;
using Backend.Models;
using Backend.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Enforce TLS 1.2 for secure connection
ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

// Register MongoDB settings and services
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// Register MongoDB client and database
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});

builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<SalesService>();
builder.Services.AddSingleton<CustomerCountService>();

//  Register OrderService
builder.Services.AddSingleton<OrderService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ExpenseService>();

// Register CourierService
builder.Services.AddSingleton<CourierService>();

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

// Use Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();

// Update the database name in the test endpoint
app.MapGet("/test-database-connection", async (IMongoClient mongoClient) =>
{
    try
    {
        var database = mongoClient.GetDatabase("ab-uom"); // Updated database name
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
