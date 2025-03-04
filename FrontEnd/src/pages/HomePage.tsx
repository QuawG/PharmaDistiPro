import Sidebar from "../components/global/Sidebar";
import ProductListPage from "./Home/ProductList";
import ProductAdd from "../components/Product/AddProduct";
import CategoryList from "./Home/CategoryList";
import CategoryAdd from "../components/Category/AddCategory";
import SubCategoryList from "./Home/SubCategoryList";
import SubAddCategory from "../components/Category/SubAddCategory";
import CustomerAdd from "../components/Customer/AddCustomer";
import CustomerListPage from "./Home/CustomerList";
import UserListPage from "./Home/UserList";
import UserAdd from "../components/User/AddUser";
import SupplierListPage from "./Home/SupplierList";
import SupplierAdd from "../components/Supplier/AddSupplier";
import UpdateProduct from "../components/Product/UpdateProduct"; // Thêm trang chỉnh sửa sản phẩm
import Navbar from "../components/global/Navbar";
import { useState } from "react";

const HomePage = () => {
  const [activePage, setActivePage] = useState<string>("Danh sách sản phẩm");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleChangePage = (page: string, productId?: number) => {
    setActivePage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <Sidebar activeSidebar={activePage} handleChangePage={handleChangePage} />
      <div className="flex-grow">
        <Navbar />
        {activePage === "Danh sách sản phẩm" && <ProductListPage handleChangePage={handleChangePage} />}
        {activePage === "Danh sách danh mục chính" && <CategoryList handleChangePage={handleChangePage} />}
        {activePage === "Thêm sản phẩm" && <ProductAdd handleChangePage={handleChangePage}/>}
        {activePage === "Thêm danh mục chính" && <CategoryAdd handleChangePage={handleChangePage} />}
        {activePage === "Danh sách danh mục phụ" && <SubCategoryList handleChangePage={handleChangePage} />}
        {activePage === "Thêm danh mục phụ" && <SubAddCategory handleChangePage={handleChangePage} />}
        {activePage === "Danh sách khách hàng" && <CustomerListPage handleChangePage={handleChangePage} />}
        {activePage === "Thêm khách hàng" && <CustomerAdd />}
        {activePage === "Danh sách người dùng" && <UserListPage handleChangePage={handleChangePage} />}
        {activePage === "Thêm người dùng" && <UserAdd />}
        {activePage === "Danh sách nhà cung cấp" && <SupplierListPage handleChangePage={handleChangePage} />}
        {activePage === "Thêm nhà cung cấp" && <SupplierAdd />}
        {activePage === "Chỉnh sửa sản phẩm" && selectedProductId && <UpdateProduct productId={selectedProductId} handleChangePage={handleChangePage} />}
      </div>
    </div>
  );
};

export default HomePage;
