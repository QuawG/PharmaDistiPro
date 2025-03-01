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
                {activePage === 'Product List' && <ProductListPage handleChangePage={handleChangePage} />}
                {activePage === 'Category List' && <CategoryList handleChangePage={handleChangePage} />}
                {activePage === 'Add Product' && <ProductAdd />}
                {activePage === 'Add Category' && <CategoryAdd handleChangePage={handleChangePage} />} 
                {activePage === 'SubCategory List' && <SubCategoryList handleChangePage={handleChangePage} />}
                {activePage === 'Add Sub Category' && <SubAddCategory handleChangePage={handleChangePage} />}
                {activePage === 'Customer List' && <CustomerListPage handleChangePage={handleChangePage} />}
                {activePage === 'Add Customer' && <CustomerAdd />}
                
            </div>
        </div>
    );
};

export default HomePage;
