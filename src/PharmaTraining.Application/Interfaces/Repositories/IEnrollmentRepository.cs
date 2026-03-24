using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Repositories;

public interface IEnrollmentRepository
{
    Task<UserCourseEnrollment?> GetByUserAndCourseAsync(Guid userId, Guid courseId, CancellationToken cancellationToken = default);
    Task<List<UserCourseEnrollment>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<UserCourseEnrollment>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task AddAsync(UserCourseEnrollment enrollment, CancellationToken cancellationToken = default);
    Task UpdateAsync(UserCourseEnrollment enrollment, CancellationToken cancellationToken = default);
    Task<LessonProgress?> GetLessonProgressAsync(Guid userId, Guid lessonId, CancellationToken cancellationToken = default);
    Task AddLessonProgressAsync(LessonProgress lessonProgress, CancellationToken cancellationToken = default);
    Task UpdateLessonProgressAsync(LessonProgress lessonProgress, CancellationToken cancellationToken = default);
}
