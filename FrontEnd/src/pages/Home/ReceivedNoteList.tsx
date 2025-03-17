import React, { useRef,useState } from "react";
import { FileText, Table, Printer } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReceivedNoteTable from "../../components/ReceivedNote/ReceivedNoteTable";


interface ReceivedNote {
    ReceiveNoteId: number;
    ReceiveNotesCode: string;
    PurchaseOrderId: number;
    Status: string;
    DeliveryPerson: string;
    TotalAmount: number;
    CreatedBy: string;
    CreatedDate: string;
    Details: ReceivedNoteDetail[];
}

interface ReceivedNoteDetail {
    ReceiveNoteDetailId: number;
    NoteNumber: number;
    ProductLotId: number;
    ProductName: string;
    ProductCode: string;
    LotCode: string;
    Unit: string;
    ActualReceived: number;
    SupplyPrice: number;
}

// Dữ liệu mẫu
const SAMPLE_RECEIVED_NOTES: ReceivedNote[] = [
    {
        ReceiveNoteId: 5,
        ReceiveNotesCode: "Note1",
        PurchaseOrderId: 1,
        Status: "Nhập",
        DeliveryPerson: "Hiếu",
        TotalAmount: 3400000,
        CreatedBy: "HieuLD",
        CreatedDate: "15-03-2025",
        Details: [
            { ReceiveNoteDetailId: 1, NoteNumber: 100, ProductLotId: 1, ProductName: "Vương Niệu Đan", ProductCode: "SP01", LotCode: "Lo1", Unit: "Hộp", ActualReceived: 50, SupplyPrice: 50000 },
            { ReceiveNoteDetailId: 2, NoteNumber: 30, ProductLotId: 2, ProductName: "Khương Thảo Đan", ProductCode: "SP02", LotCode: "Lo1", Unit: "Hộp", ActualReceived: 30, SupplyPrice: 30000 },
        ],
    },
    {
        ReceiveNoteId: 1,
        ReceiveNotesCode: "Note2",
        PurchaseOrderId: 2,
        Status: "Nhập",
        DeliveryPerson: "Hiếu",
        TotalAmount: 300000,
        CreatedBy: "HieuLD",
        CreatedDate: "15-03-2025",
        Details: [
            { ReceiveNoteDetailId: 1, NoteNumber: 100, ProductLotId: 1, ProductName: "Vương Niệu Đan", ProductCode: "SP01", LotCode: "Lo1", Unit: "Hộp", ActualReceived: 50, SupplyPrice: 50000 },
            
        ],
    },
];

const ReceivedNoteListPage: React.FC = () => {
    const [searchCode, setSearchCode] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredNotes, setFilteredNotes] = useState(SAMPLE_RECEIVED_NOTES);

    // Lọc dữ liệu
    const handleFilter = () => {
        let filteredData = [...SAMPLE_RECEIVED_NOTES];

        if (searchCode.trim()) {
            filteredData = filteredData.filter((note) =>
                note.ReceiveNotesCode.toLowerCase().includes(searchCode.toLowerCase())
            );
        }
        if (status) {
            filteredData = filteredData.filter((note) => note.Status === status);
        }

        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

        if (start && end && start > end) {
            alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
            return;
        }

        if (start) {
            filteredData = filteredData.filter(
                (note) => new Date(note.CreatedDate).setHours(0, 0, 0, 0) >= start
            );
        }

        if (end) {
            filteredData = filteredData.filter(
                (note) => new Date(note.CreatedDate).setHours(0, 0, 0, 0) <= end
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
        setFilteredNotes(SAMPLE_RECEIVED_NOTES);
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
            content += `Mã phiếu: ${note.ReceiveNotesCode}\n`;
            content += `Trạng thái: ${note.Status}\n`;
            content += `Ngày tạo: ${note.CreatedDate}\n\n`;
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
        setFilteredNotes((prev) => prev.filter((note) => note.ReceiveNoteId !== id));
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
    <ReceivedNoteTable notes={filteredNotes} onDelete={handleDelete} />
</div>
        </div>
    );
};

export default ReceivedNoteListPage;
