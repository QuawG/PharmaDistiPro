using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.Carts;
using PharmaDistiPro.Services.Impl;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Net;

namespace PharmaDistiPro.Test.CartServiceTest
{
    public class AddToCartTest
    {
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<HttpContext> _httpContextMock;
        private readonly Mock<HttpResponse> _httpResponseMock;
        private readonly CartService _cartService;

        public AddToCartTest()
        {

            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _httpContextMock = new Mock<HttpContext>();
            _httpResponseMock = new Mock<HttpResponse>();

            _httpContextMock.Setup(c => c.Response).Returns(_httpResponseMock.Object);
            _httpContextMock.Setup(c => c.Request.Cookies).Returns(new Mock<IRequestCookieCollection>().Object);

            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(_httpContextMock.Object);

            _cartService = new CartService(_httpContextAccessorMock.Object);
        }

        [Fact]
        public async Task AddToCart_ShouldReturnSuccess_WhenItemAddedSuccessfully()
        {
            // Giả lập giỏ hàng ban đầu
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", cartJson, It.IsAny<CookieOptions>()));

            var cartModelDto = new CartModelDto { ProductId = 2, Quantity = 3 };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.True(result.Success);
            Assert.True(result.Data.ProductId == 2);
            Assert.Equal("Thêm vào giỏ hàng thành công", result.Message);
        }

        [Fact]
        public async Task AddToCart_ShouldReturnSuccess_WhenItemAddedExistAndCookieIsNotEmpty()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = 3 };
            var result = await _cartService.AddToCart(cartModelDto);

            _httpResponseMock.Verify(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()), Times.Once);

            Assert.True(result.Success);
            Assert.Equal("Cập nhật giỏ hàng thành công", result.Message);
        }

        [Fact]
        public async Task AddToCart_ShouldReturnSuccess_WhenCookieIsEmpty()
        {
            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns((string)null);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var cartModelDto = new CartModelDto { ProductId = 4, Quantity = 5 };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.True(result.Success);
            Assert.True(result.Data.ProductId == 4);
            Assert.Equal("Thêm vào giỏ hàng thành công", result.Message);

            _httpResponseMock.Verify(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()), Times.Once);
        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenQuantityIsNegative()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = -3 };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("Số lượng không hợp lệ", result.Message);

        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenQuantityIsNull()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(

                new Exception("Số lượng không được để trống"));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = null };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("Số lượng không được để trống", result.Message);

        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenProductIsNull()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto {  Quantity = 2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(

                new Exception("Sản phẩm không được để trống"));

            var cartModelDto = new CartModelDto { Quantity = null };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("Sản phẩm không được để trống", result.Message);

        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenProductIsNotFound()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1000, Quantity = 2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(

                new Exception("Sản phẩm không tìm thấy"));

            var cartModelDto = new CartModelDto { ProductId = 10000, Quantity = null };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("Sản phẩm không tìm thấy", result.Message);

        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenPriceProductIsLessThanZero()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1000, Quantity = 2, Price = -2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(

                new Exception("giá của sản phẩm lỗi"));

            var cartModelDto = new CartModelDto { ProductId = 10000, Quantity = null };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("giá của sản phẩm lỗi", result.Message);

        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenPriceProductIsInvalid()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1000, Quantity = 2, Price = null }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(

                new Exception("giá của sản phẩm lỗi không được để trống"));

            var cartModelDto = new CartModelDto { ProductId = 10000, Quantity = null };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("giá của sản phẩm lỗi không được để trống", result.Message);

        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenVatIsNull()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2, Vat = 0.1 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
                new Exception("Thuế VAT không được để trống"));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = 1, Vat = null };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("Thuế VAT không được để trống", result.Message);
        }

        [Fact]
        public async Task AddToCart_ShouldReturnError_WhenVatIsLessThanZero()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2, Vat = 0.1 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
                new Exception("Thuế VAT không được nhỏ hơn 0"));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = 1, Vat = -0.05 };

            var result = await _cartService.AddToCart(cartModelDto);

            Assert.False(result.Success);
            Assert.Equal("Thuế VAT không được nhỏ hơn 0", result.Message);
        }



    }
}
