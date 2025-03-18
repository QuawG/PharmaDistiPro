import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function StorageRoomDetail({
  isOpen,
  onClose,
  room,
}: {
  isOpen: boolean;
  onClose: () => void;
  room: any;
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
            <h1 className="text-xl font-semibold text-gray-900">Thông tin kho hàng</h1>
            <p className="text-sm text-gray-500">Xem thông tin kho hàng ở dưới đây</p>
          </div>

          <div className="flex justify-center">
            <div className="border-[1px] border-gray-300 rounded-lg p-4 w-full">
              {/* Thông tin kho hàng */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mã kho</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {room?.code || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên kho</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {room?.name || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {room?.status || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nhiệt độ (°C)</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {room?.temperature || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Độ ẩm (%)</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {room?.humidity || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sức chứa</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {room?.capacity || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Nút Đóng */}
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="border rounded p-2">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}