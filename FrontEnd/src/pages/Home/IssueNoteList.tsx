import React, { useRef,useState } from "react";
import { FileText, Table, Printer } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import IssueNoteTable from "../../components/IssueNote/IssueNoteTable";
// import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";


interface IssueNoteListPageProps {
    handleChangePage: (page: string, ReceiveNoteId?: number) => void;
    
  }
// Interface cho IssueNotes
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
  
  // Interface cho IssueNoteDetails
  interface IssueNoteDetail {
    id: number;
    issueNoteId: number;
    productId: number;
    quantity: number;
  }
  
  // Dữ liệu mẫu
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
      details: [
        { id: 1, issueNoteId: 1, productId: 1, quantity: 50 },
        { id: 2, issueNoteId: 1, productId: 2, quantity: 30 },
      ],
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
      details: [
        { id: 3, issueNoteId: 2, productId: 1, quantity: 20 },
      ],
    },
];


const IssueNoteListPage: React.FC<IssueNoteListPageProps> = ({ handleChangePage }) => {
    console.log("🔄 Render IssueNoteListPage");
    const [searchCode, setSearchCode] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredNotes, setFilteredNotes] = useState(SAMPLE_ISSUE_NOTES);

    // Lọc dữ liệu
    const handleFilter = () => {
        let filteredData = [...SAMPLE_ISSUE_NOTES];

        if (searchCode.trim()) {
            filteredData = filteredData.filter((note) =>
                note.issueNoteCode.toLowerCase().includes(searchCode.toLowerCase())
            );
        }
        if (status) {
            filteredData = filteredData.filter((note) => note.status === status);
        }

        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

        if (start && end && start > end) {
            alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
            return;
        }

        if (start) {
            filteredData = filteredData.filter(
                (note) => new Date(note.createdDate).setHours(0, 0, 0, 0) >= start
            );
        }

        if (end) {
            filteredData = filteredData.filter(
                (note) => new Date(note.createdDate).setHours(0, 0, 0, 0) <= end
            );
        }

        setFilteredNotes(filteredData);
    };

    // Xóa bộ lọc
    const handleClearFilter = () => {
        setSearchCode("");
        setStatus("");
        setStartDate("");
        setEndDate("");
        setFilteredNotes(SAMPLE_ISSUE_NOTES);
    };

    // Xuất Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredNotes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachPhieuXuatNhap");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(data, "DanhSachPhieuXuatNhap.xlsx");
    };

    // Xuất file văn bản
    const exportToTextFile = () => {
        let content = "Danh sách phiếu xuất nhập kho:\n\n";
        filteredNotes.forEach((note) => {
            content += `Mã phiếu: ${note.issueNoteCode}\n`;
            content += `Trạng thái: ${note.status}\n`;
            content += `Ngày tạo: ${note.createdDate}\n\n`;
        });

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "DanhSachPhieuXuatNhap.txt");
    };
    const printRef = useRef<HTMLDivElement>(null);

    // Giả lập chức năng in
    const printData = () => {
        if (printRef.current) {
            const printContent = printRef.current.innerHTML;
            const originalContent = document.body.innerHTML;
            
            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); // Tránh lỗi giao diện sau khi in
        }
    };
    

    const handleDelete = (id: number) => {
        setFilteredNotes((prev) => prev.filter((note) => note.id !== id));
    };
    const handleUpdateNote = (updatedNote: IssueNote) => {
        setFilteredNotes((prev) =>
            prev.map((note) =>
                note.id === updatedNote.id ? updatedNote : note
            )
        );
    };

    
    return (
        <div className="p-6 mt-16 overflow-auto w-full bg-gray-100">
            <h1 className="text-xl font-semibold text-gray-900">Danh sách phiếu nhập kho</h1>
            

            {/* Bộ lọc */}
            <div className="bg-white rounded-lg shadow p-5 mt-5">
                <div className="flex gap-3">
                    <input type="text" placeholder="Mã phiếu" className="border px-4 py-1 w-40" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
                    <select className="border px-3 py-1 w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Trạng thái</option>
                        <option value="Nhập">Nhập</option>
                        <option value="Xuất">Xuất</option>
                    </select>
                    <input type="date" className="border px-3 py-1 w-40" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" className="border px-3 py-1 w-40" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    <button onClick={handleFilter} className="bg-orange-500 text-white px-4 py-1 rounded-lg">Lọc</button>
                    <button onClick={handleClearFilter} className="bg-orange-500 text-white px-4 py-1 rounded-lg">Xóa bộ lọc</button>
                    <button
                              onClick={() => handleChangePage("Tạo phiếu nhập kho")}
                              className="bg-orange-500 text-white px-4 py-1 rounded-lg"
                            >
                             +Tạo phiếu mới
                            </button>
                    <div className="flex gap-2">
                        <button onClick={exportToTextFile} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </button>
                        <button onClick={exportToExcel} className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
                            <Table className="w-5 h-5" />
                        </button>
                        <button onClick={printData} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                            <Printer className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Component bảng */}
            <div ref={printRef} className="bg-white rounded-lg shadow p-5 mt-5">
    <IssueNoteTable notes={filteredNotes} onDelete={handleDelete}  onUpdate={handleUpdateNote} />
</div>
        </div>
    );
};

export default IssueNoteListPage;
