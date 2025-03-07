import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function SupplierDetail({
  isOpen,
  onClose,
  supplier,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: any;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

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

  if (!mounted) return null;

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
            <h1 className="text-xl font-semibold text-gray-900">Chi tiết nhà cung cấp</h1>
            <p className="text-sm text-gray-500">Thông tin chi tiết nhà cung cấp</p>
          </div>

          <form className="flex flex-col items-center">
            <div className="w-full">
              <div className="border-[1px] border-gray-300 rounded-lg p-4 w-full">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tên</label>
                  <input
                    type="text"
                    value={supplier?.name || "N/A"}
                    readOnly
                    className="mt-1 border rounded p-2 w-full bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    value={supplier?.address || "N/A"}
                    readOnly
                    className="mt-1 border rounded p-2 w-full bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    value={supplier?.phone || "N/A"}
                    readOnly
                    className="mt-1 border rounded p-2 w-full bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <input
                    type="text"
                    value={supplier?.status || "N/A"}
                    readOnly
                    className="mt-1 border rounded p-2 w-full bg-gray-100"
                  />
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
          </form>

          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="border rounded p-2">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}