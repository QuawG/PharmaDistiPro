import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function UpdateStorageRoomDetail({
  isOpen,
  onClose,
  room,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  room: any;
  onSave: (updatedRoom: any) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(room);

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
    setFormData(room);
  }, [room]);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Math.max(0, Number(value)).toString(); // Ensure non-negative numbers
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      alert('Cập nhật thông tin kho hàng thành công!');
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
            <h1 className="text-xl font-semibold text-gray-900">Cập nhật thông tin kho hàng</h1>
            <p className="text-sm text-gray-500">Cập nhật thông tin kho hàng ở form bên dưới</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="w-full mb-4">
              <div className="border-[1px] border-gray-300 rounded-lg p-4 w-full">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Mã kho</label>
                  <input
                    type="text"
                    name="code"
                    value={formData?.code || ""}
                    onChange={handleChange}
                    className="mt-1 border rounded p-2 w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tên kho</label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleChange}
                    className="mt-1 border rounded p-2 w-full"
                    required
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
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Đang chờ">Đang chờ</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nhiệt độ (°C)</label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData?.temperature || ""}
                    onChange={handleNumericChange}
                    min="0"
                    className="mt-1 border rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Độ ẩm (%)</label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData?.humidity || ""}
                    onChange={handleNumericChange}
                    min="0"
                    className="mt-1 border rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Sức chứa</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData?.capacity || ""}
                    onChange={handleNumericChange}
                    min="0"
                    className="mt-1 border rounded p-2 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 w-full">
              <button type="button" onClick={onClose} className="mr-2 border rounded p-2">Hủy</button>
              <button type="submit" className="bg-blue-500 text-white rounded p-2">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}