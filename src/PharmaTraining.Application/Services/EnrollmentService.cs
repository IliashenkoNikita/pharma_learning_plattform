using PharmaTraining.Application.DTOs.Enrollments;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Enums;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ILessonRepository _lessonRepository;

    public EnrollmentService(
        IEnrollmentRepository enrollmentRepository,
        IUserRepository userRepository,
        ICourseRepository courseRepository,
        ILessonRepository lessonRepository)
    {
        _enrollmentRepository = enrollmentRepository;
        _userRepository = userRepository;
        _courseRepository = courseRepository;
        _lessonRepository = lessonRepository;
    }

    public async Task AssignAsync(Guid requesterId, AssignEnrollmentRequest request, CancellationToken cancellationToken = default)
    {
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new UnauthorizedAccessException("Requester not found.");
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken)
                   ?? throw new KeyNotFoundException("Employee not found.");

        if (requester.Role != UserRole.Superadmin && requester.CompanyId != user.CompanyId)
        {
            throw new UnauthorizedAccessException("Out of company scope.");
        }

        var existing = await _enrollmentRepository.GetByUserAndCourseAsync(request.UserId, request.CourseId, cancellationToken);
        if (existing is not null)
        {
            return;
        }

        var enrollment = new UserCourseEnrollment
        {
            UserId = request.UserId,
            CourseId = request.CourseId,
            AssignedAt = DateTime.UtcNow,
            Status = EnrollmentStatus.Assigned,
            ProgressPercent = 0
        };

        await _enrollmentRepository.AddAsync(enrollment, cancellationToken);
    }

    public async Task<List<EnrollmentDto>> GetMyCoursesAsync(Guid userId, CancellationToken cancellationToken = default)
        => (await _enrollmentRepository.GetByUserAsync(userId, cancellationToken)).Select(Map).ToList();

    public async Task CompleteLessonAsync(Guid userId, Guid lessonId, CancellationToken cancellationToken = default)
    {
        var lesson = await _lessonRepository.GetByIdAsync(lessonId, cancellationToken)
                     ?? throw new KeyNotFoundException("Lesson not found.");
        var progress = await _enrollmentRepository.GetLessonProgressAsync(userId, lessonId, cancellationToken);
        if (progress is null)
        {
            progress = new LessonProgress
            {
                UserId = userId,
                LessonId = lessonId,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow
            };
            await _enrollmentRepository.AddLessonProgressAsync(progress, cancellationToken);
        }
        else
        {
            progress.IsCompleted = true;
            progress.CompletedAt = DateTime.UtcNow;
            await _enrollmentRepository.UpdateLessonProgressAsync(progress, cancellationToken);
        }

        var enrollment = await _enrollmentRepository.GetByUserAndCourseAsync(userId, lesson.CourseId, cancellationToken);
        if (enrollment is null)
        {
            return;
        }

        if (enrollment.StartedAt is null)
        {
            enrollment.StartedAt = DateTime.UtcNow;
        }

        var totalLessons = (await _lessonRepository.GetByCourseIdAsync(lesson.CourseId, cancellationToken)).Count;
        if (totalLessons == 0)
        {
            return;
        }

        var completedLessons = 0;
        var lessons = await _lessonRepository.GetByCourseIdAsync(lesson.CourseId, cancellationToken);
        foreach (var item in lessons)
        {
            var itemProgress = await _enrollmentRepository.GetLessonProgressAsync(userId, item.Id, cancellationToken);
            if (itemProgress?.IsCompleted == true)
            {
                completedLessons++;
            }
        }

        var progressPercent = Math.Min(100, (int)Math.Round((completedLessons / (double)totalLessons) * 100));
        enrollment.ProgressPercent = progressPercent;
        enrollment.Status = progressPercent >= 100 ? EnrollmentStatus.Completed : EnrollmentStatus.InProgress;
        if (enrollment.Status == EnrollmentStatus.Completed)
        {
            enrollment.CompletedAt = DateTime.UtcNow;
        }

        await _enrollmentRepository.UpdateAsync(enrollment, cancellationToken);
    }

    private static EnrollmentDto Map(UserCourseEnrollment enrollment)
        => new()
        {
            Id = enrollment.Id,
            UserId = enrollment.UserId,
            CourseId = enrollment.CourseId,
            AssignedAt = enrollment.AssignedAt,
            StartedAt = enrollment.StartedAt,
            CompletedAt = enrollment.CompletedAt,
            ProgressPercent = enrollment.ProgressPercent,
            Status = enrollment.Status
        };
}
