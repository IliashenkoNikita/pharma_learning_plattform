using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Infrastructure.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.PlanName).IsRequired().HasMaxLength(100);
        builder.HasIndex(x => x.Name).IsUnique();
    }
}
