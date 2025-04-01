import React, { useState } from "react";
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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(ORDERS_DATA);

  
  
  

  const handleUpdateOrder = (updatedOrder: Order) => {
    setFilteredOrders(prevOrders =>
      prevOrders.map(order => (order.orderId === updatedOrder.orderId ? updatedOrder : order))
    );
  };

  const handleDeleteOrder = (orderId: number) => {
    setFilteredOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
  };
  
  

  

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách đơn hàng</h1>
          <p className="text-sm text-gray-500">Quản lý đơn hàng của bạn</p>
        </div>
        
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-center mb-4">
         
          
        </div>

        {/* Table */}
        <OrderTable orders={filteredOrders} handleChangePage={handleChangePage} onUpdate={handleUpdateOrder} onDelete={handleDeleteOrder} />

      </div>
    </div>
  );
};

export default OrderListPage;
