using Microsoft.EntityFrameworkCore;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Domain.Models;
using PharmaTraining.Infrastructure.Data;

namespace PharmaTraining.Infrastructure.Repositories;

public class FileRepository : IFileRepository
{
    private readonly ApplicationDbContext _dbContext;

    public FileRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(UploadedFile file, CancellationToken cancellationToken = default)
    {
        await _dbContext.UploadedFiles.AddAsync(file, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<UploadedFile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _dbContext.UploadedFiles.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
}
