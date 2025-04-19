import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Input, Collapse, DatePicker, Dropdown, Menu, message } from "antd";
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
import { useAuth } from "../../pages/Home/AuthContext";

interface IssueNote {
  id: number;
  issueNoteCode: string;
  orderId: number;
  customerId: number;
  updatedStatusDate: Date;
  totalAmount: number;
  createdBy: number;
  createdDate: Date;
  status: number;
}

interface User {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
}

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

interface ProductLot {
  productLotId: number;
  productId: number;
  lotId: number;
  manufacturedDate: string;
  expiredDate: string;
  supplyPrice: number;
  quantity: number;
  status: boolean | null;
  product: Product;
}

interface IssueNoteDetail {
  issueNoteDetailId: number;
  issueNoteId: number;
  productLotId: number;
  quantity: number;
  productLot: ProductLot;
}

interface IssueNoteTableProps {
  notes: IssueNote[];
  handleChangePage: (page: string, noteId?: number) => void;
  onUpdate: (updatedNote: IssueNote) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: IssueNote[]) => void;
  };
}

const IssueNoteTable: React.FC<IssueNoteTableProps> = ({
  notes,
  handleChangePage,
  onUpdate,
  rowSelection,
}) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [filteredNotes, setFilteredNotes] = useState<IssueNote[]>(notes);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<IssueNote | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [issueNoteDetails, setIssueNoteDetails] = useState<IssueNoteDetail[]>([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://pharmadistiprobe.fun/api/User/GetUserList", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userList = response.data.data.map((user: any) => ({
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const fetchIssueNoteDetails = async (issueNoteId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://pharmadistiprobe.fun/api/IssueNote/GetIssueNoteDetailByIssueNoteId/${issueNoteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssueNoteDetails(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phiếu xuất kho:", error);
      setIssueNoteDetails([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserNameById = (userId: number) => {
    const user = users.find((u) => u.userId === userId);
    return user ? `${user.firstName} ${user.lastName}` : `ID: ${userId}`;
  };

  const filterNotes = () => {
    let filteredData = [...notes];
    if (searchTerm.trim()) {
      filteredData = filteredData.filter((note) =>
        note.issueNoteCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filteredData = filteredData.filter((note) => String(note.status) === statusFilter);
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

  const handleStatusChange = (noteId: number, newStatus: string) => {
    const statusText = {
      "0": "Hủy",
      "1": "Đang xử lý",
      "2": "Đã xuất",
    }[newStatus];

    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có chắc chắn muốn thay đổi trạng thái của phiếu này thành "${statusText}" không?`,
      okText: "Có",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.put(
            `http://pharmadistiprobe.fun/api/IssueNote/UpdateIssueNoteStatus/${noteId}/${newStatus}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const updatedNote = filteredNotes.find((note) => note.id === noteId);
          if (updatedNote) {
            const newNote = { ...updatedNote, status: Number(newStatus) };
            setFilteredNotes((prevNotes) =>
              prevNotes.map((note) => (note.id === noteId ? newNote : note))
            );
            onUpdate(newNote);
            message.success(`Đã thay đổi trạng thái thành "${statusText}" thành công!`);
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái phiếu:", error);
          message.error("Không thể cập nhật trạng thái. Vui lòng thử lại!");
        }
      },
      onCancel: () => {
        // Không làm gì nếu người dùng hủy
      },
    });
  };

  const exportToExcel = () => {
    const dataToExport = filteredNotes.map((note) => ({
      ...note,
      createdBy: getUserNameById(note.createdBy),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachPhieuXuatKho");
    XLSX.writeFile(workbook, "DanhSachPhieuXuatKho.xlsx");
  };

  const printTable = () => {
    const selectedNotes =
      rowSelection && rowSelection.selectedRowKeys.length > 0
        ? filteredNotes.filter((note) => rowSelection.selectedRowKeys.includes(note.id))
        : filteredNotes;

    if (selectedNotes.length === 0) {
      alert("Không có phiếu nào được chọn để in.");
      return;
    }

    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách phiếu xuất kho</h2>
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
            .map(
              (note) => `
            <tr>
              <td>${note.issueNoteCode}</td>
              <td>${["Chờ xử lý", "Đã xử lý", "Đã xuất"][note.status] || note.status}</td>
              <td>${getUserNameById(note.createdBy)}</td>
              <td>${note.totalAmount.toLocaleString()} VND</td>
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
    { title: "Mã Phiếu", dataIndex: "issueNoteCode", key: "issueNoteCode" },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: number, record: IssueNote) => {
        const statusText = ["Chờ xử lý", "Đã xử lý", "Đã xuất"][status] || status;
        if (user?.roleName === "WarehouseManager") {
          return (
            <Select
              value={String(status)}
              onChange={(value) => handleStatusChange(record.id, value)}
              style={{ width: 120 }}
            >
              <Select.Option value="0">Hủy</Select.Option>
              <Select.Option value="1">Đang xử lý</Select.Option>
              <Select.Option value="2">Đã xuất</Select.Option>
            </Select>
          );
        }
        return (
          <span
            style={{
              color: status === 0 ? "#f5222d" : status === 1 ? "#fa8c16" : "#52c41a",
              fontWeight: "500",
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      title: "Người Tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy: number) => getUserNameById(createdBy),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: Date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "Không có dữ liệu"),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: IssueNote) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedNote(record);
                  fetchIssueNoteDetails(record.id);
                  setIsOpen(true);
                }}
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
    {
      title: "Tên sản phẩm",
      dataIndex: ["productLot", "product", "productName"],
      key: "productName",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: ["productLot", "product", "productCode"],
      key: "productCode",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => quantity.toLocaleString(),
    },
    {
      title: "Ngày sản xuất",
      dataIndex: ["productLot", "manufacturedDate"],
      key: "manufacturedDate",
      render: (date: string) => (date ? new Date(date).toLocaleDateString("vi-VN") : "Không có dữ liệu"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: ["productLot", "expiredDate"],
      key: "expiredDate",
      render: (date: string) => (date ? new Date(date).toLocaleDateString("vi-VN") : "Không có dữ liệu"),
    },
    {
      title: "Giá bán",
      dataIndex: ["productLot", "product", "sellingPrice"],
      key: "sellingPrice",
      render: (price: number) => `${price.toLocaleString()} VND`,
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
        <Button type="primary" onClick={() => handleChangePage("Tạo phiếu xuất kho")}>
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
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Select.Option value="">Chọn trạng thái</Select.Option>
                <Select.Option value="0">Chờ xử lý</Select.Option>
                <Select.Option value="1">Đã xử lý</Select.Option>
                <Select.Option value="2">Đã xuất</Select.Option>
              </Select>
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
        <Table columns={columns} dataSource={filteredNotes} rowKey="id" rowSelection={rowSelection} />
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
            Chi tiết Phiếu: {selectedNote?.issueNoteCode}
          </div>
        }
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setIssueNoteDetails([]);
        }}
        footer={
          <div style={{ textAlign: "right", padding: "8px" }}>
            <Button
              type="primary"
              onClick={() => {
                setIsOpen(false);
                setIssueNoteDetails([]);
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
                Thông tin phiếu xuất kho
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
                  <span style={{ color: "#262626" }}>{selectedNote.issueNoteCode}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Trạng Thái:</span>{" "}
                  <span
                    style={{
                      color:
                        selectedNote.status === 0
                          ? "#f5222d"
                          : selectedNote.status === 1
                          ? "#fa8c16"
                          : "#52c41a",
                      fontWeight: "500",
                    }}
                  >
                    {["Chờ xử lý", "Đã xử lý", "Đã xuất"][selectedNote.status] ||
                      selectedNote.status}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Người Tạo:</span>{" "}
                  <span style={{ color: "#262626" }}>{getUserNameById(selectedNote.createdBy)}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Tổng Tiền:</span>{" "}
                  <span style={{ color: "#262626", fontWeight: "600" }}>
                    {selectedNote.totalAmount.toLocaleString()} VND
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "500", color: "#8c8c8c" }}>Ngày Tạo:</span>{" "}
                  <span style={{ color: "#262626" }}>
                    {new Date(selectedNote.createdDate).toLocaleDateString("vi-VN")}
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
                dataSource={issueNoteDetails}
                rowKey="issueNoteDetailId"
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

export default IssueNoteTable;