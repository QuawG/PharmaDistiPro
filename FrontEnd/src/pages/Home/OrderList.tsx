import React, { useState } from "react";
import {  Table, Printer } from "lucide-react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import OrderTable from "../../components/Order/OrderTable";
// import { PRODUCTS_DATA } from "../../components/data/product";
// FileText,

interface OrderListPageProps {
    handleChangePage: (page: string, productId?: number) => void;
}

interface Order {
  orderId: number;
  orderCode: string;
  customerId: number;
  updatedStatusDate: Date;
  stockReleaseDate: Date;
  totalAmount: number;
  status: string;
  deliveryFee: number;
  address: string;
  confirmedBy?: number;
  createdDate: Date;
  assignTo?: number;
}

// interface OrderDetail {
//     orderDetailId: number;
//     orderId: number;
//     productId: number;
//     quantity: number;
//   }
// Dữ liệu mẫu
const ORDERS_DATA: Order[] = [
  {
    orderId: 1,
    orderCode: "ORD123",
    customerId: 101,
    updatedStatusDate: new Date(),
    stockReleaseDate: new Date(),
    totalAmount: 500000,
    status: "Đang xử lý",
    deliveryFee: 20000,
    address: "Hà Nội",
    createdDate: new Date(),
    assignTo: 5,
  },
  {
    orderId: 2,
    orderCode: "ORD456",
    customerId: 102,
    updatedStatusDate: new Date(),
    stockReleaseDate: new Date(),
    totalAmount: 750000,
    status: "Hoàn thành",
    deliveryFee: 30000,
    address: "TP HCM",
    createdDate: new Date(),
    assignTo: 2,
  },
];

// const ORDER_DETAILS: OrderDetail[] = [
//   { orderDetailId: 1, orderId: 1, productId: 1, quantity: 3 },
//   { orderDetailId: 2, orderId: 1, productId: 2, quantity: 2 },
//   { orderDetailId: 3, orderId: 2, productId: 3, quantity: 1 },
// ];

const OrderListPage: React.FC<OrderListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(ORDERS_DATA);

  
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredOrders(
      ORDERS_DATA.filter(order =>
        order.orderCode.toLowerCase().includes(value)
      )
    );
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setFilteredOrders(prevOrders =>
      prevOrders.map(order => (order.orderId === updatedOrder.orderId ? updatedOrder : order))
    );
  };

  const handleDeleteOrder = (orderId: number) => {
    setFilteredOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
  };
  
  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDonHang");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "DanhSachDonHang.xlsx");
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách đơn hàng</h1>
          <p className="text-sm text-gray-500">Quản lý đơn hàng của bạn</p>
        </div>
        <button
          onClick={() => handleChangePage("Tạo đơn hàng")}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5 font-bold" /> Tạo đơn hàng mới
        </button>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9F43] p-2 rounded-lg">
              <FunnelIcon className="w-5 h-5 text-white" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng..."
              className="pl-3 pr-4 py-1 border border-gray-300 rounded-lg w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={exportToExcel} className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <OrderTable orders={filteredOrders} handleChangePage={handleChangePage} onUpdate={handleUpdateOrder} onDelete={handleDeleteOrder} />

      </div>
    </div>
  );
};

export default OrderListPage;
