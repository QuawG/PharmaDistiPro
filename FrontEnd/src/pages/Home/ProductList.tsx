import React, { useState } from "react";
// import { FileText, Table, Printer } from "lucide-react";

import ProductTable from "../../components/Product/ProductTable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import { PRODUCTS_DATA } from "../../components/data/product";
// , FunnelIcon
interface ProductListPageProps {
  handleChangePage: (page: string, productId?: number) => void;
}

interface Product {
  ProductId: number;
  ProductCode: string;
  ManufactureName: string;
  ProductName: string;
  UnitId: number;
  CategoryId: number;
  Description: string;
  SellingPrice: number;
  CreatedBy: string;
  CreatedDate: string;
  Status: string;
  VAT: number;
  StorageConditions: string;
  Weight: number;
  Image?: string;
  CategoryName?: string;
  SubCategoryName?: string;
  UnitName?: string;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ handleChangePage }) => {
  // const [, setSearchTerm] = useState("");
  const [filteredProducts, ] = useState<Product[]>(PRODUCTS_DATA);

  

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
