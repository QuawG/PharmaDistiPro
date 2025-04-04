// src/components/Order/OrderTable.tsx
import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Collapse, DatePicker, Dropdown, Menu, message } from "antd";
import { MoreOutlined, EyeOutlined, FilterOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";


const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  confirmedBy: number | null;
  createdDate: string;
  assignTo: number | null;
  customer: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  };
}

interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  product: {
    productId: number;
    productCode: string;
    manufactureName: string;
    productName: string;
    sellingPrice: number;
    description: string;
    vat: number;
  };
}

interface OrderTableProps {
  orders: Order[];
  handleChangePage: (page: string, orderId?: number) => void;
  onUpdate: (updatedOrder: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, handleChangePage, onUpdate }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const orderStatuses = ["Hủy", "Chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"];

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  useEffect(() => {
    let filtered = [...orders];
    if (searchTerm.trim()) {
      const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase());
      filtered = filtered.filter((order) =>
        removeVietnameseTones(order.orderCode.toLowerCase()).includes(normalizedSearch)
      );
    }
    if (statusFilter !== null) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (dateRange) {
      filtered = filtered.filter((order) => {
        const createdDate = new Date(order.createdDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, dateRange, orders]);

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://pharmadistiprobe.fun/api/Order/GetOrdersDetailByOrderId/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails(response.data.data || []);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      message.error("Không thể lấy chi tiết đơn hàng!");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `http://pharmadistiprobe.fun/api/Order/UpdateOrderStatus/${orderId}/0`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        message.success("Hủy đơn hàng thành công!");
        onUpdate({ ...selectedOrder!, status: 0 });
        setFilteredOrders((prev) =>
          prev.map((order) => (order.orderId === orderId ? { ...order, status: 0 } : order))
        );
      } else {
        message.error(response.data.message || "Không thể hủy đơn hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      message.error("Lỗi khi hủy đơn hàng!");
    }
  };

  const showCancelConfirm = (order: Order) => {
    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn hủy đơn hàng "${order.orderCode}" không?`,
      okText: "Hủy đơn hàng",
      okType: "danger",
      cancelText: "Thoát",
      onOk: () => handleCancelOrder(order.orderId),
    });
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => orderStatuses[status],
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: Order["customer"]) => `${customer.firstName} ${customer.lastName}`,
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
      title: "",
      key: "actions",
      render: (_: any, record: Order) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                onClick={() => {
                  setSelectedOrder(record);
                  fetchOrderDetails(record.orderId);
                }}
              >
                <EyeOutlined /> Xem chi tiết
              </Menu.Item>
              {record.status === 1 && (
                <Menu.Item key="cancel" onClick={() => showCancelConfirm(record)} danger>
                  <ExclamationCircleOutlined /> Hủy đơn hàng
                </Menu.Item>
              )}
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
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
          Lọc
        </Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo đơn hàng")}>
          + Tạo đơn hàng mới
        </Button>
      </div>

      {showFilters && (
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Bộ lọc nâng cao" key="1">
            <div className="grid grid-cols-3 gap-4">
              <Select
                placeholder="Chọn trạng thái"
                value={statusFilter ?? undefined}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "100%" }}
                allowClear
              >
                {orderStatuses.map((status, index) => (
                  <Option key={index} value={index}>
                    {status}
                  </Option>
                ))}
              </Select>
              <div className="col-span-3">
                <span style={{ marginRight: 8 }}>Lọc theo ngày tạo:</span>
                <RangePicker
                  onChange={(_, dateStrings) =>
                    setDateRange(dateStrings.length === 2 ? (dateStrings as [string, string]) : null)
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-span-3">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter(null);
                    setDateRange(null);
                  }}
                  style={{ width: "100%" }}
                  danger
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      )}

      <Table columns={columns} dataSource={filteredOrders} rowKey="orderId" />

      {selectedOrder && (
        <Modal
          title={`Chi tiết đơn hàng: ${selectedOrder.orderCode}`}
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={null}
          width={800}
        >
          <Table
            columns={[
              { title: "Tên sản phẩm", dataIndex: ["product", "productName"], key: "productName" },
              { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
              {
                title: "Giá bán",
                dataIndex: ["product", "sellingPrice"],
                key: "sellingPrice",
                render: (price: number) => `${price.toLocaleString()} VND`,
              },
              {
                title: "Tổng giá",
                key: "total",
                render: (record: OrderDetail) => `${(record.quantity * record.product.sellingPrice).toLocaleString()} VND`,
              },
            ]}
            dataSource={orderDetails}
            rowKey="orderDetailId"
            pagination={false}
          />
        </Modal>
      )}
    </div>
  );
};

export default OrderTable;