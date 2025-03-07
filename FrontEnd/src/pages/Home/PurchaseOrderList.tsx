import React, { useState } from 'react'; 
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import PurchaseOrderTable from '../../components/PurchaseOrder/PurchaseOrderTable'; // Đảm bảo bạn đã tạo PurchaseOrderTable

interface PurchaseOrder {
    purchaseOrderId: number;
    purchaseOrderCode: string;
    supplierName: string;
    date: string; // Định dạng ngày
    goodsIssueDate: string; // Định dạng ngày
    totalAmount: number;
    createdBy: string;
    createdDate: string; // Định dạng ngày
    status: string;
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
    date: "2023-01-10",
    goodsIssueDate: "2023-01-15",
    totalAmount: 1500,
    createdBy: "Admin",
    createdDate: "2023-01-10T00:00:00Z",
    status: "Completed",
    deliveryFee: 50,
    address: "123 Main St",
  },
  {
    purchaseOrderId: 2,
    purchaseOrderCode: "PO-002",
    supplierName: "Supplier B",
    date: "2023-01-11",
    goodsIssueDate: "2023-01-16",
    totalAmount: 2000,
    createdBy: "Admin",
    createdDate: "2023-01-11T00:00:00Z",
    status: "Pending",
    deliveryFee: 75,
    address: "456 Elm St",
  },
  {
    purchaseOrderId: 3,
    purchaseOrderCode: "PO-003",
    supplierName: "Supplier C",
    date: "2023-01-11",
    goodsIssueDate: "2023-01-16",
    totalAmount: 2000,
    createdBy: "Admin",
    createdDate: "2023-01-11T00:00:00Z",
    status: "Pending",
    deliveryFee: 75,
    address: "456 Elm St",
  },
  {
    purchaseOrderId: 4,
    purchaseOrderCode: "PO-004",
    supplierName: "Supplier D",
    date: "2023-01-11",
    goodsIssueDate: "2023-01-16",
    totalAmount: 2000,
    createdBy: "Admin",
    createdDate: "2023-01-11T00:00:00Z",
    status: "Pending",
    deliveryFee: 75,
    address: "456 Elm St",
  },
];

const PurchaseOrderListPage: React.FC<PurchaseOrderListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>(PURCHASE_ORDERS_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = PURCHASE_ORDERS_DATA.filter(order =>
      order.purchaseOrderCode.toLowerCase().includes(value.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách đơn đặt hàng(PO)</h1>
          <p className="text-sm text-gray-500">Quản lý đơn đặt hàng(PO)</p>
        </div>
        <button 
          onClick={() => handleChangePage('Thêm đơn đặt hàng(PO)')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Thêm đơn đặt hàng mới
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
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
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