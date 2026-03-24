using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmaTraining.Application.DTOs.Companies;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Api.Controllers;

[ApiController]
[Route("api/companies")]
[Authorize(Roles = "Superadmin")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CompanyDto>>> GetAll(CancellationToken cancellationToken)
        => Ok(await _companyService.GetAllAsync(cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompanyDto>> GetById(Guid id, CancellationToken cancellationToken)
        => Ok(await _companyService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<CompanyDto>> Create([FromBody] CreateCompanyRequest request, CancellationToken cancellationToken)
    {
        var created = await _companyService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CompanyDto>> Update(Guid id, [FromBody] UpdateCompanyRequest request, CancellationToken cancellationToken)
        => Ok(await _companyService.UpdateAsync(id, request, cancellationToken));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _companyService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
