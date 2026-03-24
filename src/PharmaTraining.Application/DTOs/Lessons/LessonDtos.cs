namespace PharmaTraining.Application.DTOs.Lessons;

public class LessonDto
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string? VideoUrl { get; set; }
    public string? TextContent { get; set; }
    public int EstimatedDurationMinutes { get; set; }
}

public class CreateLessonRequest
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string? VideoUrl { get; set; }
    public string? TextContent { get; set; }
    public int EstimatedDurationMinutes { get; set; }
}

public class UpdateLessonRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string? VideoUrl { get; set; }
    public string? TextContent { get; set; }
    public int EstimatedDurationMinutes { get; set; }
}
