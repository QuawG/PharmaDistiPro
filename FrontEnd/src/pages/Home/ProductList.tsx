import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "../../components/Product/ProductTable";

interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unit: string;
  categoryName: string;
  description: string;
  sellingPrice: number;
  createdBy: number | null;
  createdDate: string | null;
  status: boolean;
  vat: number;
  storageconditions: number;
  weight: number;
  images: string[];
}

interface ProductListPageProps {
  handleChangePage: (page: string, productId?: number) => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ handleChangePage }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Giả sử token được lưu trong localStorage
        const response = await axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dữ liệu từ API:", response.data.data); // Log để kiểm tra dữ liệu
        const validProducts = response.data.data.filter((product: Product) => product.productId != null);
        setFilteredProducts(validProducts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setFilteredProducts([]); // Đặt mảng rỗng nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách sản phẩm</h1>
          <p className="text-sm text-gray-500">Quản lý sản phẩm</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-5">
        {/* Table */}
        <ProductTable PRODUCTS_DATA={filteredProducts} handleChangePage={handleChangePage} />
      </div>
    </div>
  );
};

export default ProductListPage;