
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Repositories.Impl;
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Models;
using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Cors.Infrastructure;
using System.Security.Principal;

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

            // ket noi database
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<SEP490_G74Context>(options =>
            options.UseSqlServer(connectionString)
           .EnableDetailedErrors()
           .EnableSensitiveDataLogging() // Thêm để ghi chi tiết lỗi
            );
            builder.Services.AddHttpContextAccessor(); // Đăng ký IHttpContextAccessor

            #region cloudinary 
            var cloudName = builder.Configuration.GetValue<string>("Cloudinary:CloudName");
            var apiKey = builder.Configuration.GetValue<string>("Cloudinary:Key");
            var apiSecret = builder.Configuration.GetValue<string>("Cloudinary:Secret");

            var account = new Account(cloudName, apiKey, apiSecret);
            var cloudinary = new Cloudinary(account);

            builder.Services.AddSingleton(cloudinary);
            #endregion

          

            #region Add DI for repositories
            builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
            builder.Services.AddScoped<IStorageRoomRepository, StorageRoomRepository>();
            builder.Services.AddScoped<IUnitRepository, UnitRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IOrdersDetailRepository, OrdersDetailRepository>();
            #endregion

            #region Add DI for services
            builder.Services.AddScoped<ISupplierService, SupplierService>();
            builder.Services.AddScoped<IStorageRoomService, StorageRoomService>();
            builder.Services.AddScoped<IUnitService, UnitService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<ICartService, CartService>();

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
