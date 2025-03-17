import React, { useState, useEffect } from "react";
import { Trash, FileText, Edit, SortAsc, SortDesc } from "lucide-react";

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

interface LotTableProps {
  ITEM_DATA: Lot[];
}

const LotTable: React.FC<LotTableProps> = ({ ITEM_DATA }) => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [sortField, setSortField] = useState<keyof Lot | "RemainingDays" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Dữ liệu lô hàng:", ITEM_DATA); // Kiểm tra dữ liệu đầu vào
    setLots(ITEM_DATA);
  }, [ITEM_DATA]);
  // Tính số ngày còn hạn
  const calculateRemainingDays = (expiredDate: string) => {
    const today = new Date();
    return Math.floor((new Date(expiredDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Sắp xếp dữ liệu
  const handleSort = (field: keyof Lot | "RemainingDays") => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedData = [...lots].sort((a, b) => {
      let valA: number | string, valB: number | string;

      if (field === "RemainingDays") {
        valA = calculateRemainingDays(a.ExpiredDate);
        valB = calculateRemainingDays(b.ExpiredDate);
      } else {
        valA = typeof a[field] === "boolean" ? Number(a[field]) : (a[field] as number | string);
        valB = typeof b[field] === "boolean" ? Number(b[field]) : (b[field] as number | string);
      }

      if (valA < valB) return newSortOrder === "asc" ? -1 : 1;
      if (valA > valB) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });


    setLots(sortedData);
  };

  // Xóa lô hàng
  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lô hàng này không?")) {
      setLots(lots.filter((lot) => lot.id !== id));
    }
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Xem thông tin chi tiết
  const handleView = (lot: Lot) => {
    setSelectedLot(lot);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {["LotCode", "ProductName", "ManufacturedDate", "ExpiredDate", "Quantity", "RemainingDays", "Status", "Actions"].map((field) => (
              <th key={field} className="px-4 py-3 text-left text-sm font-bold">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort(field as keyof Lot | "RemainingDays")}>
                  {field === "LotCode" && "Mã lô"}
                  {field === "ProductName" && "Tên sản phẩm"}
                  {field === "ManufacturedDate" && "Ngày SX"}
                  {field === "ExpiredDate" && "HSD"}
                  {field === "Quantity" && "Tồn kho"}
                  {field === "RemainingDays" && "Số ngày còn hạn"}
                  {field === "Status" && "Trạng thái"}
                  {field === "Actions" && "Thao tác"}
                  {sortField === field && (sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lots.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center px-4 py-3 text-sm">Không có dữ liệu</td>
            </tr>
          ) : (
            lots.map((lot) => (
              <tr key={lot.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{lot.LotCode}</td>
                <td className="px-4 py-3 text-sm">{lot.ProductName}</td>
                <td className="px-4 py-3 text-sm">{formatDate(lot.ManufacturedDate)}</td>
                <td className="px-4 py-3 text-sm">{formatDate(lot.ExpiredDate)}</td>
                <td className="px-4 py-3 text-sm">{lot.Quantity}</td>
                <td className="px-4 py-3 text-sm">
                  {calculateRemainingDays(lot.ExpiredDate)} ngày
                </td>
                <td className="px-4 py-3 text-sm">
                
                  <span
                    className={
                      lot.Status === "Còn hàng"
                        ? "text-green-500"
                        : lot.Status === "Đã hết hàng"
                          ? "text-red-500"
                          : lot.Status === "Đã hết hạn"
                            ? "text-gray-500"
                            : lot.Status === "Tạm ngưng bán"
                              ? "text-yellow-500"
                              : "text-blue-500"
                    }
                  >
                    {lot.Status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm flex space-x-2">
                  <button className="p-1 text-blue-600 hover:bg-gray-200 rounded" onClick={() => handleView(lot)}>
                    <FileText className="w-5 h-5" />
                  </button>
                  <button className="p-1 text-green-600 hover:bg-gray-200 rounded">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-gray-200 rounded" onClick={() => handleDelete(lot.id)}>
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Xem Chi Tiết */}
      {isModalOpen && selectedLot && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
              ✖️
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">Thông tin lô hàng</h2>
            <div className="grid gap-3">
              <div>
                <label className="block text-gray-600">Mã lô</label>
                <input type="text" value={selectedLot.LotCode} disabled className="border border-gray-300 rounded-lg px-3 py-1 w-full" />
              </div>
              <div>
                <label className="block text-gray-600">Tên sản phẩm</label>
                <input type="text" value={selectedLot.ProductName} disabled className="border border-gray-300 rounded-lg px-3 py-1 w-full" />
              </div>
              <div>
                <label className="block text-gray-600">Giá nhập</label>
                <input type="number" value={selectedLot.SupplyPrice} disabled className="border border-gray-300 rounded-lg px-3 py-1 w-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotTable;
