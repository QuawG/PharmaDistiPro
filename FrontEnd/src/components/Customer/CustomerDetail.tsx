import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CustomerDetail({
  isOpen,
  onClose,
  customer,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
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
            <h1 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h1>
            <p className="text-sm text-gray-500">Xem thông tin khách hàng ở dưới đây</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border-[1px] border-gray-300 rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên riêng</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {customer?.firstName || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên họ</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {customer?.lastName || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {customer?.email || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {customer?.phone || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {customer?.address || "N/A"}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tuổi</label>
                <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                  {customer?.age || "N/A"}
                </div>
              </div>
            </div>

            {/* User Avatar */}
            <div className="flex flex-col items-center justify-center border-[1px] border-gray-300 rounded-lg p-4">
              <img
                src={customer?.avatar || "https://via.placeholder.com/150"}
                alt="Customer Avatar"
                className="w-32 h-32 rounded-full border border-gray-300"
              />
              <div className="mt-2 text-center text-sm text-gray-600">
                {customer?.firstName || "Unknown"} {customer?.lastName || ""}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tạo bởi</label>
              <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                {customer?.createdBy || "N/A"}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Thời điểm tạo</label>
              <div className="mt-1 border rounded p-2 w-full bg-gray-100">
                {customer?.createdDate || "N/A"}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="border rounded p-2">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}