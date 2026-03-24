using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CompanyRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<Company>> GetAllAsync(CancellationToken cancellationToken = default)
        => _dbContext.Companies.OrderBy(x => x.Name).ToListAsync(cancellationToken);

    public Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _dbContext.Companies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(Company company, CancellationToken cancellationToken = default)
    {
        await _dbContext.Companies.AddAsync(company, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Company company, CancellationToken cancellationToken = default)
    {
        _dbContext.Companies.Update(company);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Company company, CancellationToken cancellationToken = default)
    {
        _dbContext.Companies.Remove(company);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
