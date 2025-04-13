using AutoMapper;
using CloudinaryDotNet;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using Microsoft.Extensions.Logging;
using System;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Repositories.Impl;
using System.Net.Mail;

namespace PharmaDistiPro.Services.Impl
{
    public class StorageHistoryService : IStorageHistoryService
    {
        private readonly IStorageHistoryRepository _storageHistoryRepository;
        private readonly IStorageRoomRepository _storageRoomRepository;
        private readonly IUserRepository _userRepository; // Đã khai báo nhưng chưa khởi tạo
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<StorageHistoryService> _logger;
        private readonly IEmailService _emailService;

        public StorageHistoryService(
            IStorageRoomRepository storageRoomRepository,
            IStorageHistoryRepository storageHistoryRepository,
            IUserRepository userRepository, // Thêm vào constructor
            Cloudinary cloudinary,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            ILogger<StorageHistoryService> logger,
            IEmailService emailService)
        {
            _storageRoomRepository = storageRoomRepository ?? throw new ArgumentNullException(nameof(storageRoomRepository));
            _storageHistoryRepository = storageHistoryRepository ?? throw new ArgumentNullException(nameof(storageHistoryRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository)); // Khởi tạo
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _cloudinary = cloudinary ?? throw new ArgumentNullException(nameof(cloudinary));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService)); // Đảm bảo không null
        }
        public async Task<StorageHistoryDTO> CreateStorageHistoryAsync(StorageHistoryInputRequest request)
        {
            _logger.LogInformation("Starting CreateStorageHistoryAsync with request: {@Request}", request);

            if (request == null || !request.Temperature.HasValue || !request.Humidity.HasValue)
            {
                throw new ArgumentException("Missing required fields: Temperature or Humidity.");
            }

            if (request.Temperature < -50 || request.Temperature > 100)
            {
                throw new ArgumentException("Temperature must be between -50 and 100 degrees.");
            }
            if (request.Humidity < 0 || request.Humidity > 100)
            {
                throw new ArgumentException("Humidity must be between 0 and 100 percent.");
            }

            _logger.LogInformation("Checking StorageRoom with ID {StorageRoomId}", request.StorageRoomId);
            var storageRoom = await _storageRoomRepository.GetByIdAsync(request.StorageRoomId);
            if (storageRoom == null)
            {
                throw new ArgumentException($"StorageRoom with ID {request.StorageRoomId} does not exist.");
            }

            try
            {
                var history = new StorageHistory
                {
                    StorageRoomId = request.StorageRoomId,
                    Temperature = request.Temperature.Value,
                    Humidity = request.Humidity.Value,
                    CreatedDate = request.CreatedDate ?? DateTime.UtcNow,  // Tự động gán thời gian hiện tại nếu không có giá trị
                    Service = request.Service ?? "Unknown"
                };

                _logger.LogInformation("Inserting StorageHistory: {@History}", history);
                await _storageHistoryRepository.InsertAsync(history);
                await _storageHistoryRepository.SaveAsync();

                _logger.LogInformation("Mapping StorageHistory to StorageHistoryDTO");
                var result = _mapper.Map<StorageHistoryDTO>(history);
                if (result == null)
                {
                    _logger.LogError("AutoMapper returned null when mapping StorageHistory to StorageHistoryDTO");
                    throw new InvalidOperationException("Failed to map StorageHistory to StorageHistoryDTO.");
                }

                _logger.LogInformation("Returning StorageHistoryDTO: {@Result}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating StorageHistory for StorageRoomId {StorageRoomId}", request.StorageRoomId);
                throw new Exception($"Error creating StorageHistory: {ex.Message}", ex);
            }
        }


        public async Task<List<StorageHistoryChartDTO>> GetTop50EarliestForChartAsync(int storageRoomId)
        {
            try
            {
                // Kiểm tra StorageRoom
                var storageRoom = await _storageRoomRepository.GetByIdAsync(storageRoomId);
                if (storageRoom == null)
                {
                    throw new ArgumentException($"StorageRoom with ID {storageRoomId} does not exist.");
                }

                // Lấy top 50 bản ghi sớm nhất
                var histories = await _storageHistoryRepository.GetAllAsync();
                var result = histories
                    .Where(h => h.StorageRoomId == storageRoomId)
                    .OrderBy(h => h.CreatedDate)
                    .Take(50)
                    .Select(h => new StorageHistoryChartDTO
                    {
                        Temperature = h.Temperature,
                        Humidity = h.Humidity,
                        CreatedDate = h.CreatedDate
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching chart data for StorageRoomId {0}", storageRoomId);
                throw new Exception($"Error fetching chart data: {ex.Message}", ex);
            }
        }


        // get sensor data newest 
        public async Task<StorageHistoryChartDTO> GetLatestByStorageRoomIdAsync(int storageRoomId)
        {
            try
            {
                // Kiểm tra StorageRoom
                var storageRoom = await _storageRoomRepository.GetByIdAsync(storageRoomId);
                if (storageRoom == null)
                {
                    throw new ArgumentException($"StorageRoom with ID {storageRoomId} does not exist.");
                }

                // Lấy bản ghi mới nhất
                var histories = await _storageHistoryRepository.GetAllAsync();
                var result = histories
                    .Where(h => h.StorageRoomId == storageRoomId)
                    .OrderByDescending(h => h.CreatedDate)
                    .Select(h => new StorageHistoryChartDTO
                    {
                        Temperature = h.Temperature,
                        Humidity = h.Humidity,
                        CreatedDate = h.CreatedDate
                    })
                    .FirstOrDefault();

                if (result == null)
                {
                    throw new InvalidOperationException($"No history found for StorageRoom with ID {storageRoomId}.");
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching latest data for StorageRoomId {storageRoomId}: {ex.Message}", ex);
            }


        }
        public async Task<bool> HasSensorAsync(int storageRoomId)
        {
            try
            {
                var histories = await _storageHistoryRepository.GetAllAsync();
                return histories.Any(h => h.StorageRoomId == storageRoomId);
            }
            catch
            {
                return false; // Nếu có lỗi, trả về false
            }
        }
    }
}