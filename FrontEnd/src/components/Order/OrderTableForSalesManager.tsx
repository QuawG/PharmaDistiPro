// src/components/Order/OrderTableForSalesManager.tsx
import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Collapse, Dropdown, Menu, message, Input, DatePicker } from "antd";
import { MoreOutlined, EyeOutlined, CheckOutlined, FilterOutlined,  SearchOutlined, CloseOutlined } from "@ant-design/icons";
// import * as XLSX from "xlsx";
import axios from "axios";
// import { useAuth } from "../../pages/Home/AuthContext"; // Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn
import Cookies from "js-cookie";
// import { Dayjs } from "dayjs";

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
}

const OrderTableForSalesManager: React.FC<OrderTableProps> = ({ orders,  }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [customerFilter, setCustomerFilter] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Thêm trạng thái cho ô tìm kiếm
  const orderStatuses = ["Hủy","Đang chờ Thanh Toán", "Đang chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"];
  // const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const accessToken = Cookies.get("token") || localStorage.getItem("accessToken"); // Lấy token từ cookies hoặc localStorage

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  // Hàm loại bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // Lọc đơn hàng dựa trên các tiêu chí
  useEffect(() => {
    let filtered = [...orders];

    // Lọc theo ô tìm kiếm (mã đơn hàng)
    if (searchTerm.trim()) {
      const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase());
      filtered = filtered.filter((order) =>
        removeVietnameseTones(order.orderCode.toLowerCase()).includes(normalizedSearch)
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== null) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Lọc theo khách hàng
    if (customerFilter !== null) {
      filtered = filtered.filter((order) => order.customerId === customerFilter);
    }

    // Lọc theo khoảng ngày
    if (dateRange) {
      filtered = filtered.filter((order) => {
        const createdDate = new Date(order.createdDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }

    // Lọc theo khoảng giá
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((order) =>
        (isNaN(min) || order.totalAmount >= min) && (isNaN(max) || order.totalAmount <= max)
      );
    }
    filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, customerFilter, dateRange, priceRange, orders]);

  const handleConfirmOrder = async (orderId: number) => {
    try {
      const response = await axios.put(
        `http://pharmadistiprobe.fun/api/Order/ConfirmOrder/${orderId}`,
        {}, // Body request nếu API yêu cầu
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // Thêm token vào header
          },
        }
      );
      
      if (response.status === 200 || response.data.success) {
        message.success("Xác nhận đơn hàng thành công!");
        setFilteredOrders((prev) =>
          prev.map((order) => 
            order.orderId === orderId ? { ...order, status: 2 } : order
          )
        );
      } else {
        message.error(response.data.message || "Không thể xác nhận đơn hàng!");
      }
    } catch (error: any) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        // Có thể gọi logout() từ useAuth tại đây nếu muốn
      } else {
        message.error(error.response?.data?.message || "Lỗi khi xác nhận đơn hàng!");
      }
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    try {
      const response = await axios.put(
        `http://pharmadistiprobe.fun/api/Order/UpdateOrderStatus/${orderId}/5`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 200 || response.data.success) {
        message.success("Hoàn thành đơn hàng thành công!");
        setFilteredOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: 5 } : order
          )
        );
      } else {
        message.error(response.data.message || "Không thể hoàn thành đơn hàng!");
      }
    } catch (error: any) {
      console.error("Lỗi khi hoàn thành đơn hàng:", error);
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else {
        message.error(error.response?.data?.message || "Lỗi khi hoàn thành đơn hàng!");
      }
    }
  };
  
  const showCompleteModal = (orderId: number) => {
    Modal.confirm({
      title: "Hoàn thành đơn hàng",
      content: "Bạn có chắc chắn muốn hoàn thành đơn hàng này không?",
      okText: "Xác nhận hoàn thành",
      cancelText: "Hủy",
      onOk: () => handleCompleteOrder(orderId),
    });
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await axios.put(
        `http://pharmadistiprobe.fun/api/Order/UpdateOrderStatus/${orderId}/0`, // Cập nhật endpoint đúng
        {}, // Body request (có thể không cần nếu API chỉ dùng query params)
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 200 || response.data.success) {
        message.success("Hủy đơn hàng thành công!");
        setFilteredOrders((prev) =>
          prev.map((order) => 
            order.orderId === orderId ? { ...order, status: 0 } : order
          )
        );
      } else {
        message.error(response.data.message || "Không thể hủy đơn hàng!");
      }
    } catch (error: any) {
      console.error("Lỗi khi hủy đơn hàng:", error.response ? error.response.data : error.message);
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else if (error.response?.status === 400) {
        message.error(error.response.data.message || "Yêu cầu không hợp lệ!");
      } else if (error.response?.status === 404) {
        message.error("Không tìm thấy đơn hàng hoặc endpoint!");
      } else {
        message.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng!");
      }
    }
  };

  const showCancelModal = (orderId: number) => {
    Modal.confirm({
      title: "Hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      okText: "Xác nhận hủy",
      cancelText: "Không",
      okType: "danger", // Nút xác nhận có màu đỏ
      onOk: () => handleCancelOrder(orderId),
    });
  };

  const showConfirmModal = (orderId: number) => {
    Modal.confirm({
      title: "Xác nhận đơn hàng",
      content: "Bạn có chắc chắn muốn xác nhận đơn hàng này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => handleConfirmOrder(orderId),
    });
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await axios.get(`http://pharmadistiprobe.fun/api/Order/GetOrdersDetailByOrderId/${orderId}`);
      setOrderDetails(response.data.data || []);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      message.error("Không thể lấy chi tiết đơn hàng!");
    }
  };

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map((order) => ({
  //     "Mã đơn hàng": order.orderCode,
  //     "Trạng thái": orderStatuses[order.status],
  //     "Khách hàng": ` ${order.customer.lastName}`,
  //     "Ngày tạo": new Date(order.createdDate).toLocaleDateString("vi-VN"),
  //     "Tổng tiền": order.totalAmount,
  //   })));
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  //   XLSX.writeFile(workbook, "DanhSachDonHang_SalesManager.xlsx");
  // };

  // const printTable = () => {
  //   const printContents = `
  //     <div style="text-align: center; margin-bottom: 20px;">
  //       <h2>Danh sách đơn hàng</h2>
  //     </div>
  //     <table border="1" style="width: 100%; border-collapse: collapse;">
  //       <thead>
  //         <tr>
  //           <th>Mã đơn hàng</th>
  //           <th>Trạng thái</th>
  //           <th>Khách hàng</th>
  //           <th>Ngày tạo</th>
  //           <th>Tổng tiền</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         ${filteredOrders
  //           .map((order) => `
  //             <tr>
  //               <td>${order.orderCode}</td>
  //               <td>${orderStatuses[order.status]}</td>
  //               <td>${order.customer.firstName} ${order.customer.lastName}</td>
  //               <td>${new Date(order.createdDate).toLocaleDateString("vi-VN")}</td>
  //               <td>${order.totalAmount.toLocaleString()} VND</td>
  //             </tr>
  //           `)
  //           .join("")}
  //       </tbody>
  //     </table>
  //   `;

  //   const printWindow = window.open("", "", "height=800,width=1000");
  //   if (printWindow) {
  //     printWindow.document.write("<html><head>");
  //     printWindow.document.write("</head><body>");
  //     printWindow.document.write(printContents);
  //     printWindow.document.write("</body></html>");
  //     printWindow.document.close();
  //     printWindow.print();
  //   }
  // };

  const resetFilters = () => {
    setSearchTerm(""); // Reset ô tìm kiếm
    setStatusFilter(null);
    setCustomerFilter(null);
    setDateRange(null);
    setPriceRange(null);
    setFilteredOrders(orders);
    message.success("Đã xóa tất cả bộ lọc!");
  };

  // Lấy danh sách khách hàng duy nhất từ orders
  const uniqueCustomers = Array.from(
    new Map(orders.map((order) => [order.customerId, order.customer])).values()
  );

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
      render: (customer: Order["customer"]) => ` ${customer.lastName}`,
    },
    {
      title: "Ngày tạo đơn hàng",
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
              <Menu.Item key="view" onClick={() => { setSelectedOrder(record); fetchOrderDetails(record.orderId); }}>
                <EyeOutlined /> Xem chi tiết
              </Menu.Item>
              {record.status === 2 && (
                <Menu.Item key="confirm" onClick={() => showConfirmModal(record.orderId)}>
                  <CheckOutlined /> Xác nhận
                </Menu.Item>
              )}
              {record.status === 4 && (
                <Menu.Item key="complete" onClick={() => showCompleteModal(record.orderId)}>
                  <CheckOutlined /> Hoàn thành
                </Menu.Item>
              )}
              {record.status <= 3 && (
                <Menu.Item key="cancel" onClick={() => showCancelModal(record.orderId)}>
                  <CloseOutlined /> Hủy đơn hàng
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
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          allowClear
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>Lọc</Button>
        {/* <Button type="primary" onClick={() => handleChangePage("Tạo đơn hàng")}>
          + Tạo đơn hàng mới
        </Button>
        <Button type="primary" icon={<FileExcelOutlined />} onClick={exportToExcel} style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}>
          Xuất Excel
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={printTable} style={{ marginLeft: 8 }}>
          In danh sách
        </Button> */}
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
                  <Option key={index} value={index}>{status}</Option>
                ))}
              </Select>

              <Select
                placeholder="Chọn khách hàng"
                value={customerFilter ?? undefined}
                onChange={(value) => setCustomerFilter(value)}
                style={{ width: "100%" }}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                }
              >
                {uniqueCustomers.map((customer) => (
                  <Option key={customer.userId} value={customer.userId}>
                    {`${customer.firstName} ${customer.lastName}`}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Chọn khoảng giá"
                value={priceRange ?? undefined}
                onChange={(value) => setPriceRange(value)}
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="0-100000">Dưới 100k</Option>
                <Option value="100000-500000">100k - 500k</Option>
                <Option value="0-500000">Dưới 500k</Option>
                <Option value="500000-1000000">500k - 1 triệu</Option>
                <Option value="1000000-5000000">1 triệu - 5 triệu</Option>
                <Option value="5000000-">Trên 5 triệu</Option>
              </Select>

              <div className="col-span-3">
                <span style={{ marginRight: 8 }}>Lọc theo ngày tạo:</span>
                <RangePicker
                  onChange={(_, dateStrings) => setDateRange(dateStrings.length === 2 ? dateStrings as [string, string] : null)}
                  style={{ width: "100%" }}
                />
              </div>

              <div className="col-span-3">
                <Button onClick={resetFilters} style={{ width: "100%" }} danger>
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
                key: "price",
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

export default OrderTableForSalesManager;