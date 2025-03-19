import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faBagShopping,
  faFile,
  faFileLines,
  faMoneyBills,
  faUser,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import ProductTable from "../../../components/Product/ProductTable";
import ProductTableMini from "./ProductTableMini";

const MyComponent: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: { type: "line", height: 350, toolbar: { show: false } },
    stroke: { curve: "smooth" },
    title: { text: "Purchase & Sales", align: "left" },
    xaxis: { categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"] },
    yaxis: { title: { text: "Số Tiền ($)" } },
    fill: { opacity: 0.3 },
  };

  const chartSeries = [
    { name: "Mua Hàng", data: [30, 40, 35, 50, 49] },
    { name: "Bán Hàng", data: [50, 90, 55, 30, 79] },
  ];

  const PRODUCTS_DATA = [
    {
      id: 1, ProductCode: "P001", Manufacturer: "Manufacturer A", ProductName: "Vương Niệu Đan",
      unit: "Piece", category: "Category 1", subCategory: "Sub 1", Description: "Description 1",
      status: "Available", VAT: "10%",
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_04675_87dec747f2.jpg",
    },
    {
      id: 2, ProductCode: "P002", Manufacturer: "Manufacturer B", ProductName: "Khương Thảo Đan",
      unit: "Piece", category: "Category 2", subCategory: "Sub 2", Description: "Description 2",
      status: "Out of Stock", VAT: "5%",
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/TUK_07336_8459e5acf0.jpg",
    },
  ];

  const PRODUCTS_DATA_MINI = [
    {
      id: 1, ProductName: "Khương Thảo Đan", Price: 500,
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_04675_87dec747f2.jpg",
    },
    {
      id: 2, ProductName: "Vương Niệu Đan", Price: 30,
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/TUK_07336_8459e5acf0.jpg",
    },
  ];

  const handleChangePage = (page: string, productId?: number) => {
    console.log(`Chuyển sang trang: ${page}, Product ID: ${productId}`);
  };

  return (
    <div className="mt-[60px] p-4 bg-[#e5eafb] min-h-screen">
      
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 justify-center max-w-6xl mx-auto">

        {[
          { icon: faBagShopping, color: "text-[#FF9F43] bg-[#FEEDED]" },
          { icon: faMoneyBills, color: "text-[#28C76F] bg-[#E5F8ED]" },
          { icon: faUser, color: "text-[#00CFE8] bg-[#E0F9FC]" },
          { icon: faArrowUpFromBracket, color: "text-[#EA5455] bg-[#FCEAEA]" },
        ].map((item, index) => (
          <div key={index} className="flex items-center bg-white w-full max-w-[250px] p-4 rounded-lg gap-4 mx-auto">

            <div className={`flex justify-center items-center w-12 h-12 rounded-full ${item.color}`}>
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base">$5600</p>
              <p className="text-xs sm:text-sm">Total Purchase Due</p>
            </div>
          </div>
        ))}
      </div>

      {/* Thống kê phụ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {[
          { icon: faUser, bg: "bg-[#FF9F43]" },
          { icon: faUserCheck, bg: "bg-[#00CFE8]" },
          { icon: faFileLines, bg: "bg-[#1B2850]" },
          { icon: faFile, bg: "bg-[#28C76F]" },
        ].map((item, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${item.bg} text-white`}>
            <div>
              <p className="font-bold text-sm sm:text-lg">5600</p>
              <p className="text-xs sm:text-sm">Total Purchase Due</p>
            </div>
            <FontAwesomeIcon icon={item.icon} className="text-base sm:text-xl transition-transform duration-300 transform hover:scale-110" />
          </div>
        ))}
      </div>

      {/* Biểu đồ và danh sách sản phẩm mini */}
      <div className="flex flex-col lg:flex-row gap-4 p-2">
        <div className="w-full lg:w-2/3 bg-white rounded-lg p-4">
          <Chart options={chartOptions} series={chartSeries} type="line" height={280} />
        </div>
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h2>
          <ProductTableMini PRODUCTS_DATA_MINI={PRODUCTS_DATA_MINI} handleChangePage={handleChangePage} />
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mt-4">
        <ProductTable PRODUCTS_DATA={PRODUCTS_DATA} handleChangePage={handleChangePage} />
      </div>
    </div>
  );
};

export default MyComponent;
