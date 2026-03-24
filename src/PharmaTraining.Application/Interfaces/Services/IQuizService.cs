using PharmaTraining.Application.DTOs.Quizzes;

namespace PharmaTraining.Application.Interfaces.Services;

public interface IQuizService
{
    Task<QuizWithQuestionsDto> GetByCourseAsync(Guid requesterId, Guid courseId, CancellationToken cancellationToken = default);
    Task<QuizSubmissionResultDto> SubmitAsync(Guid userId, Guid quizId, SubmitQuizRequest request, CancellationToken cancellationToken = default);
}
