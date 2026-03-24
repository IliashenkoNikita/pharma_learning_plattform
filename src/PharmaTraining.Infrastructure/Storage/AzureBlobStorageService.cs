using Azure.Storage.Blobs;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Infrastructure.Storage;

public class AzureBlobStorageService : IBlobStorageService
{
    private readonly BlobContainerClient _containerClient;

    public AzureBlobStorageService(string connectionString, string containerName)
    {
        _containerClient = new BlobContainerClient(connectionString, containerName);
    }

    public async Task<(string BlobName, string Url)> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        await _containerClient.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

        var blobName = $"{Guid.NewGuid()}-{fileName}";
        var blobClient = _containerClient.GetBlobClient(blobName);

        await blobClient.UploadAsync(content, overwrite: false, cancellationToken: cancellationToken);

        return (blobName, blobClient.Uri.ToString());
    }
}
