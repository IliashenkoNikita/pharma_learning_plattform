using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly ApplicationDbContext _dbContext;

    public EnrollmentRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<UserCourseEnrollment?> GetByUserAndCourseAsync(Guid userId, Guid courseId, CancellationToken cancellationToken = default)
        => _dbContext.UserCourseEnrollments.FirstOrDefaultAsync(x => x.UserId == userId && x.CourseId == courseId, cancellationToken);

    public Task<List<UserCourseEnrollment>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        => _dbContext.UserCourseEnrollments.Where(x => x.UserId == userId).OrderByDescending(x => x.AssignedAt).ToListAsync(cancellationToken);

    public Task<List<UserCourseEnrollment>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken = default)
        => _dbContext.UserCourseEnrollments
            .Include(x => x.User)
            .Include(x => x.Course)
            .Where(x => x.User.CompanyId == companyId)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(UserCourseEnrollment enrollment, CancellationToken cancellationToken = default)
    {
        await _dbContext.UserCourseEnrollments.AddAsync(enrollment, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(UserCourseEnrollment enrollment, CancellationToken cancellationToken = default)
    {
        _dbContext.UserCourseEnrollments.Update(enrollment);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<LessonProgress?> GetLessonProgressAsync(Guid userId, Guid lessonId, CancellationToken cancellationToken = default)
        => _dbContext.LessonProgresses.FirstOrDefaultAsync(x => x.UserId == userId && x.LessonId == lessonId, cancellationToken);

    public async Task AddLessonProgressAsync(LessonProgress lessonProgress, CancellationToken cancellationToken = default)
    {
        await _dbContext.LessonProgresses.AddAsync(lessonProgress, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateLessonProgressAsync(LessonProgress lessonProgress, CancellationToken cancellationToken = default)
    {
        _dbContext.LessonProgresses.Update(lessonProgress);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
