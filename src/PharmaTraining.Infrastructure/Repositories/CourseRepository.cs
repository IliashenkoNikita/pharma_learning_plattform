using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CourseRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<Course>> GetAllAsync(CancellationToken cancellationToken = default)
        => _dbContext.Courses.OrderBy(x => x.Title).ToListAsync(cancellationToken);

    public Task<Course?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _dbContext.Courses.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<List<Course>> GetCoursesForCompanyAsync(Guid companyId, CancellationToken cancellationToken = default)
        => _dbContext.CompanyCourseAssignments
            .Where(x => x.CompanyId == companyId && x.IsActive)
            .Select(x => x.Course)
            .OrderBy(x => x.Title)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Course course, CancellationToken cancellationToken = default)
    {
        await _dbContext.Courses.AddAsync(course, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Course course, CancellationToken cancellationToken = default)
    {
        _dbContext.Courses.Update(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Course course, CancellationToken cancellationToken = default)
    {
        _dbContext.Courses.Remove(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AssignToCompanyAsync(Guid courseId, Guid companyId, CancellationToken cancellationToken = default)
    {
        var exists = await _dbContext.CompanyCourseAssignments.AnyAsync(
            x => x.CourseId == courseId && x.CompanyId == companyId,
            cancellationToken);

        if (!exists)
        {
            await _dbContext.CompanyCourseAssignments.AddAsync(new CompanyCourseAssignment
            {
                CourseId = courseId,
                CompanyId = companyId,
                IsActive = true
            }, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
