using PharmaTraining.Application.DTOs.Users;

namespace PharmaTraining.Application.Interfaces.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync(Guid requesterId, CancellationToken cancellationToken = default);
    Task<UserDto> GetByIdAsync(Guid requesterId, Guid id, CancellationToken cancellationToken = default);
    Task<UserDto> CreateAsync(Guid requesterId, CreateUserRequest request, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateAsync(Guid requesterId, Guid id, UpdateUserRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid requesterId, Guid id, CancellationToken cancellationToken = default);
}
