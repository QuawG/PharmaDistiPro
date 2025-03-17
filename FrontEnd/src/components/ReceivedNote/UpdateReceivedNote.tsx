import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ReceivedNoteDetail {
    ReceiveNoteDetailId: number;
    NoteNumber: number;
    ProductLotId: number;
    ProductName: string;
    ProductCode: string;
    LotCode: string;
    Unit: string;
    ActualReceived: number;
    SupplyPrice: number;
}

interface ReceivedNote {
    ReceiveNoteId: number;
    ReceiveNotesCode: string;
    PurchaseOrderId: number;
    Status: string;
    DeliveryPerson: string;
    TotalAmount: number;
    CreatedBy: string;
    CreatedDate: string;
    Details: ReceivedNoteDetail[];
}

// Dữ liệu mẫu
const SAMPLE_RECEIVED_NOTES: ReceivedNote[] = [
    {
        ReceiveNoteId: 5,
        ReceiveNotesCode: "Xuất nhà cung cấp",
        PurchaseOrderId: 1,
        Status: "Nhập",
        DeliveryPerson: "Hiếu",
        TotalAmount: 150000,
        CreatedBy: "HieuLD",
        CreatedDate: "2025-03-15",
        Details: [
            { ReceiveNoteDetailId: 1, NoteNumber: 100, ProductLotId: 1, ProductName: "Vương Niệu Đan", ProductCode: "SP01", LotCode: "Lo1", Unit: "Hộp", ActualReceived: 50, SupplyPrice: 50000 },
            { ReceiveNoteDetailId: 2, NoteNumber: 30, ProductLotId: 2, ProductName: "Khương Thảo Đan", ProductCode: "SP02", LotCode: "Lo1", Unit: "Hộp", ActualReceived: 30, SupplyPrice: 30000 },
        ],
    },
    {
        ReceiveNoteId: 4,
        ReceiveNotesCode: "Nhập nhà cung cấp",
        PurchaseOrderId: 2,
        Status: "Nhập",
        DeliveryPerson: "Hiếu",
        TotalAmount: 300000,
        CreatedBy: "HieuLD",
        CreatedDate: "2025-03-15",
        Details: [
            { ReceiveNoteDetailId: 3, NoteNumber: 100, ProductLotId: 3, ProductName: "Bình Vị Thái Minh", ProductCode: "SP03", LotCode: "Lo2", Unit: "Hộp", ActualReceived: 50, SupplyPrice: 60000 },
        ],
    },
];

const UpdateReceivedNote: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const noteId = Number(id);

    // Tìm phiếu nhập kho theo ID
    const selectedNote = SAMPLE_RECEIVED_NOTES.find((note) => note.ReceiveNoteId === noteId);

    const [noteDetails, setNoteDetails] = useState(selectedNote?.Details || []);

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = (detailId: number, newQuantity: number) => {
        const updatedDetails = noteDetails.map((detail) =>
            detail.ReceiveNoteDetailId === detailId
                ? { ...detail, ActualReceived: newQuantity }
                : detail
        );
        setNoteDetails(updatedDetails);
    };

    // Lưu dữ liệu cập nhật
    const handleSave = () => {
        console.log("Dữ liệu cập nhật:", noteDetails);
        alert("Cập nhật thành công!");
        navigate(-1); // Quay lại trang trước
    };

    return (
        <div className="p-6 mt-16 overflow-auto w-full bg-gray-100">
            <h1 className="text-xl font-semibold text-gray-900">Cập Nhật Phiếu Nhập Kho</h1>

            {selectedNote ? (
                <div className="bg-white rounded-lg shadow p-5 mt-5">
                    <h2 className="text-lg font-semibold">Mã Phiếu: {selectedNote.ReceiveNotesCode}</h2>
                    <p><strong>Người giao:</strong> {selectedNote.DeliveryPerson}</p>
                    <p><strong>Trạng thái:</strong> {selectedNote.Status}</p>
                    <p><strong>Ngày tạo:</strong> {selectedNote.CreatedDate}</p>

                    {/* Bảng sản phẩm */}
                    <table className="w-full border-collapse border border-gray-300 mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
                                <th className="border border-gray-300 px-4 py-2">Mã lô</th>
                                <th className="border border-gray-300 px-4 py-2">Đơn vị</th>
                                <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                                <th className="border border-gray-300 px-4 py-2">Giá</th>
                                <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noteDetails.map((detail) => (
                                <tr key={detail.ReceiveNoteDetailId} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">{detail.ProductName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{detail.LotCode}</td>
                                    <td className="border border-gray-300 px-4 py-2">{detail.Unit}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="number"
                                            value={detail.ActualReceived}
                                            onChange={(e) =>
                                                handleQuantityChange(detail.ReceiveNoteDetailId, Number(e.target.value))
                                            }
                                            className="border px-2 py-1 w-20"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{detail.SupplyPrice.toLocaleString()} VND</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {(detail.ActualReceived * detail.SupplyPrice).toLocaleString()} VND
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Nút Lưu */}
                    <div className="mt-4">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-lg"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-red-500 mt-5">Phiếu nhập không tồn tại!</p>
            )}
        </div>
    );
};

export default UpdateReceivedNote;
