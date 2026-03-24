using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class Lesson : AuditableEntity
{
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string? VideoUrl { get; set; }
    public string? TextContent { get; set; }
    public int EstimatedDurationMinutes { get; set; }

    public ICollection<UploadedFile> Attachments { get; set; } = new List<UploadedFile>();
    public ICollection<LessonProgress> LessonProgresses { get; set; } = new List<LessonProgress>();
    public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}
