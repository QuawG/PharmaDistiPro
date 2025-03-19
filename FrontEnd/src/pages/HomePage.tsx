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
import SupplierAdd from "../components/Supplier/AddSupplier"; 
import PurchaseOrderListPage from "./Home/PurchaseOrderList"; 
import PurchaseOrderAdd from "../components/PurchaseOrder/AddPurchaseOrder"; // Import PurchaseOrderAdd
import Navbar from "../components/global/Navbar";
import UpdateProduct from "../components/Product/UpdateProduct";
import LotListPage from "./Home/LotList";
import ReceivedNoteListPage from "./Home/ReceivedNoteList";
import AddLot from "../components/Lot/AddLot"; // Import trang AddLot
import MyComponent from "./Dashboard/Dashboard/Dashboard";
import StorageRoomListPage from "./Home/StorageRoom"; // Import trang danh sách kho
import StorageRoomAdd from "../components/StorageRoom/AddStorageRoom"; 
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
        {activePage === 'Dashboard' && <MyComponent />}
        {activePage === 'Danh sách sản phẩm' && <ProductListPage handleChangePage={handleChangePage} />}
        {activePage === "Chỉnh sửa sản phẩm" && selectedProductId !== null && (
          <UpdateProduct productId={selectedProductId} handleChangePage={handleChangePage} />
        )}
        {activePage === 'Danh sách danh mục hệ thống' && <CategoryList handleChangePage={handleChangePage} />}
        {activePage === 'Tạo sản phẩm' && <ProductAdd handleChangePage={handleChangePage} />}
        {activePage === 'Tạo danh mục hệ thống' && <CategoryAdd handleChangePage={handleChangePage} />}
        {activePage === 'Danh sách danh mục thuốc' && <SubCategoryList handleChangePage={handleChangePage} />}
        {activePage === 'Tạo danh mục thuốc' && <SubAddCategory handleChangePage={handleChangePage} />}
        {activePage === 'Danh sách nhà thuốc' && <CustomerListPage handleChangePage={handleChangePage} />}
        {activePage === 'Tạo nhà thuốc' && <CustomerAdd />}
        {activePage === 'Danh sách người dùng' && <UserListPage handleChangePage={handleChangePage} />}
        {activePage === 'Tạo người dùng' && <UserAdd />}
        {activePage === 'Danh sách nhà cung cấp' && <SupplierListPage handleChangePage={handleChangePage} />}
        {activePage === 'Tạo nhà cung cấp' && <SupplierAdd />}
        {activePage === 'Danh sách đơn đặt hàng(PO)' && <PurchaseOrderListPage handleChangePage={handleChangePage} />} {/* Tạo PurchaseOrderListPage */}
        {activePage === 'Tạo đơn đặt hàng(PO)' && <PurchaseOrderAdd />}
        {activePage === "Danh sách lô hàng" && <LotListPage handleChangePage={setActivePage} />}
        {activePage === "Tạo lô hàng" && <AddLot handleChangePage={setActivePage} />}
        {activePage === "Danh sách phiếu nhập" && <ReceivedNoteListPage  />}
        {activePage === 'Danh sách kho' && <StorageRoomListPage handleChangePage={handleChangePage} />}
        {activePage === 'Tạo kho mới' && <StorageRoomAdd/>}
      </div>
    </div>
  );
};

export default HomePage;