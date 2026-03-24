using PharmaTraining.Domain.Common;

namespace PharmaTraining.Domain.Models;

public class CompanyCourseAssignment : AuditableEntity
{
    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}
