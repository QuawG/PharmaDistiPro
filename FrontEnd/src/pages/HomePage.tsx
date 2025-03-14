import Sidebar from "../components/global/Sidebar";
import ProductListPage from "./Home/ProductList";
import ProductAdd from "../components/Product/AddProduct";
import CategoryList from "./Home/CategoryList";
import CategoryAdd from "../components/Category/AddCategory";
import SubCategoryList from "./Home/SubCategoryList";
import SubAddCategory from "../components/Category/SubAddCategory";
import CustomerAdd from "../components/Customer/AddCustomer";
import CustomerListPage from "./Home/CustomerList";
import UserListPage from "./Home/UserList"; // Import UserListPage
import UserAdd from "../components/User/AddUser"; // Import UserAdd
import SupplierListPage from "./Home/SupplierList"; // Import SupplierListPage
import SupplierAdd from "../components/Supplier/AddSupplier"; // Import SupplierAdd
import PurchaseOrderListPage from "./Home/PurchaseOrderList"; // Import PurchaseOrderListPage
import PurchaseOrderAdd from "../components/PurchaseOrder/AddPurchaseOrder"; // Import PurchaseOrderAdd
import Navbar from "../components/global/Navbar";
import UpdateProduct from "../components/Product/UpdateProduct";
import LotListPage from "./Home/LotList";
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
                {activePage === 'Danh sách sản phẩm' && <ProductListPage handleChangePage={handleChangePage} />}
                {activePage === "Chỉnh sửa sản phẩm" && selectedProductId !== null && (
  <UpdateProduct productId={selectedProductId} handleChangePage={handleChangePage} />
)}
                {activePage === 'Danh sách danh mục chính' && <CategoryList handleChangePage={handleChangePage} />}
                {activePage === 'Thêm sản phẩm' && <ProductAdd handleChangePage={handleChangePage}/>}
                {activePage === 'Thêm danh mục chính' && <CategoryAdd handleChangePage={handleChangePage} />} 
                {activePage === 'Danh sách danh mục phụ' && <SubCategoryList handleChangePage={handleChangePage} />}
                {activePage === 'Thêm danh mục phụ' && <SubAddCategory handleChangePage={handleChangePage} />}
                {activePage === 'Danh sách khách hàng' && <CustomerListPage handleChangePage={handleChangePage} />}
                {activePage === 'Thêm khách hàng' && <CustomerAdd />}
                {activePage === 'Danh sách người dùng' && <UserListPage handleChangePage={handleChangePage} />}
                {activePage === 'Thêm người dùng' && <UserAdd />} 
                {activePage === 'Danh sách nhà cung cấp' && <SupplierListPage handleChangePage={handleChangePage} />} 
                {activePage === 'Thêm nhà cung cấp' && <SupplierAdd />} 
                {activePage === 'Danh sách đơn đặt hàng(PO)' && <PurchaseOrderListPage handleChangePage={handleChangePage} />} {/* Thêm PurchaseOrderListPage */}
                {activePage === 'Thêm đơn đặt hàng(PO)' && <PurchaseOrderAdd />} 
                {activePage === 'Danh sách lô hàng' && <LotListPage />} 
            </div>
        </div>
    );
};

export default HomePage;