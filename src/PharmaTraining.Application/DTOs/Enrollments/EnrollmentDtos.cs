using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Application.DTOs.Enrollments;

public class EnrollmentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int ProgressPercent { get; set; }
    public EnrollmentStatus Status { get; set; }
}

public class AssignEnrollmentRequest
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
}

public class CompleteLessonProgressRequest
{
    public Guid LessonId { get; set; }
}
