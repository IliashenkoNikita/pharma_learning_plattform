using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class LessonProgress : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;

    public DateTime? CompletedAt { get; set; }
    public bool IsCompleted { get; set; }
}
