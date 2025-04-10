using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using Xunit;

namespace PharmaDistiPro.UnitTest.SupplierServiceTest
{
    public class ActivateDeactivateSupplierTest
    {
        private readonly Mock<ISupplierRepository> _mockSupplierRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly SupplierService _supplierService;

        public ActivateDeactivateSupplierTest()
        {
            _mockSupplierRepository = new Mock<ISupplierRepository>();
            _mockMapper = new Mock<IMapper>();
            _supplierService = new SupplierService(_mockSupplierRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task ActivateDeactivateSupplier_WhenSupplierExists_ReturnSuccess()
        {
            // Arrange
            var supplierId = 1;
            var updateStatus = true;

            var supplier = new Supplier { Id = supplierId, Status = false };
            var supplierDto = new SupplierDTO { Id = supplierId, Status = updateStatus };

            _mockSupplierRepository.Setup(r => r.GetByIdAsync(supplierId)).ReturnsAsync(supplier);
            _mockSupplierRepository.Setup(r => r.UpdateAsync(It.IsAny<Supplier>()));
            _mockSupplierRepository.Setup(r => r.SaveAsync());
            _mockMapper.Setup(m => m.Map<SupplierDTO>(It.IsAny<Supplier>())).Returns(supplierDto);

            // Act
            var response = await _supplierService.ActivateDeactivateSupplier(supplierId, updateStatus);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Cập nhật thành công", response.Message);
            Assert.NotNull(response.Data);
            Assert.Equal(updateStatus, response.Data.Status);
        }

        [Fact]
        public async Task ActivateDeactivateSupplier_WhenSupplierNotFound_ReturnFail()
        {
            // Arrange
            var supplierId = 2;
            _mockSupplierRepository.Setup(r => r.GetByIdAsync(supplierId)).ReturnsAsync((Supplier?)null);
            _mockMapper.Setup(m => m.Map<SupplierDTO>(null)).Returns((SupplierDTO?)null);

            // Act
            var response = await _supplierService.ActivateDeactivateSupplier(supplierId, false);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Không tìm thấy nhà phân phối", response.Message);
            Assert.Null(response.Data);
        }

        [Fact]
        public async Task ActivateDeactivateSupplier_ReturnException()
        {
            // Arrange
            var supplierId = 3;
            _mockSupplierRepository.Setup(r => r.GetByIdAsync(supplierId)).ThrowsAsync(new Exception("Database failure"));

            // Act
            var response = await _supplierService.ActivateDeactivateSupplier(supplierId, true);

            // Assert
            Assert.False(response.Success);
            Assert.Contains("Database failure", response.Message);
        }
    }
}
