using PharmaTraining.Application.Interfaces.Services;

namespace PharmaTraining.Infrastructure.Identity;

public class PasswordService : IPasswordService
{
    public string HashPassword(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    public bool VerifyPassword(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
