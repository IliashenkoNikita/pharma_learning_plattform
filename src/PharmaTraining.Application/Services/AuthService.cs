using PharmaTraining.Application.DTOs.Auth;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, IPasswordService passwordService, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email.Trim().ToLowerInvariant(), cancellationToken)
                   ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!user.IsActive || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        var (token, expiresAtUtc) = _tokenService.GenerateToken(user);

        return new AuthResponse
        {
            AccessToken = token,
            ExpiresAtUtc = expiresAtUtc,
            UserId = user.Id,
            CompanyId = user.CompanyId,
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role = user.Role
        };
    }

    public async Task<CurrentUserDto> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new KeyNotFoundException("User not found.");

        return new CurrentUserDto
        {
            Id = user.Id,
            CompanyId = user.CompanyId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsActive = user.IsActive
        };
    }
}
