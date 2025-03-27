import React, { useState } from "react";
import { Menu, Dropdown, Button, Table, Modal, Input } from "antd";
import { MoreOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined } from "@ant-design/icons";

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
    StorageRoomName: string;
}

interface ReceivedNoteTableProps {
    notes: ReceivedNote[];
    onDelete: (id: number) => void;
    onUpdate: (updatedNote: ReceivedNote) => void;
}

const ReceivedNoteTable: React.FC<ReceivedNoteTableProps> = ({ notes, onDelete, onUpdate }) => {
    const [selectedNote, setSelectedNote] = useState<ReceivedNote | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = (note: ReceivedNote) => {
        setSelectedNote(note);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedNote(null);
        setIsEditModalOpen(false);
    };

    const handleQuantityChange = (detailId: number, newQuantity: number) => {
        if (selectedNote) {
            const updatedNote = {
                ...selectedNote,
                Details: selectedNote.Details.map(detail =>
                    detail.ReceiveNoteDetailId === detailId
                        ? { ...detail, ActualReceived: newQuantity }
                        : detail
                ),
            };
            setSelectedNote(updatedNote);
        }
    };

    const handleSave = () => {
        if (selectedNote) {
            onUpdate(selectedNote);
            closeEditModal();
        }
    };

    const handleDeleteNote = (id: number) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa phiếu?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => onDelete(id),
        });
    };

    const columns = [
        { title: "Mã phiếu", dataIndex: "ReceiveNotesCode", key: "ReceiveNotesCode" },
        { title: "Trạng thái", dataIndex: "Status", key: "Status" },
        { title: "Người giao hàng", dataIndex: "DeliveryPerson", key: "DeliveryPerson" },
        { title: "Số loại sản phẩm", dataIndex: "Details", key: "Details", render: (details: ReceivedNoteDetail[]) => details.length },
        { title: "Số lượng sản phẩm", key: "TotalQuantity", render: (_: any, record: ReceivedNote) => record.Details.reduce((total, detail) => total + detail.ActualReceived, 0) },
        { title: "Tổng tiền", dataIndex: "TotalAmount", key: "TotalAmount", render: (amount: number) => `${amount.toLocaleString()} VND` },
        { title: "Ngày nhập", dataIndex: "CreatedDate", key: "CreatedDate" },
        {
            title: <UnorderedListOutlined />,
            key: "actions",
            render: (_: any, record: ReceivedNote) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                                Xem & Sửa Phiếu
                            </Menu.Item>
                            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteNote(record.ReceiveNoteId)}>
                                Xóa Phiếu
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <Button shape="circle" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            <Table columns={columns} dataSource={notes} rowKey="ReceiveNoteId" />

            {selectedNote && (
                <Modal
                    title={`Chỉnh Sửa Phiếu: ${selectedNote.ReceiveNotesCode}`}
                    visible={isEditModalOpen}
                    onCancel={closeEditModal}
                    onOk={handleSave}
                    width={800}
                >
                    <Table
                        columns={[
                            { title: "Tên Sản Phẩm", dataIndex: "ProductName", key: "ProductName" },
                            {
                                title: "Số Lượng",
                                dataIndex: "ActualReceived",
                                key: "ActualReceived",
                                render: (text: number, record: ReceivedNoteDetail) => (
                                    <Input
                                        type="number"
                                        value={text}
                                        onChange={(e) => handleQuantityChange(record.ReceiveNoteDetailId, Number(e.target.value))}
                                    />
                                ),
                            },
                            { title: "Số lô", dataIndex: "LotCode", key: "LotCode" },
                            { title: "DVT", dataIndex: "Unit", key: "Unit" },
                            { title: "Giá Nhập", dataIndex: "SupplyPrice", key: "SupplyPrice" },
                            { title: "Thành tiền", key: "TotalPrice", render: (_: any, record: ReceivedNoteDetail) => `${(record.ActualReceived * record.SupplyPrice).toLocaleString()} VND` },
                            { title: "Tên kho", dataIndex: "StorageRoomName", key: "StorageRoomName" },
                        ]}
                        dataSource={selectedNote.Details}
                        rowKey="ReceiveNoteDetailId"
                    />
                </Modal>
            )}
        </div>
    );
};

export default ReceivedNoteTable;
