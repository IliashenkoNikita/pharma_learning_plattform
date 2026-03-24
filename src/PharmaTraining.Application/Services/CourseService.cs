using PharmaTraining.Application.DTOs.Courses;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Enums;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IUserRepository _userRepository;

    public CourseService(ICourseRepository courseRepository, IUserRepository userRepository)
    {
        _courseRepository = courseRepository;
        _userRepository = userRepository;
    }

    public async Task<List<CourseDto>> GetAllAsync(Guid requesterId, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);
        var courses = requester.Role == UserRole.Superadmin
            ? await _courseRepository.GetAllAsync(cancellationToken)
            : await _courseRepository.GetCoursesForCompanyAsync(requester.CompanyId!.Value, cancellationToken);

        return courses.Select(Map).ToList();
    }

    public async Task<CourseDto> GetByIdAsync(Guid requesterId, Guid id, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);
        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
                     ?? throw new KeyNotFoundException("Course not found.");

        if (requester.Role != UserRole.Superadmin)
        {
            var companyCourses = await _courseRepository.GetCoursesForCompanyAsync(requester.CompanyId!.Value, cancellationToken);
            if (companyCourses.All(x => x.Id != id))
            {
                throw new UnauthorizedAccessException("Course is not assigned to your company.");
            }
        }

        return Map(course);
    }

    public async Task<CourseDto> CreateAsync(CreateCourseRequest request, CancellationToken cancellationToken = default)
    {
        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Status = request.Status,
            EstimatedDurationMinutes = request.EstimatedDurationMinutes,
            ThumbnailUrl = request.ThumbnailUrl
        };

        await _courseRepository.AddAsync(course, cancellationToken);
        return Map(course);
    }

    public async Task<CourseDto> UpdateAsync(Guid id, UpdateCourseRequest request, CancellationToken cancellationToken = default)
    {
        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
                     ?? throw new KeyNotFoundException("Course not found.");

        course.Title = request.Title;
        course.Description = request.Description;
        course.Category = request.Category;
        course.Status = request.Status;
        course.EstimatedDurationMinutes = request.EstimatedDurationMinutes;
        course.ThumbnailUrl = request.ThumbnailUrl;

        await _courseRepository.UpdateAsync(course, cancellationToken);
        return Map(course);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
                     ?? throw new KeyNotFoundException("Course not found.");
        await _courseRepository.DeleteAsync(course, cancellationToken);
    }

    public Task AssignToCompanyAsync(Guid courseId, Guid companyId, CancellationToken cancellationToken = default)
        => _courseRepository.AssignToCompanyAsync(courseId, companyId, cancellationToken);

    private async Task<User> RequireRequesterAsync(Guid requesterId, CancellationToken cancellationToken)
        => await _userRepository.GetByIdAsync(requesterId, cancellationToken)
           ?? throw new UnauthorizedAccessException("Requester not found.");

    private static CourseDto Map(Course course)
        => new()
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Category = course.Category,
            Status = course.Status,
            EstimatedDurationMinutes = course.EstimatedDurationMinutes,
            ThumbnailUrl = course.ThumbnailUrl,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt
        };
}
