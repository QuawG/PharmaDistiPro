using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Repositories.Impl;
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Models;
using AutoMapper;

namespace PharmaDistiPro
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<SEP490_G74Context>(options => options.UseSqlServer(connectionString).EnableDetailedErrors());

            #region Add DI for repositories
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            #endregion

            #region Add DI for services
            builder.Services.AddScoped<IUserService, UserService>();
            #endregion

            // Register AutoMapper
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}