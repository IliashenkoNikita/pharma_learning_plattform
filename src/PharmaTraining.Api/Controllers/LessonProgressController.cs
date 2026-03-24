using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Enrollments;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/lesson-progress")]
[Authorize(Roles = "Employee")]
public class LessonProgressController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public LessonProgressController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpPost("complete")]
    public async Task<IActionResult> Complete([FromBody] CompleteLessonProgressRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("Invalid token."));
        await _enrollmentService.CompleteLessonAsync(userId, request.LessonId, cancellationToken);
        return Ok();
    }
}
