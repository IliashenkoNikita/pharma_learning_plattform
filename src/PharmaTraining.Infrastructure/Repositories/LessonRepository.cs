using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class LessonRepository : ILessonRepository
{
    private readonly ApplicationDbContext _dbContext;

    public LessonRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<Lesson>> GetByCourseIdAsync(Guid courseId, CancellationToken cancellationToken = default)
        => _dbContext.Lessons
            .Where(x => x.CourseId == courseId)
            .OrderBy(x => x.OrderIndex)
            .ToListAsync(cancellationToken);

    public Task<Lesson?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _dbContext.Lessons.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(Lesson lesson, CancellationToken cancellationToken = default)
    {
        await _dbContext.Lessons.AddAsync(lesson, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Lesson lesson, CancellationToken cancellationToken = default)
    {
        _dbContext.Lessons.Update(lesson);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Lesson lesson, CancellationToken cancellationToken = default)
    {
        _dbContext.Lessons.Remove(lesson);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
