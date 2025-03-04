import React, { useEffect, useState } from "react";

interface UpdateProductProps {
  productId: number;
  handleChangePage: (page: string) => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ productId, handleChangePage }) => {
  const [product, setProduct] = useState<any>(null);
  const [editedProduct, setEditedProduct] = useState<any>(null);

  useEffect(() => {
    import("../data/product").then((module) => {
      const PRODUCTS_DATA = module.PRODUCTS_DATA;
      const foundProduct = PRODUCTS_DATA.find((p) => p.id === productId);
      setProduct(foundProduct || null);
      setEditedProduct(foundProduct ? { ...foundProduct } : null);
    });
  }, [productId]);

  if (!product) {
    return <div className="p-6">Sản phẩm không tồn tại.</div>;
  }

  // Hàm xử lý thay đổi dữ liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm lưu dữ liệu
  const handleSave = () => {
    console.log("Dữ liệu đã chỉnh sửa:", editedProduct);
    alert("Sản phẩm đã được cập nhật!");
  };

  return (
    <div className="pt-[70px] px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa sản phẩm</h1>

        {/* Mã sản phẩm và Tên sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
            <input type="text" className="mt-1 p-2 w-full border rounded-md" value={editedProduct.ProductCode} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
            <input 
              type="text" 
              className="mt-1 p-2 w-full border rounded-md" 
              name="ProductName"
              value={editedProduct.ProductName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Nhà cung cấp và Đơn vị */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
            <input 
              type="text" 
              className="mt-1 p-2 w-full border rounded-md" 
              name="Manufacturer"
              value={editedProduct.Manufacturer}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
            <select 
              className="mt-1 p-2 w-full border rounded-md" 
              name="unit"
              value={editedProduct.unit} 
              onChange={handleChange}
            >
              <option value="Hộp">Hộp</option>
              <option value="Tuýp">Tuýp</option>
              <option value="Chai">Chai</option>
            </select>
          </div>
        </div>

        {/* Danh mục và Danh mục phụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <select 
              className="mt-1 p-2 w-full border rounded-md" 
              name="category"
              value={editedProduct.category} 
              onChange={handleChange}
            >
              <option value="Danh mục 1">Danh mục 1</option>
              <option value="Danh mục 2">Danh mục 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục phụ</label>
            <select 
              className="mt-1 p-2 w-full border rounded-md"
              name="subCategory"
              value={editedProduct.subCategory}
              onChange={handleChange}
            >
              <option value="Danh mục phụ 1">Danh mục phụ 1</option>
              <option value="Danh mục phụ 2">Danh mục phụ 2</option>
            </select>
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea 
            className="mt-1 p-2 w-full border rounded-md" 
            rows={3} 
            name="Description"
            value={editedProduct.Description} 
            onChange={handleChange}
          />
        </div>

        {/* Thuế VAT và Trạng thái */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Thuế VAT</label>
            <input 
              type="text" 
              className="mt-1 p-2 w-full border rounded-md" 
              name="VAT"
              value={editedProduct.VAT} 
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select 
              className="mt-1 p-2 w-full border rounded-md"
              name="status"
              value={editedProduct.status} 
              onChange={handleChange}
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Ảnh sản phẩm */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Ảnh sản phẩm</label>
          <img src={editedProduct.image} alt={editedProduct.ProductName} className="mt-2 w-40 h-40 object-cover rounded-md" />
          
        </div>

        {/* Nút hành động */}
        <div className="mt-6 flex gap-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Lưu
          </button>
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded-md" 
            onClick={() => handleChangePage("Danh sách sản phẩm")}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
