using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Repositories;

public interface ICompanyRepository
{
    Task<List<Company>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Company company, CancellationToken cancellationToken = default);
    Task UpdateAsync(Company company, CancellationToken cancellationToken = default);
    Task DeleteAsync(Company company, CancellationToken cancellationToken = default);
}
