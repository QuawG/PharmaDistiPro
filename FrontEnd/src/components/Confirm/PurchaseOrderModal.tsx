import React from "react";

interface PurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">Thông báo lưu trữ</h2>
                    <p className="text-gray-600">Vui lòng chọn nhà cung cấp trước khi thêm sản phẩm vào đơn hàng!</p>
                    <div className="mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderModal;