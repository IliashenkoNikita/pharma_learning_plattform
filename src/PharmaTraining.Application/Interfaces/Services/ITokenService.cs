using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Services;

public interface ITokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(User user);
}
