using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Courses;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/courses")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    [Authorize(Roles = "Superadmin,Manager,Employee")]
    public async Task<ActionResult<List<CourseDto>>> GetAll(CancellationToken cancellationToken)
        => Ok(await _courseService.GetAllAsync(GetUserId(), cancellationToken));

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Superadmin,Manager,Employee")]
    public async Task<ActionResult<CourseDto>> GetById(Guid id, CancellationToken cancellationToken)
        => Ok(await _courseService.GetByIdAsync(GetUserId(), id, cancellationToken));

    [HttpPost]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<CourseDto>> Create([FromBody] CreateCourseRequest request, CancellationToken cancellationToken)
    {
        var created = await _courseService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<CourseDto>> Update(Guid id, [FromBody] UpdateCourseRequest request, CancellationToken cancellationToken)
        => Ok(await _courseService.UpdateAsync(id, request, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Superadmin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _courseService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/assign-company")]
    [Authorize(Roles = "Superadmin")]
    public async Task<IActionResult> AssignToCompany(Guid id, [FromBody] AssignCourseToCompanyRequest request, CancellationToken cancellationToken)
    {
        await _courseService.AssignToCompanyAsync(id, request.CompanyId, cancellationToken);
        return Ok();
    }

    private Guid GetUserId()
        => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("Invalid token."));
}
