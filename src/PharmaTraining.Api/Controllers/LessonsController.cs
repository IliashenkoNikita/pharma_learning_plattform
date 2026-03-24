using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Lessons;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/lessons")]
[Authorize]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonsController(ILessonService lessonService)
    {
        _lessonService = lessonService;
    }

    [HttpGet("by-course/{courseId:guid}")]
    [Authorize(Roles = "Superadmin,Manager,Employee")]
    public async Task<ActionResult<List<LessonDto>>> GetByCourse(Guid courseId, CancellationToken cancellationToken)
        => Ok(await _lessonService.GetByCourseIdAsync(courseId, cancellationToken));

    [HttpPost]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<LessonDto>> Create([FromBody] CreateLessonRequest request, CancellationToken cancellationToken)
        => Ok(await _lessonService.CreateAsync(request, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<LessonDto>> Update(Guid id, [FromBody] UpdateLessonRequest request, CancellationToken cancellationToken)
        => Ok(await _lessonService.UpdateAsync(id, request, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Superadmin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _lessonService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
