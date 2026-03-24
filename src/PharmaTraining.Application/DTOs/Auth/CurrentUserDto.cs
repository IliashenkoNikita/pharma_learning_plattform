using PharmaTraining.Domain.Enums;

namespace PharmaTraining.Application.DTOs.Auth;

public class CurrentUserDto
{
    public Guid Id { get; set; }
    public Guid? CompanyId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
}
