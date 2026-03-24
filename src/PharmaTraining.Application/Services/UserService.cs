using PharmaTraining.Application.DTOs.Users;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Domain.Enums;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IPasswordService _passwordService;

    public UserService(IUserRepository userRepository, ICompanyRepository companyRepository, IPasswordService passwordService)
    {
        _userRepository = userRepository;
        _companyRepository = companyRepository;
        _passwordService = passwordService;
    }

    public async Task<List<UserDto>> GetAllAsync(Guid requesterId, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);
        var users = requester.Role == UserRole.Superadmin
            ? await _userRepository.GetAllAsync(null, cancellationToken)
            : await _userRepository.GetAllAsync(requester.CompanyId, cancellationToken);

        return users.Select(Map).ToList();
    }

    public async Task<UserDto> GetByIdAsync(Guid requesterId, Guid id, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);
        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
                   ?? throw new KeyNotFoundException("User not found.");

        EnsureScope(requester, user.CompanyId);
        return Map(user);
    }

    public async Task<UserDto> CreateAsync(Guid requesterId, CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);

        if (requester.Role == UserRole.Manager)
        {
            request.CompanyId = requester.CompanyId;
            if (request.Role == UserRole.Superadmin)
            {
                throw new UnauthorizedAccessException("Manager cannot create superadmin users.");
            }
        }

        if (request.Role != UserRole.Superadmin && !request.CompanyId.HasValue)
        {
            throw new InvalidOperationException("CompanyId is required for manager and employee roles.");
        }

        if (request.Role == UserRole.Employee && request.CompanyId.HasValue)
        {
            await EnsureSeatCapacityAsync(request.CompanyId.Value, cancellationToken);
        }

        var existing = await _userRepository.GetByEmailAsync(request.Email.Trim().ToLowerInvariant(), cancellationToken);
        if (existing is not null)
        {
            throw new InvalidOperationException("Email already exists.");
        }

        var user = new User
        {
            CompanyId = request.Role == UserRole.Superadmin ? null : request.CompanyId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = _passwordService.HashPassword(request.Password),
            Role = request.Role,
            IsActive = request.IsActive
        };

        await _userRepository.AddAsync(user, cancellationToken);
        return Map(user);
    }

    public async Task<UserDto> UpdateAsync(Guid requesterId, Guid id, UpdateUserRequest request, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);
        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
                   ?? throw new KeyNotFoundException("User not found.");

        EnsureScope(requester, user.CompanyId);

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.IsActive = request.IsActive;

        await _userRepository.UpdateAsync(user, cancellationToken);
        return Map(user);
    }

    public async Task DeleteAsync(Guid requesterId, Guid id, CancellationToken cancellationToken = default)
    {
        var requester = await RequireRequesterAsync(requesterId, cancellationToken);
        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
                   ?? throw new KeyNotFoundException("User not found.");

        EnsureScope(requester, user.CompanyId);

        if (user.Role == UserRole.Superadmin)
        {
            throw new InvalidOperationException("Cannot delete superadmin.");
        }

        await _userRepository.DeleteAsync(user, cancellationToken);
    }

    private async Task EnsureSeatCapacityAsync(Guid companyId, CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetByIdAsync(companyId, cancellationToken)
                      ?? throw new KeyNotFoundException("Company not found.");

        var employeeCount = await _userRepository.CountByCompanyAndRoleAsync(companyId, UserRole.Employee, cancellationToken);
        if (employeeCount >= company.SeatLimit)
        {
            throw new InvalidOperationException("Seat limit reached for the company.");
        }
    }

    private async Task<User> RequireRequesterAsync(Guid requesterId, CancellationToken cancellationToken)
        => await _userRepository.GetByIdAsync(requesterId, cancellationToken)
           ?? throw new UnauthorizedAccessException("Requester not found.");

    private static void EnsureScope(User requester, Guid? targetCompanyId)
    {
        if (requester.Role == UserRole.Superadmin)
        {
            return;
        }

        if (requester.CompanyId != targetCompanyId)
        {
            throw new UnauthorizedAccessException("Out of company scope.");
        }
    }

    private static UserDto Map(User user)
        => new()
        {
            Id = user.Id,
            CompanyId = user.CompanyId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
}
