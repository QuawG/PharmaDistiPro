import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

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
            <h1 className="text-xl font-semibold text-gray-900">Customer Details</h1>
            <p className="text-sm text-gray-500">Full details of the customer</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border-[1px] border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50 w-1/3">Name</td>
                    <td className="px-4 py-3">{customer?.name || "N/A"}</td>
                  </tr>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Age</td>
                    <td className="px-4 py-3">{customer?.age || "N/A"}</td>
                  </tr>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Email</td>
                    <td className="px-4 py-3">{customer?.email || "N/A"}</td>
                  </tr>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Phone</td>
                    <td className="px-4 py-3">{customer?.phone || "N/A"}</td>
                  </tr>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Address</td>
                    <td className="px-4 py-3">{customer?.address || "N/A"}</td>
                  </tr>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Created By</td>
                    <td className="px-4 py-3">{customer?.createdBy || "N/A"}</td>
                  </tr>
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Created At</td>
                    <td className="px-4 py-3">{customer?.createdAt || "N/A"}</td>
                  </tr>
      
                  <tr className="border-b-[1px] border-b-gray-300">
                    <td className="px-4 py-3 bg-gray-50">Status</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${customer?.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{customer?.status || "N/A"}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Customer Avatar */}
            <div className="flex flex-col items-center justify-center border-[1px] border-gray-300 rounded-lg p-4">
              <div className="relative">
                <img
                  src={customer?.avatar || "https://via.placeholder.com/150"}
                  alt="Customer Avatar"
                  className="w-32 h-32 rounded-full border border-gray-300"
                />
                <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                {customer?.name || "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
