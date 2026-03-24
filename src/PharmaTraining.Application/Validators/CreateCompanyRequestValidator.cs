using FluentValidation;
using PharmaTraining.Application.DTOs.Companies;

namespace PharmaTraining.Application.Validators;

public class CreateCompanyRequestValidator : AbstractValidator<CreateCompanyRequest>
{
    public CreateCompanyRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.PlanName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.SeatLimit).GreaterThan(0);
        RuleFor(x => x.ActiveUntil).GreaterThan(DateTime.UtcNow.AddDays(-1));
    }
}
