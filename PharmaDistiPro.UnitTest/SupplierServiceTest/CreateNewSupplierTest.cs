using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System.Linq.Expressions;
using Xunit;

namespace PharmaDistiPro.UnitTest.SupplierServiceTest
{
    public class CreateNewSupplierTest
    {
        private readonly Mock<ISupplierRepository> _mockSupplierRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly SupplierService _supplierService;

        public CreateNewSupplierTest()
        {
            _mockSupplierRepository = new Mock<ISupplierRepository>();
            _mockMapper = new Mock<IMapper>();
            _supplierService = new SupplierService(_mockSupplierRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenSupplierExists_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Pharma One",
                SupplierCode = "P001"
            };

            var existingSupplier = new Supplier
            {
                SupplierName = "Pharma One",
                SupplierCode = "P001"
            };

            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync(existingSupplier);

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Code và tên đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenValidRequest_ReturnsSuccess()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "New Supplier",
                SupplierCode = "NEW001",
                SupplierAddress = "123 Pharma St.",
                SupplierPhone = "0123456789",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now

            };

            var mappedSupplier = new Supplier
            {
                SupplierName = "New Supplier",
                SupplierCode = "NEW001",
                SupplierAddress = "123 Pharma St.",
                SupplierPhone = "0123456789",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now
            };

            var mappedDTO = new SupplierDTO
            {
                SupplierName = "New Supplier",
                SupplierCode = "NEW001",
                SupplierAddress = "123 Pharma St.",
                SupplierPhone = "0123456789",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now
            };

            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync((Supplier)null);

            _mockMapper.Setup(mapper => mapper.Map<Supplier>(request)).Returns(mappedSupplier);
            _mockMapper.Setup(mapper => mapper.Map<SupplierDTO>(mappedSupplier)).Returns(mappedDTO);

            _mockSupplierRepository.Setup(repo => repo.InsertAsync(mappedSupplier));
            _mockSupplierRepository.Setup(repo => repo.SaveAsync());

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal("NEW001", result.Data.SupplierCode);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenExceptionThrown_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Crash Supplier",
                SupplierCode = "ERR001"
            };

            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ThrowsAsync(new Exception("Unexpected database error"));

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Lỗi: Unexpected database error", result.Message);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenSupplierCodeExists_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Supplier A",
                SupplierCode = "CODE123"
            };

            var existingSupplier = new Supplier
            {
                SupplierName = "Supplier B",
                SupplierCode = "CODE123"
            };

            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync(existingSupplier);

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Code và tên đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenPhoneNull_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Supplier A",
                SupplierCode = "CODE123",
                SupplierPhone = null
            };



            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync((Supplier)null);

            _mockMapper.Setup(mapper => mapper.Map<Supplier>(request)).Throws(new Exception("Số điện thoại đang rỗng"));

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Số điện thoại đang rỗng", result.Message);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenPhoneIsNotNumber_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Supplier A",
                SupplierCode = "CODE123",
                SupplierPhone = "abc"
            };



            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync((Supplier)null);

            _mockMapper.Setup(mapper => mapper.Map<Supplier>(request)).Throws(new Exception("Số điện thoại đang sai định dạng"));

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Số điện thoại đang sai định dạng", result.Message);
        }

        [Fact]
        public async Task CreateNewSupplier_WhenAddressNull_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Supplier A",
                SupplierCode = "CODE123",
                SupplierPhone = "0123456789",
                SupplierAddress = null

            };



            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync((Supplier)null);

            _mockMapper.Setup(mapper => mapper.Map<Supplier>(request)).Throws(new Exception("Địa chỉ không được để trống"));

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Địa chỉ không được để trống", result.Message);
        }


        [Fact]
        public async Task CreateNewSupplier_WhenStatusNull_ReturnsFailure()
        {
            // Arrange
            var request = new SupplierInputRequest
            {
                SupplierName = "Supplier A",
                SupplierCode = "CODE123",
                SupplierPhone = "0123456789",
                SupplierAddress = "123 Pharma St.",
                Status = null
            };



            _mockSupplierRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Supplier, bool>>>(), null))
                .ReturnsAsync((Supplier)null);

            _mockMapper.Setup(mapper => mapper.Map<Supplier>(request)).Throws(new Exception("Trạng thái không được để trống"));

            // Act
            var result = await _supplierService.CreateNewSupplier(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Trạng thái không được để trống", result.Message);
        }

    }
}
