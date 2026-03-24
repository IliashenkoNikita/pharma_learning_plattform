using PharmaTraining.Domain.Common;
using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Domain.Models;

public class QuizQuestion : AuditableEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

    public string QuestionText { get; set; } = string.Empty;
    public QuestionType Type { get; set; } = QuestionType.SingleChoice;
    public int OrderIndex { get; set; }

    public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
}
