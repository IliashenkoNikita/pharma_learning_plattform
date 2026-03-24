using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class QuizAttempt : AuditableEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }
    public decimal ScorePercent { get; set; }
    public bool Passed { get; set; }

    public ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
}
