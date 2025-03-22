import React, { useState } from "react";
import { Table, Dropdown, Button, Modal, Input, Form } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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

// interface OrderDetail {
//     orderDetailId: number;
//     orderId: number;
//     productId: number;
//     quantity: number;
//   }

interface OrderTableProps {
  orders?: Order[];
  handleChangePage: (page: string, orderId?: number) => void;
  onUpdate: (updatedOrder: Order) => void;
  onDelete: (orderId: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onUpdate, onDelete }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

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

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Khách hàng", dataIndex: "customerId", key: "customerId" },
    { 
      title: "Ngày tạo", 
      dataIndex: "createdDate", 
      key: "createdDate", 
      render: (date: Date) => new Date(date).toLocaleDateString("vi-VN") 
    },
    { 
      title: "Tổng tiền", 
      dataIndex: "totalAmount", 
      key: "totalAmount", 
      render: (amount: number) => `${amount.toLocaleString()} VND` 
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Order) => {
        const menuItems = [
          {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <EditOutlined />,
            onClick: () => openEditModal(record),
          },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.orderId),
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
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
        </Modal>
      )}
    </>
  );
};

export default OrderTable;
