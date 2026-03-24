using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Application.DTOs.Companies;

public class CompanyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PlanName { get; set; } = string.Empty;
    public int SeatLimit { get; set; }
    public SubscriptionStatus SubscriptionStatus { get; set; }
    public DateTime ActiveUntil { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCompanyRequest
{
    public string Name { get; set; } = string.Empty;
    public string PlanName { get; set; } = "Starter";
    public int SeatLimit { get; set; }
    public SubscriptionStatus SubscriptionStatus { get; set; } = SubscriptionStatus.Active;
    public DateTime ActiveUntil { get; set; }
}

public class UpdateCompanyRequest : CreateCompanyRequest
{
}
