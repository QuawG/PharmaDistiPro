import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  Button,
  Modal,
  Input,
  Collapse,
  DatePicker,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  EyeOutlined,
  FilterOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;

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

interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unit: string;
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
  supplyPrice: number;
  product: Product;
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
  products?: PurchaseOrderDetail[];
}

interface StockStatus {
  productId: number;
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  shortageQuantity: number;
}

interface PurchaseOrderTableProps {
  handleChangePage: (page: string, purchaseOrderId?: number) => void;
  onDelete: (id: number) => void;
  // onUpdate: (updatedOrder: PurchaseOrder) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: PurchaseOrder[]) => void;
  };
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  handleChangePage,
  rowSelection,
}) => {
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [allOrders, setAllOrders] = useState<PurchaseOrder[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStockStatusModalOpen, setIsStockStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [stockStatus, setStockStatus] = useState<StockStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Lấy danh sách đơn đặt hàng
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://pharmadistiprobe.fun/api/PurchaseOrders/GetPurchaseOrdersList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllOrders(response.data.data || []);
        setFilteredOrders(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn đặt hàng:", error);
        message.error("Không thể tải danh sách đơn đặt hàng!");
      }
    };

    fetchPurchaseOrders();
  }, []);

  // Lọc và sắp xếp dữ liệu theo ngày tạo mới nhất
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

    // Sắp xếp theo ngày tạo mới nhất
    filteredData.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());

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

  // Lấy tình trạng nhập hàng
  const fetchStockStatus = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Lấy chi tiết đơn hàng để có danh sách sản phẩm đầy đủ
      const orderResponse = await axios.get(`http://pharmadistiprobe.fun/api/PurchaseOrders/GetPurchaseOrderDetailByPoId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderDetails = orderResponse.data.data || [];
      const order = allOrders.find((o) => o.purchaseOrderId === id);

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng!");
      }

      let fullStockStatus: StockStatus[];

      // Nếu đơn hàng đã hoàn thành (status = 3), tất cả sản phẩm phải có shortageQuantity = 0
      if (order.status === 3) {
        fullStockStatus = orderDetails.map((detail: PurchaseOrderDetail) => ({
          productId: detail.productId,
          productName: detail.product.productName,
          orderedQuantity: detail.quantity,
          receivedQuantity: detail.quantity, // Đã hoàn thành nên nhận đủ
          shortageQuantity: 0,
        }));
      } else {
        // Lấy tình trạng nhập hàng cho các trạng thái khác
        const stockResponse = await axios.get(`http://pharmadistiprobe.fun/api/PurchaseOrders/CheckReceivedStockStatus/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const stockData = stockResponse.data.data || [];

        // Tạo danh sách đầy đủ các sản phẩm từ chi tiết đơn hàng
        fullStockStatus = orderDetails.map((detail: PurchaseOrderDetail) => {
          const stockItem = stockData.find((item: StockStatus) => item.productId === detail.productId) || {
            productId: detail.productId,
            productName: detail.product.productName,
            orderedQuantity: detail.quantity,
            receivedQuantity: 0,
            shortageQuantity: detail.quantity,
          };

          return {
            productId: detail.productId,
            productName: detail.product.productName,
            orderedQuantity: detail.quantity,
            receivedQuantity: stockItem.receivedQuantity,
            shortageQuantity: detail.quantity - stockItem.receivedQuantity,
          };
        });
      }

      setStockStatus(fullStockStatus);
      setIsStockStatusModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy tình trạng nhập hàng:", error);
      message.error("Không thể tải tình trạng nhập hàng!");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order) => ({
        "Mã Đơn": order.purchaseOrderCode,
        "Nhà Cung Cấp": order.supplier?.supplierName || "N/A",
        "Ngày Đặt": new Date(order.createDate).toLocaleDateString("vi-VN"),
        "Tổng Tiền": order.totalAmount,
        "Trạng Thái": ["Hủy", "Chờ nhập hàng", "Thiếu hàng", "Hoàn thành"][order.status] || "Không xác định",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDonDatHang");
    XLSX.writeFile(workbook, "DanhSachDonDatHang.xlsx");
  };

  const printTable = () => {
    const selectedOrders = rowSelection?.selectedRowKeys.length
      ? filteredOrders.filter((order) => rowSelection.selectedRowKeys.includes(order.purchaseOrderId))
      : filteredOrders;

    if (selectedOrders.length === 0) {
      message.error("Không có đơn hàng nào được chọn để in.");
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
              <td>${["Hủy", "Chờ nhập hàng", "Thiếu hàng", "Hoàn thành"][order.status] || "Không xác định"}</td>
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
      render: (status: number) => ["Hủy", "Chờ nhập hàng", "Thiếu hàng", "Hoàn thành"][status] || "Không xác định",
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
          placeholder="Tìm kiếm theo mã đơn hoặc nhà cung cấp"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
          Lọc
        </Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo đơn đặt hàng(PO)")} className="bg-blue-500">
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
                allowClear
              >
                <Option value="">Tất cả trạng thái</Option>
                <Option value="0">Hủy</Option>
                <Option value="1">Chờ nhập hàng</Option>
                <Option value="2">Thiếu hàng</Option>
                <Option value="3">Hoàn thành</Option>
              </Select>
              <div className="col-span-2">
                <span style={{ marginRight: 8 }}>Lọc theo ngày đặt hàng</span>
                <RangePicker
                  onChange={(_, dateStrings) => setDateRange(dateStrings.length === 2 ? (dateStrings as [string, string]) : null)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setDateRange(null);
                    setFilteredOrders(allOrders);
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
        title={
          <div className="text-xl font-semibold text-gray-800">
            Chi tiết Đơn hàng: {selectedOrder?.purchaseOrderCode}
          </div>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="checkStock"
            type="primary"
            onClick={() => selectedOrder && fetchStockStatus(selectedOrder.purchaseOrderId)}
            className="bg-blue-500"
          >
            Kiểm tra tình trạng nhập hàng
          </Button>,
        ]}
        width={900}
        centered
        bodyStyle={{ padding: "24px", background: "#f9fafb" }}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Thông tin chung</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã Đơn</p>
                  <p className="text-base font-medium">{selectedOrder.purchaseOrderCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nhà Cung Cấp</p>
                  <p className="text-base font-medium">{selectedOrder.supplier?.supplierName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày Đặt</p>
                  <p className="text-base font-medium">{formatDate(selectedOrder.createDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày Cập Nhật Trạng Thái</p>
                  <p className="text-base font-medium">{formatDate(selectedOrder.updatedStatusDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng Tiền</p>
                  <p className="text-base font-medium text-green-600">
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng Thái</p>
                  <p className="text-base font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        selectedOrder.status === 0
                          ? "bg-red-100 text-red-600"
                          : selectedOrder.status === 1
                          ? "bg-yellow-100 text-yellow-600"
                          : selectedOrder.status === 2
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {["Hủy", "Chờ nhập hàng", "Thiếu hàng", "Hoàn thành"][selectedOrder.status] || "Không xác định"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tạo Bởi</p>
                  <p className="text-base font-medium">{selectedOrder.createdBy || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Chi tiết đơn đặt hàng</h3>
              <Table
                columns={[
                  {
                    title: "Tên Sản Phẩm",
                    dataIndex: ["product", "productName"],
                    key: "productName",
                  },
                  {
                    title: "Số Lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                    render: (quantity: number) => quantity.toLocaleString("vi-VN"),
                  },
                  {
                    title: "Giá Nhập (VND)",
                    dataIndex: "supplyPrice",
                    key: "supplyPrice",
                    render: (price: number) => price.toLocaleString("vi-VN"),
                  },
                  {
                    title: "Thành Tiền (VND)",
                    key: "total",
                    render: (_: any, record: PurchaseOrderDetail) =>
                      (record.quantity * record.supplyPrice).toLocaleString("vi-VN"),
                  },
                ]}
                dataSource={selectedOrder.products || []}
                rowKey="purchaseOrderDetailId"
                pagination={false}
                bordered
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Tình trạng nhập hàng */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800">
            Tình trạng nhập hàng: {selectedOrder?.purchaseOrderCode}
          </div>
        }
        open={isStockStatusModalOpen}
        onCancel={() => setIsStockStatusModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsStockStatusModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
        centered
        bodyStyle={{ padding: "24px", background: "#f9fafb" }}
      >
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Chi tiết tình trạng nhập hàng</h3>
          <Table
            columns={[
              {
                title: "Tên Sản Phẩm",
                dataIndex: "productName",
                key: "productName",
              },
              {
                title: "Số Lượng Đặt",
                dataIndex: "orderedQuantity",
                key: "orderedQuantity",
                render: (quantity: number) => quantity.toLocaleString("vi-VN"),
              },
              {
                title: "Số Lượng Đã Nhận",
                dataIndex: "receivedQuantity",
                key: "receivedQuantity",
                render: (quantity: number) => quantity.toLocaleString("vi-VN"),
              },
              {
                title: "Số Lượng Còn Thiếu",
                dataIndex: "shortageQuantity",
                key: "shortageQuantity",
                render: (quantity: number) => (
                  <span className={quantity > 0 ? "text-red-600" : "text-green-600"}>
                    {quantity.toLocaleString("vi-VN")}
                  </span>
                ),
              },
            ]}
            dataSource={stockStatus}
            rowKey="productId"
            pagination={false}
            bordered
            className="rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default PurchaseOrderTable;