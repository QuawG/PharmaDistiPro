using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using Xunit;

namespace PharmaDistiPro.UnitTest.SupplierServiceTest
{
    public class GetSupplierListTest
    {
        private readonly Mock<ISupplierRepository> _mockSupplierRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly SupplierService _supplierService;

        public GetSupplierListTest()
        {
            _mockSupplierRepository = new Mock<ISupplierRepository>();
            _mockMapper = new Mock<IMapper>();
            _supplierService = new SupplierService(_mockSupplierRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetSupplierList_WhenSuppliersExist_ReturnsSuccess()
        {
            // Arrange
            var suppliers = new List<Supplier>
            {
                new Supplier { Id = 1, SupplierName = " A" },
                new Supplier { Id = 2, SupplierName = " B" }
            };

            var supplierDTOs = new List<SupplierDTO>
            {
                new SupplierDTO { Id = 1, SupplierName = " A" },
                new SupplierDTO { Id = 2, SupplierName = " B" }
            };

            _mockSupplierRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(suppliers);
            _mockMapper.Setup(m => m.Map<IEnumerable<SupplierDTO>>(suppliers)).Returns(supplierDTOs);

            // Act
            var result = await _supplierService.GetSupplierList();

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetSupplierList_WhenNoSuppliers_ReturnsFailure()
        {
            // Arrange
            _mockSupplierRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Supplier>());

            // Act
            var result = await _supplierService.GetSupplierList();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetSupplierList_WhenExceptionThrown_ReturnsFailure()
        {
            // Arrange
            _mockSupplierRepository.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _supplierService.GetSupplierList();

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Database error", result.Message);
        }
    }
}
