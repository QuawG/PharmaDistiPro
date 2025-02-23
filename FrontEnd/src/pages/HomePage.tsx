import Sidebar from "../components/global/Sidebar";
import ProductListPage from "./Home/ProductList";
import ProductAdd from "../components/Product/AddProduct";
import Navbar from "../components/global/Navbar";
import { useState } from "react";
const HomePage = () => {
    const [activePage, setActivePage] = useState<string>('Product List')

    const handleChangePage = (page: string) => {
        setActivePage(page)
    }


    return (
        <div className="w-screen h-screen flex">
                <Sidebar activeSidebar={activePage} handleChangePage={handleChangePage}/>
            <div className="flex w-[calc(100vw-260px)] h-full">
                <Navbar />
                {
                    activePage === 'Product List' ? (
                        <ProductListPage handleChangePage={handleChangePage}/>
                    ) : (
                        <ProductAdd />
                    )
                }
            </div>
       </div>
    )
}

export default HomePage