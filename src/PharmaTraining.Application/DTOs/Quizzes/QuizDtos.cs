namespace PharmaTraining.Application.DTOs.Quizzes;

public class QuizDto
{
    public Guid Id { get; set; }
    public Guid? CourseId { get; set; }
    public Guid? LessonId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int PassingScorePercent { get; set; }
}

public class QuizOptionPublicDto
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public string OptionText { get; set; } = string.Empty;
}

public class QuizQuestionPublicDto
{
    public Guid Id { get; set; }
    public Guid QuizId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public List<QuizOptionPublicDto> Options { get; set; } = new();
}

public class QuizWithQuestionsDto
{
    public Guid Id { get; set; }
    public Guid? CourseId { get; set; }
    public Guid? LessonId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int PassingScorePercent { get; set; }
    public List<QuizQuestionPublicDto> Questions { get; set; } = new();
}

public class QuizQuestionAnswerRequest
{
    public Guid QuestionId { get; set; }
    public Guid SelectedOptionId { get; set; }
}

public class SubmitQuizRequest
{
    public List<QuizQuestionAnswerRequest> Answers { get; set; } = new();
}

public class QuizSubmissionResultDto
{
    public Guid AttemptId { get; set; }
    public decimal ScorePercent { get; set; }
    public bool Passed { get; set; }
}
