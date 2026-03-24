using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Application.DTOs.Courses;

public class CourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public CourseStatus Status { get; set; }
    public int EstimatedDurationMinutes { get; set; }
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCourseRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public CourseStatus Status { get; set; } = CourseStatus.Draft;
    public int EstimatedDurationMinutes { get; set; }
    public string? ThumbnailUrl { get; set; }
}

public class UpdateCourseRequest : CreateCourseRequest
{
}

public class AssignCourseToCompanyRequest
{
    public Guid CompanyId { get; set; }
}
