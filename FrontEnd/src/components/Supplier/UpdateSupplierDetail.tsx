import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function UpdateSupplierDetail({
  isOpen,
  onClose,
  supplier,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: any;
  onSave: (updatedSupplier: any) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(supplier);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData(supplier);
  }, [supplier]);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      alert('Information saved successfully!');
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out bg-black/30 backdrop-blur-sm ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[90vw] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl transition-all duration-300 ease-out transform ${
          visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-8 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Cập nhật thông tin nhà cung cấp</h1>
            <p className="text-sm text-gray-500">Cập nhật thông tin nhà cung cấp theo form bên dưới</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border-[1px] border-gray-300 rounded-lg p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleChange}
                    className="mt-1 border rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData?.address || ""}
                    onChange={handleChange}
                    className="mt-1 border rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData?.phone || ""}
                    onChange={handleChange}
                    className="mt-1 border rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    name="status"
                    value={formData?.status || ""}
                    onChange={handleChange}
                    className="mt-1 border rounded p-2 w-full"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="pending">Đang chờ</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tạo bởi</label>
                  <input
                    type="text"
                    value={supplier?.createdBy || "N/A"}
                    readOnly
                    className="mt-1 border rounded p-2 w-full bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Thời điểm tạo</label>
                  <input
                    type="text"
                    value={supplier?.createdDate || "N/A"}
                    readOnly
                    className="mt-1 border rounded p-2 w-full bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="button" onClick={onClose} className="mr-2 border rounded p-2">Hủy</button>
              <button type="submit" className="bg-blue-500 text-white rounded p-2">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}