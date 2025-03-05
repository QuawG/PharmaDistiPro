using AutoMapper;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{

    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Lấy toàn bộ danh mục và sắp xếp thành cấu trúc cây (cha - con).
        /// </summary>
        /// <returns>Danh sách danh mục theo dạng cây</returns>
        public async Task<Response<List<CategoryDTO>>> GetCategoryTree()
        {
            var response = new Response<List<CategoryDTO>>();
            try
            {
                // Lấy toàn bộ danh mục từ repository
                var categories = await _categoryRepository.GetAllAsync();
                if (!categories.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                    return response;
                }

                // Map sang CategoryDTO
                var categoryDtoList = _mapper.Map<List<CategoryDTO>>(categories);

                // Xây dựng cây danh mục
                var categoryTree = BuildCategoryTree(categoryDtoList);

                response.Success = true;
                response.Data = categoryTree;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }
            return response;
        }

      
        private List<CategoryDTO> BuildCategoryTree(List<CategoryDTO> categories)
        {
            
            var lookup = categories.ToDictionary(c => c.Id, c => c);

           
            var rootCategories = new List<CategoryDTO>();

            foreach (var category in categories)
            {
                if (category.CategoryMainId.HasValue && lookup.ContainsKey(category.CategoryMainId.Value))
                {
           
                    var parent = lookup[category.CategoryMainId.Value];
                    parent.SubCategories.Add(category);
                }
                else
                {
                   
                    rootCategories.Add(category);
                }
            }

            return rootCategories;
        }

    
        public async Task<Response<CategoryDTO>> GetCategoryById(int categoryId)
        {
            var response = new Response<CategoryDTO>();
            try
            {
                var category = await _categoryRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy danh mục";
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<CategoryDTO>(category);
                    response.Message = "Danh mục tìm thấy";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<Response<CategoryDTO>> CreateNewCategory(CategoryInputRequest categoryInputRequest)
        {
            var response = new Response<CategoryDTO>();
            try
            {
                // Kiểm tra xem danh mục đã tồn tại chưa
                var existingCategory = await _categoryRepository.GetSingleByConditionAsync(x =>
                    x.CategoryCode == categoryInputRequest.CategoryCode ||
                    x.CategoryName == categoryInputRequest.CategoryName);

                if (existingCategory != null)
                {
                    response.Success = false;
                    response.Message = "Mã danh mục hoặc tên danh mục đã tồn tại.";
                    return response;
                }

                // Map dữ liệu từ DTO sang Entity
                var newCategory = _mapper.Map<Category>(categoryInputRequest);
                newCategory.CreatedDate = DateTime.Now;

                await _categoryRepository.InsertAsync(newCategory);
                await _categoryRepository.SaveAsync();

                response.Success = true;
                response.Message = "Tạo mới danh mục thành công";
                response.Data = _mapper.Map<CategoryDTO>(newCategory);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }
            return response;
        }

        public async Task<Response<CategoryDTO>> UpdateCategory(CategoryInputRequest categoryUpdateRequest)
        {
            var response = new Response<CategoryDTO>();
            try
            {
                var categoryToUpdate = await _categoryRepository.GetByIdAsync(categoryUpdateRequest.Id);
                if (categoryToUpdate == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy danh mục";
                    return response;
                }

                // Map dữ liệu từ DTO sang thực thể hiện tại
                _mapper.Map(categoryUpdateRequest, categoryToUpdate);

                await _categoryRepository.UpdateAsync(categoryToUpdate);
                await _categoryRepository.SaveAsync();

                response.Success = true;
                response.Message = "Cập nhật danh mục thành công";
                response.Data = _mapper.Map<CategoryDTO>(categoryToUpdate);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Đã xảy ra lỗi khi cập nhật danh mục.";
            }
            return response;
        }

      
    }








}
