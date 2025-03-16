import React, { useState } from "react";
import { HomeIcon, InboxStackIcon, ChevronRightIcon, UserIcon, ShoppingCartIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { PackageIcon, StoreIcon } from "lucide-react";

const ProductList = [
    "Danh sách sản phẩm",
    "Tạo sản phẩm",
    "Danh sách danh mục chính",
    "Tạo danh mục chính",
    "Danh sách danh mục phụ",
    "Tạo danh mục phụ",
    "Nhập sản phẩm"
];

const CustomerList = [
    "Danh sách khách hàng",
    "Tạo khách hàng"
];

const UserList = [
    "Danh sách người dùng",
    "Tạo người dùng"
];

const SupplierList = [
    "Danh sách nhà cung cấp",
    "Tạo nhà cung cấp"
];

const PurchaseOrderList = [
    "Danh sách đơn đặt hàng(PO)",
    "Tạo đơn đặt hàng (PO)"
];

const OrderList = [
    "Danh sách đơn hàng",
    "Thêm đơn hàng"
]

const LotList =[
    "Danh sách lô hàng"
]

interface SidebarProps {
    activeSidebar: string;
    handleChangePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar, handleChangePage }) => {
    const [activeMenuSidebar] = useState<string | null>("product");
    const [isProductOpen, setIsProductOpen] = useState(false); 
    const [activeItem, setActiveItem] = useState<string | null>(activeSidebar); 
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isSupplierOpen, setIsSupplierOpen] = useState(false);
    const [isPurchaseOrderOpen, setIsPurchaseOrderOpen] = useState(false); // State for Purchase Order
    const [isOrderOpen, setIsOrderOpen] = useState (false);
    const [isLotOpen, setIsLotOpen] = useState (false);

    const handleItemClick = (item: string) => {
        setActiveItem(item);
        handleChangePage(item);
    };

    return (
        <div className="w-[260px] border-r-[1px] border-r-gray-200 z-20 bg-white h-full">
            <div className="w-full">
                <img className="w-[150px] mx-auto my-1" src="/img/logoPharma.png" alt="Pharma Logo" />
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
                            <UserIcon className="mr-[6px] w-4 h-4" />
                            Khách hàng
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isCustomerOpen ? "rotate-90" : ""}`}
                        />
                    </div>
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

                {/* User */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isUserOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsUserOpen(!isUserOpen)}
                    >
                        <span className="flex items-center">
                            <UserIcon className="mr-[6px] w-4 h-4" />
                            Người dùng
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isUserOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isUserOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {UserList.map((item, index) => (
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

                {/* Supplier */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isSupplierOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsSupplierOpen(!isSupplierOpen)}
                    >
                        <span className="flex items-center">
                            <StoreIcon className="mr-[6px] w-4 h-4" />
                            Nhà cung cấp
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isSupplierOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isSupplierOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {SupplierList.map((item, index) => (
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

                {/* Purchase Order */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isPurchaseOrderOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsPurchaseOrderOpen(!isPurchaseOrderOpen)}
                    >
                        <span className="flex items-center">
                            <PackageIcon className="mr-[6px] w-4 h-4" />
                            Đơn đặt hàng(PO)
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isPurchaseOrderOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isPurchaseOrderOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {PurchaseOrderList.map((item, index) => (
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
                {/* order */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isOrderOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsOrderOpen (!isOrderOpen)}
                    >
                        <span className="flex items-center">
                            <ShoppingCartIcon className="mr-[6px] w-4 h-4" />
                            Đơn hàng
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isOrderOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isOrderOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {OrderList.map((item, index) => (
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

                {/* Lot */}
                <div>
                    <div
                        className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                            ${isLotOpen ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                        onClick={() => setIsLotOpen (!isLotOpen)}
                    >
                        <span className="flex items-center">
                            <ArchiveBoxIcon className="mr-[6px] w-4 h-4" />
                            Lô Hàng
                        </span>
                        <ChevronRightIcon
                            className={`w-4 h-4 transition-transform ${isLotOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                    <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${isLotOpen ? "max-h-[500px]" : "max-h-0"}`}>
                        {LotList.map((item, index) => (
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

            </div>
        </div>
    );
};

export default Sidebar;