import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Collapse, DatePicker, Dropdown, Menu } from "antd";
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
  quantity: number | null; // Cập nhật để chấp nhận null
  manufacturedDate: string;
  expiredDate: string;
  supplyPrice: number | null; // Cập nhật để chấp nhận null
  status: number | null;
  productName: string;
  lotCode: string;
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
  // onUpdate: (updatedLot: ProductLot) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductLot[]) => void;
  };
}

const LotTable: React.FC<LotTableProps> = ({
  handleChangePage,
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

  useEffect(() => {
    const fetchProductLots = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/ProductLot");
        // Lọc và sửa dữ liệu để tránh null/undefined
        const validLots = (response.data.data || []).map((lot: ProductLot) => ({
          ...lot,
          quantity: lot.quantity ?? 0, // Gán mặc định 0 nếu null
          supplyPrice: lot.supplyPrice ?? 0, // Gán mặc định 0 nếu null
          productName: lot.productName || "Không xác định", // Đảm bảo có giá trị
          lotCode: lot.lotCode || "N/A",
        }));
        setAllLots(validLots);
        setFilteredLots(validLots);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm trong lô:", error);
      }
    };

    const fetchLotCodes = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Lot");
        let lotCodesArray: string[] = [];
        if (Array.isArray(response.data)) {
          lotCodesArray = response.data.map((lot: Lot) => lot.lotCode || "N/A");
        } else if (response.data && Array.isArray(response.data.data)) {
          lotCodesArray = response.data.data.map((lot: Lot) => lot.lotCode || "N/A");
        }
        setLotCodes(lotCodesArray);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mã lô:", error);
      }
    };

    fetchProductLots();
    fetchLotCodes();
  }, []);

  // Hàm tính ngày ngừng bán (trước ngày hết hạn 3 tháng)
  const calculateStopSellingDate = (expiredDate: string) => {
    const date = new Date(expiredDate);
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split("T")[0];
  };

  // Hàm tính số ngày còn hạn (từ ngày ngừng bán đến ngày sản xuất)
  const calculateRemainingDays = (manufacturedDate: string, expiredDate: string) => {
    const stopSellingDate = new Date(calculateStopSellingDate(expiredDate));
    const manufactured = new Date(manufacturedDate);
    const daysLeft = Math.floor((stopSellingDate.getTime() - manufactured.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft < 0 ? 0 : daysLeft;
  };

  // Hàm định dạng số ngày còn hạn thành "số tháng số ngày"
  const formatRemainingDays = (manufacturedDate: string, expiredDate: string) => {
    const daysLeft = calculateRemainingDays(manufacturedDate, expiredDate);
    const months = Math.floor(daysLeft / 30);
    const remainingDays = daysLeft % 30;
    return `${months} tháng ${remainingDays} ngày`;
  };

  useEffect(() => {
    let filteredData = [...allLots];

    if (searchTerm.trim()) {
      filteredData = filteredData.filter((lot) =>
        lot.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter((lot) => String(lot.status) === statusFilter);
    }

    if (priceFilter) {
      filteredData = filteredData.filter((lot) => {
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
      filteredData = filteredData.filter((lot) => {
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
      filteredData = filteredData.filter((lot) => lot.lotCode === lotCodeFilter);
    }

    if (dateRange) {
      filteredData = filteredData.filter((lot) => {
        const createdDate = new Date(lot.manufacturedDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }

    setFilteredLots(filteredData);
  }, [searchTerm, statusFilter, priceFilter, remainingDaysFilter, lotCodeFilter, dateRange, allLots]);

  const fetchLotDetail = async (id: number) => {
    try {
      const response = await axios.get(`http://pharmadistiprobe.fun/api/ProductLot/${id}`);
      const lot = response.data.data;
      // Đảm bảo dữ liệu chi tiết không có null
      setSelectedLot({
        ...lot,
        quantity: lot.quantity ?? 0,
        supplyPrice: lot.supplyPrice ?? 0,
        productName: lot.productName || "Không xác định",
        lotCode: lot.lotCode || "N/A",
      });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lô:", error);
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredLots.map((lot) => ({
      "Mã Lô": lot.lotCode,
      "Tên Sản Phẩm": lot.productName,
      "Số Lượng": lot.quantity ?? 0,
      "Giá Nhập": (lot.supplyPrice ?? 0).toLocaleString("vi-VN"),
      "Số Ngày Còn Hạn": formatRemainingDays(lot.manufacturedDate, lot.expiredDate),
      "Ngày Sản Xuất": new Date(lot.manufacturedDate).toLocaleDateString("vi-VN"),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachLoHang");
    XLSX.writeFile(workbook, "DanhSachLoHang.xlsx");
  };

  const printTable = () => {
    const selectedLots = rowSelection?.selectedRowKeys.length
      ? filteredLots.filter((lot) => rowSelection.selectedRowKeys.includes(lot.id))
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
          </tr>
        </thead>
        <tbody>
          ${selectedLots
            .map(
              (lot) => `
            <tr>
              <td>${lot.lotCode}</td>
              <td>${lot.productName}</td>
              <td style="text-align: right;">${(lot.quantity ?? 0).toLocaleString()}</td>
              <td style="text-align: right;">${(lot.supplyPrice ?? 0).toLocaleString("vi-VN")} VND</td>
              <td>${formatRemainingDays(lot.manufacturedDate, lot.expiredDate)}</td>
              <td>${new Date(lot.manufacturedDate).toLocaleDateString("vi-VN")}</td>
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
      title: "Giá Nhập (VND)  ",
      dataIndex: "supplyPrice",
      key: "supplyPrice",
      align: "right" as const,
      width: 150,
      sorter: (a: ProductLot, b: ProductLot) => (a.supplyPrice ?? 0) - (b.supplyPrice ?? 0),
      render: (price: number | null) => `${(price ?? 0).toLocaleString("vi-VN")}`,
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
    // {
    //   title: "Ngày Sản Xuất",
    //   dataIndex: "manufacturedDate",
    //   key: "manufacturedDate",
    //   width: 120,
    //   sorter: (a: ProductLot, b: ProductLot) =>
    //     new Date(a.manufacturedDate).getTime() - new Date(b.manufacturedDate).getTime(),
    //   render: (date: string) => formatDate(date),
    // },
    {
      title: "Hành động",
      key: "actions",
      width: 80,
      render: (_: any, record: ProductLot) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => fetchLotDetail(record.id)}
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
        <Button
          type="primary"
          onClick={() => handleChangePage("Tạo lô hàng")}
          style={{ borderRadius: "6px" }}
        >
          + Tạo lô mới
        </Button>
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
                <span style={{ color: "#262626" }}>{selectedLot.productName}</span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Trạng Thái:</span>
                <span
                  style={{
                    color: selectedLot.status === 1 ? "#389e0d" : "#cf1322",
                    fontWeight: "500",
                  }}
                >
                  {selectedLot.status === 1 ? "Còn hàng" : "Hết hàng"}
                </span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Số Lượng:</span>
                <span style={{ color: "#262626" }}>
                  {(selectedLot.quantity ?? 0).toLocaleString()}
                </span>

                <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Giá Nhập:</span>
                <span style={{ color: "#262626"}}>
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
    </div>
  );
};

export default LotTable;