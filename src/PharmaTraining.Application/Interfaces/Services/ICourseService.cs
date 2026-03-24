using PharmaTraining.Application.DTOs.Courses;

namespace PharmaTraining.Application.Interfaces.Services;

public interface ICourseService
{
    Task<List<CourseDto>> GetAllAsync(Guid requesterId, CancellationToken cancellationToken = default);
    Task<CourseDto> GetByIdAsync(Guid requesterId, Guid id, CancellationToken cancellationToken = default);
    Task<CourseDto> CreateAsync(CreateCourseRequest request, CancellationToken cancellationToken = default);
    Task<CourseDto> UpdateAsync(Guid id, UpdateCourseRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task AssignToCompanyAsync(Guid courseId, Guid companyId, CancellationToken cancellationToken = default);
}
