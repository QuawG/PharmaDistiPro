using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{

    public interface ICategoryService
    {
        Task<Services.Response<CategoryDTO>> CreateNewCategory(CategoryInputRequest categoryInputRequest);
        Task<Services.Response<CategoryDTO>> GetCategoryById(int categoryId);
        Task<Services.Response<List<CategoryDTO>>> GetCategoryTree();
        Task<Services.Response<CategoryDTO>> UpdateCategory(CategoryInputRequest categoryUpdateRequest);
    }


}
