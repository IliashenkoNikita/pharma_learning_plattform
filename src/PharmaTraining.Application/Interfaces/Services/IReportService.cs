using PharmaTraining.Application.DTOs.Reports;

namespace PharmaTraining.Application.Interfaces.Services;

public interface IReportService
{
    Task<CompanyReportDto> GetCompanyReportAsync(Guid requesterId, Guid companyId, CancellationToken cancellationToken = default);
    Task<byte[]> ExportCompanyReportCsvAsync(Guid requesterId, Guid companyId, CancellationToken cancellationToken = default);
    Task<PlatformReportDto> GetPlatformReportAsync(Guid requesterId, CancellationToken cancellationToken = default);
}
