import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Form, Collapse, DatePicker, Dropdown, Menu } from "antd";
const { Panel } = Collapse;
import { MoreOutlined, EditOutlined, DeleteOutlined, FilterOutlined, UnorderedListOutlined, PrinterOutlined, FileExcelOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { Dayjs } from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

declare global {
  interface Window {
    XLSX: typeof XLSX;
  }
}

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

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const OrderTable: React.FC<OrderTableProps> = ({ orders, orderDetails, onUpdate, onDelete, handleChangePage }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [minTotal, setMinTotal] = useState<number | string>("");
  const [maxTotal, setMaxTotal] = useState<number | string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders || []);
  const orderStatuses = ["Hủy", "Chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"];

  useEffect(() => {
    setFilteredOrders(orders || []);
  }, [orders]);

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  const filterOrders = () => {
    let filtered = [...(orders || [])];

    if (searchTerm.trim()) {
      const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase());
      filtered = filtered.filter((order) =>
        removeVietnameseTones(order.orderCode.toLowerCase()).includes(normalizedSearch)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (minTotal !== "" && !isNaN(Number(minTotal))) {
      filtered = filtered.filter((order) => order.totalAmount >= Number(minTotal));
    }

    if (maxTotal !== "" && !isNaN(Number(maxTotal))) {
      filtered = filtered.filter((order) => order.totalAmount <= Number(maxTotal));
    }

    if (dateRange) {
      filtered = filtered.filter((order) => {
        const createdDate = new Date(order.createdDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, minTotal, maxTotal, dateRange, orders]);

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

  const showDeleteConfirm = (order: Order) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa đơn hàng "${order.orderCode}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => onDelete(order.orderId),
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "DanhSachDonHang.xlsx");
  };

  const printTable = () => {
    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách đơn hàng</h2>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Trạng thái</th>
            <th>Khách hàng</th>
            <th>Ngày tạo</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          ${filteredOrders
        .map((order) => `
            <tr>
              <td>${order.orderCode}</td>
              <td>${order.status}</td>
              <td>${order.customerId}</td>
              <td>${new Date(order.createdDate).toLocaleDateString("vi-VN")}</td>
              <td>${order.totalAmount.toLocaleString()} VND</td>
            </tr>
          `)
        .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "", "height=800,width=1000");
    if (printWindow) {
      printWindow.document.write("<html><head>");
      printWindow.document.write("</head><body>");
      printWindow.document.write(printContents);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
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
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => openEditModal(record)}>
                <EditOutlined /> Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" onClick={() => showDeleteConfirm(record)} danger>
                <DeleteOutlined /> Xóa
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
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Tìm kiếm theo mã đơn hàng" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 200 }} />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>Lọc</Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo đơn hàng")}>
          + Tạo đơn hàng mới
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
        >
          Xuất Excel
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={printTable}
          style={{ marginLeft: 8 }}
        >
          In danh sách
        </Button>
      </div>

      {showFilters && (
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Bộ lọc nâng cao" key="1">
            <div className="grid grid-cols-3 gap-4">
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="">Chọn trạng thái</Option>
                {orderStatuses.map((status) => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo ngày tạo</span>
                <RangePicker onChange={(_: RangeValue, dateStrings: [string, string]) => setDateRange(dateStrings)} style={{ width: "100%" }} />
              </div>
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo tổng tiền</span>
                <Input.Group compact style={{ width: "100%" }}>
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={minTotal}
                    onChange={(e) => setMinTotal(e.target.value)}
                    style={{ width: "50%" }}
                  />
                  <Input
                    type="number"
                    placeholder="đến"
                    value={maxTotal}
                    onChange={(e) => setMaxTotal(e.target.value)}
                    style={{ width: "50%" }}
                  />
                </Input.Group>
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setMinTotal("");
                    setMaxTotal("");
                    setDateRange(null);
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      )}

      <div id="printableArea">
        <Table columns={columns} dataSource={filteredOrders} rowKey="orderId" />
      </div>

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
            dataSource={orderDetails?.filter((detail) => detail.orderId === selectedOrder.orderId)}
            rowKey="orderDetailId"
            pagination={false}
          />
        </Modal>
      )}
    </div>
  );
};

export default OrderTable;