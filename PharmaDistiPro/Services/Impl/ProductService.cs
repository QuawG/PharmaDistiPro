using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using System.Linq.Expressions;

namespace PharmaDistiPro.Services.Impl
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly Cloudinary _cloudinary;
        private readonly IMapper _mapper;
        private readonly ICategoryRepository _categoryRepository; 


        public ProductService(IProductRepository product, IMapper mapper, Cloudinary cloudinary, ICategoryRepository category)
        {
            _productRepository = product;
            _mapper = mapper;
            _cloudinary = cloudinary;
            _categoryRepository = category;
        }

        
        public async Task<Response<IEnumerable<ProductDTO>>> GetProductList(int pageNumber = 1, string? searchTerm = null)
        {
            var response = new Response<IEnumerable<ProductDTO>>();
            try
            {
                Expression<Func<Product, bool>> filter = p => true;
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    filter = p => (p.ProductName != null && p.ProductName.ToLower().Contains(searchTerm)) ||
                                  (p.ProductCode != null && p.ProductCode.ToLower().Contains(searchTerm));
                }

                const int pageSize = 6; // Đồng bộ với thông báo
                var products = await _productRepository.GetPagedAsync(
                    filter: filter,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    includes: null,
                    orderBy: q => q.OrderBy(p => p.ProductId)
                );

                if (!products.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                    return response;
                }

                var totalItems = await _productRepository.CountAsync(filter);
                var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

                response.Data = _mapper.Map<IEnumerable<ProductDTO>>(products);
                response.Success = true;
                response.Message = $"Lấy danh sách sản phẩm thành công (Trang {pageNumber}/{totalPages}, {pageSize} sản phẩm/trang)";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Get all product
        public async Task<Response<IEnumerable<ProductDTO>>> GetProductList()
        {
            var response = new Response<IEnumerable<ProductDTO>>();
            try
            {
                var products = await _productRepository.GetAllAsync();
                response.Data = _mapper.Map<IEnumerable<ProductDTO>>(products);
                response.Success = true;

                if (!products.Any()) response.Message = "Không có dữ liệu";
                else response.Message = "Lấy danh sách sản phẩm thành công";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Deactivate product
        public async Task<Response<ProductDTO>> ActivateDeactivateProduct(int productId, bool update)
        {
            var response = new Response<ProductDTO>();
            try
            {
                var product = await _productRepository.GetByIdAsync(productId);
                if (product == null)
                {
                    response.Success = false;
                    response.Data = null; // Không ánh xạ nếu product null
                    response.Message = "Không tìm thấy sản phẩm";
                    return response;
                }

                product.Status = update;
                await _productRepository.UpdateAsync(product);
                await _productRepository.SaveAsync();
                response.Success = true;
                response.Data = _mapper.Map<ProductDTO>(product);
                response.Message = "Cập nhật thành công";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        public async Task<Response<ProductDTO>> CreateNewProduct(ProductInputRequest productInputRequest)
        {
            var response = new Response<ProductDTO>();
            try
            {
                // Kiểm tra CategoryId có giá trị không
                if (!productInputRequest.CategoryId.HasValue)
                {
                    response.Success = false;
                    response.Message = "CategoryId là bắt buộc.";
                    return response;
                }

                // Lấy Category từ CategoryId
                var category = await _categoryRepository.GetByIdAsync(productInputRequest.CategoryId.Value);
                if (category == null)
                {
                    response.Success = false;
                    response.Message = "Danh mục không tồn tại.";
                    return response;
                }

                // Sinh ProductCode: CategoryCode + số tự tăng
                string categoryCode = category.CategoryCode ?? "DEFAULT";
                int productCount = await _productRepository.CountAsync(p => p.CategoryId == productInputRequest.CategoryId.Value);
                string productCode = $"{categoryCode}{productCount + 1:D3}";
                Console.WriteLine($"Generated ProductCode: {productCode}");

                var newProduct = _mapper.Map<Product>(productInputRequest);
                newProduct.ProductCode = productCode; // Gán ProductCode đã sinh
                Console.WriteLine($"newProduct.ProductCode after assignment: {newProduct.ProductCode}");
                newProduct.CreatedDate = DateTime.Now;
                newProduct.Status = true;

                if (productInputRequest.Images != null && productInputRequest.Images.Any())
                {
                    foreach (var image in productInputRequest.Images)
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(image.FileName, image.OpenReadStream()),
                            PublicId = Path.GetFileNameWithoutExtension(image.FileName)
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        var imageUrl = uploadResult.SecureUri.ToString();

                        newProduct.ImageProducts.Add(new ImageProduct
                        {
                            Image = imageUrl
                        });
                    }
                }

                await _productRepository.InsertAsync(newProduct);
                Console.WriteLine($"newProduct.ProductCode before SaveAsync: {newProduct.ProductCode}");
                await _productRepository.SaveAsync();
                Console.WriteLine($"newProduct.ProductCode after SaveAsync: {newProduct.ProductCode}");

                if (newProduct.ImageProducts.Any())
                {
                    foreach (var imageProduct in newProduct.ImageProducts)
                    {
                        imageProduct.ProductId = newProduct.ProductId;
                    }
                    await _productRepository.SaveAsync();
                }

                response.Message = "Tạo mới sản phẩm thành công";
                response.Success = true;
                response.Data = _mapper.Map<ProductDTO>(newProduct);
                Console.WriteLine($"response.Data.ProductCode: {response.Data.ProductCode}");
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
                return response;
            }
        }

        // Get product by Id
        public async Task<Response<ProductDTO>> GetProductById(int productId)
        {
            var response = new Response<ProductDTO>();
            try
            {
                var product = await _productRepository.GetByIdAsync(productId);
                if (product == null)
                {
                    response.Success = false;
                    response.Data = null;
                    response.Message = "Không tìm thấy sản phẩm";
                    return response;
                }

                response.Success = true;
                response.Data = _mapper.Map<ProductDTO>(product);
                response.Message = "Product found";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Update product (hỗ trợ cập nhật nhiều ảnh nếu cần)
        public async Task<Response<ProductDTO>> UpdateProduct(ProductInputRequest productUpdateRequest)
        {
            var response = new Response<ProductDTO>();
            try
            {
                var productToUpdate = await _productRepository.GetByIdAsync(productUpdateRequest.ProductId);
                if (productToUpdate == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy sản phẩm";
                    return response;
                }

                _mapper.Map(productUpdateRequest, productToUpdate);

                // Xử lý ảnh mới nếu có
                if (productUpdateRequest.Images != null && productUpdateRequest.Images.Any())
                {
                    foreach (var image in productUpdateRequest.Images)
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(image.FileName, image.OpenReadStream()),
                            PublicId = Path.GetFileNameWithoutExtension(image.FileName)
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        var imageUrl = uploadResult.SecureUri.ToString();

                        productToUpdate.ImageProducts.Add(new ImageProduct
                        {
                            Image = imageUrl,
                            ProductId = productToUpdate.ProductId
                        });
                    }
                }

                await _productRepository.UpdateAsync(productToUpdate);
                await _productRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<ProductDTO>(productToUpdate);
                response.Message = "Cập nhật thành công";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: {ex.Message}";
                return response;
            }
        }


    }
}
