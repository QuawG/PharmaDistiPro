import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Collapse, DatePicker, Dropdown, Menu } from "antd";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
import { EyeOutlined, EditOutlined, DeleteOutlined, FilterOutlined,  FileExcelOutlined, PrinterOutlined, MoreOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

interface IssueNote {
  id: number;
  issueNoteCode: string;
  orderId: number;
  customerId: number;
  updatedStatusDate: Date;
  totalAmount: number;
  createdBy: string;
  createdDate: Date;
  status: string;
  details: IssueNoteDetail[];
}

interface IssueNoteDetail {
  id: number;
  issueNoteId: number;
  productId: number;
  quantity: number;
}

interface IssueNoteTableProps {
  notes: IssueNote[];
  handleChangePage: (page: string, noteId?: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (updatedNote: IssueNote) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: IssueNote[]) => void;
  };
}

const IssueNoteTable: React.FC<IssueNoteTableProps> = ({ notes, handleChangePage, onDelete }) => {
  const [filteredNotes, setFilteredNotes] = useState<IssueNote[]>(notes);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<IssueNote | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const uniqueStatuses = Array.from(new Set(notes.map(note => note.status)));

  // Filter notes
  const filterNotes = () => {
    let filteredData = [...notes];

    if (searchTerm.trim()) {
      filteredData = filteredData.filter((note) =>
        note.issueNoteCode.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredNotes(filteredData);
  };

  useEffect(() => {
    filterNotes();
  }, [searchTerm, statusFilter, dateRange, notes]);

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
  };

  const handleStatusChange = (noteId: number, newStatus: string) => {
    setFilteredNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, status: newStatus } : note
      )
    );
  };

  const handleDelete = () => {
    if (selectedNote) {
      onDelete(selectedNote.id);
      setIsDeleteModalOpen(false);
      setSelectedNote(null);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredNotes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachPhieuXuatNhap");
    XLSX.writeFile(workbook, "DanhSachPhieuXuatNhap.xlsx");
  };

  const printTable = () => {
    const selectedNotes = selectedRowKeys.length > 0
      ? filteredNotes.filter((note) => selectedRowKeys.includes(note.id))
      : filteredNotes;

    if (selectedNotes.length === 0) {
      alert("Không có phiếu nào được chọn để in.");
      return;
    }

    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách phiếu xuất nhập</h2>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Mã Phiếu</th>
            <th>Trạng Thái</th>
            <th>Người Tạo</th>
            <th>Tổng Tiền</th>
            <th>Ngày Tạo</th>
          </tr>
        </thead>
        <tbody>
          ${selectedNotes
        .map((note) => `
            <tr>
              <td>${note.issueNoteCode}</td>
              <td>${note.status}</td>
              <td>${note.createdBy}</td>
              <td>${note.totalAmount.toLocaleString()} VND</td>
              <td>${new Date(note.createdDate).toLocaleDateString("vi-VN")}</td>
            </tr>
          `)
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
    { title: "Mã Phiếu", dataIndex: "issueNoteCode", key: "issueNoteCode" },
    { 
      title: "Trạng Thái", 
      dataIndex: "status", 
      key: "status",
      render: (status: string, record: IssueNote) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="Nhập">Nhập</Select.Option>
          <Select.Option value="Xuất">Xuất</Select.Option>
        </Select>
      ),
    },
    { title: "Người Tạo", dataIndex: "createdBy", key: "createdBy" },
    { title: "Số Sản Phẩm", key: "TotalProducts", render: (_: any, record: IssueNote) => record.details.length },
    { title: "Số lượng", key: "TotalQuantity", render: (_: any, record: IssueNote) => record.details.reduce((total, detail) => total + detail.quantity, 0) },
    { title: "Tổng Tiền", dataIndex: "totalAmount", key: "totalAmount", render: (amount: number) => `${amount.toLocaleString()} VND` },
    { 
      title: "Ngày Tạo", 
      dataIndex: "createdDate", 
      key: "createdDate", 
      render: (date: Date) => date ? new Date(date).toLocaleDateString("vi-VN") : "Không có dữ liệu" 
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: IssueNote) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => { setSelectedNote(record); setIsOpen(true); }}>
                Xem chi tiết
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleChangePage("Chỉnh sửa phiếu", record.id)}>
                Sửa
              </Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => { setSelectedNote(record); setIsDeleteModalOpen(true); }}>
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Tìm kiếm theo mã phiếu" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 200 }} />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>Lọc</Button>
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
              <Select placeholder="Trạng thái" value={statusFilter} onChange={setStatusFilter} style={{ width: "100%" }}>
                <Select.Option value="">Chọn trạng thái</Select.Option>
                {uniqueStatuses.map((status) => (
                  <Select.Option key={status} value={status}>{status}</Select.Option>
                ))}
              </Select>
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo ngày tạo</span>
                <RangePicker onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])} style={{ width: "100%" }} />
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
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: handleRowSelectionChange,
          }}
        />
      </div>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa phiếu này không?</p>
      </Modal>

      {/* Modal chi tiết phiếu */}
      <Modal
        title={`Chi tiết Phiếu: ${selectedNote?.issueNoteCode}`}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={800}
      >
        {selectedNote && (
          <div>
            <p><strong>Mã Phiếu:</strong> {selectedNote.issueNoteCode}</p>
            <p><strong>Trạng Thái:</strong> {selectedNote.status}</p>
            <p><strong>Người Tạo:</strong> {selectedNote.createdBy}</p>
            <p><strong>Tổng Tiền:</strong> {selectedNote.totalAmount.toLocaleString()} VND</p>
            <p><strong>Ngày Tạo:</strong> {new Date(selectedNote.createdDate).toLocaleDateString("vi-VN")}</p>
            <h3>Chi tiết sản phẩm:</h3>
            <Table
              columns={[
                { title: "Mã Sản Phẩm", dataIndex: "productId", key: "productId" },
                { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
              ]}
              dataSource={selectedNote.details}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IssueNoteTable;