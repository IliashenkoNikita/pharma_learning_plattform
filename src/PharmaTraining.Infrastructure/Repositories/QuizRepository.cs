using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class QuizRepository : IQuizRepository
{
    private readonly ApplicationDbContext _dbContext;

    public QuizRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Quiz?> GetByIdWithQuestionsAsync(Guid id, CancellationToken cancellationToken = default)
        => _dbContext.Quizzes
            .Include(x => x.Questions)
            .ThenInclude(x => x.Options)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<Quiz?> GetByCourseIdWithQuestionsAsync(Guid courseId, CancellationToken cancellationToken = default)
        => _dbContext.Quizzes
            .Include(x => x.Questions)
            .ThenInclude(x => x.Options)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync(x => x.CourseId == courseId, cancellationToken);

    public async Task AddAttemptAsync(QuizAttempt attempt, CancellationToken cancellationToken = default)
    {
        await _dbContext.QuizAttempts.AddAsync(attempt, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<List<QuizAttempt>> GetAttemptsByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default)
        => _dbContext.QuizAttempts
            .Include(x => x.User)
            .Include(x => x.Quiz)
            .Where(x => x.User.CompanyId == companyId)
            .OrderByDescending(x => x.SubmittedAt)
            .ToListAsync(cancellationToken);
}
