namespace PharmaTraining.Application.DTOs.Reports;

public class CompanyDashboardSummaryDto
{
    public int TotalEmployees { get; set; }
    public int ActiveEmployees { get; set; }
    public int SeatLimit { get; set; }
    public int AssignedCourses { get; set; }
    public int CompletedEnrollments { get; set; }
    public decimal AverageProgress { get; set; }
}

public class EmployeeProgressReportItemDto
{
    public string EmployeeName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public int ProgressPercent { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class QuizPerformanceReportItemDto
{
    public string EmployeeName { get; set; } = string.Empty;
    public string QuizTitle { get; set; } = string.Empty;
    public decimal ScorePercent { get; set; }
    public bool Passed { get; set; }
    public DateTime? SubmittedAt { get; set; }
}

public class CompanyReportDto
{
    public CompanyDashboardSummaryDto Summary { get; set; } = new();
    public List<EmployeeProgressReportItemDto> EmployeeProgress { get; set; } = new();
    public List<QuizPerformanceReportItemDto> QuizPerformance { get; set; } = new();
}

public class PlatformSeatRiskItemDto
{
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public int SeatLimit { get; set; }
    public int SeatsUsed { get; set; }
    public decimal UsagePercent { get; set; }
    public DateTime ActiveUntil { get; set; }
}

public class PlatformRecentCompanyActivityItemDto
{
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public DateTime LastUpdatedAt { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public string SubscriptionStatus { get; set; } = string.Empty;
}

public class PlatformReportDto
{
    public int TotalCompanies { get; set; }
    public int TotalActiveSubscriptions { get; set; }
    public int TotalUsers { get; set; }
    public int TotalManagers { get; set; }
    public int TotalEmployees { get; set; }
    public int TotalCourses { get; set; }
    public int SubscriptionsExpiringSoon { get; set; }
    public List<PlatformSeatRiskItemDto> CompaniesNearSeatLimit { get; set; } = new();
    public List<PlatformRecentCompanyActivityItemDto> RecentCompanyActivity { get; set; } = new();
}
