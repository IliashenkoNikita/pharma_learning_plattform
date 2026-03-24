using Microsoft.AspNetCore.Http;
using PharmaTraining.Application.DTOs.Files;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class FileService : IFileService
{
    private readonly IBlobStorageService _blobStorageService;
    private readonly IFileRepository _fileRepository;

    public FileService(IBlobStorageService blobStorageService, IFileRepository fileRepository)
    {
        _blobStorageService = blobStorageService;
        _fileRepository = fileRepository;
    }

    public async Task<UploadedFileDto> UploadAsync(IFormFile file, Guid? lessonId = null, Guid? courseId = null, CancellationToken cancellationToken = default)
    {
        if (file.Length == 0)
        {
            throw new InvalidOperationException("File is empty.");
        }

        await using var stream = file.OpenReadStream();
        var (blobName, url) = await _blobStorageService.UploadAsync(stream, file.FileName, file.ContentType, cancellationToken);

        var uploaded = new UploadedFile
        {
            OriginalFileName = file.FileName,
            BlobName = blobName,
            ContentType = file.ContentType,
            FileSize = file.Length,
            Url = url,
            UploadedAt = DateTime.UtcNow,
            LessonId = lessonId,
            CourseId = courseId
        };

        await _fileRepository.AddAsync(uploaded, cancellationToken);

        return new UploadedFileDto
        {
            Id = uploaded.Id,
            OriginalFileName = uploaded.OriginalFileName,
            BlobName = uploaded.BlobName,
            ContentType = uploaded.ContentType,
            FileSize = uploaded.FileSize,
            Url = uploaded.Url,
            UploadedAt = uploaded.UploadedAt
        };
    }
}
