using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class Quiz : AuditableEntity
{
    public Guid? CourseId { get; set; }
    public Course? Course { get; set; }

    public Guid? LessonId { get; set; }
    public Lesson? Lesson { get; set; }

    public string Title { get; set; } = string.Empty;
    public int PassingScorePercent { get; set; } = 70;

    public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    public ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
}
