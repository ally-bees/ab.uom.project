using Microsoft.AspNetCore.Mvc; // Provides attributes and classes for building web APIs.
using Backend.Services; // Imports the CourierService used for business logic.
using Backend.Models; // Imports the Courier model used in the controller.
using System; // Provides base classes and data types, such as Exception.
using System.Threading.Tasks; // Enables the use of asynchronous programming patterns.

namespace Backend.Controllers
{
    [ApiController] // Marks the class as a Web API controller.
    [Route("api/courier")] // Defines the base route for all actions in this controller.
    public class CourierController : ControllerBase
    {
        private readonly CourierService _courierService; // Dependency injection for the courier service.

        public CourierController(CourierService courierService)
        {
            _courierService = courierService; // Assigns the injected service to the private field.
        }

        [HttpGet("summary")] // Handles GET requests at api/courier/summary with query parameters.
        public async Task<IActionResult> GetSummary([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            try
            {
                var summary = await _courierService.GetSummaryAsync(from, to); // Retrieves courier summary between two dates.
                return Ok(summary); // Returns the summary with 200 OK.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 Internal Server Error if exception occurs.
            }
        }

        [HttpGet("recent")] // Handles GET requests at api/courier/recent with optional count query parameter.
        public async Task<IActionResult> GetRecentDeliveries([FromQuery] int count = 10)
        {
            try
            {
                var deliveries = await _courierService.GetRecentDeliveriesAsync(count); // Retrieves recent deliveries up to a specified count.
                return Ok(deliveries); // Returns the deliveries with 200 OK.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 Internal Server Error on failure.
            }
        }

        [HttpGet("all")] // Handles GET requests at api/courier/all.
        public async Task<IActionResult> GetAllCouriers()
        {
            try
            {
                var couriers = await _courierService.GetAllAsync(); // Retrieves all couriers.
                return Ok(couriers); // Returns the courier list with 200 OK.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 if any error occurs.
            }
        }

        [HttpGet("top-nations")] // Handles GET requests for top 3 contries
        public async Task<IActionResult> GetTopCountries()
        {
            var result = await _courierService.GetTopCountriesPercentageAsync();
            return Ok(result);
        }

        [HttpGet("{id}")] // Handles GET requests for a specific courier by ID.
        public async Task<IActionResult> GetCourierById(string id)
        {
            try
            {
                var courier = await _courierService.GetByIdAsync(id); // Retrieves the courier by ID.
                if (courier == null)
                {
                    return NotFound(); // Returns 404 Not Found if the courier doesn't exist.
                }
                return Ok(courier); // Returns the courier data with 200 OK.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 if an error occurs.
            }
        }

        [HttpPost] // Handles POST requests to create a new courier.
        public async Task<IActionResult> CreateCourier([FromBody] Courier courier)
        {
            if (courier == null)
                return BadRequest("Courier data is required."); // Returns 400 Bad Request if the courier data is null.

            try
            {
                await _courierService.CreateAsync(courier); // Creates a new courier using the service.
                return CreatedAtAction(nameof(GetCourierById), new { id = courier.Id }, courier); // Returns 201 Created with the created courier.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 Internal Server Error on failure.
            }
        }

        [HttpPut("{id}")] // Handles PUT requests to update an existing courier by ID.
        public async Task<IActionResult> UpdateCourier(string id, [FromBody] Courier updatedCourier)
        {
            if (updatedCourier == null)
                return BadRequest("Updated courier data is required."); // Returns 400 if the updated courier is null.

            try
            {
                var existingCourier = await _courierService.GetByIdAsync(id); // Checks if the courier exists.
                if (existingCourier == null)
                {
                    return NotFound(); // Returns 404 if the courier doesn't exist.
                }
                await _courierService.UpdateAsync(id, updatedCourier); // Updates the courier data.
                return NoContent(); // Returns 204 No Content to indicate success.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 Internal Server Error if an error occurs.
            }
        }

        [HttpDelete("{id}")] // Handles DELETE requests to remove a courier by ID.
        public async Task<IActionResult> DeleteCourier(string id)
        {
            try
            {
                var existingCourier = await _courierService.GetByIdAsync(id); // Checks if the courier exists.
                if (existingCourier == null)
                {
                    return NotFound(); // Returns 404 if not found.
                }
                await _courierService.DeleteAsync(id); // Deletes the courier.
                return NoContent(); // Returns 204 No Content to indicate successful deletion.
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Returns 500 if an exception occurs.
            }
        }
    }
}
