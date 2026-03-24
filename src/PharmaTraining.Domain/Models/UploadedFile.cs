using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class UploadedFile : BaseEntity
{
    public string OriginalFileName { get; set; } = string.Empty;
    public string BlobName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string Url { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public Guid? LessonId { get; set; }
    public Lesson? Lesson { get; set; }

    public Guid? CourseId { get; set; }
    public Course? Course { get; set; }
}
