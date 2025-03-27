using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{
    public class ProductLotService : IProductLotService
    {
        private readonly IProductLotRepository _productLotRepository;

        public ProductLotService(IProductLotRepository productLotRepository)
        {
            _productLotRepository = productLotRepository;
        }

        public async Task<Response<List<ProductLotResponse>>> CreateProductLot(List<ProductLotRequest> productLots)
        {
            if (productLots == null || productLots.Count == 0)
            {
                return new Response<List<ProductLotResponse>>
                {
                    StatusCode = 400,
                    Message = "Danh sách lô hàng không có giá trị!"
                };
            }

            var response = new Response<List<ProductLotResponse>>();
            var createdProductLots = new List<ProductLot>();
            var productLotResponses = new List<ProductLotResponse>();

            foreach (var productLot in productLots)
            {
                if (productLot.LotId == null)
                {
                    return new Response<List<ProductLotResponse>>
                    {
                        StatusCode = 400,
                        Message = "LotId không có giá trị!"
                    };
                }

                Lot lot = await _productLotRepository.GetLotById(productLot.LotId);
                if (lot == null)
                {
                    return new Response<List<ProductLotResponse>>
                    {
                        StatusCode = 404,
                        Message = $"Không tìm thấy lô có ID {productLot.LotId}!"
                    };
                }

                ProductLot newProductLot = new ProductLot
                {
                    LotId = productLot.LotId,
                    ProductId = productLot.ProductId,
                    Quantity = 0,
                    ManufacturedDate = productLot.ManufacturedDate,
                    ExpiredDate = productLot.ExpiredDate,
                    SupplyPrice = productLot.SupplyPrice,
                    Status = productLot.Status
                };

                createdProductLots.Add(newProductLot);
            }

            // **Batch Insert All Valid ProductLots**
            var insertedLots = await _productLotRepository.CreateProductLots(createdProductLots);

            if (insertedLots == null || insertedLots.Count == 0)
            {
                return new Response<List<ProductLotResponse>>
                {
                    StatusCode = 500,
                    Message = "Lỗi khi tạo lô hàng!"
                };
            }

            foreach (var createdProductLot in insertedLots)
            {
                var data = new ProductLotResponse()
                {
                    Id = createdProductLot.ProductLotId,
                    SupplyPrice = createdProductLot.SupplyPrice,
                    Quantity = createdProductLot.Quantity,
                    ManufacturedDate = createdProductLot.ManufacturedDate,
                    ExpiredDate = createdProductLot.ExpiredDate,
                    ProductId = createdProductLot.ProductId,
                    LotId = createdProductLot.LotId,
                    Status = createdProductLot.Status,
                    ProductName = createdProductLot.Product?.ProductName,
                    LotCode = createdProductLot.Lot?.LotCode
                };
                productLotResponses.Add(data);
            }

            response = new Response<List<ProductLotResponse>>
            {
                StatusCode = 200,
                Data = productLotResponses
            };

            return response;
        }


        public async Task<Response<ProductLotResponse>> GetProductLotById(int id)
        {
            ProductLot productlot = await _productLotRepository.GetProductLotById(id);
            var response = new Response<ProductLotResponse>();
            if (productlot == null)
            {
                response = new Response<ProductLotResponse>
                {
                    StatusCode = 404,
                    Message = "Không tìm thấy lô hàng!"
                };
                return response;
            }
            ProductLotResponse data = new ProductLotResponse()
            {
                Id = productlot.ProductLotId,
                SupplyPrice = productlot.SupplyPrice,
                Quantity = productlot.Quantity,
                ManufacturedDate = productlot.ManufacturedDate,
                ExpiredDate = productlot.ExpiredDate,
                ProductId = productlot.ProductId,
                LotId = productlot.LotId,
                Status = productlot.Status,
                ProductName = productlot.Product.ProductName,
                LotCode = productlot.Lot.LotCode
            };
            response = new Response<ProductLotResponse>
            {
                StatusCode = 200,
                Data = data
            };
            return response;
        }

        public async Task<Response<List<ProductLotResponse>>> GetProductLotList()
        {
            var productlots = await _productLotRepository.GetProductLotList();

            productlots = productlots.OrderByDescending(x => x.ProductLotId).ToList();

            var response = new Response<List<ProductLotResponse>>();
            if (productlots == null)
            {
                response = new Response<List<ProductLotResponse>>
                {
                    StatusCode = 500,
                    Message = "Lỗi khi lấy dữ liệu lô hàng!"
                };
                return response;
            }
            if (productlots.Count <= 0)
            {
                response = new Response<List<ProductLotResponse>>
                {
                    StatusCode = 404,
                    Message = "Không có lô hàng nào!"
                };
                return response;
            }
            List<ProductLotResponse> dataSet = new List<ProductLotResponse>();
            foreach (ProductLot item in productlots)
            {
                ProductLotResponse data = new ProductLotResponse()
                {
                    Id = item.ProductLotId,
                    SupplyPrice = item.SupplyPrice,
                    Quantity = item.Quantity,
                    ManufacturedDate = item.ManufacturedDate,
                    ExpiredDate = item.ExpiredDate,
                    ProductId = item.ProductId,
                    LotId = item.LotId,
                    Status = item.Status,
                    ProductName = item.Product.ProductName,
                    LotCode = item.Lot.LotCode
                };
                dataSet.Add(data);
            }
            response = new Response<List<ProductLotResponse>>
            {
                StatusCode = 200,
                Data = dataSet
            };
            return response;
        }

        public async Task<Response<ProductLotResponse>> UpdateProductLot(ProductLotRequest ProductLot)
        {
            var response = new Response<ProductLotResponse>();
            if (ProductLot == null)
            {
                response = new Response<ProductLotResponse>
                {
                    StatusCode = 400,
                    Message = "Dữ liệu không hợp lệ!"
                };
                return response;
            }
            if(ProductLot.LotId == null)
            {
                response = new Response<ProductLotResponse>
                {
                    StatusCode = 400,
                    Message = "LotId không có giá trị!"
                };
                return response;
            }
            Lot lot = await _productLotRepository.GetLotById(ProductLot.LotId);
            if (lot == null)
            {
                response = new Response<ProductLotResponse>
                {
                    StatusCode = 404,
                    Message = "Không tìm thấy lô!"
                };
                return response;
            }
            ProductLot OldProductLot = await _productLotRepository.GetProductLotById(ProductLot.ProductLotId);
            if (OldProductLot == null)
            {
                response = new Response<ProductLotResponse>
                {
                    StatusCode = 404,
                    Message = "Không tìm thấy lô hàng!"
                };
                return response;
            }
            OldProductLot.ProductId = ProductLot.ProductId;
            OldProductLot.ManufacturedDate = ProductLot.ManufacturedDate;
            OldProductLot.ExpiredDate = ProductLot.ExpiredDate;
            OldProductLot.SupplyPrice = ProductLot.SupplyPrice;
            var updatedProductLot = await _productLotRepository.UpdateProductLot(OldProductLot);
            if (updatedProductLot == null)
            {
                response = new Response<ProductLotResponse>
                {
                    StatusCode = 500,
                    Message = "Lỗi khi cập nhật lô hàng!"
                };
                return response;
            }
            ProductLotResponse data = new ProductLotResponse()
            {
                Id = updatedProductLot.ProductLotId,
                SupplyPrice = updatedProductLot.SupplyPrice,
                Quantity = updatedProductLot.Quantity,
                ManufacturedDate = updatedProductLot.ManufacturedDate,
                ExpiredDate = updatedProductLot.ExpiredDate,
                ProductId = updatedProductLot.ProductId,
                LotId = updatedProductLot.LotId,
                Status = updatedProductLot.Status,
                ProductName = updatedProductLot.Product.ProductName,
                LotCode = updatedProductLot.Lot.LotCode
            };
            response = new Response<ProductLotResponse>
            {
                StatusCode = 200,
                Data = data
            };
            return response;
        }
    }
}
