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
  quantity: number;
  manufacturedDate: string;
  expiredDate: string;
  supplyPrice: number;
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
  onUpdate: (updatedLot: ProductLot) => void;
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
        console.log("Dữ liệu từ API ProductLot:", response.data);
        setAllLots(response.data.data || []);
        setFilteredLots(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm trong lô:", error);
      }
    };

    const fetchLotCodes = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Lot");
        console.log("Dữ liệu từ API Lot:", response.data);
        let lotCodesArray: string[] = [];
        if (Array.isArray(response.data)) {
          lotCodesArray = response.data.map((lot: Lot) => lot.lotCode);
        } else if (response.data && Array.isArray(response.data.data)) {
          lotCodesArray = response.data.data.map((lot: Lot) => lot.lotCode);
        } else {
          console.warn("Dữ liệu từ API Lot không phải mảng:", response.data);
        }
        setLotCodes(lotCodesArray);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mã lô:", error);
      }
    };

    fetchProductLots();
    fetchLotCodes();
  }, []);

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
        const price = lot.supplyPrice;
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
        const remainingDays = calculateRemainingDays(lot.expiredDate);
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
      setSelectedLot(response.data.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lô:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLots);
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
            <th>Trạng Thái</th>
            <th>Giá Nhập</th>
            <th>Ngày Tạo</th>
          </tr>
        </thead>
        <tbody>
          ${selectedLots
            .map(
              (lot) => `
            <tr>
              <td>${lot.lotCode}</td>
              <td>${lot.productName}</td>
              <td>${lot.status === 1 ? "Còn hàng" : "Hết hàng"}</td>
              <td>${lot.supplyPrice.toLocaleString("vi-VN")} VND</td>
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

  const calculateRemainingDays = (expiredDate: string) => {
    const today = new Date();
    const daysLeft = Math.floor((new Date(expiredDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft < 0 ? 0 : daysLeft;
  };

  const formatRemainingDays = (expiredDate: string) => {
    const daysLeft = calculateRemainingDays(expiredDate);
    if (daysLeft >= 365) {
      const years = Math.floor(daysLeft / 365);
      const remainingDays = daysLeft % 365;
      return `${years} năm ${remainingDays} ngày`;
    }
    return `${daysLeft} ngày`;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const columns = [
    { title: "Mã Lô", dataIndex: "lotCode", key: "lotCode" },
    { title: "Tên Sản Phẩm", dataIndex: "productName", key: "productName" },
    {
      title: "Giá Nhập",
      dataIndex: "supplyPrice",
      key: "supplyPrice",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VND`, // Định dạng giá tiền
    },
    { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Số Ngày Còn Hạn",
      key: "remainingDays",
      render: (_: any, record: ProductLot) => formatRemainingDays(record.expiredDate), // Định dạng ngày còn lại
    },
    {
      title: "",
      key: "actions",
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
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
          Lọc
        </Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo lô hàng")}>
          + Tạo lô mới
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
                placeholder="Giá nhập"
                value={priceFilter}
                onChange={setPriceFilter}
                style={{ width: "100%" }}
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
                style={{ width: "100%" }}
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
                style={{ width: "100%" }}
              >
                <Option value="">Chọn mã lô</Option>
                {lotCodes.map((lotCode) => (
                  <Option key={lotCode} value={lotCode}>
                    {lotCode}
                  </Option>
                ))}
              </Select>
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo ngày sản xuất</span>
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
                    setPriceFilter("");
                    setRemainingDaysFilter("");
                    setLotCodeFilter("");
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
        dataSource={filteredLots}
        rowKey="id"
        rowSelection={rowSelection}
      />

      <Modal
        title={`Chi tiết Lô: ${selectedLot?.lotCode}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedLot && (
          <div>
            <p><strong>Mã Lô:</strong> {selectedLot.lotCode}</p>
            <p><strong>Tên Sản Phẩm:</strong> {selectedLot.productName}</p>
            <p><strong>Trạng Thái:</strong> {selectedLot.status === 1 ? "Còn hàng" : "Hết hàng"}</p>
            <p><strong>Giá Nhập:</strong> {selectedLot.supplyPrice.toLocaleString("vi-VN")} VND</p>
            <p><strong>Số Lượng:</strong> {selectedLot.quantity}</p>
            <p><strong>Ngày Sản Xuất:</strong> {formatDate(selectedLot.manufacturedDate)}</p>
            <p><strong>Hạn Sử Dụng:</strong> {formatDate(selectedLot.expiredDate)}</p>
            <p><strong>Số Ngày Còn Hạn:</strong> {formatRemainingDays(selectedLot.expiredDate)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LotTable;