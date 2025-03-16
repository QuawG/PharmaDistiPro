import React, { useState } from "react";
import { FileText, Table, Printer } from "lucide-react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ProductTable from "../../components/Product/ProductTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PRODUCTS_DATA } from "../../components/data/product";

interface ProductListPageProps {
  handleChangePage: (page: string, productId?: number) => void;
}

interface Product {
  id: number;
  ProductCode: string;
  Manufacturer: string;
  ProductName: string;
  unit: string;
  category: string;
  subCategory: string;
  Description: string;
  status: string;
  VAT: string;
  image: string;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = PRODUCTS_DATA.filter((product) =>
      product.ProductName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Hàm xuất dữ liệu ra file Excel có định dạng sẵn
  const exportToExcel = async () => {
    try {
      // 1️⃣ Đọc file template.xlsx từ thư mục public
      const response = await fetch("/templates/DanhSachSanPham.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
  
      // 2️⃣ Kiểm tra sheet "DanhSachSanPham"
      const sheetName = workbook.SheetNames[0]; // Lấy tên sheet đầu tiên thay vì hardcode

      let worksheet = workbook.Sheets[sheetName];
  
      if (!worksheet) {
        console.error(`Lỗi: Sheet "${sheetName}" không tồn tại trong file Excel mẫu.`);
        return;
      }
  
      // 3️⃣ Xác định vị trí bắt đầu nhập dữ liệu (bỏ qua tiêu đề)
      const startRow = 4; // Ví dụ: dữ liệu bắt đầu từ dòng 2 (dòng 1 là tiêu đề)
      
      // 4️⃣ Chèn dữ liệu từ `filteredProducts` vào file Excel
      filteredProducts.forEach((product, index) => {
        const row = startRow + index; // Xác định dòng cần điền dữ liệu
  
        worksheet[`A${row}`] = { v: product.ProductName }; // Cột A: ID sản phẩm
        worksheet[`B${row}`] = { v: product.ProductCode }; // Cột B: Mã sản phẩm
        worksheet[`C${row}`] = { v: product.category }; // Cột C: Hãng sản xuất
        worksheet[`D${row}`] = { v: product.subCategory}; // Cột D: Tên sản phẩm
        worksheet[`E${row}`] = { v: product.Manufacturer }; // Cột E: Đơn vị
        worksheet[`F${row}`] = { v: product.Description }; // Cột F: Danh mục
        worksheet[`G${row}`] = { v: product.unit }; // Cột G: Mô tả
        worksheet[`H${row}`] = { v: product.VAT }; // Cột H: Trạng thái
        worksheet[`I${row}`] = { v: product.status }; // Cột I: Thuế VAT
       
      });
  
      // 5️⃣ Xuất file Excel với định dạng của template
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
  
      saveAs(data, "DanhSachSanPham.xlsx");
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
    }
  };
  

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách sản phẩm</h1>
          <p className="text-sm text-gray-500">Quản lý sản phẩm</p>
        </div>
        <button
          onClick={() => handleChangePage("Tạo sản phẩm")}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5 font-bold" /> Tạo sản phẩm mới
        </button>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9F43] p-2 rounded-lg">
              <FunnelIcon className="w-5 h-5 text-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8 pr-4 py-1 border border-gray-300 rounded-lg w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button onClick={exportToExcel} className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <ProductTable PRODUCTS_DATA={filteredProducts} handleChangePage={handleChangePage} />
      </div>
    </div>
  );
};

export default ProductListPage;
