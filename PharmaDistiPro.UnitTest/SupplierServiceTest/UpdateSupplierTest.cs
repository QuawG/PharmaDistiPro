using Xunit;
using Moq;
using AutoMapper;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Models;
using PharmaDistiPro.DTO.Suppliers;
using System;
using System.Collections.Generic;

namespace PharmaDistiPro.UnitTest.SupplierServiceTest
{
    public class UpdateSupplierTest
    {
        private readonly Mock<ISupplierRepository> _mockSupplierRepository;
        private readonly IMapper _mapper;
        private readonly SupplierService _supplierService;

        public UpdateSupplierTest()
        {
            _mockSupplierRepository = new Mock<ISupplierRepository>();

            // Setup AutoMapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Supplier, SupplierDTO>();
                cfg.CreateMap<SupplierInputRequest, Supplier>();
            });
            _mapper = config.CreateMapper();

            _supplierService = new SupplierService(_mockSupplierRepository.Object, _mapper);
        }

        [Fact]
        public async Task UpdateSupplier_WhenSupplierExists_ReturnsSuccess()
        {
            // Arrange
            var existingSupplier = new Supplier
            {
                Id = 1,
                SupplierName = "Old Name",
                SupplierCode = "OLD01"
            };

            var request = new SupplierInputRequest
            {
                Id = 1,
                SupplierName = "New Name",
                SupplierCode = "NEW01",
                SupplierAddress = "New Address",
                SupplierPhone = "123456789",
                Status = true,
                CreatedBy = 99,
                CreatedDate = DateTime.Now
            };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingSupplier);
            _mockSupplierRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Supplier>()));
            _mockSupplierRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal("New Name", response.Data.SupplierName);
            Assert.Equal("Cập nhật nhà phân phối thành công", response.Message);
        }

        [Fact]
        public async Task UpdateSupplier_WhenSupplierNotFound_ReturnsFailure()
        {
            // Arrange
            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Supplier)null);

            var request = new SupplierInputRequest { Id = 999 };

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Không tìm thấy nhà phân phối", response.Message);
        }

        [Fact]
        public async Task UpdateSupplier_WhenExceptionThrown_ReturnsErrorMessage()
        {
            // Arrange
            var request = new SupplierInputRequest { Id = 1 };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(1)).ThrowsAsync(new Exception("Database error"));

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật nhà phân phối.", response.Message);
        }

        [Fact]
        public async Task UpdateSupplier_WhenSupplierNameIsNull_KeepOldValue()
        {
            // Arrange
            var existingSupplier = new Supplier
            {
                Id = 1,
                SupplierName = "Old Name",
                SupplierCode = "CODE123"
            };

            var request = new SupplierInputRequest
            {
                Id = 1,
                SupplierName = null,
                SupplierCode = "NEWCODE"
            };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingSupplier);
            _mockSupplierRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Supplier>()));
            _mockSupplierRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Old Name", response.Data.SupplierName); // giữ nguyên giá trị cũ
            Assert.Equal("NEWCODE", response.Data.SupplierCode);
        }

        [Fact]
        public async Task UpdateSupplier_WhenSupplierCodeIsNull_KeepOldValue()
        {
            // Arrange
            var existingSupplier = new Supplier
            {
                Id = 2,
                SupplierName = "Supplier",
                SupplierCode = "ORIGCODE"
            };

            var request = new SupplierInputRequest
            {
                Id = 2,
                SupplierName = "Updated Supplier",
                SupplierCode = null
            };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(existingSupplier);
            _mockSupplierRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Supplier>()));
            _mockSupplierRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Updated Supplier", response.Data.SupplierName);
            Assert.Equal("ORIGCODE", response.Data.SupplierCode); // giữ nguyên code cũ
        }

        [Fact]
        public async Task UpdateSupplier_WhenSupplierAddressAreNull_KeepOldValue()
        {
            // Arrange
            var existingSupplier = new Supplier
            {
                Id = 3,
                SupplierName = "Supplier",
                SupplierCode = "S003",
                SupplierAddress = "Old Address",
                SupplierPhone = "99999"
            };

            var request = new SupplierInputRequest
            {
                Id = 3,
                SupplierAddress = null
            };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(3)).ReturnsAsync(existingSupplier);
            _mockSupplierRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Supplier>()));
            _mockSupplierRepository.Setup(repo => repo.SaveAsync()) ;

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Old Address", response.Data.SupplierAddress); // giữ nguyên
            Assert.Equal("99999", response.Data.SupplierPhone); // giữ nguyên
        }

        [Fact]
        public async Task UpdateSupplier_WhenSupplierPhoneAreNull_KeepOldValue()
        {
            // Arrange
            var existingSupplier = new Supplier
            {
                Id = 3,
                SupplierName = "Supplier",
                SupplierCode = "S003",
                SupplierAddress = "Old Address",
                SupplierPhone = "99999"
            };

            var request = new SupplierInputRequest
            {
                Id = 3,
                SupplierPhone = null
            };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(3)).ReturnsAsync(existingSupplier);
            _mockSupplierRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Supplier>()));
            _mockSupplierRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Old Address", response.Data.SupplierAddress); // giữ nguyên
            Assert.Equal("99999", response.Data.SupplierPhone); // giữ nguyên
        }

        [Fact]
        public async Task UpdateSupplier_WhenUpdateFails_ThrowsExceptionHandled()
        {
            // Arrange
            var existingSupplier = new Supplier
            {
                Id = 4,
                SupplierName = "To be updated"
            };

            var request = new SupplierInputRequest
            {
                Id = 4,
                SupplierName = "New name"
            };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(4)).ReturnsAsync(existingSupplier);
            _mockSupplierRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Supplier>()))
                                   .ThrowsAsync(new Exception("Update failed"));

            // Act
            var response = await _supplierService.UpdateSupplier(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật nhà phân phối.", response.Message);
        }

    }
}
