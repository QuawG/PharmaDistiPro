import React, { useState } from "react";
import { HomeIcon, InboxStackIcon, ChevronRightIcon, UserIcon, ShoppingCartIcon, ArchiveBoxIcon, ArrowRightEndOnRectangleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { PackageIcon, StoreIcon } from "lucide-react";

const menus = {
    "Sản phẩm": ["Danh sách sản phẩm", "Tạo sản phẩm", "Chủng loại", "Tạo chủng loại", "Danh sách danh mục thuốc", "Tạo danh mục thuốc", "Nhập sản phẩm"],
    "Nhà thuốc": ["Danh sách nhà thuốc", "Tạo nhà thuốc"],
    "Người dùng": ["Danh sách người dùng", "Tạo người dùng"],
    "Nhà cung cấp": ["Danh sách nhà cung cấp", "Tạo nhà cung cấp"],
    "Đơn đặt hàng": ["Danh sách đơn đặt hàng(PO)", "Tạo đơn đặt hàng(PO)"],
    "Đơn hàng": ["Danh sách đơn hàng", "Tạo đơn hàng"],
    "Lô hàng": ["Danh sách lô hàng", "Tạo lô hàng"],
    "Phiếu nhập kho": ["Danh sách phiếu nhập", "Tạo phiếu nhập kho"],
    "Phiếu xuất kho": ["Danh sách phiếu xuất kho", "Tạo phiếu xuất kho"],
    "Kho" : ["Danh sách kho", "Tạo kho mới"]
};


interface SidebarProps {
    activeSidebar: string;
    handleChangePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar, handleChangePage }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<string | null>(activeSidebar);

    const handleItemClick = (item: string) => {
        setActiveItem(item);
        handleChangePage(item);
    };

    const toggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="w-[260px] min-w-[260px] max-w-[260px] flex-shrink-0 border-r-[1px] border-r-gray-200 z-20 bg-white h-full overflow-y-auto">
            <div className="w-full">
                <img className="w-[150px] mx-auto my-1" src="/img/logoPharma.png" alt="Pharma Logo" />
            </div>

            <div className="p-5 w-full">
                {/* Dashboard */}
                <div
                    className="px-[15px] mb-3 flex items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] hover:text-white hover:bg-[#1b2850]"
                    onClick={() => handleItemClick("Dashboard")}
                >
                    <span className="flex items-center">
                        <HomeIcon className="mr-[6px] w-4 h-4" />
                        Dashboard
                    </span>
                </div>

                {/* Render các menu */}
                {Object.entries(menus).map(([menuKey, menuItems]) => (
                    <div key={menuKey}>
                        <div
                            className={`px-[15px] flex justify-between items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] 
                                ${openMenu === menuKey ? "text-white bg-[#1b2850]" : "hover:text-white hover:bg-[#1b2850]"}`}
                            onClick={() => toggleMenu(menuKey)}
                        >
                            <span className="flex items-center">
                                {menuKey === "Sản phẩm" && <InboxStackIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Nhà thuốc" && <UserIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Người dùng" && <UserIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Nhà cung cấp" && <StoreIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Đơn đặt hàng" && <PackageIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Đơn hàng" && <ShoppingCartIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Lô hàng" && <ArchiveBoxIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Phiếu nhập kho" && <ArrowRightEndOnRectangleIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Phiếu xuất kho" && <ArrowRightStartOnRectangleIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey === "Kho" && <StoreIcon className="mr-[6px] w-4 h-4" />}
                                {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
                            </span>
                            <ChevronRightIcon className={`w-4 h-4 transition-transform ${openMenu === menuKey ? "rotate-90" : ""}`} />
                        </div>
                        <ul className={`transition-all duration-300 ease-in-out overflow-hidden ${openMenu === menuKey ? "max-h-[500px]" : "max-h-0"}`}>
                            {menuItems.map((item, index) => (
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
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
