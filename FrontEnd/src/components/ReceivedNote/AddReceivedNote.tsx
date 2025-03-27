import React, { useState } from "react";
import {  TrashIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import { ITEM_DATA } from "../../components/data/ItemData";

interface AddReceivedNoteProps {
    handleChangePage: (page: string) => void;
    handleAddNote: (newNote: ReceivedNote) => void;
}

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
    StorageRoomName: string;
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

const AddReceivedNote: React.FC<AddReceivedNoteProps> = ({ handleChangePage, handleAddNote }) => {
    const [noteCode, setNoteCode] = useState("");
    const [purchaseOrderId, setPurchaseOrderId] = useState<number | "">("");
    const [status] = useState("Nhập");
    // , setStatus
    const [deliveryPerson, setDeliveryPerson] = useState("");
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [createdBy] = useState("");
    // , setCreatedBy
    const [createdDate, setCreatedDate] = useState(() => {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Chuyển về múi giờ địa phương
        return today.toISOString().slice(0, 10);
    });
    const [details, setDetails] = useState<ReceivedNoteDetail[]>([]);
    const [selectedLot, setSelectedLot] = useState<number | null>(null);


    const lotOptions = Array.from(new Set(ITEM_DATA.map((item) => item.LotCode))).map((lot) => ({
        value: lot,
        label: lot,
    }));

    const productOptions = selectedLot
        ? ITEM_DATA.filter((p) => p.LotCode === String(selectedLot)).map((p) => ({
            value: p.id,
            label: p.ProductName,
        }))
        : [];

    const handleSelectLot = (selectedOption: any) => {
        setSelectedLot(selectedOption.value);
    };

    const handleSelectProduct = (selectedOption: any) => {
        const product = ITEM_DATA.find((p) => p.id === selectedOption.value);
        if (product && !details.some((d) => d.ProductLotId === product.id)) {
            setDetails([
                ...details,
                {
                    ReceiveNoteDetailId: details.length + 1,
                    NoteNumber: details.length + 1,
                    ProductLotId: product.id,
                    ProductName: product.ProductName,
                    ProductCode: "",
                    LotCode: product.LotCode,
                    Unit: "",
                    ActualReceived: 0,
                    SupplyPrice: product.SupplyPrice,
                    StorageRoomName: "",
                },
            ]);
        }
    };

    const handleDetailChange = (index: number, field: keyof ReceivedNoteDetail, value: any) => {
        const updatedDetails = [...details];
        updatedDetails[index] = { ...updatedDetails[index], [field]: value };
        setDetails(updatedDetails);

        // ✅ Cập nhật tổng tiền khi thay đổi số lượng
        const newTotal = updatedDetails.reduce((sum, item) => sum + item.ActualReceived * item.SupplyPrice, 0);
        setTotalAmount(newTotal);
    };


    const handleRemoveDetail = (index: number) => {
        const updatedDetails = details.filter((_, i) => i !== index);
        setDetails(updatedDetails);

        // ✅ Cập nhật tổng tiền khi xóa sản phẩm
        const newTotal = updatedDetails.reduce((sum, item) => sum + item.ActualReceived * item.SupplyPrice, 0);
        setTotalAmount(newTotal);
    };

    const handleSave = () => {
        if (!noteCode || !purchaseOrderId || !deliveryPerson || details.length === 0) {
            alert("Vui lòng điền đầy đủ thông tin và thêm ít nhất một sản phẩm!");
            return;
        }

        for (const detail of details) {
            if (detail.ActualReceived <= 0) {
                alert(`Số lượng của sản phẩm "${detail.ProductName}" phải lớn hơn 0!`);
                return;
            }
            if (!detail.StorageRoomName.trim()) {
                alert(`Vui lòng nhập kho hàng cho sản phẩm "${detail.ProductName}"!`);
                return;
            }
        }

        
        const newNote: ReceivedNote = {
            ReceiveNoteId: Date.now(),
            ReceiveNotesCode: noteCode,
            PurchaseOrderId: Number(purchaseOrderId),
            Status: status,
            DeliveryPerson: deliveryPerson,
            TotalAmount: totalAmount,
            CreatedBy: createdBy,
            CreatedDate: createdDate,
            Details: details,
        };

        handleAddNote(newNote);
        console.log("Lưu phiếu nhập kho:", newNote);
        alert("Tạo phiếu nhập kho thành công!");

    };
    const STORAGE_ROOMS = [
        { value: "Kho A", label: "Kho A" },
        { value: "Kho B", label: "Kho B" },
        { value: "Kho C", label: "Kho C" },
    ];

    return (
        <div className="p-6 mt-16 w-full bg-gray-100">
            <h1 className="text-xl font-semibold text-gray-900">Tạo phiếu nhập kho</h1>

            <div className="bg-white rounded-lg shadow p-5 mt-5">
                <div className="grid grid-cols-2 gap-4">
                    <label>Mã phiếu<input type="text" className="border px-4 py-2 w-full" value={noteCode} onChange={(e) => setNoteCode(e.target.value)} /></label>
                    <label>ID Đơn hàng<input type="number" className="border px-4 py-2 w-full" value={purchaseOrderId} onChange={(e) => setPurchaseOrderId(e.target.value ? Number(e.target.value) : "")} /></label>
                    <label>Người giao hàng<input type="text" className="border px-4 py-2 w-full" value={deliveryPerson} onChange={(e) => setDeliveryPerson(e.target.value)} /></label>
                    <label>
                        Tổng tiền
                        <span className="border px-4 py-2 w-full block bg-gray-100">{totalAmount.toLocaleString()} VND</span>
                    </label>

                    <label>Ngày tạo<input type="date" className="border px-4 py-2 w-full" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} /></label>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5 mt-5">
                <h2 className="text-lg font-semibold text-gray-900">Chi tiết phiếu</h2>
                <Select options={lotOptions} onChange={handleSelectLot} placeholder="Chọn lô..." className="mb-4" />
                {selectedLot && (
                    <Select options={productOptions} onChange={handleSelectProduct} placeholder="Chọn sản phẩm..." className="mb-4" />
                )}
                <table className="w-full border-collapse border border-gray-300 mt-3">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="border p-2">Tên sản phẩm</th>
                            <th className="border p-2">Số lô</th>
                            <th className="border p-2">Số lượng</th>
                            <th className="border p-2">Giá nhập</th>
                            <th className="border p-2">Thành tiền</th>
                            <th className="border p-2">Kho lưu trữ</th>
                            <th className="border p-2">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((detail, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{detail.ProductName}</td>
                                <td className="border p-2">{detail.LotCode}</td>
                                <td className="border p-2"><input type="number" className="w-full px-2 py-1 border" value={detail.ActualReceived} onChange={(e) => handleDetailChange(index, "ActualReceived", Number(e.target.value))} /></td>
                                <td className="border p-2">{detail.SupplyPrice}</td>
                                <td className="border p-2 font-semibold text-blue-600">
                                    {(detail.ActualReceived * detail.SupplyPrice).toLocaleString()} VND
                                </td>
                                <td className="border p-2">
                                    <select
                                        className="w-full px-2 py-1 border"
                                        value={detail.StorageRoomName}
                                        onChange={(e) => handleDetailChange(index, "StorageRoomName", e.target.value)}
                                    >
                                        <option value="">Chọn kho...</option>
                                        {STORAGE_ROOMS.map((room) => (
                                            <option key={room.value} value={room.value}>
                                                {room.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="border p-2"><button onClick={() => handleRemoveDetail(index)} className="bg-red-500 text-white px-2 py-1 rounded-md"><TrashIcon className="w-4 h-4" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg">
                    Lưu
                </button>



                <button onClick={() => handleChangePage("Danh sách phiếu nhập")} className="ml-3 text-gray-600">
                    Quay lại
                </button>



            </div>
        </div>

    );
};

export default AddReceivedNote;
