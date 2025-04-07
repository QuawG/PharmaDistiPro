using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json;
using PharmaDistiPro.DTO.Carts;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.Test.CartServiceTest
{
    public class UpdateCartTest
    {
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<HttpContext> _httpContextMock;
        private readonly Mock<HttpResponse> _httpResponseMock;
        private readonly CartService _cartService;

        public UpdateCartTest()
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
        public async Task UpdateCart_ShouldReturnSuccess_WhenItemUpdatedSuccessfully()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            int productId = 1;
            int newQuantity = 3;

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = 3 };

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            // Gọi phương thức UpdateCart
            var result = await _cartService.UpdateCart(productId, newQuantity);

            // Kiểm tra kết quả trả về
            Assert.True(result.Success);
            Assert.Equal(3, result.Data.Quantity);
            Assert.Equal("Cập nhật số lượng thành công", result.Message);
        }
        [Fact]
        public async Task UpdateCart_ShouldRemoveItem_WhenQuantityIs0()
        {
            var cartList = new List<CartModelDto>
             {
        new CartModelDto { ProductId = 1, Quantity = 2 }
                };

            int productId = 1;
            int newQuantity = 0;

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            string updatedCartJson = null;
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()))
                .Callback<string, string, CookieOptions>((key, value, options) => updatedCartJson = value);

            var result = await _cartService.UpdateCart(productId, newQuantity);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            Assert.True(result.Success);
            Assert.Equal("Xóa sản phẩm khỏi giỏ hàng thành công", result.Message);


        }
        [Fact]
        public async Task UpdateCart_ShoudRetrurnFail_WhenProductIdNotFound()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            int productId = 2;
            int newQuantity = 3;

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var cartModelDto = new CartModelDto { ProductId = 1, Quantity = 3 };

            var result = await _cartService.UpdateCart(productId, newQuantity);

            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy sản phẩm trong giỏ hàng", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenPriceIsNegative()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2, Price = -10 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
    new Exception("Giá sản phẩm không hợp lệ"));

            var result = await _cartService.UpdateCart(1, 3);

            Assert.False(result.Success);
            Assert.Equal("Giá sản phẩm không hợp lệ", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenPriceIsNull()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2, Price = null }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("Giá sản phẩm không được để trống"));

            var result = await _cartService.UpdateCart(1, 3);

            Assert.False(result.Success);
            Assert.Equal("Giá sản phẩm không được để trống", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenVatIsNegative()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2, Vat = -1 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("VAT không hợp lệ"));
            var result = await _cartService.UpdateCart(1, 3);

            Assert.False(result.Success);
            Assert.Equal("VAT không hợp lệ", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenVatIsNull()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2, Vat = null }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("VAT không được để trống"));
            var result = await _cartService.UpdateCart(1, 3);

            Assert.False(result.Success);
            Assert.Equal("VAT không được để trống", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenQuantityIsNegative()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = 2 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("Số lượng không hợp lệ"));
            var result = await _cartService.UpdateCart(1, -5);

            Assert.False(result.Success);
            Assert.Equal("Số lượng không hợp lệ", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenQuantityIsNull()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 1, Quantity = null }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("Số lượng trong giỏ hàng không hợp lệ"));
            var result = await _cartService.UpdateCart(1, 3);

            Assert.False(result.Success);
            Assert.Equal("Số lượng trong giỏ hàng không hợp lệ", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenProductIsNull()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { Quantity = 2 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("Sản phẩm không được để trống"));
            var result = await _cartService.UpdateCart(0, 3);

            Assert.False(result.Success);
            Assert.Equal("Sản phẩm không được để trống", result.Message);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnError_WhenProductIsNotFound()
        {
            var cartList = new List<CartModelDto>
    {
        new CartModelDto { ProductId = 999, Quantity = 2 }
    };

            var cartJson = JsonConvert.SerializeObject(cartList);
            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>())).Throws(
new Exception("Không tìm thấy sản phẩm"));
            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            var result = await _cartService.UpdateCart(1000, 3);

            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy sản phẩm", result.Message);
        }

    }
}
