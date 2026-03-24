using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class QuizOption : AuditableEntity
{
    public Guid QuestionId { get; set; }
    public QuizQuestion Question { get; set; } = null!;

    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}
