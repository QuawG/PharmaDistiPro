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


        public ProductService(IProductRepository product, IMapper mapper, Cloudinary cloudinary)
        {
            _productRepository = product;
            _mapper = mapper;
            _cloudinary = cloudinary;
        }

        // Get all product with pagination and search 
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

                // Lấy dữ liệu phân trang với 6 sản phẩm mỗi trang
                var products = await _productRepository.GetPagedAsync(
                    filter: filter,
                    pageNumber: pageNumber,
                    pageSize: 2,
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
                var totalPages = (int)Math.Ceiling((double)totalItems / 6);

                response.Data = _mapper.Map<IEnumerable<ProductDTO>>(products);
                response.Success = true;
                response.Message = $"Lấy danh sách sản phẩm thành công (Trang {pageNumber}/{totalPages}, 6 sản phẩm/trang)";
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

                if (products.Count() == 0) response.Message = "Không có dữ liệu";

                return response;

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }



        ///Deactivate product
        public async Task<Response<ProductDTO>> ActivateDeactivateProduct(int productId, bool update)
        {
            var response = new Response<ProductDTO>();
            try
            {
              
                var products = await _productRepository.GetByIdAsync(productId);
                if (products == null)
                {
                    response.Success = false;
                    response.Data = _mapper.Map<ProductDTO>(products);
                    response.Message = "Không tìm thấy sản phẩm";
                    return response;
                }
                else
                {
                    products.Status = update;
                    await _productRepository.UpdateAsync(products);
                    await _productRepository.SaveAsync();
                    response.Success = true;
                    response.Data = _mapper.Map<ProductDTO>(products);
                    response.Message = "Cập nhật thành công";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }



        //Create new product
        public async Task<Response<ProductDTO>> CreateNewProduct(ProductInputRequest productInputRequest)
        {
            var response = new Response<ProductDTO>();
            string imageUrl = null;

            try
            {
                
                var existingProduct = await _productRepository.GetSingleByConditionAsync(x => x.ProductCode.Equals(productInputRequest.ProductCode) );
                if (existingProduct != null)
                {
                    response.Success = false;
                    response.Message = "Tên sản phẩm đã tồn tại.";
                    return response;
                }

              
                if ( productInputRequest.Image != null)
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(productInputRequest.Image.FileName, productInputRequest.Image.OpenReadStream()),
                        PublicId = Path.GetFileNameWithoutExtension(productInputRequest.Image.FileName)
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    imageUrl = uploadResult.SecureUri.ToString();
                }

          
                var newProduct = _mapper.Map<Product>(productInputRequest);
                newProduct.Image = imageUrl;
                newProduct.CreatedDate = DateTime.Now;
                newProduct.Status = true;

              
                await _productRepository.InsertAsync(newProduct);
                await _productRepository.SaveAsync();

              
                response.Message = "Tạo mới sản phẩm thành công";
                response.Success = true;
                response.Data = _mapper.Map<ProductDTO>(newProduct);

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
                var products = await _productRepository.GetByIdAsync(productId);
                if (products == null)
                {
                    response.Success = false;
                    response.Data = null;
                    response.Message = "Không tìm thấy sản phẩm";
                    return response;
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<ProductDTO>(products);
                    response.Message = "Product found";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Update product
        public async Task<Response<ProductDTO>> UpdateProduct(ProductInputRequest productUpdateRequest)
        {
            var response = new Response<ProductDTO>();
            string imageUrl = null;

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
                if (productUpdateRequest.Image != null)
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(productUpdateRequest.Image.FileName, productUpdateRequest.Image.OpenReadStream()),
                        PublicId = Path.GetFileNameWithoutExtension(productUpdateRequest.Image.FileName)
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    imageUrl = uploadResult.SecureUri.ToString();
                    productToUpdate.Image = imageUrl;
                }

                await _productRepository.UpdateAsync(productToUpdate);
                await _productRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<ProductDTO>(productToUpdate);
                response.Message = "Cập nhật thành công";
            }
            catch (Exception ex)
            {
                
                response.Success = false;
                response.Message = "Đã xảy ra lỗi trong quá trình cập nhật sản phẩm.";
            }

            return response;
        }

    }
}
