using AutoMapper;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using System.Linq.Expressions;

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

        //category tree list
        public async Task<Response<IEnumerable<CategoryDTO>>> GetCategoryTreeAsync()
        {
            var response = new Response<IEnumerable<CategoryDTO>>();

            try
            {
                var categories = await _categoryRepository.GetAllAsync();

                if (!categories.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu danh mục";
                    return response;
                }

         
                var categoryDTOs = _mapper.Map<IEnumerable<CategoryDTO>>(categories);

                // build tree
                var categoryTree = BuildCategoryTree(categoryDTOs.ToList());

                response.Success = true;
                response.Data = categoryTree;
                response.Message = "Lấy danh sách danh mục thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }

            return response;
        }

        //build tree class
        private List<CategoryDTO> BuildCategoryTree(List<CategoryDTO> categories)
        {
            var categoryDict = categories.ToDictionary(c => c.Id, c => c);
            var rootCategories = new List<CategoryDTO>();

            foreach (var category in categories)
            {
                if (category.CategoryMainId == null)
                {
                    rootCategories.Add(category);
                }
                else
                {
                    if (categoryDict.TryGetValue(category.CategoryMainId.Value, out var parent))
                    {
                        parent.SubCategories.Add(category);
                    }
                }
            }

            return rootCategories;
        }

        // Filter by name
        public async Task<Response<IEnumerable<CategoryDTO>>> FilterCategoriesAsync(string? searchTerm)
        {
            var response = new Response<IEnumerable<CategoryDTO>>();

            try
            {
                // Create condition filter
                Expression<Func<Category, bool>> filter = c => true; 

                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    filter = c => c.CategoryName.ToLower().Contains(searchTerm) || (c.CategoryCode != null && c.CategoryCode.ToLower().Contains(searchTerm));
                }


                
                var categories = await _categoryRepository.GetByConditionAsync(filter);

                if (!categories.Any())
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy danh mục phù hợp";
                    return response;
                }

                var categoryDTOs = _mapper.Map<IEnumerable<CategoryDTO>>(categories);

                response.Success = true;
                response.Data = categoryDTOs;
                response.Message = "Lọc danh mục thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }

            return response;
        }

        // Create Category
        public async Task<Response<CategoryDTO>> CreateCategoryAsync(CategoryInputRequest categoryInputRequest)
        {
            var response = new Response<CategoryDTO>();

            try
            {
               
                var existingCategory = await _categoryRepository.GetSingleByConditionAsync(
                    c => c.CategoryName.Equals(categoryInputRequest.CategoryName) || (c.CategoryCode != null && c.CategoryCode.Equals(categoryInputRequest.CategoryCode))
                );

                if (existingCategory != null)
                {
                    response.Success = false;
                    response.Message = "Tên hoặc mã danh mục đã tồn tại.";
                    return response;
                }

              
                if (categoryInputRequest.CategoryMainId.HasValue)
                {
                    var parentCategory = await _categoryRepository.GetByIdAsync(categoryInputRequest.CategoryMainId.Value);
                    if (parentCategory == null)
                    {
                        response.Success = false;
                        response.Message = "Danh mục cha không tồn tại.";
                        return response;
                    }
                }

                
                var newCategory = _mapper.Map<Category>(categoryInputRequest);
                newCategory.CreatedDate = DateTime.Now;
              

                await _categoryRepository.InsertAsync(newCategory);
                await _categoryRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<CategoryDTO>(newCategory);
                response.Message = "Tạo danh mục thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }

            return response;
        }

        public async Task<Response<CategoryDTO>> UpdateCategoryAsync(CategoryInputRequest categoryUpdateRequest)
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

             
                if (categoryUpdateRequest.CategoryMainId.HasValue)
                {
                    var parentCategory = await _categoryRepository.GetByIdAsync(categoryUpdateRequest.CategoryMainId.Value);
                    if (parentCategory == null)
                    {
                        response.Success = false;
                        response.Message = "Danh mục cha không tồn tại.";
                        return response;
                    }
                 
                    if (categoryUpdateRequest.CategoryMainId == categoryUpdateRequest.Id)
                    {
                        response.Success = false;
                        response.Message = "Danh mục không thể là cha của chính nó.";
                        return response;
                    }
                }

                
                var duplicateCategory = await _categoryRepository.GetSingleByConditionAsync(
                    c => (c.CategoryName.Equals(categoryUpdateRequest.CategoryName) || (c.CategoryCode != null && c.CategoryCode.Equals(categoryUpdateRequest.CategoryCode))) && c.Id != categoryUpdateRequest.Id
                );

                if (duplicateCategory != null)
                {
                    response.Success = false;
                    response.Message = "Tên hoặc mã danh mục đã tồn tại.";
                    return response;
                }

                
                if (!string.IsNullOrEmpty(categoryUpdateRequest.CategoryName))
                    categoryToUpdate.CategoryName = categoryUpdateRequest.CategoryName;

                if (!string.IsNullOrEmpty(categoryUpdateRequest.CategoryCode))
                    categoryToUpdate.CategoryCode = categoryUpdateRequest.CategoryCode;

                if (categoryUpdateRequest.CategoryMainId.HasValue)
                    categoryToUpdate.CategoryMainId = categoryUpdateRequest.CategoryMainId;

               

                await _categoryRepository.UpdateAsync(categoryToUpdate);
                await _categoryRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<CategoryDTO>(categoryToUpdate);
                response.Message = "Cập nhật danh mục thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }

            return response;
        }


        //public async Task<Response<bool>> DeleteCategoryAsync(int categoryId)
        //{
        //    var response = new Response<bool>();

        //    try
        //    {
        //        Kiểm tra danh mục có tồn tại không
        //        var categoryToDelete = await _categoryRepository.GetByIdAsync(categoryId);
        //        if (categoryToDelete == null)
        //        {
        //            response.Success = false;
        //            response.Message = "Không tìm thấy danh mục";
        //            return response;
        //        }

        //        Kiểm tra xem danh mục có danh mục con không
        //        var hasSubCategories = await _categoryRepository.GetSingleByConditionAsync(c => c.CategoryMainId == categoryId);
        //        if (hasSubCategories != null)
        //        {
        //            response.Success = false;
        //            response.Message = "Không thể xóa danh mục vì vẫn còn danh mục con.";
        //            return response;
        //        }

        //        Xóa danh mục
        //       await _categoryRepository.DeleteAsync(categoryToDelete);
        //        await _categoryRepository.SaveAsync();

        //        response.Success = true;
        //        response.Data = true;
        //        response.Message = "Xóa danh mục thành công";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"Lỗi: {ex.Message}";
        //    }

        //    return response;
        //}


    }








}
