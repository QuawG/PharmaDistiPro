// src/pages/OrderListForSalesManager.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderTableForSalesManager from "../../components/Order/OrderTableForSalesManager";
import { useAuth } from "./AuthContext"; // Import AuthContext
import { Result } from "antd"; // Import Result để hiển thị thông báo lỗi

interface Order {
  orderId: number;
  orderCode: string;
  customerId: number;
  updatedStatusDate: string;
  stockReleaseDate: string | null;
  totalAmount: number;
  status: number;
  wardCode: string;
  districtId: number;
  deliveryFee: number | null;
  address: string | null;
  confirmedBy: number | null;
  createdDate: string;
  assignTo: number | null;
  customer: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  };
}

interface OrderListPageProps {
  handleChangePage: (page: string, orderId?: number) => void;
}

const OrderListForSalesManager: React.FC<OrderListPageProps> = ({ handleChangePage }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Order/GetAllOrders");
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    // Chỉ gọi API nếu người dùng là Sales Manager
    if (user?.roleName === "SalesManager") {
      fetchOrders();
    }
  }, [user]);

  // Nếu không phải Sales Manager, hiển thị thông báo không có quyền truy cập
  if (!user || user.roleName !== "SalesManager") {
    return (
      <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        />
      </div>
    );
  }

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách đơn hàng (Sales Manager)</h1>
          <p className="text-sm text-gray-500">Quản lý đơn hàng của bạn</p>
        </div>
      </div>

      <OrderTableForSalesManager orders={orders} handleChangePage={handleChangePage} />
    </div>
  );
};

export default OrderListForSalesManager;