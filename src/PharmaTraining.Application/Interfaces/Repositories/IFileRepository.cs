using PharmaTraining.Domain.Models;

namespace PharmaTraining.Application.Interfaces.Repositories;

public interface IFileRepository
{
    Task AddAsync(UploadedFile file, CancellationToken cancellationToken = default);
    Task<UploadedFile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
