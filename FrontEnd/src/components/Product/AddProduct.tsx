import { useState } from "react";

export default function ProductAdd({ handleChangePage }: { handleChangePage: (page: string) => void }) {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    mainCategory: "",
    subCategory: "",
    manufacturer: "",
    unit: "",
    status: "active",
    description: "",
    image: null as File | null,
    VAT: "", // Tạo trường VAT
  });
  

  // Xử lý thay đổi input, select và textarea
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
    const { productCode, productName, mainCategory, subCategory, manufacturer, unit, status, description, image } = formData;
    if (!productCode || !productName || !mainCategory || !subCategory || !manufacturer || !unit || !status || !description || !image) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra form trước khi submit
    if (!validateForm()) return;

    console.log("Form Data:", formData);
    alert("Add Successfully"); // Thông báo khi Tạo sản phẩm thành công
    handleChangePage("Danh sách sản phẩm"); // Chuyển về danh sách sản phẩm
  };

  return (
    <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tạo sản phẩm</h1>
        <p className="text-sm text-gray-500">Tạo sản phẩm mới</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-5 w-full bg-white rounded-lg shadow">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mã sản phẩm */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">Mã sản phẩm</label>
            <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập mã sản phẩm" />
          </div>

          {/* Tên sản phẩm */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">Tên sản phẩm</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên sản phẩm" />
          </div>

          {/* Nhà cung cấp */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">Nhà sản xuất</label>
            <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập Nhà sản xuất" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Danh mục chính */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">Danh mục hệ thống</label>
            <select name="mainCategory" value={formData.mainCategory} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
              <option value="">Chọn danh mục hệ thống</option>
              <option value="category1">Danh mục 1</option>
              <option value="category2">Danh mục 2</option>
            </select>
          </div>

          {/* Danh mục phụ */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">Danh mục thuốc</label>
            <select name="subCategory" value={formData.subCategory} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
              <option value="">Chọn danh mục thuốc</option>
              <option value="subcategory1">Danh mục phụ 1</option>
              <option value="subcategory2">Danh mục phụ 2</option>
            </select>
          </div>

          {/* Đơn vị hộp */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">Đơn vị</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Chọn đơn vị</option>
              <option value="hop">Hộp</option>
              <option value="tuyp">Tuýp</option>
              <option value="chai">Chai</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        {/* Row 3 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
  {/* Trạng thái */}
  <div className="space-y-1">
    <label className="block text-[14px] mb-2 text-gray-700">Trạng thái</label>
    <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
      <option value="active">Hoạt động</option>
      <option value="inactive">Không hoạt động</option>
    </select>
  </div>

  {/* Thuế VAT */}
  <div className="space-y-1">
    <label className="block text-[14px] mb-2 text-gray-700">Thuế VAT</label>
    <input
      type="text"
      name="VAT"
      value={formData.VAT || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
      placeholder="Nhập phần trăm thuế VAT"
    />
  </div>
</div>

        {/* Mô tả */}
        <div className="space-y-1">
          <label className="block text-[14px] mb-2 text-gray-700">Mô tả</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập mô tả sản phẩm"
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
                      strokeLinejoin="round"
                    />
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


        {/* Buttons */}
        <div className="flex gap-4">
          <button type="submit" className="px-9 py-3.5 bg-amber-500 text-white rounded-sm font-bold text-sm">Lưu</button>
          <button type="button" onClick={() => handleChangePage("Danh sách sản phẩm")} className="px-9 py-3.5 bg-gray-500 text-white rounded-sm font-bold text-sm">Hủy</button>
        </div>
      </form>
    </div>
  );
}
