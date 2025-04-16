import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";
import { useAuth } from "../../pages/Home/AuthContext";

interface Order {
  orderId: number;
  orderCode: string;
  customerId: number;
  updatedStatusDate: string;
  stockReleaseDate: string | null;
  totalAmount: number;
  status: number;
  wardCode: string;
  districtId: number;
  deliveryFee: number | null;
  address: string | null;
  confirmedBy: number;
  createdDate: string;
  assignTo: number;
  customer: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  };
  confirmBy: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
  };
}

interface OrderTableProps {
  handleChangePage: (page: string, orderId?: number) => void;
}

const OrderTableForWarehouseManager: React.FC<OrderTableProps> = ({  }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://pharmadistiprobe.fun/api/Order/GetOrderToCreateIssueNoteList", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredOrders = response.data.data.filter((order: Order) => order.assignTo === user?.customerId);
      setOrders(filteredOrders || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCreateIssueNote = async (orderId: number) => {
    Modal.confirm({
      title: "Tạo phiếu xuất kho",
      content: "Bạn có chắc chắn muốn tạo phiếu xuất kho cho đơn hàng này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            `http://pharmadistiprobe.fun/api/IssueNote/CreateIssueNote/${orderId}`, // Truyền orderId qua URL
            null, // Không cần body
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.data) {
            message.success("Tạo phiếu xuất kho thành công!");
            setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
          } else {
            message.error("Không thể tạo phiếu xuất kho!");
          }
        } catch (error: any) {
          console.error("Lỗi khi tạo phiếu xuất kho:", error);
          if (error.response?.status === 404) {
          } else {
            message.error(error.response?.data?.message || "Lỗi khi tạo phiếu xuất kho!");
          }
        }
      },
    });
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: Order["customer"]) => `${customer.firstName.trim()} ${customer.lastName}`,
    },
    {
      title: "Người xác nhận",
      dataIndex: "confirmBy",
      key: "confirmBy",
      render: (confirmBy: Order["confirmBy"]) => `${confirmBy.firstName.trim()} ${confirmBy.lastName}`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => ["Hủy", "Đang chờ thanh toán ","Đang chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"][status],
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: Order) => (
        <Button
          type="primary"
          onClick={() => handleCreateIssueNote(record.orderId)}
          disabled={record.status !== 3}
        >
          Tạo phiếu xuất kho
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng cần tạo phiếu xuất kho</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OrderTableForWarehouseManager;