using PharmaTraining.Application.DTOs.Lessons;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _lessonRepository;

    public LessonService(ILessonRepository lessonRepository)
    {
        _lessonRepository = lessonRepository;
    }

    public async Task<List<LessonDto>> GetByCourseIdAsync(Guid courseId, CancellationToken cancellationToken = default)
        => (await _lessonRepository.GetByCourseIdAsync(courseId, cancellationToken)).Select(Map).ToList();

    public async Task<LessonDto> CreateAsync(CreateLessonRequest request, CancellationToken cancellationToken = default)
    {
        var lesson = new Lesson
        {
            CourseId = request.CourseId,
            Title = request.Title,
            Description = request.Description,
            OrderIndex = request.OrderIndex,
            VideoUrl = request.VideoUrl,
            TextContent = request.TextContent,
            EstimatedDurationMinutes = request.EstimatedDurationMinutes
        };

        await _lessonRepository.AddAsync(lesson, cancellationToken);
        return Map(lesson);
    }

    public async Task<LessonDto> UpdateAsync(Guid id, UpdateLessonRequest request, CancellationToken cancellationToken = default)
    {
        var lesson = await _lessonRepository.GetByIdAsync(id, cancellationToken)
                     ?? throw new KeyNotFoundException("Lesson not found.");

        lesson.Title = request.Title;
        lesson.Description = request.Description;
        lesson.OrderIndex = request.OrderIndex;
        lesson.VideoUrl = request.VideoUrl;
        lesson.TextContent = request.TextContent;
        lesson.EstimatedDurationMinutes = request.EstimatedDurationMinutes;

        await _lessonRepository.UpdateAsync(lesson, cancellationToken);
        return Map(lesson);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var lesson = await _lessonRepository.GetByIdAsync(id, cancellationToken)
                     ?? throw new KeyNotFoundException("Lesson not found.");
        await _lessonRepository.DeleteAsync(lesson, cancellationToken);
    }

    private static LessonDto Map(Lesson lesson)
        => new()
        {
            Id = lesson.Id,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Description = lesson.Description,
            OrderIndex = lesson.OrderIndex,
            VideoUrl = lesson.VideoUrl,
            TextContent = lesson.TextContent,
            EstimatedDurationMinutes = lesson.EstimatedDurationMinutes
        };
}
