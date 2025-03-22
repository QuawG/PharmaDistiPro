import React, { useState } from "react";
import { FileText, Table, Printer } from "lucide-react";
// import { PlusIcon } from "@heroicons/react/24/outline";
import LotTable from "../../components/Lot/LotTable";
import { ITEM_DATA } from "../../components/data/ItemData";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Lot {
  id: number;
  LotCode: string;
  ProductName: string;
  Status: string;
  SupplyPrice: number;
  ManufacturedDate: string;
  ExpiredDate: string;
  Quantity: number;
  CreatedBy: string;
  CreatedDate: string;
}

const LotListPage: React.FC<{ handleChangePage: (page: string) => void }> = ({ handleChangePage }) => {
  const [lotCode, setLotCode] = useState("");
  const [productName, setProductName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredLots, setFilteredLots] = useState<Lot[]>(ITEM_DATA);


  const handleFilter = () => {
    let filteredData = [...ITEM_DATA];
  
    if (lotCode.trim()) {
      filteredData = filteredData.filter((lot) =>
        lot.LotCode.toLowerCase().includes(lotCode.toLowerCase())
      );
    }
    if (productName.trim()) {
      filteredData = filteredData.filter((lot) =>
        lot.ProductName.toLowerCase().includes(productName.toLowerCase())
      );
    }
    if (status !== "") {
      filteredData = filteredData.filter((lot) => lot.Status.toString() === status);
    }
    
  
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
  
    if (start && end && start > end) {
      alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
      return;
    }
  
    if (start) {
      filteredData = filteredData.filter(
        (lot) => new Date(lot.ExpiredDate).setHours(0, 0, 0, 0) >= start
      );
    }
  
    if (end) {
      filteredData = filteredData.filter(
        (lot) => new Date(lot.ExpiredDate).setHours(0, 0, 0, 0) <= end
      );
    }
  
    setFilteredLots(filteredData);
  };
  

  // Xuất Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLots);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachLoHang");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(data, "DanhSachLoHang.xlsx");
  };

  const handleClearFilter = () => {
    setLotCode("");
    setProductName("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setFilteredLots(ITEM_DATA);
  };
  

  // Thêm mới lô hàng
  

  return (
    <div className="p-6 mt-16 overflow-auto w-full bg-gray-100">
      <h1 className="text-xl font-semibold text-gray-900 ">Danh sách lô hàng</h1>

      {/* Bộ lọc */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex gap-3">
          <input type="text" placeholder="Mã lô" className="border px-4 py-1 w-20" value={lotCode} onChange={(e) => setLotCode(e.target.value)} />
          <input type="text" placeholder="Tên sản phẩm" className="border px-4 py-1 w-30" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <select className="border px-3 py-1 w-30" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tình trạng</option>
            <option value="Còn hàng">Còn hàng</option>
            <option value="Đã hết hàng">Đã hết hàng</option>
            <option value="Đã hết hạn">Đã hết hạn</option>
            <option value="Tạm ngưng bán">Tạm ngưng bán</option>
            
          </select>
          <input type="date" className="border px-3 py-1 w-35" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className="border px-3 py-1 w-35" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button onClick={handleFilter} className="bg-orange-500 text-white px-4 py-1 rounded-lg">Lọc</button>
<button onClick={handleClearFilter} className="bg-orange-500 text-white px-4 py-1 rounded-lg">Xóa bộ lọc</button>
<button 
          onClick={() => handleChangePage("Tạo lô hàng")} 
          className="bg-orange-500 text-white px-4 py-1 rounded-lg"
        >
          +Tạo lô hàng
        </button>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FileText className="w-5 h-5" /></button>
            <button onClick={exportToExcel} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><Table className="w-5 h-5" /></button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Printer className="w-5 h-5" /></button>
          </div>
        </div>
        
      </div>

      {/* Bảng dữ liệu */}
      <LotTable ITEM_DATA={filteredLots} />

      
    </div>
  );
};

export default LotListPage;
