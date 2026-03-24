using PharmaTraining.Domain.Common;
using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Domain.Models;

public class Course : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public CourseStatus Status { get; set; } = CourseStatus.Draft;
    public int EstimatedDurationMinutes { get; set; }
    public string? ThumbnailUrl { get; set; }

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<CompanyCourseAssignment> CompanyAssignments { get; set; } = new List<CompanyCourseAssignment>();
    public ICollection<UserCourseEnrollment> Enrollments { get; set; } = new List<UserCourseEnrollment>();
    public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}
