
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
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

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
            #region Swagger
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

                // Configure Swagger to use Bearer Token Authentication
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
            #endregion
            builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // Bỏ qua vòng lặp
    });
            // ket noi database
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<SEP490_G74Context>(options =>
            options.UseSqlServer(connectionString)
           .EnableDetailedErrors()
           .EnableSensitiveDataLogging() // Thêm để ghi chi tiết lỗi
            );
            builder.Services.AddHttpContextAccessor(); // Đăng ký IHttpContextAccessor
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy => policy.AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader());
            });
            #region cloudinary 
            var cloudName = builder.Configuration.GetValue<string>("Cloudinary:CloudName");
            var apiKey = builder.Configuration.GetValue<string>("Cloudinary:Key");
            var apiSecret = builder.Configuration.GetValue<string>("Cloudinary:Secret");

            var account = new Account(cloudName, apiKey, apiSecret);
            var cloudinary = new Cloudinary(account);

            builder.Services.AddSingleton(cloudinary);
            #endregion

            #region Email
            var emailConfig = builder.Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();

            builder.Services.AddSingleton(emailConfig);
            builder.Services.AddScoped<IEmailService, EmailService>();

            #endregion
            #region Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateActor = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                };
            });
            #endregion

            #region GHN SERVICE
            builder.Services.AddHttpClient<IGHNService, GHNService>();
            #endregion

            #region Add DI for repositories
            builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
            builder.Services.AddScoped<IStorageRoomRepository, StorageRoomRepository>();
            builder.Services.AddScoped<IUnitRepository, UnitRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IOrdersDetailRepository, OrdersDetailRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<IOrdersDetailRepository, OrdersDetailRepository>();
            builder.Services.AddScoped<IIssueNoteRepository, IssueNoteRepository>();
            builder.Services.AddScoped<IIssueNoteDetailsRepository, IssueNoteDetailsRepository>();
            builder.Services.AddScoped<IProductLotRepository, ProductLotRepository>();
            builder.Services.AddScoped<IIssueNoteRepository, IssueNoteRepository>();
            builder.Services.AddScoped<IIssueNoteDetailsRepository, IssueNoteDetailsRepository>();
            builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
            builder.Services.AddScoped<IPurchaseOrdersDetailRepository, PurchaseOrdersDetailRepository>();
            builder.Services.AddScoped<ILotRepository, LotRepository>();
            builder.Services.AddScoped<IProductLotRepository, ProductLotRepository>();
            builder.Services.AddScoped<IReceivedNoteRepository, ReceivedNoteRepository>();

            #endregion

            #region Add DI for services
            builder.Services.AddScoped<ISupplierService, SupplierService>();
            builder.Services.AddScoped<IStorageRoomService, StorageRoomService>();
            builder.Services.AddScoped<IUnitService, UnitService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IProductService, ProductService>();
            builder.Services.AddScoped<ICartService, CartService>();
            builder.Services.AddScoped<IIssueNoteService, IssueNoteService>();
            builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
            builder.Services.AddScoped<ILotService, LotService>();
            builder.Services.AddScoped<IProductLotService, ProductLotService>();
            builder.Services.AddScoped<IReceivedNoteService, ReceivedNoteService>();

            #endregion

            // Register AutoMapper
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            
                app.UseSwagger();
                app.UseSwaggerUI();
            

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });

            app.MapControllers();

            app.Run();
        }
    }
}
