import React, { useState } from "react";
import { HomeIcon, InboxStackIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ProductList = [
    "Product List",
    "Add Product",
    "Add Category List",
    "Add Category",
    "Sub Category List",
    "Add Sub Category",
    "Import Product"
];

interface SidebarProps {
    activeSidebar: string
    handleChangePage: (page: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar, handleChangePage }) => {
    const [activeMenuSidebar, setActiveMenuSidebar] = useState<string | null>("product");
    const [isProductOpen, setIsProductOpen] = useState(false); 
    const [activeItem, setActiveItem] = useState<string | null>(activeSidebar); 

    const handleProductClick = () => {
        setIsProductOpen((prev) => !prev);
    };

    const handleItemClick = (item: string) => {
        setActiveMenuSidebar("product");
        setActiveItem(item);
        handleChangePage(item)
    };

    const handleItemClickSidebar = (item: string) => {
        setActiveItem(item);
        setActiveMenuSidebar("dashboard");
    };

    return (
        <div className="w-[260px] border-r-[1px] border-r-gray-200 z-20">
            <div className="w-full">
                <img className="w-[180px]" src="/img/logo.png" alt="Logo" />
            </div>
            <div className="p-5 w-full">
                {/* Dashboard */}
                <div
                    className={`px-[15px] mb-3 flex items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                        ${activeMenuSidebar === "dashboard" ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                    onClick={() => handleItemClickSidebar("dashboard")}
                >
                    <span className="flex items-center">
                        <HomeIcon className="mr-[6px] w-4 h-4" />
                        Dashboard
                    </span>
                </div>

                {/* Product */}
                <div>
                    <div
                        className={`px-[15px]
                             ${activeMenuSidebar === "product" ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}
                            flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] hover:text-white hover:bg-[#1b2850]`}
                        onClick={handleProductClick}
                    >
                        <span className="flex items-center">
                            <InboxStackIcon className="mr-[6px] w-4 h-4" />
                            Product
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isProductOpen ? "rotate-90" : ""}`}
                        />
                    </div>

                    {/* Danh sách ProductList */}
                    <ul
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isProductOpen ? "max-h-[500px] " : "max-h-0 "
                        }`}
                    >
                        {ProductList.map((item, index) => (
                            <li
                            key={index}
                            className={`
                                flex items-center text-[14px] gap-2 px-4 py-2 rounded-md 
                                transition-all cursor-pointer hover:text-amber-400
                                group
                                ${activeItem === item ? "text-[#1b2850]" : ""}
                            `}
                            onClick={() => handleItemClick(item)}
                            >
                            <div className="relative flex items-center">
                                <input
                                type="radio"
                                name="product-list"
                                checked={activeItem === item}
                                onChange={() => handleItemClick(item)}
                                className={`
                                    cursor-pointer appearance-none
                                    w-2.5 h-2.5 rounded-full border
                                    transition-all duration-200
                                    hover:border-amber-400
                                    group-hover:border-amber-400
                                    ${activeItem === item 
                                    ? "border-[#1b2850] bg-white" 
                                    : "border-gray-400 bg-white"
                                    }
                                    checked:border-[#1b2850]
                                    checked:bg-white
                                `}
                                />
                                <span 
                                className={`
                                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-2 h-2 rounded-full
                                    transition-all duration-200
                                    pointer-events-none
                                    ${activeItem === item 
                                    ? "bg-[#1b2850]" 
                                    : "bg-transparent"
                                    }
                                    group-hover:bg-amber-400
                                `}
                                />
                            </div>
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
