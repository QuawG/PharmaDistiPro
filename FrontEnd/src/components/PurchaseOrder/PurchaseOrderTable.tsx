import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Collapse, DatePicker, Dropdown, Menu, Form, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;

// Interface cho PurchaseOrder từ API
interface Supplier {
  id: number;
  supplierName: string;
  supplierCode: string;
  supplierAddress: string;
  supplierPhone: string;
  status: boolean;
  createdBy: number;
  createdDate: string;
}

interface PurchaseOrder {
  purchaseOrderId: number;
  purchaseOrderCode: string;
  supplierId: number | null;
  updatedStatusDate: string;
  totalAmount: number;
  status: number;
  createdBy: string | null;
  createDate: string;
  amountPaid: number | null;
  supplier: Supplier | null;
  products?: PurchaseOrderDetail[]; // Thêm trường products để lưu chi tiết
}

// Interface cho PurchaseOrderDetail từ API
interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unitId: number | null;
  categoryId: number;
  description: string;
  sellingPrice: number;
  createdBy: number;
  createdDate: string | null;
  status: boolean;
  vat: number;
  storageconditions: number;
  weight: number;
}

interface PurchaseOrderDetail {
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface PurchaseOrderTableProps {
  handleChangePage: (page: string, purchaseOrderId?: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (updatedOrder: PurchaseOrder) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: PurchaseOrder[]) => void;
  };
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  handleChangePage,
  onDelete,
  onUpdate,
  rowSelection,
}) => {
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [allOrders, setAllOrders] = useState<PurchaseOrder[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách đơn đặt hàng
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage nếu cần
        const response = await axios.get("http://pharmadistiprobe.fun/api/PurchaseOrders/GetPurchaseOrdersList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dữ liệu từ API PurchaseOrders:", response.data);
        setAllOrders(response.data.data || []);
        setFilteredOrders(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn đặt hàng:", error);
        message.error("Không thể tải danh sách đơn đặt hàng!");
      }
    };

    fetchPurchaseOrders();
  }, []);

  // Lọc dữ liệu
  useEffect(() => {
    let filteredData = [...allOrders];

    if (searchTerm.trim()) {
      filteredData = filteredData.filter((order) =>
        order.purchaseOrderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.supplier?.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter((order) => String(order.status) === statusFilter);
    }

    if (dateRange) {
      filteredData = filteredData.filter((order) => {
        const orderDate = new Date(order.createDate);
        return orderDate >= new Date(dateRange[0]) && orderDate <= new Date(dateRange[1]);
      });
    }

    setFilteredOrders(filteredData);
  }, [searchTerm, statusFilter, dateRange, allOrders]);

  // Lấy chi tiết đơn hàng
  const fetchOrderDetail = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://pharmadistiprobe.fun/api/PurchaseOrders/GetPurchaseOrderDetailByPoId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Chi tiết đơn hàng:", response.data);
      const orderDetails = allOrders.find((order) => order.purchaseOrderId === id);
      if (orderDetails) {
        setSelectedOrder({ ...orderDetails, products: response.data.data || [] });
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      message.error("Không thể tải chi tiết đơn hàng!");
    }
  };

  const openEditModal = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      ...order,
      date: dayjs(order.createDate),
      goodsIssueDate: dayjs(order.updatedStatusDate),
    });
    setIsEditModalOpen(true);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDonDatHang");
    XLSX.writeFile(workbook, "DanhSachDonDatHang.xlsx");
  };

  const printTable = () => {
    const selectedOrders = rowSelection?.selectedRowKeys.length
      ? filteredOrders.filter((order) => rowSelection.selectedRowKeys.includes(order.purchaseOrderId))
      : filteredOrders;

    if (selectedOrders.length === 0) {
      alert("Không có đơn hàng nào được chọn để in.");
      return;
    }

    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách đơn đặt hàng</h2>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>Nhà Cung Cấp</th>
            <th>Ngày Đặt</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          ${selectedOrders
            .map(
              (order) => `
            <tr>
              <td>${order.purchaseOrderCode}</td>
              <td>${order.supplier?.supplierName || "N/A"}</td>
              <td>${new Date(order.createDate).toLocaleDateString("vi-VN")}</td>
              <td>${order.totalAmount.toLocaleString("vi-VN")} VND</td>
              <td>${["Hủy", "Chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"][order.status] || "Không xác định"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "", "height=800,width=1000");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print</title></head><body>");
      printWindow.document.write(printContents);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const columns = [
    { title: "Mã Đơn", dataIndex: "purchaseOrderCode", key: "purchaseOrderCode" },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier: Supplier | null) => supplier?.supplierName || "N/A",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => ["Hủy", "Chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"][status] || "Không xác định",
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: PurchaseOrder) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => fetchOrderDetail(record.purchaseOrderId)}
              >
                Xem chi tiết
              </Menu.Item>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              >
                Cập nhật
              </Menu.Item>
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận xóa",
                    content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
                    onOk: () => onDelete(record.purchaseOrderId),
                  });
                }}
              >
                Xóa
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

  const handleUpdateSubmit = async (values: any) => {
    if (!selectedOrder) return;
    const updatedOrder = {
      ...selectedOrder,
      ...values,
      createDate: values.date.format("YYYY-MM-DD"),
      updatedStatusDate: values.goodsIssueDate.format("YYYY-MM-DD"),
    };
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`http://pharmadistiprobe.fun/api/PurchaseOrders/${updatedOrder.purchaseOrderId}`, updatedOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(updatedOrder);
      message.success("Cập nhật đơn hàng thành công!");
      setIsEditModalOpen(false);
      const updatedOrders = allOrders.map((order) =>
        order.purchaseOrderId === updatedOrder.purchaseOrderId ? updatedOrder : order
      );
      setAllOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      message.error("Cập nhật đơn hàng thất bại!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo mã đơn hoặc nhà cung cấp"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
          Lọc
        </Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo đơn đặt hàng(PO)")}>
          + Tạo đơn mới
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
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="">Tất cả trạng thái</Option>
                <Option value="0">Hủy</Option>
                <Option value="1">Chờ xác nhận</Option>
                <Option value="2">Xác nhận</Option>
                <Option value="3">Vận chuyển</Option>
                <Option value="4">Hoàn thành</Option>
              </Select>
              <div className="col-span-2">
                <span style={{ marginRight: 8 }}>Lọc theo ngày đặt hàng</span>
                <RangePicker
                  onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
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

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="purchaseOrderId"
        rowSelection={rowSelection}
      />

      {/* Modal Chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết Đơn hàng: ${selectedOrder?.purchaseOrderCode}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <p><strong>Mã Đơn:</strong> {selectedOrder.purchaseOrderCode}</p>
            <p><strong>Nhà Cung Cấp:</strong> {selectedOrder.supplier?.supplierName || "N/A"}</p>
            <p><strong>Ngày Đặt:</strong> {formatDate(selectedOrder.createDate)}</p>
            <p><strong>Ngày Cập Nhật Trạng Thái:</strong> {formatDate(selectedOrder.updatedStatusDate)}</p>
            <p><strong>Tổng Tiền:</strong> {selectedOrder.totalAmount.toLocaleString("vi-VN")} VND</p>
            {/* <p><strong>Số Tiền Đã Thanh Toán:</strong> {selectedOrder.amountPaid?.toLocaleString("vi-VN") || "Chưa thanh toán"} VND</p> */}
            <p><strong>Trạng Thái:</strong> {["Hủy", "Chờ xác nhận", "Xác nhận", "Vận chuyển", "Hoàn thành"][selectedOrder.status] || "Không xác định"}</p>
            <p><strong>Tạo Bởi:</strong> {selectedOrder.createdBy || "N/A"}</p>

            <h3 className="mt-4 font-semibold">Danh sách sản phẩm</h3>
            <Table
              columns={[
                { title: "Tên Sản Phẩm", dataIndex: ["product", "productName"], key: "productName" },
                { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
                {title: "amountPaid?", dataIndex:"amountPaid", key:"amountPaid"},
                // {
                //   title: "Giá Nhập",
                //   dataIndex: ["product", "sellingPrice"],
                //   key: "sellingPrice",
                //   render: (price: number) => `${price.toLocaleString("vi-VN")} VND`,
                // },
                // {
                //   title: "Thuế (VAT)",
                //   dataIndex: ["product", "vat"],
                //   key: "vat",
                //   render: (vat: number) => `${vat}%`,
                // },
                // // {
                // //   title: "Tổng Giá",
                // //   key: "total",
                // //   render: (_: any, record: PurchaseOrderDetail) =>
                // //     `${(record.quantity * record.product.sellingPrice * (1 + record.product.vat / 100)).toLocaleString("vi-VN")} VND`,
                // // },
              ]}
              dataSource={selectedOrder.products || []}
              rowKey="purchaseOrderDetailId"
              pagination={false}
            />
          </div>
        )}
      </Modal>

      {/* Modal Cập nhật đơn hàng */}
      <Modal
        title={`Cập nhật Đơn hàng: ${selectedOrder?.purchaseOrderCode}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <Form form={form} layout="vertical" onFinish={handleUpdateSubmit}>
            <Form.Item label="Mã Đơn" name="purchaseOrderCode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nhà Cung Cấp" name={["supplier", "supplierName"]}>
              <Input disabled /> {/* Nhà cung cấp chỉ hiển thị, không chỉnh sửa */}
            </Form.Item>
            <Form.Item label="Ngày Đặt" name="date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Ngày Cập Nhật Trạng Thái" name="goodsIssueDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Tổng Tiền" name="totalAmount" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Số Tiền Đã Thanh Toán" name="amountPaid">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Trạng Thái" name="status" rules={[{ required: true }]}>
              <Select>
                <Option value={0}>Hủy</Option>
                <Option value={1}>Chờ xác nhận</Option>
                <Option value={2}>Xác nhận</Option>
                <Option value={3}>Vận chuyển</Option>
                <Option value={4}>Hoàn thành</Option>
              </Select>
            </Form.Item>

            <h3 className="mt-4 font-semibold">Danh sách sản phẩm</h3>
            <Table
              columns={[
                { title: "Tên Sản Phẩm", dataIndex: ["product", "productName"], key: "productName" },
                { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
                {
                  title: "Giá Nhập",
                  dataIndex: ["product", "sellingPrice"],
                  key: "sellingPrice",
                  render: (price: number) => `${price.toLocaleString("vi-VN")} VND`,
                },
                {
                  title: "Thuế (VAT)",
                  dataIndex: ["product", "vat"],
                  key: "vat",
                  render: (vat: number) => `${vat}%`,
                },
                {
                  title: "Tổng Giá",
                  key: "total",
                  render: (_: any, record: PurchaseOrderDetail) =>
                    `${(record.quantity * record.product.sellingPrice * (1 + record.product.vat / 100)).toLocaleString("vi-VN")} VND`,
                },
              ]}
              dataSource={selectedOrder.products || []}
              rowKey="purchaseOrderDetailId"
              pagination={false}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrderTable;