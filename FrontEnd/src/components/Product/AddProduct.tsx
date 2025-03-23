import { useState } from "react";

export default function ProductAdd({ handleChangePage }: { handleChangePage: (page: string) => void }) {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    manufactureName: "",
    categoryId: "",
    subCategoryId: "",
    unitName: "",
    status: "Đang bán",
    description: "",
    sellingPrice: "",
    storageConditions: "",
    weight: "",
    image: null as File | null,
    VAT: "",
  });

  // Danh sách tùy chọn giả định
  const categories = [
    { id: "1", name: "Thuốc giảm đau" },
    { id: "2", name: "Kháng sinh" },
  ];
  const subCategories = [
    { id: "1", name: "Viên nén" },
    { id: "2", name: "Dung dịch" },
  ];
  const statuses = ["Đang bán", "Ngừng bán"];

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // Kiểm tra form trước khi submit
  const validateForm = () => {
    const { productCode, productName, manufactureName, categoryId, subCategoryId, unitName, status, description, sellingPrice, storageConditions, weight, image, VAT } = formData;
    if (!productCode || !productName || !manufactureName || !categoryId || !subCategoryId || !unitName || !status || !description || !sellingPrice || !storageConditions || !weight || !image|| !VAT) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Form Data:", formData);
    alert("Thêm sản phẩm thành công!");
    handleChangePage("Danh sách sản phẩm");
  };

  return (
    <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tạo sản phẩm</h1>
        <p className="text-sm text-gray-500">Nhập thông tin chi tiết của sản phẩm mới</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 w-full bg-white rounded-lg shadow">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Mã sản phẩm</label>
            <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Tên sản phẩm</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Nhà sản xuất</label>
            <input type="text" name="manufactureName" value={formData.manufactureName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Danh mục</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Danh mục phụ</label>
            <select name="subCategoryId" value={formData.subCategoryId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Chọn danh mục phụ</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Trạng thái</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Giá bán</label>
            <input type="text" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Trọng lượng</label>
            <input type="text" name="weight" value={formData.weight} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Điều kiện bảo quản</label>
            <input type="text" name="storageConditions" value={formData.storageConditions} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Đơn vị tính</label>
            <input type="text" name="unitName" value={formData.unitName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">VAT</label>
            <input type="text" name="VAT" value={formData.VAT} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        {/* Upload ảnh */}
        <div className="space-y-1">
  <label className="block text-sm text-gray-700">Mô tả sản phẩm</label>
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border rounded-md"
  />
</div>

        {/* Ảnh sản phẩm */}
        <div className="space-y-1">
          <label className="block text-[14px] mb-2 text-gray-700">Ảnh sản phẩm</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Ảnh sản phẩm"
                  className="mx-auto h-32 object-cover"
                />
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Chọn file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF tới 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>


        <button type="submit" className="px-9 py-3 bg-amber-500 text-white rounded-md font-bold text-sm">Lưu</button>
      </form>
    </div>
  );
}
