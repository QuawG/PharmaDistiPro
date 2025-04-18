import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faFileLines,
  faMoneyBills,
} from "@fortawesome/free-solid-svg-icons";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import axios from "axios";

interface Supplier {
  supplierId: number | null;
  amountPaid: number;
  supplier: { supplierName: string } | null;
}

interface PurchaseOrder {
  purchaseOrderId: number;
  totalAmount: number;
  createdDate: string;
}

interface Order {
  orderId: number;
  totalAmount: number;
  createdDate: string;
  customerId: number;
}

interface Customer {
  customerId: number;
  totalRevenue: number;
  customer: { firstName: string; lastName: string };
}

interface OrderDetail {
  productId: number;
  totalQuantity: number;
  product: { productName: string; sellingPrice: number };
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseData, setPurchaseData] = useState<PurchaseOrder[]>([]);
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [productData, setProductData] = useState<OrderDetail[]>([]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          suppliersRes,
          purchasesRes,
          customersRes,
          productsRes,
          ordersRes,
        ] = await Promise.all([
          axios.get("http://pharmadistiprobe.fun/api/PurchaseOrders/GetTopSupplierList?topSupplier=10"),
          axios.get("http://pharmadistiprobe.fun/api/PurchaseOrders/GetPurchaseOrdersRevenueList"),
          axios.get("http://pharmadistiprobe.fun/api/Order/GetTopCustomerRevenue?topCustomer=10"),
          axios.get("http://pharmadistiprobe.fun/api/Order/GetAllOrderDetails?topProduct=10"),
          axios.get("http://pharmadistiprobe.fun/api/Order/GetOrdersRevenueList"),
        ]);

        // Xử lý dữ liệu
        const suppliers: Supplier[] = suppliersRes.data.data;
        const purchases: PurchaseOrder[] = purchasesRes.data.data.map((p: any) => ({
          purchaseOrderId: p.purchaseOrderId,
          totalAmount: p.totalAmount,
          createdDate: p.createDate,
        }));
        const customers: Customer[] = customersRes.data.data;
        const products: OrderDetail[] = productsRes.data.data;
        const orders: Order[] = ordersRes.data.data;

        // Debug: Log chi tiết purchaseData và suppliers
        console.log("Purchase Data:", purchases);
        purchases.forEach(p => {
          console.log(`Purchase ID: ${p.purchaseOrderId}, Total Amount: ${p.totalAmount}, Created Date: ${p.createdDate}`);
        });
        console.log("Suppliers Data:", suppliers);
        suppliers.forEach(s => {
          console.log(`Supplier ID: ${s.supplierId}, Amount Paid: ${s.amountPaid}, Supplier Name: ${s.supplier?.supplierName || "Không xác định"}`);
        });

        setSuppliers(suppliers);
        setTotalPurchase(purchases.reduce((sum: number, p: PurchaseOrder) => sum + (p.totalAmount || 0), 0));
        setTotalRevenue(orders.reduce((sum: number, o: Order) => sum + (o.totalAmount || 0), 0));
        setOrderCount(orders.length);
        setPurchaseData(purchases);
        setOrderData(orders);
        setCustomerData(customers);
        setProductData(products);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu từ API!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý dữ liệu biểu đồ
  const getMonthlyData = (data: (PurchaseOrder | Order)[]) => {
    // Lấy danh sách tháng từ dữ liệu
    const months = Array.from(
      new Set(
        data
          .filter(d => d.createdDate && !isNaN(new Date(d.createdDate).getTime()))
          .map(d => {
            const date = new Date(d.createdDate);
            return `${date.getMonth() + 1}-${date.getFullYear()}`;
          })
      )
    ).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);
      return yearA - yearB || monthA - monthB;
    });

    const monthlyData = months.map(month => {
      const [monthNum, year] = month.split("-").map(Number);
      const filteredData = data.filter(d => {
        if (!d.createdDate) return false;
        const date = new Date(d.createdDate);
        const isValid = !isNaN(date.getTime());
        const isSameMonth = date.getMonth() + 1 === monthNum && date.getFullYear() === year;
        // Debug: Log chi tiết
        const id = "purchaseOrderId" in d ? d.purchaseOrderId : ("orderId" in d ? d.orderId : "unknown");
        console.log(
          `ID: ${id}, Date: ${d.createdDate}, Parsed Month: ${date.getMonth() + 1}, Parsed Year: ${date.getFullYear()}, Valid: ${isValid}, Same Month: ${isSameMonth}`
        );
        return isValid && isSameMonth;
      });
      const total = filteredData.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
      console.log(`Month: ${month}, Filtered Data:`, filteredData, `Total: ${total}`);
      return total;
    });

    // Chuyển MM-YYYY thành dạng hiển thị
    const displayMonths = months.map(m => {
      const [month, year] = m.split("-").map(Number);
      return `Tháng ${month} ${year}`;
    });

    console.log("Monthly Purchase Data:", { months: displayMonths, monthlyData });
    if (!months.length) {
      return { months: ["Không có dữ liệu"], monthlyData: [0] };
    }
    return { months: displayMonths, monthlyData };
  };

  // Biểu đồ Chi Phí Mua Hàng
  const purchaseChartOptions: ApexOptions = {
    chart: { type: "line", height: 280, toolbar: { show: false } },
    stroke: { curve: "smooth" },
    title: { text: "Chi phí mua hàng", align: "left", style: { fontSize: "16px", color: "#111827" } },
    xaxis: { categories: getMonthlyData(purchaseData).months },
    yaxis: {
      title: { text: "Số tiền (VND)" },
      labels: { formatter: val => `${(val / 1000000).toFixed(1)}M` },
      min: 0,
      forceNiceScale: true,
    },
    fill: { opacity: 0.3 },
    colors: ["#EF4444"],
    tooltip: { y: { formatter: val => `${val.toLocaleString()} VND` } },
    noData: { text: "Không có dữ liệu chi phí mua hàng", align: "center", verticalAlign: "middle" },
  };

  const purchaseChartSeries = [
    { name: "Mua hàng", data: getMonthlyData(purchaseData).monthlyData },
  ];

  // Biểu đồ Doanh Thu Bán Hàng
  const salesChartOptions: ApexOptions = {
    chart: { type: "line", height: 280, toolbar: { show: false } },
    stroke: { curve: "smooth" },
    title: { text: "Doanh thu bán hàng", align: "left", style: { fontSize: "16px", color: "#111827" } },
    xaxis: { categories: getMonthlyData(orderData).months },
    yaxis: {
      title: { text: "Số tiền (VND)" },
      labels: { formatter: val => `${(val / 1000000).toFixed(1)}M` },
      min: 0,
      forceNiceScale: true,
    },
    fill: { opacity: 0.3 },
    colors: ["#3B82F6"],
    tooltip: { y: { formatter: val => `${val.toLocaleString()} VND` } },
    noData: { text: "Không có dữ liệu doanh thu bán hàng", align: "center", verticalAlign: "middle" },
  };

  const salesChartSeries = [
    { name: "Bán hàng", data: getMonthlyData(orderData).monthlyData },
  ];

  // Biểu đồ Sản Phẩm Bán Chạy (Số Lượng)
  const productQuantityChartOptions: ApexOptions = {
    chart: { type: "bar", height: 280, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    title: { text: "Sản phẩm bán chạy (số lượng)", align: "left", style: { fontSize: "16px", color: "#111827" } },
    xaxis: { categories: productData.map(p => p.product.productName), labels: { rotate: -45 } },
    yaxis: { title: { text: "Số lượng" }, min: 0 },
    colors: ["#10B981"],
    tooltip: { y: { formatter: val => `${val} đơn vị` } },
    noData: { text: "Không có dữ liệu sản phẩm", align: "center", verticalAlign: "middle" },
  };

  const productQuantityChartSeries = [
    { name: "Số Lượng", data: productData.map(p => p.totalQuantity) },
  ];

  // Biểu đồ Sản Phẩm Bán Chạy (Doanh Thu)
  const productRevenueChartOptions: ApexOptions = {
    chart: { type: "bar", height: 280, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    title: { text: "Sản phẩm bán chạy (doanh thu)", align: "left", style: { fontSize: "16px", color: "#111827" } },
    xaxis: { categories: productData.map(p => p.product.productName), labels: { rotate: -45 } },
    yaxis: {
      title: { text: "Doanh thu (VND)" },
      labels: { formatter: val => `${(val / 1000000).toFixed(1)}M` },
      min: 0,
    },
    colors: ["#3B82F6"],
    tooltip: { y: { formatter: val => `${val.toLocaleString()} VND` } },
    noData: { text: "Không có dữ liệu sản phẩm", align: "center", verticalAlign: "middle" },
  };

  const productRevenueChartSeries = [
    { name: "Doanh thu", data: productData.map(p => p.totalQuantity * p.product.sellingPrice) },
  ];

  // Biểu đồ Số Tiền Thanh Toán Theo Nhà Cung Cấp
  const supplierChartOptions: ApexOptions = {
    chart: { type: "bar", height: 280, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    title: { text: "Số tiền đã thanh toán theo nhà cung cấp", align: "left", style: { fontSize: "16px", color: "#111827" } },
    xaxis: {
      categories: suppliers.map(s => s.supplier?.supplierName || "Không xác định"),
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: "Số Tiền (VND)" },
      labels: { formatter: val => `${(val / 1000000).toFixed(1)}M` },
      min: 0,
    },
    colors: ["#F59E0B"],
    tooltip: { y: { formatter: val => `${val.toLocaleString()} VND` } },
    noData: { text: "Không có dữ liệu nhà cung cấp", align: "center", verticalAlign: "middle" },
  };

  const supplierChartSeries = [
    { name: "Số Tiền Thanh Toán", data: suppliers.map(s => s.amountPaid || 0) },
  ];

  // Biểu đồ Doanh Thu & Đơn Hàng Theo Khách Hàng
  const customerChartOptions: ApexOptions = {
    chart: { type: "bar", height: 280, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "45%", distributed: false } },
    title: { text: "Doanh thu & đơn hàng theo khách hàng", align: "left", style: { fontSize: "16px", color: "#111827" } },
    xaxis: {
      categories: customerData.map(c => `${c.customer.firstName} ${c.customer.lastName}`),
      labels: { rotate: -45 },
    },
    yaxis: [
      { title: { text: "Doanh thu (VND)" }, labels: { formatter: val => `${(val / 1000000).toFixed(1)}M` } },
      { opposite: true, title: { text: "Số đơn" } },
    ],
    colors: ["#3B82F6", "#10B981"],
    legend: { position: "top" },
    tooltip: {
      y: [
        { formatter: val => `${val.toLocaleString()} VND` },
        { formatter: val => `${val} đơn` },
      ],
    },
    noData: { text: "Không có dữ liệu khách hàng", align: "center", verticalAlign: "middle" },
  };

  const customerChartSeries = [
    { name: "Doanh thu", type: "column", data: customerData.map(c => c.totalRevenue) },
    {
      name: "Số đơn",
      type: "column",
      data: customerData.map(c => orderData.filter(o => o.customerId === c.customerId).length),
    },
  ];

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thống kê tài chính</h1>
          <p className="text-sm text-gray-600">Cập nhật: {new Date().toLocaleDateString("vi-VN")}</p>
        </div>

        {/* Thống kê tổng quan */}
        {loading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { icon: faMoneyBills, title: "Tổng doanh thu", value: `${(totalRevenue / 1000000).toFixed(1)}M VND`, color: "bg-blue-100 text-blue-600" },
              { icon: faBagShopping, title: "Tổng chi phí mua hàng", value: `${(totalPurchase / 1000000).toFixed(1)}M VND`, color: "bg-red-100 text-red-600" },
              { icon: faFileLines, title: "Số đơn hàng (Đã hoàn thành)", value: orderCount, color: "bg-green-100 text-green-600" },
            ].map((item, index) => (
              <div key={index} className={`bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 ${item.color}`}>
                <div className="p-3 rounded-full bg-opacity-20">
                  <FontAwesomeIcon icon={item.icon} className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {purchaseData.length === 0 || getMonthlyData(purchaseData).monthlyData.every(val => val === 0) ? (
              <div className="text-center text-gray-500">Không có dữ liệu chi phí mua hàng</div>
            ) : (
              <Chart options={purchaseChartOptions} series={purchaseChartSeries} type="line" height={280} />
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {orderData.length === 0 || getMonthlyData(orderData).monthlyData.every(val => val === 0) ? (
              <div className="text-center text-gray-500">Không có dữ liệu doanh thu bán hàng</div>
            ) : (
              <Chart options={salesChartOptions} series={salesChartSeries} type="line" height={280} />
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {productData.length === 0 ? (
              <div className="text-center text-gray-500">Không có dữ liệu sản phẩm</div>
            ) : (
              <Chart options={productQuantityChartOptions} series={productQuantityChartSeries} type="bar" height={280} />
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {productData.length === 0 ? (
              <div className="text-center text-gray-500">Không có dữ liệu sản phẩm</div>
            ) : (
              <Chart options={productRevenueChartOptions} series={productRevenueChartSeries} type="bar" height={280} />
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {suppliers.length === 0 || suppliers.every(s => s.amountPaid === 0) ? (
              <div className="text-center text-gray-500">Không có dữ liệu nhà cung cấp</div>
            ) : (
              <Chart options={supplierChartOptions} series={supplierChartSeries} type="bar" height={280} />
            )}
          </div>
        </div>

        {/* Biểu đồ khách hàng */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          {customerData.length === 0 ? (
            <div className="text-center text-gray-500">Không có dữ liệu khách hàng</div>
          ) : (
            <Chart options={customerChartOptions} series={customerChartSeries} type="bar" height={280} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;