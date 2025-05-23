using Backendcustomerinsight.Models;
using Backendcustomerinsight.Service;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{

    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200") // Adjust if deployed
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Configure MongoDB settings
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<MongoDBService>();

// Add controllers and Swagger services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline for development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// HTTPS redirection (optional; remove if unnecessary during local dev)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}



app.UseCors("AllowAngular");

app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();
