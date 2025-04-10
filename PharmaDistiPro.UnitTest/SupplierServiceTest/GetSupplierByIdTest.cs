using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using Xunit;

namespace PharmaDistiPro.UnitTest.SupplierServiceTest
{
    public class GetSupplierByIdTest
    {
        private readonly Mock<ISupplierRepository> _mockSupplierRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly SupplierService _supplierService;

        public GetSupplierByIdTest()
        {
            _mockSupplierRepository = new Mock<ISupplierRepository>();
            _mockMapper = new Mock<IMapper>();
            _supplierService = new SupplierService(_mockSupplierRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetSupplierById_WhenSupplierExists_ReturnsSuccess()
        {
            // Arrange
            var supplier = new Supplier { Id = 1, SupplierName = "ABC Pharma" };
            var supplierDto = new SupplierDTO { Id = 1, SupplierName = "ABC Pharma" };

            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(supplier);
            _mockMapper.Setup(mapper => mapper.Map<SupplierDTO>(supplier)).Returns(supplierDto);

            // Act
            var result = await _supplierService.GetSupplierById(1);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal("Supplier found", result.Message);
            Assert.Equal(supplierDto.Id, result.Data.Id);
        }

        [Fact]
        public async Task GetSupplierById_WhenSupplierNotFound_ReturnsFailure()
        {
            // Arrange
            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Supplier)null);

            // Act
            var result = await _supplierService.GetSupplierById(99);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không tìm thấy nhà phân phối", result.Message);
        }

        [Fact]
        public async Task GetSupplierById_WhenExceptionThrown_ReturnsFailure()
        {
            // Arrange
            _mockSupplierRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ThrowsAsync(new Exception("Unexpected database error"));

            // Act
            var result = await _supplierService.GetSupplierById(1);

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Unexpected database error", result.Message);
        }

    }
}
