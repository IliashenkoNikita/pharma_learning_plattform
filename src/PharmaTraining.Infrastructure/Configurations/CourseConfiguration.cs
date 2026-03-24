using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaTraining.Domain.Models;

namespace PharmaTraining.Infrastructure.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Category).IsRequired().HasMaxLength(120);
        builder.Property(x => x.Description).HasMaxLength(5000);
    }
}
