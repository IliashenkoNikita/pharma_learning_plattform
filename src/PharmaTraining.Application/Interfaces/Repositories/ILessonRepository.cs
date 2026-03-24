using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Repositories;

public interface ILessonRepository
{
    Task<List<Lesson>> GetByCourseIdAsync(Guid courseId, CancellationToken cancellationToken = default);
    Task<Lesson?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Lesson lesson, CancellationToken cancellationToken = default);
    Task UpdateAsync(Lesson lesson, CancellationToken cancellationToken = default);
    Task DeleteAsync(Lesson lesson, CancellationToken cancellationToken = default);
}
