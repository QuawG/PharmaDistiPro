import React, { useState } from "react";
// import { DatePicker, Collapse } from "antd";
// const { RangePicker } = DatePicker;
// const { Panel } = Collapse;
// import { EyeOutlined, EditOutlined, DeleteOutlined, FilterOutlined, UnorderedListOutlined, FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";
import IssueNoteTable from "../../components/IssueNote/IssueNoteTable";
// import * as XLSX from "xlsx";

interface IssueNoteListPageProps {
  handleChangePage: (page: string, ReceiveNoteId?: number) => void;
}

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

const SAMPLE_ISSUE_NOTES: IssueNote[] = [
  {
    id: 1,
    issueNoteCode: "IN001",
    orderId: 101,
    customerId: 201,
    updatedStatusDate: new Date("2025-03-15"),
    totalAmount: 3400000,
    createdBy: "HieuLD",
    createdDate: new Date("2025-03-15"),
    status: "Xuất",
    details: [{ id: 1, issueNoteId: 1, productId: 1, quantity: 50 }],
  },
  {
    id: 2,
    issueNoteCode: "IN002",
    orderId: 102,
    customerId: 202,
    updatedStatusDate: new Date("2025-03-16"),
    totalAmount: 300000,
    createdBy: "HieuLD",
    createdDate: new Date("2025-03-16"),
    status: "Xuất",
    details: [{ id: 2, issueNoteId: 2, productId: 1, quantity: 20 }],
  },
];

const IssueNoteListPage: React.FC<IssueNoteListPageProps> = ({ handleChangePage }) => {
  const [filteredNotes, setFilteredNotes] = useState<IssueNote[]>(SAMPLE_ISSUE_NOTES);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("");
//   const [dateRange, setDateRange] = useState<[string, string] | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

//   const uniqueStatuses = Array.from(new Set(SAMPLE_ISSUE_NOTES.map(note => note.status)));

//   const filterNotes = () => {
//     let filteredData = [...SAMPLE_ISSUE_NOTES];

//     if (searchTerm.trim()) {
//       filteredData = filteredData.filter((note) =>
//         note.issueNoteCode.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter) {
//       filteredData = filteredData.filter((note) => note.status === statusFilter);
//     }

//     if (dateRange) {
//       filteredData = filteredData.filter((note) => {
//         const createdDate = new Date(note.createdDate);
//         return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
//       });
//     }

//     setFilteredNotes(filteredData);
//   };

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
  };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredNotes);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachPhieuXuatNhap");
//     XLSX.writeFile(workbook, "DanhSachPhieuXuatNhap.xlsx");
//   };

//   const printTable = () => {
//     const selectedNotes = selectedRowKeys.length > 0
//       ? filteredNotes.filter((note) => selectedRowKeys.includes(note.id))
//       : filteredNotes;

//     if (selectedNotes.length === 0) {
//       alert("Không có phiếu nào được chọn để in.");
//       return;
//     }

//     const printContents = `
//       <div style="text-align: center; margin-bottom: 20px;">
//         <h2>Danh sách phiếu xuất nhập</h2>
//       </div>
//       <table border="1" style="width: 100%; border-collapse: collapse;">
//         <thead>
//           <tr>
//             <th>Mã Phiếu</th>
//             <th>Trạng Thái</th>
//             <th>Người Tạo</th>
//             <th>Tổng Tiền</th>
//             <th>Ngày Tạo</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${selectedNotes
//         .map((note) => `
//             <tr>
//               <td>${note.issueNoteCode}</td>
//               <td>${note.status}</td>
//               <td>${note.createdBy}</td>
//               <td>${note.totalAmount.toLocaleString()} VND</td>
//               <td>${new Date(note.createdDate).toLocaleDateString("vi-VN")}</td>
//             </tr>
//           `)
//         .join("")}
//         </tbody>
//       </table>
//     `;

//     const printWindow = window.open("", "", "height=800,width=1000");
//     if (printWindow) {
//       printWindow.document.write("<html><head><title>Print</title></head><body>");
//       printWindow.document.write(printContents);
//       printWindow.document.write("</body></html>");
//       printWindow.document.close();
//       printWindow.print();
//     }
//   };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách phiếu nhập kho</h1>
          <p className="text-sm text-gray-500">Quản lý phiếu nhập kho</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-5">
        {/* <div className="flex gap-4 mb-4">
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
        </div> */}

        {/* {showFilters && (
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
                      setFilteredNotes(SAMPLE_ISSUE_NOTES);
                    }}
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </Panel>
          </Collapse>
        )} */}

        <div id="printableArea">
          <IssueNoteTable
            notes={filteredNotes}
            handleChangePage={handleChangePage}
            onDelete={(id) => setFilteredNotes(filteredNotes.filter(note => note.id !== id))}
            onUpdate={(updatedNote) => setFilteredNotes(filteredNotes.map(note => note.id === updatedNote.id ? updatedNote : note))}
            rowSelection={{
              selectedRowKeys,
              onChange: handleRowSelectionChange,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IssueNoteListPage;