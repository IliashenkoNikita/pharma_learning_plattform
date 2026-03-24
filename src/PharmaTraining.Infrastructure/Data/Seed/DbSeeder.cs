using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Enums;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Infrastructure.Data.Seed;

public class DbSeeder
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPasswordService _passwordService;

    public DbSeeder(ApplicationDbContext dbContext, IPasswordService passwordService)
    {
        _dbContext = dbContext;
        _passwordService = passwordService;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.Database.MigrateAsync(cancellationToken);

        if (await _dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var company = new Company
        {
            Name = "Acme Pharma",
            PlanName = "Business",
            SeatLimit = 10,
            SubscriptionStatus = SubscriptionStatus.Active,
            ActiveUntil = DateTime.UtcNow.AddMonths(6)
        };

        var superadmin = new User
        {
            CompanyId = null,
            FirstName = "Platform",
            LastName = "Admin",
            Email = "superadmin@pharma.local",
            PasswordHash = _passwordService.HashPassword("SuperAdmin123!"),
            Role = UserRole.Superadmin,
            IsActive = true
        };

        var manager = new User
        {
            Company = company,
            FirstName = "Marta",
            LastName = "Manager",
            Email = "manager@acme.local",
            PasswordHash = _passwordService.HashPassword("Manager123!"),
            Role = UserRole.Manager,
            IsActive = true
        };

        var employees = new List<User>
        {
            new()
            {
                Company = company,
                FirstName = "Evan",
                LastName = "Employee",
                Email = "evan@acme.local",
                PasswordHash = _passwordService.HashPassword("Employee123!"),
                Role = UserRole.Employee,
                IsActive = true
            },
            new()
            {
                Company = company,
                FirstName = "Ella",
                LastName = "Employee",
                Email = "ella@acme.local",
                PasswordHash = _passwordService.HashPassword("Employee123!"),
                Role = UserRole.Employee,
                IsActive = true
            }
        };

        var course1 = new Course
        {
            Title = "GxP Fundamentals",
            Description = "Good practice baseline for regulated pharma work.",
            Category = "Compliance",
            Status = CourseStatus.Published,
            EstimatedDurationMinutes = 90
        };

        var course2 = new Course
        {
            Title = "Pharmacovigilance Basics",
            Description = "Adverse event lifecycle and reporting standards.",
            Category = "Safety",
            Status = CourseStatus.Published,
            EstimatedDurationMinutes = 75
        };

        var lesson1 = new Lesson
        {
            Course = course1,
            Title = "What is GxP",
            Description = "Overview of good practice standards",
            OrderIndex = 1,
            TextContent = "GxP stands for good x practice...",
            EstimatedDurationMinutes = 20
        };

        var lesson2 = new Lesson
        {
            Course = course1,
            Title = "Data Integrity",
            Description = "ALCOA+ principles",
            OrderIndex = 2,
            TextContent = "Data integrity ensures traceable records...",
            EstimatedDurationMinutes = 25
        };

        var quiz = new Quiz
        {
            Course = course1,
            Title = "GxP Checkpoint",
            PassingScorePercent = 70
        };

        var question = new QuizQuestion
        {
            Quiz = quiz,
            QuestionText = "What does ALCOA stand for?",
            Type = QuestionType.SingleChoice,
            OrderIndex = 1
        };

        var option1 = new QuizOption { Question = question, OptionText = "Attributable, Legible, Contemporaneous, Original, Accurate", IsCorrect = true };
        var option2 = new QuizOption { Question = question, OptionText = "Approved, Logged, Calculated, Observed, Archived", IsCorrect = false };

        var assignment1 = new CompanyCourseAssignment { Company = company, Course = course1, IsActive = true };
        var assignment2 = new CompanyCourseAssignment { Company = company, Course = course2, IsActive = true };

        _dbContext.Companies.Add(company);
        _dbContext.Users.Add(superadmin);
        _dbContext.Users.Add(manager);
        _dbContext.Users.AddRange(employees);
        _dbContext.Courses.AddRange(course1, course2);
        _dbContext.Lessons.AddRange(lesson1, lesson2);
        _dbContext.Quizzes.Add(quiz);
        _dbContext.QuizQuestions.Add(question);
        _dbContext.QuizOptions.AddRange(option1, option2);
        _dbContext.CompanyCourseAssignments.AddRange(assignment1, assignment2);

        await _dbContext.SaveChangesAsync(cancellationToken);

        var employeeUser = employees.First();
        _dbContext.UserCourseEnrollments.Add(new UserCourseEnrollment
        {
            UserId = employeeUser.Id,
            CourseId = course1.Id,
            Status = EnrollmentStatus.InProgress,
            ProgressPercent = 30,
            StartedAt = DateTime.UtcNow.AddDays(-2)
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
