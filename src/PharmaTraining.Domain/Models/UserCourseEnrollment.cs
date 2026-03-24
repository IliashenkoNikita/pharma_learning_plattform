using PharmaTraining.Domain.Common;
using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Domain.Models;

public class UserCourseEnrollment : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int ProgressPercent { get; set; }
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Assigned;
}
