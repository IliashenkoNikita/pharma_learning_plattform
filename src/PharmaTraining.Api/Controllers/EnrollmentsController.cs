using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Enrollments;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/enrollments")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentsController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpPost("assign")]
    [Authorize(Roles = "Superadmin,Manager")]
    public async Task<IActionResult> Assign([FromBody] AssignEnrollmentRequest request, CancellationToken cancellationToken)
    {
        await _enrollmentService.AssignAsync(GetUserId(), request, cancellationToken);
        return Ok();
    }

    [HttpGet("my-courses")]
    [Authorize(Roles = "Employee")]
    public async Task<ActionResult<List<EnrollmentDto>>> MyCourses(CancellationToken cancellationToken)
        => Ok(await _enrollmentService.GetMyCoursesAsync(GetUserId(), cancellationToken));

    private Guid GetUserId()
        => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("Invalid token."));
}
