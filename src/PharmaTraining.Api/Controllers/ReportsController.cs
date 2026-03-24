using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Reports;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Roles = "Superadmin,Manager")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("company/{companyId:guid}")]
    public async Task<ActionResult<CompanyReportDto>> GetCompanyReport(Guid companyId, CancellationToken cancellationToken)
        => Ok(await _reportService.GetCompanyReportAsync(GetUserId(), companyId, cancellationToken));

    [HttpGet("company/{companyId:guid}/csv")]
    public async Task<IActionResult> ExportCompanyCsv(Guid companyId, CancellationToken cancellationToken)
    {
        var bytes = await _reportService.ExportCompanyReportCsvAsync(GetUserId(), companyId, cancellationToken);
        return File(bytes, "text/csv", $"company-report-{companyId}.csv");
    }

    [HttpGet("platform")]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<PlatformReportDto>> GetPlatformReport(CancellationToken cancellationToken)
        => Ok(await _reportService.GetPlatformReportAsync(GetUserId(), cancellationToken));

    private Guid GetUserId()
        => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("Invalid token."));
}
