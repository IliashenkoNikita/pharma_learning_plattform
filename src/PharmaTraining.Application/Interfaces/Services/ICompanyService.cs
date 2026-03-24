using PharmaTraining.Application.DTOs.Companies;

namespace PharmaTraining.Application.Interfaces.Services;

public interface ICompanyService
{
    Task<List<CompanyDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CompanyDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CompanyDto> CreateAsync(CreateCompanyRequest request, CancellationToken cancellationToken = default);
    Task<CompanyDto> UpdateAsync(Guid id, UpdateCompanyRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
