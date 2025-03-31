import React, { useState } from "react";
import { Table, Button, Form, Input, InputNumber, Select, DatePicker, Typography, Statistic, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ITEM_DATA } from "../../components/data/ItemData";

const { Title } = Typography;
const { Option } = Select;

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
    const [form] = Form.useForm();
    const [details, setDetails] = useState<ReceivedNoteDetail[]>([]);
    const [selectedLot, setSelectedLot] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    const lotOptions = [...new Set(ITEM_DATA.map((item) => item.LotCode))].map((lot) => ({
        value: lot,
        label: lot,
    }));

    const productOptions = selectedLot
        ? ITEM_DATA.filter((p) => p.LotCode === String(selectedLot)).map((p) => ({
            value: p.id,
            label: p.ProductName,
        }))
        : [];

    const STORAGE_ROOMS = ["Kho A", "Kho B", "Kho C"];

    const totalAmount = details.reduce((sum, item) => sum + item.ActualReceived * item.SupplyPrice, 0);

    const handleSelectLot = (value: number) => {
        setSelectedLot(value);
        setSelectedProduct(null); // Reset selected product when lot changes
    };

    const handleSelectProduct = (value: number) => {
        setSelectedProduct(value);
        const product = ITEM_DATA.find((p) => p.id === value);
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
                    ActualReceived: 1,
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
    };

    const handleRemoveDetail = (index: number) => {
        const updatedDetails = details.filter((_, i) => i !== index);
        setDetails(updatedDetails);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (details.length === 0) {
                message.warning("Vui lòng thêm ít nhất một sản phẩm vào chi tiết phiếu!");
                return;
            }

            for (const detail of details) {
                if (detail.ActualReceived <= 0) {
                    message.error(`Số lượng của sản phẩm "${detail.ProductName}" phải lớn hơn 0!`);
                    return;
                }
                if (!detail.StorageRoomName.trim()) {
                    message.error(`Vui lòng nhập kho hàng cho sản phẩm "${detail.ProductName}"!`);
                    return;
                }
            }

            const newNote: ReceivedNote = {
                ReceiveNoteId: Date.now(),
                ReceiveNotesCode: values.noteCode,
                PurchaseOrderId: Number(values.purchaseOrderId),
                Status: "Nhập",
                DeliveryPerson: values.deliveryPerson,
                TotalAmount: totalAmount,
                CreatedBy: "",
                CreatedDate: values.createdDate.format("YYYY-MM-DD"),
                Details: details,
            };

            handleAddNote(newNote);
            message.success("Tạo phiếu nhập kho thành công!");
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: "Tên sản phẩm", dataIndex: "ProductName", key: "ProductName" },
        { title: "Số lô", dataIndex: "LotCode", key: "LotCode" },
        {
            title: "Số lượng",
            dataIndex: "ActualReceived",
            key: "ActualReceived",
            render: (_: any, record: any, index: number) => (
                <InputNumber
                    min={1}
                    value={record.ActualReceived}
                    onChange={(value) => handleDetailChange(index, "ActualReceived", value)}
                />
            ),
        },
        { title: "Giá nhập", dataIndex: "SupplyPrice", key: "SupplyPrice" },
        {
            title: "Thành tiền",
            dataIndex: "TotalPrice",
            key: "TotalPrice",
            render: (_: any, record: any) => `${(record.ActualReceived * record.SupplyPrice).toLocaleString()} VND`,
        },
        {
            title: "Kho lưu trữ",
            dataIndex: "StorageRoomName",
            key: "StorageRoomName",
            render: (_: any, record: any, index: number) => (
                <Select
                    style={{ width: "100%" }}
                    value={record.StorageRoomName}
                    onChange={(value) => handleDetailChange(index, "StorageRoomName", value)}
                >
                    <Option value="">Chọn kho...</Option>
                    {STORAGE_ROOMS.map((room) => (
                        <Option key={room} value={room}>
                            {room}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_: any, __: any, index: number) => (
                <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveDetail(index)} />
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
            <Title level={3}>Tạo phiếu nhập kho</Title>
            <Form layout="vertical" form={form}>
                <Form.Item label="Mã phiếu" name="noteCode" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="ID Đơn hàng" name="purchaseOrderId" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Người giao hàng" name="deliveryPerson" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Ngày tạo" name="createdDate" initialValue={dayjs()} >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        disabled
                        value={dayjs()} // Luôn lấy ngày hiện tại
                    />
                </Form.Item>
            </Form>

            <Title level={5}>Chọn lô</Title>
            <Select
                placeholder="Chọn lô..."
                options={lotOptions}
                onChange={handleSelectLot}
                style={{ width: "100%", marginBottom: 8 }}
            />

            <Title level={5}>Chọn sản phẩm</Title>
            <Select
                placeholder={selectedLot ? "Chọn sản phẩm..." : "Vui lòng chọn lô trước"}
                value={selectedProduct}
                options={productOptions}
                onChange={handleSelectProduct}
                style={{ width: "100%", marginBottom: 16 }}
                disabled={!selectedLot} // Vô hiệu hóa nếu chưa chọn lô
            />

            <Table columns={columns} dataSource={details} rowKey="ReceiveNoteDetailId" />
            <Statistic title="Tổng tiền" value={totalAmount} suffix="VND" />

            <Button type="primary" onClick={handleSave}>Lưu phiếu</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => handleChangePage("Danh sách phiếu nhập")}>Hủy</Button>
        </div>
    );
};

export default AddReceivedNote;
