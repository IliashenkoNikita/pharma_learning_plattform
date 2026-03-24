using PharmaTraining.Application.DTOs.Enrollments;

namespace PharmaTraining.Application.Interfaces.Services;

public interface IEnrollmentService
{
    Task AssignAsync(Guid requesterId, AssignEnrollmentRequest request, CancellationToken cancellationToken = default);
    Task<List<EnrollmentDto>> GetMyCoursesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task CompleteLessonAsync(Guid userId, Guid lessonId, CancellationToken cancellationToken = default);
}
