using PharmaTraining.Application.DTOs.Auth;

namespace PharmaTraining.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<CurrentUserDto> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default);
}
