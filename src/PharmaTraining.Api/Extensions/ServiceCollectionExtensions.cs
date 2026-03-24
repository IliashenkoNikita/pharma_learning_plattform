using System.Text;
using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PharmaTraining.Application.Interfaces.Repositories;
using PharmaTraining.Application.Interfaces.Services;
using PharmaTraining.Application.Services;
using PharmaTraining.Application.Validators;
using PharmaTraining.Infrastructure.Data;
using PharmaTraining.Infrastructure.Data.Seed;
using PharmaTraining.Infrastructure.Identity;
using PharmaTraining.Infrastructure.Repositories;
using PharmaTraining.Infrastructure.Storage;

namespace PharmaTraining.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        services
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<CreateCompanyRequestValidator>();

        var allowedOrigins = GetAllowedOrigins(configuration);
        if (environment.IsProduction() && allowedOrigins.Length == 0)
        {
            throw new InvalidOperationException("Cors:AllowedOrigins is required in production.");
        }

        services.AddCors(options =>
        {
            options.AddPolicy("DefaultCors", builder =>
            {
                if (allowedOrigins.Length > 0)
                {
                    builder
                        .WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    return;
                }

                builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string missing.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        var jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret missing");
        var jwtIssuer = configuration["Jwt:Issuer"] ?? "PharmaTraining";
        var jwtAudience = configuration["Jwt:Audience"] ?? "PharmaTrainingClient";

        if (environment.IsProduction())
        {
            if (jwtSecret.Length < 32)
            {
                throw new InvalidOperationException("Jwt:Secret must be at least 32 characters in production.");
            }

            if (jwtSecret.Contains("CHANGE_ME", StringComparison.OrdinalIgnoreCase)
                || jwtSecret.Contains("dev-secret", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Jwt:Secret cannot use placeholder or development values in production.");
            }
        }

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
                };
            });

        services.AddAuthorization();

        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<ILessonRepository, LessonRepository>();
        services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
        services.AddScoped<IQuizRepository, QuizRepository>();
        services.AddScoped<IFileRepository, FileRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICompanyService, CompanyService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IQuizService, QuizService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IFileService, FileService>();

        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();

        services.AddScoped<IBlobStorageService>(_ =>
        {
            var storageConnectionString = configuration["AzureBlob:ConnectionString"]
                                          ?? "UseDevelopmentStorage=true";
            var containerName = configuration["AzureBlob:ContainerName"] ?? "pharma-files";
            return new AzureBlobStorageService(storageConnectionString, containerName);
        });

        services.AddScoped<DbSeeder>();

        return services;
    }

    private static string[] GetAllowedOrigins(IConfiguration configuration)
    {
        var configured = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                        ?? Array.Empty<string>();
        var csv = configuration["Cors:AllowedOrigins"];

        var origins = configured
            .Concat(string.IsNullOrWhiteSpace(csv)
                ? Array.Empty<string>()
                : csv.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
            .Select(x => x.Trim().TrimEnd('/'))
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return origins;
    }
}
