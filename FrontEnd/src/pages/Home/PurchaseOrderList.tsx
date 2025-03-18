import React, { useState } from 'react';
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import PurchaseOrderTable from '../../components/PurchaseOrder/PurchaseOrderTable';

interface PurchaseOrder {
  purchaseOrderId: number;
  purchaseOrderCode: string;
  supplierName: string;
  date: string;
  goodsIssueDate: string;
  totalAmount: number;
  createdBy: string;
  createdDate: string;
  status: string; // Thêm thuộc tính status
  deliveryFee: number;
  address: string;
}

interface PurchaseOrderListPageProps {
  handleChangePage: (page: string) => void;
}

const PURCHASE_ORDERS_DATA: PurchaseOrder[] = [
  {
    purchaseOrderId: 1,
    purchaseOrderCode: "PO-001",
    supplierName: "Supplier A",
    date: "2025-01-10",
    goodsIssueDate: "2025-01-15",
    totalAmount: 1500,
    createdBy: "Admin",
    createdDate: "2025-01-10T00:00:00Z",
    status: "Completed",
    deliveryFee: 50,
    address: "123 Main St",
  },
  {
    purchaseOrderId: 2,
    purchaseOrderCode: "PO-002",
    supplierName: "Supplier B",
    date: "2025-01-11",
    goodsIssueDate: "2025-01-16",
    totalAmount: 2000,
    createdBy: "Admin",
    createdDate: "2025-01-11T00:00:00Z",
    status: "Pending",
    deliveryFee: 75,
    address: "456 Elm St",
  },
  {
    purchaseOrderId: 3,
    purchaseOrderCode: "PO-003",
    supplierName: "Supplier B",
    date: "2025-02-14",
    goodsIssueDate: "2025-02-16",
    totalAmount: 2000,
    createdBy: "Admin",
    createdDate: "2025-01-14T00:00:00Z",
    status: "Pending",
    deliveryFee: 75,
    address: "456 Elm St",
  },
  {
    purchaseOrderId: 4,
    purchaseOrderCode: "PO-004",
    supplierName: "Supplier C",
    date: "2025-03-14",
    goodsIssueDate: "2025-03-16",
    totalAmount: 2000,
    createdBy: "Admin",
    createdDate: "2025-03-14T00:00:00Z",
    status: "Completed",
    deliveryFee: 75,
    address: "456 Elm St",
  }
];

const PurchaseOrderListPage: React.FC<PurchaseOrderListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Thêm trạng thái được chọn
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>(PURCHASE_ORDERS_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterOrders(value, startDate, endDate, selectedStatus);
  };

  const filterOrders = (searchTerm: string, startDate: string, endDate: string, status: string) => {
    const filtered = PURCHASE_ORDERS_DATA.filter(order => {
      const matchesCode = order.purchaseOrderCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSupplier = order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

      const orderDate = new Date(order.date);
      const isWithinDateRange =
        (!startDate && !endDate) ||
        (orderDate >= new Date(startDate) && orderDate <= new Date(endDate));

      const matchesStatus = !status || order.status === status; // Kiểm tra trạng thái

      return (matchesCode || matchesSupplier) && isWithinDateRange && matchesStatus;
    });
    setFilteredOrders(filtered);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterOrders(searchTerm, startDate, endDate, status);
  };

  // 📤 Xuất danh sách đơn hàng ra Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseOrders");

    // Xuất file
    XLSX.writeFile(workbook, "PurchaseOrders.xlsx");
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách đơn đặt hàng (PO)</h1>
          <p className="text-sm text-gray-500">Quản lý đơn đặt hàng</p>
        </div>
        <button 
          onClick={() => handleChangePage('Tạo đơn đặt hàng(PO)')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Tạo đơn đặt hàng mới
        </button>
      </div>

      {/* Search and Actions */}
      <div className='bg-white rounded-lg shadow p-5'>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9F43] p-2 rounded-lg">
              <FunnelIcon className="w-5 h-5 text-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-1 border border-gray-300 rounded-lg w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  filterOrders(searchTerm, e.target.value, endDate, selectedStatus);
                }}
                className="border rounded p-1"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  filterOrders(searchTerm, startDate, e.target.value, selectedStatus);
                }}
                className="border rounded p-1"
              />
              {/* Dropdown cho trạng thái */}
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="border rounded p-1"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Completed">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Pending">Đang chờ</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
              onClick={exportToExcel}
            >
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <PurchaseOrderTable PURCHASE_ORDERS_DATA={filteredOrders} />
      </div>
    </div>
  );
};

export default PurchaseOrderListPage;