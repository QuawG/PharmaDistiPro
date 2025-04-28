import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Collapse, DatePicker, Dropdown, notification } from "antd";
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

interface ProductLot {
  id: number;
  lotId: number;
  productId: number;
  quantity: number | null;
  manufacturedDate: string;
  expiredDate: string;
  supplyPrice: number | null;
  status: 0 | 1 | 2 | null; // 0: Ngừng bán, 1: Còn hạn, 2: Ưu tiên xuất
  productName: string;
  lotCode: string;
  unit: string;
  storageRoomId: number;
}

interface Product {
  productId: number;
  productName: string;
  unit: string;
  [key: string]: any;
}

interface Lot {
  lotId: number;
  lotCode: string;
  createdBy: string | null;
  createdDate: string | null;
  productLots: ProductLot[];
}

interface LotTableProps {
  handleChangePage: (page: string, lotId?: number) => void;
  onDelete: (id: number) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductLot[]) => void;
  };
}

const LotTable: React.FC<LotTableProps> = ({
  // handleChangePage,
  rowSelection,
}) => {
  const [filteredLots, setFilteredLots] = useState<ProductLot[]>([]);
  const [allLots, setAllLots] = useState<ProductLot[]>([]);
  const [lotCodes, setLotCodes] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ProductLot | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [remainingDaysFilter, setRemainingDaysFilter] = useState<string>("");
  const [lotCodeFilter, setLotCodeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [prevLots, setPrevLots] = useState<ProductLot[]>([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusModalLots, setStatusModalLots] = useState<ProductLot[]>([]);
  const [statusModalTitle, setStatusModalTitle] = useState<string>("");

  // Hàm ánh xạ trạng thái thành văn bản
  const getStatusText = (status: 0 | 1 | 2 | null) => {
    switch (status) {
      case 0:
        return "Ngừng bán";
      case 1:
        return "Còn hạn";
      case 2:
        return "Ưu tiên xuất";
      default:
        return "Không xác định";
    }
  };

  const fetchData = async () => {
    try {
      // Fetch ProductLots
      const lotResponse = await axios.get("http://pharmadistiprobe.fun/api/ProductLot");
      const productLots = lotResponse.data.data || [];

      // Fetch Products to get unit
      const productResponse = await axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct");
      const products = productResponse.data.data || [];

      // Map products to a lookup object
      const productMap = products.reduce((acc: { [key: number]: Product }, product: Product) => {
        acc[product.productId] = product;
        return acc;
      }, {});

      // Merge unit into ProductLots
      const validLots = productLots.map((lot: ProductLot) => {
        const product = productMap[lot.productId];
        return {
          ...lot,
          quantity: lot.quantity ?? 0,
          supplyPrice: lot.supplyPrice ?? 0,
          productName: lot.productName || "Không xác định",
          lotCode: lot.lotCode || "N/A",
          unit: product?.unit || "N/A",
        };
      });

      // Kiểm tra thay đổi trạng thái
      if (prevLots.length > 0) {
        validLots.forEach((newLot: ProductLot) => {
          const prevLot = prevLots.find((lot: ProductLot) => lot.id === newLot.id);
          if (prevLot && prevLot.status !== newLot.status) {
            notification.info({
              message: "Thay đổi trạng thái",
              description: (
                <div>
                  Lô <strong>{newLot.lotCode}</strong> đã đổi trạng thái thành{" "}
                  <strong>{getStatusText(newLot.status)}</strong>.
                  <br />
                  <Button
                    type="link"
                    onClick={() => {
                      setStatusModalLots(
                        validLots.filter((lot: ProductLot) => lot.status === newLot.status)
                      );
                      setStatusModalTitle(`Danh sách lô: ${getStatusText(newLot.status)}`);
                      setIsStatusModalOpen(true);
                    }}
                    style={{ padding: 0, marginTop: 8 }}
                  >
                    Xem danh sách
                  </Button>
                </div>
              ),
              duration: 5,
            });
          }
        });
      }

      setPrevLots(validLots);
      setAllLots(validLots);
      setFilteredLots(validLots);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm trong lô hoặc sản phẩm:", error);
    }

    try {
      // Fetch Lot Codes
      const lotResponse = await axios.get("http://pharmadistiprobe.fun/api/Lot");
      let lotCodesArray: string[] = [];
      if (Array.isArray(lotResponse.data)) {
        lotCodesArray = lotResponse.data.map((lot: Lot) => lot.lotCode || "N/A");
      } else if (lotResponse.data && Array.isArray(lotResponse.data.data)) {
        lotCodesArray = lotResponse.data.data.map((lot: Lot) => lot.lotCode || "N/A");
      }
      setLotCodes(lotCodesArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mã lô:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateStopSellingDate = (expiredDate: string) => {
    const date = new Date(expiredDate);
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split("T")[0];
  };

  const calculateRemainingDays = (manufacturedDate: string, expiredDate: string) => {
    const stopSellingDate = new Date(calculateStopSellingDate(expiredDate));
    const manufactured = new Date(manufacturedDate);
    const daysLeft = Math.floor((stopSellingDate.getTime() - manufactured.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft < 0 ? 0 : daysLeft;
  };

  const formatRemainingDays = (manufacturedDate: string, expiredDate: string) => {
    const daysLeft = calculateRemainingDays(manufacturedDate, expiredDate);
    const months = Math.floor(daysLeft / 30);
    const remainingDays = daysLeft % 30;
    return `${months} tháng ${remainingDays} ngày`;
  };

  useEffect(() => {
    let filteredData = [...allLots];

    if (searchTerm.trim()) {
      filteredData = filteredData.filter((lot: ProductLot) =>
        lot.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter((lot: ProductLot) => String(lot.status) === statusFilter);
    }

    if (priceFilter) {
      filteredData = filteredData.filter((lot: ProductLot) => {
        const price = lot.supplyPrice || 0;
        switch (priceFilter) {
          case "0-100000":
            return price >= 0 && price <= 100000;
          case "100000-200000":
            return price > 100000 && price <= 200000;
          case "200000+":
            return price > 200000;
          default:
            return true;
        }
      });
    }

    if (remainingDaysFilter) {
      filteredData = filteredData.filter((lot: ProductLot) => {
        const remainingDays = calculateRemainingDays(lot.manufacturedDate, lot.expiredDate);
        switch (remainingDaysFilter) {
          case "0-30":
            return remainingDays >= 0 && remainingDays <= 30;
          case "30-90":
            return remainingDays > 30 && remainingDays <= 90;
          case "90+":
            return remainingDays > 90;
          default:
            return true;
        }
      });
    }

    if (lotCodeFilter) {
      filteredData = filteredData.filter((lot: ProductLot) => lot.lotCode === lotCodeFilter);
    }

    if (dateRange) {
      filteredData = filteredData.filter((lot: ProductLot) => {
        const createdDate = new Date(lot.manufacturedDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }

    setFilteredLots(filteredData);
  }, [searchTerm, statusFilter, priceFilter, remainingDaysFilter, lotCodeFilter, dateRange, allLots]);

  const fetchLotDetail = async (id: number) => {
    try {
      const [lotResponse, productResponse] = await Promise.all([
        axios.get(`http://pharmadistiprobe.fun/api/ProductLot/${id}`),
        axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct"),
      ]);

      const lot = lotResponse.data.data;
      const products = productResponse.data.data || [];
      const product = products.find((p: Product) => p.productId === lot.productId);

      setSelectedLot({
        ...lot,
        quantity: lot.quantity ?? 0,
        supplyPrice: lot.supplyPrice ?? 0,
        productName: lot.productName || "Không xác định",
        lotCode: lot.lotCode || "N/A",
        unit: product?.unit || "N/A",
      });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lô hoặc sản phẩm:", error);
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredLots.map((lot: ProductLot) => ({
      "Mã Lô": lot.lotCode,
      "Tên Sản Phẩm": lot.productName,
      "Số Lượng": lot.quantity ?? 0,
      "Giá Nhập": (lot.supplyPrice ?? 0).toLocaleString("vi-VN"),
      "Số Ngày Còn Hạn": formatRemainingDays(lot.manufacturedDate, lot.expiredDate),
      "Ngày Sản Xuất": new Date(lot.manufacturedDate).toLocaleDateString("vi-VN"),
      "Đơn Vị Tính": lot.unit,
      "Trạng Thái": getStatusText(lot.status),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachLoHang");
    XLSX.writeFile(workbook, "DanhSachLoHang.xlsx");
  };

  const printTable = () => {
    const selectedLots = rowSelection?.selectedRowKeys.length
      ? filteredLots.filter((lot: ProductLot) => rowSelection.selectedRowKeys.includes(lot.id))
      : filteredLots;

    if (selectedLots.length === 0) {
      alert("Không có lô hàng nào được chọn để in.");
      return;
    }

    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách lô hàng</h2>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Mã Lô</th>
            <th>Tên Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Giá Nhập</th>
            <th>Số Ngày Còn Hạn</th>
            <th>Ngày Sản Xuất</th>
            <th>Đơn Vị Tính</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          ${selectedLots
            .map(
              (lot: ProductLot) => `
            <tr>
              <td>${lot.lotCode}</td>
              <td>${lot.productName}</td>
              <td style="text-align: right;">${(lot.quantity ?? 0).toLocaleString()}</td>
              <td style="text-align: right;">${(lot.supplyPrice ?? 0).toLocaleString("vi-VN")} VND</td>
              <td>${formatRemainingDays(lot.manufacturedDate, lot.expiredDate)}</td>
              <td>${new Date(lot.manufacturedDate).toLocaleDateString("vi-VN")}</td>
              <td>${lot.unit}</td>
              <td>${getStatusText(lot.status)}</td>
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
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "N/A";

  const columns = [
    {
      title: "Mã Lô",
      dataIndex: "lotCode",
      key: "lotCode",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "right" as const,
      width: 100,
      sorter: (a: ProductLot, b: ProductLot) => (a.quantity ?? 0) - (b.quantity ?? 0),
      render: (quantity: number | null) => (quantity ?? 0).toLocaleString(),
    },
    {
      title: "Giá Nhập (VND)",
      dataIndex: "supplyPrice",
      key: "supplyPrice",
      align: "right" as const,
      width: 150,
      sorter: (a: ProductLot, b: ProductLot) => (a.supplyPrice ?? 0) - (b.supplyPrice ?? 0),
      render: (price: number | null) => `${(price ?? 0).toLocaleString("vi-VN")}`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a: ProductLot, b: ProductLot) => (a.status ?? -1) - (b.status ?? -1),
      render: (status: 0 | 1 | 2 | null) => getStatusText(status),
    },
    {
      title: "Số Ngày Còn Hạn",
      key: "remainingDays",
      width: 150,
      align: "right" as const,
      sorter: (a: ProductLot, b: ProductLot) =>
        calculateRemainingDays(a.manufacturedDate, a.expiredDate) -
        calculateRemainingDays(b.manufacturedDate, b.expiredDate),
      render: (_: any, record: ProductLot) =>
        formatRemainingDays(record.manufacturedDate, record.expiredDate),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: any, record: ProductLot) => {
        const menuItems = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "Xem chi tiết",
            onClick: () => fetchLotDetail(record.id),
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
          >
            <Button shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const statusModalColumns = [
    {
      title: "Mã Lô",
      dataIndex: "lotCode",
      key: "lotCode",
      width: 120,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      width: 200,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "right" as const,
      width: 100,
      render: (quantity: number | null) => (quantity ?? 0).toLocaleString(),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: 0 | 1 | 2 | null) => getStatusText(status),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200, borderRadius: "6px" }}
        />
        <Button
          icon={<FilterOutlined />}
          onClick={() => setShowFilters(!showFilters)}
          style={{ borderRadius: "6px" }}
        >
          Lọc
        </Button>
        {/* <Button
          type="primary"
          onClick={() => handleChangePage("Tạo lô hàng")}
          style={{ borderRadius: "6px" }}
        >
          + Tạo lô mới
        </Button> */}
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          style={{ backgroundColor: "#28a745", borderColor: "#28a745", borderRadius: "6px" }}
        >
          Xuất Excel
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={printTable}
          style={{ borderRadius: "6px" }}
        >
          In danh sách
        </Button>
      </div>

      {showFilters && (
        <Collapse defaultActiveKey={["1"]} className="mb-6">
          <Panel header="Bộ lọc nâng cao" key="1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                placeholder="Giá nhập"
                value={priceFilter}
                onChange={setPriceFilter}
                style={{ width: "100%", borderRadius: "6px" }}
              >
                <Option value="">Chọn khoảng giá</Option>
                <Option value="0-100000">0 - 100,000 VND</Option>
                <Option value="100000-200000">100,000 - 200,000 VND</Option>
                <Option value="200000+">Trên 200,000 VND</Option>
              </Select>
              <Select
                placeholder="Số ngày còn hạn"
                value={remainingDaysFilter}
                onChange={setRemainingDaysFilter}
                style={{ width: "100%", borderRadius: "6px" }}
              >
                <Option value="">Chọn khoảng ngày</Option>
                <Option value="0-30">0 - 30 ngày</Option>
                <Option value="30-90">30 - 90 ngày</Option>
                <Option value="90+">Trên 90 ngày</Option>
              </Select>
              <Select
                placeholder="Mã lô"
                value={lotCodeFilter}
                onChange={setLotCodeFilter}
                style={{ width: "100%", borderRadius: "6px" }}
              >
                <Option value="">Chọn mã lô</Option>
                {lotCodes.map((lotCode) => (
                  <Option key={lotCode} value={lotCode}>
                    {lotCode}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%", borderRadius: "6px" }}
              >
                <Option value="">Chọn trạng thái</Option>
                <Option value="0">Ngừng bán</Option>
                <Option value="1">Còn hạn</Option>
                <Option value="2">Ưu tiên xuất</Option>
              </Select>
              <div className="md:col-span-3">
                <span style={{ display: "block", marginBottom: 8, color: "#595959" }}>
                  Lọc theo ngày sản xuất
                </span>
                <RangePicker
                  onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])}
                  style={{ width: "100%", borderRadius: "6px" }}
                />
              </div>
              <div className="md:col-span-3">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setPriceFilter("");
                    setRemainingDaysFilter("");
                    setLotCodeFilter("");
                    setDateRange(null);
                  }}
                  style={{ width: "100%", borderRadius: "6px" }}
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
        dataSource={filteredLots}
        rowKey="id"
        rowSelection={rowSelection}
        bordered
        size="middle"
        className="rounded-lg overflow-hidden"
      />

      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        <div className="bg-white p-6 rounded-lg shadow">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              borderBottom: "1px solid #e8e8e8",
              paddingBottom: "12px",
            }}
          >
            <EyeOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#262626", margin: 0 }}>
              Chi tiết Lô: {selectedLot?.lotCode}
            </h2>
          </div>
          {selectedLot && (
            <div style={{ fontSize: "14px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: "12px 24px",
                  marginBottom: "24px",
                }}
              >
                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Mã Lô:</span>
                <span style={{ color: "#262626" }}>{selectedLot.lotCode}</span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Tên Sản Phẩm:</span>
                <span style={{ color: "262626" }}>{selectedLot.productName}</span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Trạng Thái:</span>
                <span
                  style={{
                    color:
                      selectedLot.status === 1
                        ? "#389e0d"
                        : selectedLot.status === 2
                        ? "#fa8c16"
                        : "#cf1322",
                    fontWeight: "500",
                  }}
                >
                  {getStatusText(selectedLot.status)}
                </span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Đơn Vị Tính:</span>
                <span style={{ color: "#262626" }}>{selectedLot.unit}</span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Số Lượng:</span>
                <span style={{ color: "#262626" }}>
                  {(selectedLot.quantity ?? 0).toLocaleString()}
                </span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Giá Nhập:</span>
                <span style={{ color: "#262626" }}>
                  {(selectedLot.supplyPrice ?? 0).toLocaleString("vi-VN")} VND
                </span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Ngày Sản Xuất:</span>
                <span style={{ color: "#262626" }}>{formatDate(selectedLot.manufacturedDate)}</span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Hạn Sử Dụng:</span>
                <span style={{ color: "#262626" }}>{formatDate(selectedLot.expiredDate)}</span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Ngày Ngừng Bán:</span>
                <span style={{ color: "#262626" }}>
                  {formatDate(calculateStopSellingDate(selectedLot.expiredDate))}
                </span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Số Ngày Còn Hạn:</span>
                <span style={{ color: "#262626" }}>
                  {formatRemainingDays(selectedLot.manufacturedDate, selectedLot.expiredDate)}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                    borderRadius: "6px",
                    padding: "6px 16px",
                  }}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        footer={null}
        width={800}
        title={statusModalTitle}
        className="rounded-lg"
      >
        <Table
          columns={statusModalColumns}
          dataSource={statusModalLots}
          rowKey="id"
          bordered
          size="middle"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default LotTable;