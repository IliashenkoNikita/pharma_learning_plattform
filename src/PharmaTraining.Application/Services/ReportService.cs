using System.Text;
using PharmaTraining.Application.DTOs.Reports;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Application.Services;

public class ReportService : IReportService
{
    private readonly IUserRepository _userRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly IQuizRepository _quizRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly ICourseRepository _courseRepository;

    public ReportService(
        IUserRepository userRepository,
        IEnrollmentRepository enrollmentRepository,
        IQuizRepository quizRepository,
        ICompanyRepository companyRepository,
        ICourseRepository courseRepository)
    {
        _userRepository = userRepository;
        _enrollmentRepository = enrollmentRepository;
        _quizRepository = quizRepository;
        _companyRepository = companyRepository;
        _courseRepository = courseRepository;
    }

    public async Task<CompanyReportDto> GetCompanyReportAsync(Guid requesterId, Guid companyId, CancellationToken cancellationToken = default)
    {
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new UnauthorizedAccessException("Requester not found.");

        if (requester.Role != UserRole.Superadmin && requester.CompanyId != companyId)
        {
            throw new UnauthorizedAccessException("Out of company scope.");
        }

        var company = await _companyRepository.GetByIdAsync(companyId, cancellationToken)
                      ?? throw new KeyNotFoundException("Company not found.");
        var users = await _userRepository.GetAllAsync(companyId, cancellationToken);
        var employees = users.Where(x => x.Role == UserRole.Employee).ToList();
        var enrollments = await _enrollmentRepository.GetByCompanyAsync(companyId, cancellationToken);
        var attempts = await _quizRepository.GetAttemptsByCompanyAsync(companyId, cancellationToken);
        var courses = await _courseRepository.GetCoursesForCompanyAsync(companyId, cancellationToken);

        var summary = new CompanyDashboardSummaryDto
        {
            TotalEmployees = employees.Count,
            ActiveEmployees = employees.Count(x => x.IsActive),
            SeatLimit = company.SeatLimit,
            AssignedCourses = courses.Count,
            CompletedEnrollments = enrollments.Count(x => x.Status == EnrollmentStatus.Completed),
            AverageProgress = enrollments.Count == 0 ? 0 : (decimal)enrollments.Average(x => x.ProgressPercent)
        };

        var progressItems = enrollments.Select(e =>
        {
            var employee = users.FirstOrDefault(x => x.Id == e.UserId);
            return new EmployeeProgressReportItemDto
            {
                EmployeeName = employee is null ? "Unknown" : $"{employee.FirstName} {employee.LastName}",
                Email = employee?.Email ?? string.Empty,
                CourseTitle = e.Course.Title,
                ProgressPercent = e.ProgressPercent,
                Status = e.Status.ToString()
            };
        }).ToList();

        var quizItems = attempts.Select(a => new QuizPerformanceReportItemDto
        {
            EmployeeName = $"{a.User.FirstName} {a.User.LastName}",
            QuizTitle = a.Quiz.Title,
            ScorePercent = a.ScorePercent,
            Passed = a.Passed,
            SubmittedAt = a.SubmittedAt
        }).ToList();

        return new CompanyReportDto
        {
            Summary = summary,
            EmployeeProgress = progressItems,
            QuizPerformance = quizItems
        };
    }

    public async Task<byte[]> ExportCompanyReportCsvAsync(Guid requesterId, Guid companyId, CancellationToken cancellationToken = default)
    {
        var report = await GetCompanyReportAsync(requesterId, companyId, cancellationToken);

        var sb = new StringBuilder();
        sb.AppendLine("EmployeeName,Email,CourseTitle,ProgressPercent,Status");
        foreach (var row in report.EmployeeProgress)
        {
            sb.AppendLine($"{Escape(row.EmployeeName)},{Escape(row.Email)},{Escape(row.CourseTitle)},{row.ProgressPercent},{Escape(row.Status)}");
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    public async Task<PlatformReportDto> GetPlatformReportAsync(Guid requesterId, CancellationToken cancellationToken = default)
    {
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new UnauthorizedAccessException("Requester not found.");

        if (requester.Role != UserRole.Superadmin)
        {
            throw new UnauthorizedAccessException("Only superadmin can access platform report.");
        }

        var companies = await _companyRepository.GetAllAsync(cancellationToken);
        var users = await _userRepository.GetAllAsync(null, cancellationToken);
        var courses = await _courseRepository.GetAllAsync(cancellationToken);

        var now = DateTime.UtcNow;
        var soonThreshold = now.AddDays(30);

        var seatRisk = new List<PlatformSeatRiskItemDto>();
        foreach (var company in companies)
        {
            var seatsUsed = users.Count(u => u.CompanyId == company.Id && u.Role == UserRole.Employee && u.IsActive);
            var usagePercent = company.SeatLimit > 0
                ? Math.Round((decimal)seatsUsed * 100 / company.SeatLimit, 2)
                : 0;

            if (company.SeatLimit > 0 && usagePercent >= 80)
            {
                seatRisk.Add(new PlatformSeatRiskItemDto
                {
                    CompanyId = company.Id,
                    CompanyName = company.Name,
                    SeatLimit = company.SeatLimit,
                    SeatsUsed = seatsUsed,
                    UsagePercent = usagePercent,
                    ActiveUntil = company.ActiveUntil
                });
            }
        }

        var recentActivity = companies
            .OrderByDescending(c => c.UpdatedAt)
            .Take(10)
            .Select(c => new PlatformRecentCompanyActivityItemDto
            {
                CompanyId = c.Id,
                CompanyName = c.Name,
                LastUpdatedAt = c.UpdatedAt,
                PlanName = c.PlanName,
                SubscriptionStatus = c.SubscriptionStatus.ToString()
            })
            .ToList();

        return new PlatformReportDto
        {
            TotalCompanies = companies.Count,
            TotalActiveSubscriptions = companies.Count(c => c.SubscriptionStatus == SubscriptionStatus.Active),
            TotalUsers = users.Count,
            TotalManagers = users.Count(u => u.Role == UserRole.Manager),
            TotalEmployees = users.Count(u => u.Role == UserRole.Employee),
            TotalCourses = courses.Count,
            SubscriptionsExpiringSoon = companies.Count(c => c.ActiveUntil > now && c.ActiveUntil <= soonThreshold),
            CompaniesNearSeatLimit = seatRisk.OrderByDescending(x => x.UsagePercent).ToList(),
            RecentCompanyActivity = recentActivity
        };
    }

    private static string Escape(string value) => $"\"{value.Replace("\"", "\"\"")}\"";
}
