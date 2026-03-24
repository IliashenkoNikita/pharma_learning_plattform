using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/files")]
[Authorize(Roles = "Superadmin,Manager")]
public class FilesController : ControllerBase
{
    private readonly IFileService _fileService;

    public FilesController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(50 * 1024 * 1024)]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromQuery] Guid? lessonId,
        [FromQuery] Guid? courseId,
        CancellationToken cancellationToken)
    {
        var uploaded = await _fileService.UploadAsync(file, lessonId, courseId, cancellationToken);
        return Ok(uploaded);
    }
}
