using PharmaTraining.Application.DTOs.Companies;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;

    public CompanyService(ICompanyRepository companyRepository)
    {
        _companyRepository = companyRepository;
    }

    public async Task<List<CompanyDto>> GetAllAsync(CancellationToken cancellationToken = default)
        => (await _companyRepository.GetAllAsync(cancellationToken)).Select(Map).ToList();

    public async Task<CompanyDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var company = await _companyRepository.GetByIdAsync(id, cancellationToken)
                      ?? throw new KeyNotFoundException("Company not found.");
        return Map(company);
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyRequest request, CancellationToken cancellationToken = default)
    {
        var company = new Company
        {
            Name = request.Name,
            PlanName = request.PlanName,
            SeatLimit = request.SeatLimit,
            SubscriptionStatus = request.SubscriptionStatus,
            ActiveUntil = request.ActiveUntil
        };

        await _companyRepository.AddAsync(company, cancellationToken);
        return Map(company);
    }

    public async Task<CompanyDto> UpdateAsync(Guid id, UpdateCompanyRequest request, CancellationToken cancellationToken = default)
    {
        var company = await _companyRepository.GetByIdAsync(id, cancellationToken)
                      ?? throw new KeyNotFoundException("Company not found.");

        company.Name = request.Name;
        company.PlanName = request.PlanName;
        company.SeatLimit = request.SeatLimit;
        company.SubscriptionStatus = request.SubscriptionStatus;
        company.ActiveUntil = request.ActiveUntil;

        await _companyRepository.UpdateAsync(company, cancellationToken);
        return Map(company);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var company = await _companyRepository.GetByIdAsync(id, cancellationToken)
                      ?? throw new KeyNotFoundException("Company not found.");

        await _companyRepository.DeleteAsync(company, cancellationToken);
    }

    private static CompanyDto Map(Company company)
        => new()
        {
            Id = company.Id,
            Name = company.Name,
            PlanName = company.PlanName,
            SeatLimit = company.SeatLimit,
            SubscriptionStatus = company.SubscriptionStatus,
            ActiveUntil = company.ActiveUntil,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
}
