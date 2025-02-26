import Sidebar from "../components/global/Sidebar";
import ProductListPage from "./Home/ProductList";
import ProductAdd from "../components/Product/AddProduct";
import CustomerAdd from "../components/Customer/AddCustomer";
import CustomerListPage from "./Home/CustomerList"; // Import Customer List Page
import Navbar from "../components/global/Navbar";
import { useState } from "react";

const HomePage = () => {
    const [activePage, setActivePage] = useState<string>('Product List');

    const handleChangePage = (page: string) => {
        setActivePage(page);
    };

    return (
        <div className="w-screen h-screen flex">
            <Sidebar activeSidebar={activePage} handleChangePage={handleChangePage} />
            <div className="flex w-[calc(100vw-260px)] h-full">
                <Navbar />
                {
                    activePage === 'Product List' ? (
                        <ProductListPage handleChangePage={handleChangePage} />
                    ) : activePage === 'Add Product' ? (
                        <ProductAdd />
                    ) : activePage === 'Customer List' ? (
                        <CustomerListPage handleChangePage={handleChangePage} />
                    ): activePage === 'Add Customer' ? (
                        <CustomerAdd />
                    ) : null // Thêm các trang khác nếu cần
                }
            </div>
        </div>
    );
};

export default HomePage;