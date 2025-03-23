import React, { useState } from "react";
import { Menu, Dropdown, Button, Table, Modal, Input } from "antd";
import { MoreOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined } from "@ant-design/icons";

interface IssueNote {
    id: number;
    issueNoteCode: string;
    orderId: number;
    customerId: number;
    updatedStatusDate: Date;
    totalAmount: number;
    createdBy: string;
    createdDate: Date;
    status: string;
    details: IssueNoteDetail[];
}

interface IssueNoteDetail {
    id: number;
    issueNoteId: number;
    productId: number;
    quantity: number;
}

interface IssueNoteTableProps {
    notes: IssueNote[];
    onDelete: (id: number) => void;
    onUpdate: (updatedNote: IssueNote) => void;
}

const IssueNoteTable: React.FC<IssueNoteTableProps> = ({ notes, onDelete, onUpdate }) => {
    const [selectedNote, setSelectedNote] = useState<IssueNote | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = (note: IssueNote) => {
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
                details: selectedNote.details.map(detail =>
                    detail.id === detailId ? { ...detail, quantity: newQuantity } : detail
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
        { title: "Mã Phiếu", dataIndex: "issueNoteCode", key: "issueNoteCode" },
        { title: "Trạng Thái", dataIndex: "status", key: "status" },
        { title: "Người Tạo", dataIndex: "createdBy", key: "createdBy" },
        { title: "Số Sản Phẩm", key: "TotalProducts", render: (_: any, record: IssueNote) => record.details.length },
        { title: "Số lượng", key: "TotalQuantity", render: (_: any, record: IssueNote) => record.details.reduce((total, detail) => total + detail.quantity, 0) },
        { title: "Tổng Tiền", dataIndex: "totalAmount", key: "totalAmount", render: (amount: number) => `${amount.toLocaleString()} VND` },
        { 
            title: "Ngày Tạo", 
            dataIndex: "createdDate", 
            key: "createdDate", 
            render: (date: Date) => date ? new Date(date).toLocaleDateString("vi-VN") : "Không có dữ liệu"
        },
        {
            title: <UnorderedListOutlined />,
            key: "actions",
            render: (_: any, record: IssueNote) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                                Xem & Sửa Phiếu
                            </Menu.Item>
                            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteNote(record.id)}>
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
            <Table columns={columns} dataSource={notes} rowKey="id" />

            {selectedNote && (
                <Modal
                    title={`Chỉnh Sửa Phiếu: ${selectedNote.issueNoteCode}`}
                    visible={isEditModalOpen}
                    onCancel={closeEditModal}
                    onOk={handleSave}
                    width={800}
                >
                    <Table
                        columns={[
                            { title: "Mã Sản Phẩm", dataIndex: "productId", key: "productId" },
                            {
                                title: "Số Lượng",
                                dataIndex: "quantity",
                                key: "quantity",
                                render: (text: number, record: IssueNoteDetail) => (
                                    <Input
                                        type="number"
                                        value={text}
                                        onChange={(e) => handleQuantityChange(record.id, Number(e.target.value))}
                                    />
                                ),
                            },
                        ]}
                        dataSource={selectedNote.details}
                        rowKey="id"
                    />
                </Modal>
            )}
        </div>
    );
};

export default IssueNoteTable;
