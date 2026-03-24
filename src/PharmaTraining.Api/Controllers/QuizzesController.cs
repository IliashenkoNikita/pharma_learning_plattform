using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Quizzes;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/quizzes")]
[Authorize]
public class QuizzesController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizzesController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    [HttpGet("by-course/{courseId:guid}")]
    [Authorize(Roles = "Superadmin,Manager,Employee")]
    public async Task<ActionResult<QuizWithQuestionsDto>> GetByCourse(Guid courseId, CancellationToken cancellationToken)
        => Ok(await _quizService.GetByCourseAsync(GetUserId(), courseId, cancellationToken));

    [HttpPost("{id:guid}/submit")]
    [Authorize(Roles = "Employee")]
    public async Task<ActionResult<QuizSubmissionResultDto>> Submit(Guid id, [FromBody] SubmitQuizRequest request, CancellationToken cancellationToken)
        => Ok(await _quizService.SubmitAsync(GetUserId(), id, request, cancellationToken));

    private Guid GetUserId()
        => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("Invalid token."));
}
