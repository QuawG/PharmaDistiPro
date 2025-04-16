import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Collapse, DatePicker, Dropdown, Menu } from "antd";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
import {
  EyeOutlined,
  FilterOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";

interface ReceivedNote {
  receiveNoteId: number;
  receiveNotesCode: string;
  purchaseOrderId: number;
  status: string | null;
  createdBy: number;
  createdDate: string;
  createdByNavigation?: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    age: number;
    avatar: string | null;
    address: string;
    roleId: number;
    employeeCode: string | null;
    taxCode: string | null;
    status: boolean;
    createdBy: number;
    createdDate: string | null;
    roleName: string | null;
  };
  purchaseOrder?: {
    purchaseOrderId: number;
    purchaseOrderCode: string;
    supplierId: number;
    updatedStatusDate: string;
    totalAmount: number;
    status: number;
    createdBy: number | null;
    createDate: string;
    amountPaid: number | null;
    createdByNavigation: any | null;
    supplier: any | null;
  };
}

interface ReceivedNoteDetail {
  receiveNoteDetailId: number;
  noteNumber: number | null;
  productLotId: number;
  productName: string;
  productCode: string;
  lotCode: string;
  unit: string;
  actualReceived: number;
  unitPrice: number;
  totalAmount: number;
  documentNumber: string | null;
  createdBy: string | null;
  createdDate: string | null;
}

interface ReceivedNoteTableProps {
  notes: ReceivedNote[];
  handleChangePage: (page: string, noteId?: number) => void;
  onUpdate: (updatedNote: ReceivedNote) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: ReceivedNote[]) => void;
  };
}

const ReceivedNoteTable: React.FC<ReceivedNoteTableProps> = ({
  notes,
  handleChangePage,
  // onUpdate,
  rowSelection,
}) => {
  const [filteredNotes, setFilteredNotes] = useState<ReceivedNote[]>(notes);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ReceivedNote | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [receivedNoteDetails, setReceivedNoteDetails] = useState<ReceivedNoteDetail[]>([]);
  const [noteTotalAmount, setNoteTotalAmount] = useState<number>(0);
  const [noteTotals, setNoteTotals] = useState<{ [key: number]: number }>({});

  const openNoteDetails = async (receiveNoteId: number) => {
    const note = filteredNotes.find((n) => n.receiveNoteId === receiveNoteId);
    if (note) {
      setSelectedNote(note);
      try {
        const response = await axios.get(`http://pharmadistiprobe.fun/api/ReceivedNote/${receiveNoteId}`);
        const { data } = response.data;
        setReceivedNoteDetails(data.receivedNoteDetails || []);
        const total = (data.receivedNoteDetails || []).reduce(
          (sum: number, detail: ReceivedNoteDetail) => sum + detail.totalAmount,
          0
        );
        setNoteTotalAmount(total);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phiếu:", error);
        setReceivedNoteDetails([]);
        setNoteTotalAmount(0);
      }
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const fetchAllTotals = async () => {
      const totals: { [key: number]: number } = {};
      for (const note of notes) {
        try {
          const response = await axios.get(`http://pharmadistiprobe.fun/api/ReceivedNote/${note.receiveNoteId}`);
          const { data } = response.data;
          const total = (data.receivedNoteDetails || []).reduce(
            (sum: number, detail: ReceivedNoteDetail) => sum + detail.totalAmount,
            0
          );
          totals[note.receiveNoteId] = total;
        } catch (error) {
          console.error(`Lỗi khi lấy chi tiết cho phiếu ${note.receiveNoteId}:`, error);
          totals[note.receiveNoteId] = 0;
        }
      }
      setNoteTotals(totals);
    };
    fetchAllTotals();
  }, [notes]);

  const filterNotes = () => {
    let filteredData = [...notes];
    if (searchTerm.trim()) {
      filteredData = filteredData.filter((note) =>
        note.receiveNotesCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filteredData = filteredData.filter((note) => note.status === statusFilter);
    }
    if (dateRange) {
      filteredData = filteredData.filter((note) => {
        const createdDate = new Date(note.createdDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }
    filteredData.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    setFilteredNotes(filteredData);
  };

  useEffect(() => {
    filterNotes();
  }, [searchTerm, statusFilter, dateRange, notes]);

  const getUserNameById = (note: ReceivedNote) => {
    if (note.createdByNavigation) {
      const firstName = note.createdByNavigation.firstName || "";
      const lastName = note.createdByNavigation.lastName || "";
      return `${firstName.trim()} ${lastName}`.trim();
    }
    return `ID: ${note.createdBy}`;
  };

  const exportToExcel = () => {
    const dataToExport = filteredNotes.map((note) => ({
      "Mã Phiếu": note.receiveNotesCode,
      "Người Tạo": getUserNameById(note),
      "Tổng giá trị phiếu": noteTotals[note.receiveNoteId] || 0,
      "Ngày Tạo": new Date(note.createdDate).toLocaleDateString("vi-VN"),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachPhieuNhapKho");
    XLSX.writeFile(workbook, "DanhSachPhieuNhapKho.xlsx");
  };

  const printTable = () => {
    const selectedNotes =
      rowSelection && rowSelection.selectedRowKeys.length > 0
        ? filteredNotes.filter((note) => rowSelection.selectedRowKeys.includes(note.receiveNoteId))
        : filteredNotes;

    if (selectedNotes.length === 0) {
      alert("Không có phiếu nào được chọn để in.");
      return;
    }

    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách phiếu nhập kho</h2>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Mã Phiếu</th>
            <th>Người Tạo</th>
            <th>Tổng giá trị phiếu</th>
            <th>Ngày Tạo</th>
          </tr>
        </thead>
        <tbody>
          ${selectedNotes
            .map(
              (note) => `
            <tr>
              <td>${note.receiveNotesCode}</td>
              <td>${getUserNameById(note)}</td>
              <td>${(noteTotals[note.receiveNoteId] || 0).toLocaleString()} VND</td>
              <td>${new Date(note.createdDate).toLocaleDateString("vi-VN")}</td>
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

  const columns = [
    { title: "Mã Phiếu", dataIndex: "receiveNotesCode", key: "receiveNotesCode" },
    {
      title: "Người Tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_: any, record: ReceivedNote) => getUserNameById(record),
    },
    {
      title: "Tổng giá trị phiếu (VND)",
      key: "totalAmount",
      render: (_: any, record: ReceivedNote) =>
        `${(noteTotals[record.receiveNoteId] || 0).toLocaleString()} `,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: ReceivedNote) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => openNoteDetails(record.receiveNoteId)}
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

  const detailColumns = [
    { title: "Tên Sản Phẩm", dataIndex: "productName", key: "productName" },
    { title: "Mã Sản Phẩm", dataIndex: "productCode", key: "productCode" },
    {
      title: "Số Lượng",
      dataIndex: "actualReceived",
      key: "actualReceived",
      render: (quantity: number) => quantity.toLocaleString(),
    },
    { title: "Số Lô", dataIndex: "lotCode", key: "lotCode" },
    { title: "Đơn Vị", dataIndex: "unit", key: "unit" },
    {
      title: "Đơn giá (VND)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right" as const,
      render: (price: number) => `${price.toLocaleString()}`,
    },
    {
      title: "Thành Tiền (VND)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right" as const,
      render: (total: number) => `${total.toLocaleString()}`,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo mã phiếu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
          Lọc
        </Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo phiếu nhập kho")}>
          + Tạo phiếu mới
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
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo ngày tạo</span>
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
                    setFilteredNotes(notes);
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
        <Table
          columns={columns}
          dataSource={filteredNotes}
          rowKey="receiveNoteId"
          rowSelection={rowSelection}
        />
      </div>

      <Modal
        title={
          <div
            style={{
              backgroundColor: "#f0f5ff",
              padding: "16px",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#1d39c4",
            }}
          >
            <EyeOutlined style={{ fontSize: "20px" }} />
            Chi tiết Phiếu: {selectedNote?.receiveNotesCode}
          </div>
        }
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setReceivedNoteDetails([]);
          setNoteTotalAmount(0);
        }}
        footer={
          <div style={{ textAlign: "right", padding: "8px" }}>
            <Button
              type="primary"
              onClick={() => {
                setIsOpen(false);
                setReceivedNoteDetails([]);
                setNoteTotalAmount(0);
              }}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "4px",
                padding: "6px 16px",
              }}
            >
              Đóng
            </Button>
          </div>
        }
        width={1000}
        bodyStyle={{ padding: "24px", backgroundColor: "#fafafa" }}
      >
        {selectedNote && (
          <div>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#595959",
                  marginBottom: "16px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
                }}
              >
                Thông tin phiếu nhập kho
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Mã Phiếu:</span>{" "}
                  <span style={{ color: "#262626" }}>{selectedNote.receiveNotesCode}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Người Tạo:</span>{" "}
                  <span style={{ color: "#262626" }}>{getUserNameById(selectedNote)}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Tổng giá trị phiếu:</span>{" "}
                  <span style={{ color: "#262626", fontWeight: "600" }}>
                    {noteTotalAmount.toLocaleString()} VND
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Ngày Tạo:</span>{" "}
                  <span style={{ color: "#262626" }}>
                    {new Date(selectedNote.createdDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Mã Đơn Mua Hàng:</span>{" "}
                  <span style={{ color: "#262626" }}>
                    {selectedNote.purchaseOrder?.purchaseOrderCode || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#595959",
                  marginBottom: "16px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
                }}
              >
                Chi tiết sản phẩm
              </h3>
              <Table
                columns={detailColumns}
                dataSource={receivedNoteDetails}
                rowKey="receiveNoteDetailId"
                pagination={false}
                bordered
                size="middle"
                rowClassName={(_, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
                style={{ borderRadius: "8px", overflow: "hidden" }}
                locale={{ emptyText: "Không có sản phẩm nào trong phiếu này." }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReceivedNoteTable;