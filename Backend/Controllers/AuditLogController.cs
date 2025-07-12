using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuditLogController : ControllerBase
    {
        private readonly Auditservice _auditService;

        public AuditLogController(Auditservice auditService)
        {
            _auditService = auditService;
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public async Task<ActionResult> CreateTestData()
        {
            try
            {
                // Create sample audit logs
                var sampleLogs = new List<AuditLog>
                {
                    new AuditLog
                    {
                        Timestamp = DateTime.UtcNow.AddHours(-1),
                        Username = "admin@example.com",
                        UserEmail = "admin@example.com",
                        UserRole = "Admin",
                        Action = "User Login",
                        ActionType = "Login",
                        Resource = "Authentication",
                        Status = "Success",
                        Severity = "Info",
                        Module = "Authentication",
                        IpAddress = "192.168.1.100",
                        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        Details = "User logged in successfully",
                        IsSystemLog = false
                    },
                    new AuditLog
                    {
                        Timestamp = DateTime.UtcNow.AddHours(-2),
                        Username = "john.doe@example.com",
                        UserEmail = "john.doe@example.com",
                        UserRole = "User",
                        Action = "Create Order",
                        ActionType = "Create",
                        Resource = "Order",
                        ResourceId = "ORD-001",
                        Status = "Success",
                        Severity = "Info",
                        Module = "Sales",
                        IpAddress = "192.168.1.101",
                        UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                        Details = "New order created with 3 items",
                        IsSystemLog = false
                    },
                    new AuditLog
                    {
                        Timestamp = DateTime.UtcNow.AddHours(-3),
                        Username = "admin@example.com",
                        UserEmail = "admin@example.com",
                        UserRole = "Admin",
                        Action = "Update User Permissions",
                        ActionType = "Update",
                        Resource = "User",
                        ResourceId = "USR-002",
                        Status = "Success",
                        Severity = "Warning",
                        Module = "User Management",
                        IpAddress = "192.168.1.100",
                        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        Details = "User role changed from User to Manager",
                        IsSystemLog = false
                    },
                    new AuditLog
                    {
                        Timestamp = DateTime.UtcNow.AddHours(-4),
                        Username = "jane.smith@example.com",
                        UserEmail = "jane.smith@example.com",
                        UserRole = "Manager",
                        Action = "Export Sales Report",
                        ActionType = "Export",
                        Resource = "Report",
                        Status = "Success",
                        Severity = "Info",
                        Module = "Reporting",
                        IpAddress = "192.168.1.102",
                        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        Details = "Sales report exported for Q4 2024",
                        IsSystemLog = false
                    },
                    new AuditLog
                    {
                        Timestamp = DateTime.UtcNow.AddHours(-5),
                        Username = "system",
                        UserEmail = "system@example.com",
                        UserRole = "System",
                        Action = "Database Backup",
                        ActionType = "System",
                        Resource = "Database",
                        Status = "Success",
                        Severity = "Info",
                        Module = "System",
                        IpAddress = "127.0.0.1",
                        UserAgent = "System Service",
                        Details = "Daily database backup completed successfully",
                        IsSystemLog = true
                    },
                    new AuditLog
                    {
                        Timestamp = DateTime.UtcNow.AddHours(-6),
                        Username = "unknown@example.com",
                        UserEmail = "unknown@example.com",
                        UserRole = "User",
                        Action = "Failed Login Attempt",
                        ActionType = "Login",
                        Resource = "Authentication",
                        Status = "Failed",
                        Severity = "Warning",
                        Module = "Authentication",
                        IpAddress = "192.168.1.103",
                        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        Details = "Invalid password provided",
                        ErrorMessage = "Authentication failed: Invalid credentials",
                        IsSystemLog = false
                    }
                };

                foreach (var log in sampleLogs)
                {
                    await _auditService.CreateAuditLogAsync(log);
                }

                return Ok(new { message = "Test audit logs created successfully", count = sampleLogs.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to create test data", details = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAuditLogs(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? userId,
            [FromQuery] string? username,
            [FromQuery] string? actionType,
            [FromQuery] string? resource,
            [FromQuery] string? status,
            [FromQuery] string? severity,
            [FromQuery] string? module,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var filter = new AuditLogFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    UserId = userId,
                    Username = username,
                    ActionType = actionType,
                    Resource = resource,
                    Status = status,
                    Severity = severity,
                    Module = module,
                    Page = page,
                    PageSize = pageSize
                };

                var logs = await _auditService.GetAuditLogsAsync(filter);
                var totalCount = await _auditService.GetAuditLogsCountAsync(filter);

                return Ok(new
                {
                    logs,
                    pagination = new
                    {
                        page,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve audit logs", details = ex.Message });
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<AuditLogSummary>> GetAuditLogSummary(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            try
            {
                var summary = await _auditService.GetAuditLogSummaryAsync(fromDate, toDate);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve audit log summary", details = ex.Message });
            }
        }

        [HttpGet("distinct/{field}")]
        public async Task<ActionResult<List<string>>> GetDistinctValues(string field)
        {
            try
            {
                var values = await _auditService.GetDistinctValuesAsync(field);
                return Ok(values);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve distinct values", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<AuditLog>> CreateAuditLog([FromBody] AuditLog auditLog)
        {
            try
            {
                // Set user information from current user context
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                auditLog.UserId = userId;
                auditLog.Username = username;
                auditLog.UserEmail = userEmail;
                auditLog.UserRole = userRole;
                auditLog.Timestamp = DateTime.UtcNow;
                auditLog.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                auditLog.UserAgent = HttpContext.Request.Headers["User-Agent"].ToString();

                var createdLog = await _auditService.CreateAuditLogAsync(auditLog);
                return CreatedAtAction(nameof(GetAuditLogs), new { id = createdLog.Id }, createdLog);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to create audit log", details = ex.Message });
            }
        }

        [HttpDelete("cleanup")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CleanupOldLogs([FromQuery] DateTime beforeDate)
        {
            try
            {
                var result = await _auditService.DeleteAuditLogsAsync(beforeDate);
                return Ok(new { message = "Cleanup completed successfully", deletedCount = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to cleanup old logs", details = ex.Message });
            }
        }

        [HttpGet("export")]
        public async Task<ActionResult> ExportAuditLogs(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? format = "csv")
        {
            try
            {
                var filter = new AuditLogFilter
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Page = 1,
                    PageSize = 10000 // Large page size for export
                };

                var logs = await _auditService.GetAuditLogsAsync(filter);

                if (format.ToLower() == "csv")
                {
                    var csvContent = GenerateCsvContent(logs);
                    var fileName = $"audit_logs_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                    
                    return File(
                        System.Text.Encoding.UTF8.GetBytes(csvContent),
                        "text/csv",
                        fileName
                    );
                }

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to export audit logs", details = ex.Message });
            }
        }

        private string GenerateCsvContent(List<AuditLog> logs)
        {
            var csv = new System.Text.StringBuilder();
            csv.AppendLine("Timestamp,User,Action,ActionType,Resource,Status,Severity,Module,IP Address,Details");

            foreach (var log in logs)
            {
                csv.AppendLine($"\"{log.Timestamp:yyyy-MM-dd HH:mm:ss}\"," +
                              $"\"{log.Username ?? "System"}\"," +
                              $"\"{log.Action}\"," +
                              $"\"{log.ActionType}\"," +
                              $"\"{log.Resource ?? "N/A"}\"," +
                              $"\"{log.Status}\"," +
                              $"\"{log.Severity}\"," +
                              $"\"{log.Module ?? "N/A"}\"," +
                              $"\"{log.IpAddress ?? "N/A"}\"," +
                              $"\"{log.Details ?? ""}\"");
            }

            return csv.ToString();
        }
    }
} 