using FluentValidation;
using PharmaTraining.Application.DTOs.Courses;

namespace PharmaTraining.Application.Validators;

public class CreateCourseRequestValidator : AbstractValidator<CreateCourseRequest>
{
    public CreateCourseRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(120);
        RuleFor(x => x.EstimatedDurationMinutes).GreaterThan(0);
    }
}
