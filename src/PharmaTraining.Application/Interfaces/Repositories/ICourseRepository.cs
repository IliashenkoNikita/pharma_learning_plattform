using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Repositories;

public interface ICourseRepository
{
    Task<List<Course>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Course?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Course>> GetCoursesForCompanyAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task AddAsync(Course course, CancellationToken cancellationToken = default);
    Task UpdateAsync(Course course, CancellationToken cancellationToken = default);
    Task DeleteAsync(Course course, CancellationToken cancellationToken = default);
    Task AssignToCompanyAsync(Guid courseId, Guid companyId, CancellationToken cancellationToken = default);
}
