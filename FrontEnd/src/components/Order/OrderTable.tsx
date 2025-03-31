import React, { useState } from "react";
import { Table, Dropdown, Button, Modal, Input, Form, Select } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Order {
  orderId: number;
  orderCode: string;
  customerId: number;
  updatedStatusDate: Date;
  stockReleaseDate: Date;
  totalAmount: number;
  status: string;
  deliveryFee: number;
  address: string;
  confirmedBy?: number;
  createdDate: Date;
  assignTo?: number;
}

interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderTableProps {
  orders?: Order[];
  orderDetails?: OrderDetail[];
  handleChangePage: (page: string, orderId?: number) => void;
  onUpdate: (updatedOrder: Order) => void;
  onDelete: (orderId: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, orderDetails, onUpdate, onDelete }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const orderStatuses = ["Hủy", "Chờ xác nhận", "Đã xác nhận", "Chờ lấy hàng", "Vận chuyển", "Hoàn thành"];

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    form.setFieldsValue(order);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedOrder(null);
    setIsEditModalOpen(false);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (selectedOrder) {
        const updatedOrder = { ...selectedOrder, ...values };
        onUpdate(updatedOrder);
        closeEditModal();
      }
    });
  };

  const handleDelete = (orderId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => onDelete(orderId),
    });
  };

  const handleStatusChange = (order: Order, newStatus: string) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có chắc chắn muốn đổi trạng thái đơn hàng sang '${newStatus}'?`,
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => onUpdate({ ...order, status: newStatus }),
    });
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
    { title: "Số sản phẩm", dataIndex: "productCount", key: "productCount" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => (
        <Select value={status} onChange={(newStatus) => handleStatusChange(record, newStatus)}>
          {orderStatuses.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      ),
    },
    { title: "Khách hàng", dataIndex: "customerId", key: "customerId" },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: Date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: <UnorderedListOutlined />,
      key: "actions",
      render: (_: any, record: Order) => (
        <Dropdown menu={{
          items: [
            { key: "edit", label: "Chỉnh sửa", icon: <EditOutlined />, onClick: () => openEditModal(record) },
            { key: "delete", label: "Xóa", icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(record.orderId) },
          ]
        }} trigger={["click"]}>
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={orders} rowKey="orderId" />

      {selectedOrder && (
        <Modal
          title={`Chỉnh Sửa Đơn Hàng: ${selectedOrder.orderCode}`}
          open={isEditModalOpen}
          onCancel={closeEditModal}
          onOk={handleSave}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Mã đơn hàng" name="orderCode">
              <Input />
            </Form.Item>
            <Form.Item label="Trạng thái" name="status">
              <Input />
            </Form.Item>
            <Form.Item label="Khách hàng" name="customerId">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Tổng tiền" name="totalAmount">
              <Input type="number" />
            </Form.Item>
          </Form>

          <Table
            title={() => "Chi tiết đơn hàng"}
            columns={[
              { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
              { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
              { title: "Giá bán", dataIndex: "price", key: "price", render: (price: number) => `${price.toLocaleString()} VND` },
              { title: "Tổng giá", key: "total", render: (record: OrderDetail) => `${(record.quantity * record.price).toLocaleString()} VND` },
            ]}
            dataSource={orderDetails?.filter(detail => detail.orderId === selectedOrder.orderId)}
            rowKey="orderDetailId"
            pagination={false}
          />
        </Modal>
      )}
    </>
  );
};

export default OrderTable;