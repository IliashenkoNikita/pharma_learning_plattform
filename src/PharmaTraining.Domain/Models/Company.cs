using PharmaTraining.Domain.Common;
using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Domain.Models;

public class Company : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string PlanName { get; set; } = "Starter";
    public int SeatLimit { get; set; }
    public SubscriptionStatus SubscriptionStatus { get; set; } = SubscriptionStatus.Active;
    public DateTime ActiveUntil { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<CompanyCourseAssignment> CourseAssignments { get; set; } = new List<CompanyCourseAssignment>();
}
