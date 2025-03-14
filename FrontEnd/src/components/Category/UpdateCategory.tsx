import React, { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

interface UpdateCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (updatedCategory: Category) => void;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState<Category | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Cập nhật formData khi category thay đổi
  useEffect(() => {
    if (category) {
      setFormData(category);
      setPreviewImage(category.image || 'assets/img/product/noimage.png'); // Load ảnh mặc định nếu không có ảnh
    }
  }, [category]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => (prev ? { ...prev, image: imageUrl } : null));
    }
  };

  const handleSave = () => {
    onSave(formData);  // Cập nhật ảnh trong danh sách
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-lg font-semibold mb-4">Cập nhật danh mục</h2>
        {showSuccess && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-md text-center mb-3">
            Cập nhật thành công!
          </div>
        )}

        <div className="space-y-3">
          {/* Hiển thị ảnh */}
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <img
                src={previewImage ?? 'assets/img/product/noimage.png'}
                alt="Preview"
                className="w-32 h-32 object-cover border rounded-md hover:opacity-80 transition"
              />
            </label>
          </div>

          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Mã danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã danh mục</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
        </div>

        {/* Nút lưu và hủy */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Hủy
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-white bg-[#FF9F43] rounded hover:bg-[#ff8f20]">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
