using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Backend.Services;
using Backend.Models;
using System.Diagnostics;
using System.Text;

namespace Backend.Middleware
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            var originalBodyStream = context.Response.Body;

            try
            {
                // Capture request details
                var requestBody = await CaptureRequestBody(context.Request);
                var requestPath = context.Request.Path.ToString();
                var requestMethod = context.Request.Method;
                var userAgent = context.Request.Headers["User-Agent"].ToString();
                var ipAddress = GetClientIpAddress(context);

                // Execute the request
                using var memoryStream = new MemoryStream();
                context.Response.Body = memoryStream;

                await _next(context);

                stopwatch.Stop();

                // Capture response details
                memoryStream.Position = 0;
                var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();
                memoryStream.Position = 0;
                await memoryStream.CopyToAsync(originalBodyStream);

                // Log the audit entry
                await LogAuditEntry(context, requestPath, requestMethod, requestBody, responseBody, 
                    context.Response.StatusCode, stopwatch.ElapsedMilliseconds, userAgent, ipAddress);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                
                // Log error audit entry
                await LogErrorAuditEntry(context, ex, stopwatch.ElapsedMilliseconds);
                
                throw;
            }
            finally
            {
                context.Response.Body = originalBodyStream;
            }
        }

        private async Task<string> CaptureRequestBody(HttpRequest request)
        {
            if (request.Body.CanSeek)
            {
                request.Body.Position = 0;
                using var reader = new StreamReader(request.Body, leaveOpen: true);
                return await reader.ReadToEndAsync();
            }
            return string.Empty;
        }

        private string GetClientIpAddress(HttpContext context)
        {
            var forwardedHeader = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedHeader))
            {
                return forwardedHeader.Split(',')[0].Trim();
            }

            return context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        }

        private async Task LogAuditEntry(HttpContext context, string path, string method, string requestBody, 
            string responseBody, int statusCode, long durationMs, string userAgent, string ipAddress)
        {
            try
            {
                var auditService = context.RequestServices.GetService<Auditservice>();
                if (auditService == null) return;

                var action = $"{method} {path}";
                var actionType = GetActionType(method);
                var resource = GetResourceFromPath(path);
                var status = statusCode >= 200 && statusCode < 300 ? "Success" : "Failed";
                var severity = GetSeverity(statusCode);
                var module = GetModuleFromPath(path);

                var details = new StringBuilder();
                if (!string.IsNullOrEmpty(requestBody) && requestBody.Length < 500)
                {
                    details.AppendLine($"Request: {requestBody}");
                }
                if (!string.IsNullOrEmpty(responseBody) && responseBody.Length < 500)
                {
                    details.AppendLine($"Response: {responseBody}");
                }

                var auditLog = new AuditLog
                {
                    Action = action,
                    ActionType = actionType,
                    Resource = resource,
                    Details = details.ToString().Trim(),
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    Status = status,
                    Module = module,
                    Severity = severity,
                    DurationMs = durationMs,
                    IsSystemLog = true
                };

                await auditService.CreateAuditLogAsync(auditLog);
            }
            catch (Exception ex)
            {
                // Log to console if audit logging fails
                Console.WriteLine($"Failed to log audit entry: {ex.Message}");
            }
        }

        private async Task LogErrorAuditEntry(HttpContext context, Exception ex, long durationMs)
        {
            try
            {
                var auditService = context.RequestServices.GetService<Auditservice>();
                if (auditService == null) return;

                var path = context.Request.Path.ToString();
                var method = context.Request.Method;
                var userAgent = context.Request.Headers["User-Agent"].ToString();
                var ipAddress = GetClientIpAddress(context);

                var auditLog = new AuditLog
                {
                    Action = $"{method} {path}",
                    ActionType = "Error",
                    Resource = GetResourceFromPath(path),
                    Details = ex.Message,
                    ErrorMessage = ex.ToString(),
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    Status = "Failed",
                    Module = GetModuleFromPath(path),
                    Severity = "Error",
                    DurationMs = durationMs,
                    IsSystemLog = true
                };

                await auditService.CreateAuditLogAsync(auditLog);
            }
            catch
            {
                // Silently fail if audit logging fails
            }
        }

        private string GetActionType(string method)
        {
            return method.ToUpper() switch
            {
                "GET" => "Read",
                "POST" => "Create",
                "PUT" => "Update",
                "PATCH" => "Update",
                "DELETE" => "Delete",
                _ => "Other"
            };
        }

        private string GetResourceFromPath(string path)
        {
            var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            return segments.Length > 0 ? segments[0] : "Unknown";
        }

        private string GetModuleFromPath(string path)
        {
            var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (segments.Length > 1)
            {
                return segments[1].ToLower() switch
                {
                    "auth" => "Authentication",
                    "user" => "User Management",
                    "admin" => "Administration",
                    "sales" => "Sales",
                    "inventory" => "Inventory",
                    "finance" => "Finance",
                    "report" => "Reporting",
                    _ => "General"
                };
            }
            return "General";
        }

        private string GetSeverity(int statusCode)
        {
            return statusCode switch
            {
                >= 500 => "Critical",
                >= 400 => "Error",
                >= 300 => "Warning",
                _ => "Info"
            };
        }
    }

    public static class AuditMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuditLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuditMiddleware>();
        }
    }
} 