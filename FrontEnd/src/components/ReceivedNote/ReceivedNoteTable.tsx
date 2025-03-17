import React, { useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { MoreOutlined, DeleteOutlined, EditOutlined ,UnorderedListOutlined} from "@ant-design/icons";

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

interface ReceivedNoteTableProps {
    notes: ReceivedNote[];
    onDelete: (id: number) => void;
}

const ReceivedNoteTable: React.FC<ReceivedNoteTableProps> = ({ notes, onDelete }) => {
    const [selectedNote, setSelectedNote] = useState<ReceivedNote | null>(null);

    // Mở modal chỉnh sửa
    const openEditModal = (note: ReceivedNote) => {
        setSelectedNote(note);
    };

    // Đóng modal
    const closeEditModal = () => {
        setSelectedNote(null);
    };

    // Xóa phiếu nhập kho
    const handleDeleteNote = (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phiếu?");
        if (confirmDelete) {
            onDelete(id);
            setTimeout(() => alert("Bạn đã xóa thành công phiếu!"), 200);
        }
    };

    const handleDeleteDetail = (detailId: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (confirmDelete && selectedNote) {
            setSelectedNote({
                ...selectedNote,
                Details: selectedNote.Details.filter(detail => detail.ReceiveNoteDetailId !== detailId),
            });
            setTimeout(() => alert("Bạn đã xóa thành công sản phẩm!"), 200);
        }
    };

    return (
        <div>
            {/* Bảng danh sách phiếu nhập kho */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Mã Phiếu</th>
                        <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
                        <th className="border border-gray-300 px-4 py-2">Người Giao Hàng</th>
                        <th className="border border-gray-300 px-4 py-2">Số Sản Phẩm</th>
                        <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                        <th className="border border-gray-300 px-4 py-2">Tổng Tiền</th>
                        <th className="border border-gray-300 px-4 py-2">Ngày Tạo</th>
                        <th className="border border-gray-300 px-4 py-2"><UnorderedListOutlined></UnorderedListOutlined></th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((note) => (
                        <tr key={note.ReceiveNoteId} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{note.ReceiveNotesCode}</td>
                            <td className="border border-gray-300 px-4 py-2">{note.Status}</td>
                            <td className="border border-gray-300 px-4 py-2">{note.DeliveryPerson}</td>
                            <td className="border border-gray-300 px-4 py-2">{note.Details.length}</td>
                            <td className="border border-gray-300 px-4 py-2">
    {note.Details.reduce((total, detail) => total + detail.ActualReceived, 0)}
</td>
                            <td className="border border-gray-300 px-4 py-2">{note.TotalAmount.toLocaleString()} VND</td>
                            <td className="border border-gray-300 px-4 py-2">{note.CreatedDate}</td>
                            <td className="border border-gray-300 px-4 py-2 relative">
                                {/* Menu hành động */}
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item
                                                key="edit"
                                                icon={<EditOutlined />}
                                                onClick={() => openEditModal(note)}
                                            >
                                                Xem & Sửa Phiếu
                                            </Menu.Item>
                                            <Menu.Item
                                                key="delete"
                                                icon={<DeleteOutlined />}
                                                danger
                                                onClick={() => handleDeleteNote(note.ReceiveNoteId)}
                                            >
                                                Xóa Phiếu
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={['click']}
                                >
                                    <Button icon={<MoreOutlined />} />
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal chỉnh sửa */}
            {selectedNote && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <div className="bg-white shadow-lg p-5 rounded-lg w-1/2 border border-gray-300">
                        <div className="flex justify-between">
                            <h2 className="text-lg font-bold">Chỉnh Sửa Phiếu: {selectedNote.ReceiveNotesCode}</h2>
                            <Button icon={<DeleteOutlined />} onClick={closeEditModal} />
                        </div>

                        {/* Bảng chỉnh sửa chi tiết sản phẩm */}
                        <table className="w-full mt-4 border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Tên Sản Phẩm</th>
                                    <th className="border px-4 py-2">Số Lượng</th>
                                    <th className="border px-4 py-2">Số lô</th>
                                    <th className="border px-4 py-2">DVT</th>
                                    <th className="border px-4 py-2">Giá Nhập</th>
                                    <th className="border px-4 py-2">Thành tiền</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {selectedNote.Details.map((detail) => (
                                    <tr key={detail.ReceiveNoteDetailId}>
                                        <td className="border px-4 py-2">{detail.ProductName}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                className="border px-2 py-1 w-20"
                                                value={detail.ActualReceived}
                                                onChange={(e) =>
                                                    setSelectedNote({
                                                        ...selectedNote,
                                                        Details: selectedNote.Details.map(d =>
                                                            d.ReceiveNoteDetailId === detail.ReceiveNoteDetailId
                                                                ? { ...d, ActualReceived: Number(e.target.value) }
                                                                : d
                                                        ),
                                                    })
                                                }
                                            />
                                        </td>
                                        <td className="border px-4 py-2">{detail.LotCode}</td>
                                        <td className="border px-4 py-2">{detail.Unit}</td>
                                        <td className="border px-4 py-2">{detail.SupplyPrice}</td>
                                        <td className="border px-4 py-2">
                                            {(detail.ActualReceived * detail.SupplyPrice).toLocaleString()} VND
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteDetail(detail.ReceiveNoteDetailId)}
                />
            </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Nút lưu và hủy */}
                        <div className="flex justify-end mt-4">
                            <Button onClick={closeEditModal} className="mr-2">Hủy</Button>
                            <Button type="primary">Lưu</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceivedNoteTable;
