using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Repositories;

public interface IQuizRepository
{
    Task<Quiz?> GetByIdWithQuestionsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Quiz?> GetByCourseIdWithQuestionsAsync(Guid courseId, CancellationToken cancellationToken = default);
    Task AddAttemptAsync(QuizAttempt attempt, CancellationToken cancellationToken = default);
    Task<List<QuizAttempt>> GetAttemptsByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default);
}
