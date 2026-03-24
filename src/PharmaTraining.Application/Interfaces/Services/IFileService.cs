using Microsoft.AspNetCore.Http;
using PharmaTraining.Application.DTOs.Files;

namespace PharmaTraining.Application.Interfaces.Services;

public interface IFileService
{
    Task<UploadedFileDto> UploadAsync(IFormFile file, Guid? lessonId = null, Guid? courseId = null, CancellationToken cancellationToken = default);
}
