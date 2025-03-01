import React, { useState } from "react";
import { HomeIcon, InboxStackIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ProductList = [
    "Danh sách sản phẩm",
    "Thêm sản phẩm",
    "Danh sách danh mục chính",
    "Thêm danh mục chính",
    "Danh sách danh mục phụ",
    "Thêm danh mục phụ",
    "Nhập sản phẩm"
];

const CustomerList = [
    "Danh sách khách hàng",
    "Thêm khách hàng",
    "Customer Group"
];

interface SidebarProps {
    activeSidebar: string;
    handleChangePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar, handleChangePage }) => {
    const [activeMenuSidebar, setActiveMenuSidebar] = useState<string | null>("product");
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(activeSidebar);

    const handleItemClick = (item: string) => {
        if (ProductList.includes(item)) {
            setActiveMenuSidebar("product");
        } else if (CustomerList.includes(item)) {
            setActiveMenuSidebar("customer");
        }
        setActiveItem(item);
        handleChangePage(item);
    };

    return (
        <div className="w-[260px] border-r-[1px] border-r-gray-200 z-20 bg-white h-full">
            <div className="w-full">
                <img className="w-[180px] mx-auto my-4" src="/img/logo.png" alt="Logo" />
            </div>

            <div className="p-5 w-full">
                {/* Dashboard */}
                <div
                    className={`px-[15px] mb-3 flex items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                        ${activeMenuSidebar === "dashboard" ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                    onClick={() => handleItemClick("Dashboard")}
                >
                    <span className="flex items-center">
                        <HomeIcon className="mr-[6px] w-4 h-4" />
                        Dashboard
                    </span>
                </div>

                {/* Product */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isProductOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsProductOpen(!isProductOpen)}
                    >
                        <span className="flex items-center">
                            <InboxStackIcon className="mr-[6px] w-4 h-4" />
                            Sản phẩm
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isProductOpen ? "rotate-90" : ""}`}
                        />
                    </div>

                    {/* Danh sách ProductList */}
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isProductOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {ProductList.map((item, index) => (
                            <li
                                key={index}
                                className={`flex items-center text-[14px] gap-2 px-4 py-2 rounded-md 
                                    transition-all cursor-pointer hover:text-amber-400
                                    ${activeItem === item ? "text-[#1b2850]" : ""}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isCustomerOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsCustomerOpen(!isCustomerOpen)}
                    >
                        <span className="flex items-center">
                            <InboxStackIcon className="mr-[6px] w-4 h-4" />
                            Khách hàng
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isCustomerOpen ? "rotate-90" : ""}`}
                        />
                    </div>

                    {/* Danh sách CustomerList */}
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isCustomerOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {CustomerList.map((item, index) => (
                            <li
                                key={index}
                                className={`flex items-center text-[14px] gap-2 px-4 py-2 rounded-md transition-all cursor-pointer hover:text-amber-400
                                    ${activeItem === item ? "text-[#1b2850]" : ""}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
