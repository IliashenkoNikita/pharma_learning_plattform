namespace PharmaTraining.Application.DTOs.Files;

public class UploadedFileDto
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string BlobName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string Url { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
