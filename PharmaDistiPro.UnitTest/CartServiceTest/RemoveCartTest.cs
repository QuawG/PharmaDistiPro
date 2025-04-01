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
    public class RemoveCartTest
    {
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<HttpContext> _httpContextMock;
        private readonly Mock<HttpResponse> _httpResponseMock;
        private readonly CartService _cartService;

        public RemoveCartTest()
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
        public async Task Remove_ShoudRetrurnFail_WhenProductIdNotFound()
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

            var result = await _cartService.RemoveFromCart(productId);

            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy sản phẩm trong giỏ hàng", result.Message);
        }

        [Fact]
        public async Task Remove_ShoudRetrurnSuccess_WhenItemRemovedSuccessfully()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            int productId = 1;

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var result = await _cartService.RemoveFromCart(productId);

            Assert.True(result.Success);
            Assert.Equal("Xóa sản phẩm khỏi giỏ hàng thành công", result.Message);
        }
    }
}
