namespace PharmaTraining.Application.Interfaces.Services;

public interface IBlobStorageService
{
    Task<(string BlobName, string Url)> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);
}
