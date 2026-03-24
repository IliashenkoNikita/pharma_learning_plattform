using PharmaTraining.Application.DTOs.Lessons;

namespace PharmaTraining.Application.Interfaces.Services;

public interface ILessonService
{
    Task<List<LessonDto>> GetByCourseIdAsync(Guid courseId, CancellationToken cancellationToken = default);
    Task<LessonDto> CreateAsync(CreateLessonRequest request, CancellationToken cancellationToken = default);
    Task<LessonDto> UpdateAsync(Guid id, UpdateLessonRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
