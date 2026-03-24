using PharmaTraining.Domain.Common;
using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Domain.Models;

public class User : AuditableEntity
{
    public Guid? CompanyId { get; set; }
    public Company? Company { get; set; }

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<UserCourseEnrollment> Enrollments { get; set; } = new List<UserCourseEnrollment>();
    public ICollection<LessonProgress> LessonProgresses { get; set; } = new List<LessonProgress>();
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
}
