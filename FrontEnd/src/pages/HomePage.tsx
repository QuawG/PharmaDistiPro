import Sidebar from "../components/global/Sidebar";
import ProductListPage from "./Home/ProductList";
import ProductAdd from "../components/Product/AddProduct";
import CategoryList from "./Home/CategoryList";
import CategoryAdd from "../components/Category/AddCategory";
import SubCategoryList from "./Home/SubCategoryList";
import SubAddCategory from "../components/Category/SubAddCategory";
import CustomerAdd from "../components/Customer/AddCustomer";
import CustomerListPage from "./Home/CustomerList";
import Navbar from "../components/global/Navbar";
import { useState } from "react";

const HomePage = () => {
    const [activePage, setActivePage] = useState<string>('Product List');

    const handleChangePage = (page: string) => {
        console.log("Navigating to:", page);
        setActivePage(page);
    };

    return (
        <div className="w-screen h-screen flex">
            <Sidebar activeSidebar={activePage} handleChangePage={handleChangePage} />
            <div className="flex-grow">
                <Navbar />
                {activePage === 'Danh sách sản phẩm' && <ProductListPage handleChangePage={handleChangePage} />}
                {activePage === 'Danh sách danh mục chính' && <CategoryList handleChangePage={handleChangePage} />}
                {activePage === 'Thêm sản phẩm' && <ProductAdd />}
                {/* {activePage === 'Add Product' && <ProductAdd handleChangePage={handleChangePage} />} */}
                {activePage === 'Thêm danh mục chính' && <CategoryAdd handleChangePage={handleChangePage} />} 
                {activePage === 'Danh sách danh mục phụ' && <SubCategoryList handleChangePage={handleChangePage} />}
                {activePage === 'Thêm danh mục phụ' && <SubAddCategory handleChangePage={handleChangePage} />}
                {activePage === 'Danh sách khách hàng' && <CustomerListPage handleChangePage={handleChangePage} />}
                {activePage === 'Thêm khách hàng' && <CustomerAdd />}
                
            </div>
        </div>
    );
};

export default HomePage;
