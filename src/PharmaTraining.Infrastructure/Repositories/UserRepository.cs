using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Enums;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<User>> GetAllAsync(Guid? companyId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Users.AsQueryable();
        if (companyId.HasValue)
        {
            query = query.Where(x => x.CompanyId == companyId.Value);
        }

        return query.OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ToListAsync(cancellationToken);
    }

    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        => _dbContext.Users.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public Task<int> CountByCompanyAndRoleAsync(Guid companyId, UserRole role, CancellationToken cancellationToken = default)
        => _dbContext.Users.CountAsync(x => x.CompanyId == companyId && x.Role == role && x.IsActive, cancellationToken);

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(User user, CancellationToken cancellationToken = default)
    {
        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
