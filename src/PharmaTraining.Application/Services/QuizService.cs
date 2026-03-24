using PharmaTraining.Application.DTOs.Quizzes;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Enums;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class QuizService : IQuizService
{
    private readonly IQuizRepository _quizRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICourseRepository _courseRepository;

    public QuizService(IQuizRepository quizRepository, IUserRepository userRepository, ICourseRepository courseRepository)
    {
        _quizRepository = quizRepository;
        _userRepository = userRepository;
        _courseRepository = courseRepository;
    }

    public async Task<QuizWithQuestionsDto> GetByCourseAsync(Guid requesterId, Guid courseId, CancellationToken cancellationToken = default)
    {
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new UnauthorizedAccessException("Requester not found.");

        if (requester.Role != UserRole.Superadmin)
        {
            if (!requester.CompanyId.HasValue)
            {
                throw new UnauthorizedAccessException("Invalid company scope.");
            }

            var assignedCourses = await _courseRepository.GetCoursesForCompanyAsync(requester.CompanyId.Value, cancellationToken);
            if (assignedCourses.All(x => x.Id != courseId))
            {
                throw new UnauthorizedAccessException("Course is not assigned to your company.");
            }
        }

        var quiz = await _quizRepository.GetByCourseIdWithQuestionsAsync(courseId, cancellationToken)
                   ?? throw new KeyNotFoundException("Quiz not found for this course.");

        return new QuizWithQuestionsDto
        {
            Id = quiz.Id,
            CourseId = quiz.CourseId,
            LessonId = quiz.LessonId,
            Title = quiz.Title,
            PassingScorePercent = quiz.PassingScorePercent,
            Questions = quiz.Questions
                .OrderBy(q => q.OrderIndex)
                .Select(q => new QuizQuestionPublicDto
                {
                    Id = q.Id,
                    QuizId = q.QuizId,
                    QuestionText = q.QuestionText,
                    Type = q.Type.ToString(),
                    OrderIndex = q.OrderIndex,
                    Options = q.Options.Select(o => new QuizOptionPublicDto
                    {
                        Id = o.Id,
                        QuestionId = o.QuestionId,
                        OptionText = o.OptionText,
                    }).ToList(),
                }).ToList(),
        };
    }

    public async Task<QuizSubmissionResultDto> SubmitAsync(Guid userId, Guid quizId, SubmitQuizRequest request, CancellationToken cancellationToken = default)
    {
        var quiz = await _quizRepository.GetByIdWithQuestionsAsync(quizId, cancellationToken)
                   ?? throw new KeyNotFoundException("Quiz not found.");

        if (quiz.Questions.Count == 0)
        {
            throw new InvalidOperationException("Quiz has no questions.");
        }

        var correctAnswers = 0;
        var answers = new List<QuizAnswer>();

        foreach (var question in quiz.Questions)
        {
            var selectedOptionIds = request.Answers
                .Where(x => x.QuestionId == question.Id)
                .Select(x => x.SelectedOptionId)
                .Distinct()
                .ToHashSet();

            if (selectedOptionIds.Count == 0)
            {
                continue;
            }

            var validSelectedOptions = question.Options
                .Where(x => selectedOptionIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToHashSet();

            if (validSelectedOptions.Count == 0)
            {
                continue;
            }

            var correctOptionIds = question.Options
                .Where(x => x.IsCorrect)
                .Select(x => x.Id)
                .ToHashSet();

            var isCorrect = validSelectedOptions.SetEquals(correctOptionIds);
            if (isCorrect)
            {
                correctAnswers++;
            }

            foreach (var optionId in validSelectedOptions)
            {
                answers.Add(new QuizAnswer
                {
                    QuestionId = question.Id,
                    SelectedOptionId = optionId
                });
            }
        }

        var scorePercent = (decimal)correctAnswers / quiz.Questions.Count * 100m;
        var passed = scorePercent >= quiz.PassingScorePercent;

        var attempt = new QuizAttempt
        {
            QuizId = quiz.Id,
            UserId = userId,
            StartedAt = DateTime.UtcNow,
            SubmittedAt = DateTime.UtcNow,
            ScorePercent = Math.Round(scorePercent, 2),
            Passed = passed,
            Answers = answers
        };

        await _quizRepository.AddAttemptAsync(attempt, cancellationToken);

        return new QuizSubmissionResultDto
        {
            AttemptId = attempt.Id,
            ScorePercent = attempt.ScorePercent,
            Passed = passed
        };
    }
}
