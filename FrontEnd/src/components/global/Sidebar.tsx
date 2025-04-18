import React, { useState, useEffect } from "react";
import { HomeIcon, InboxStackIcon, ChevronRightIcon, UserIcon, ShoppingCartIcon, ArchiveBoxIcon, ArrowRightEndOnRectangleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { PackageIcon, StoreIcon } from "lucide-react";
import { useAuth } from "../../pages/Home/AuthContext"; // Import AuthContext để lấy role

const menus = {
  "Sản phẩm": ["Danh sách sản phẩm", "Tạo sản phẩm", "Chủng loại", "Tạo chủng loại", "Danh sách danh mục thuốc", "Tạo danh mục thuốc", "Nhập sản phẩm"],
  "Nhà thuốc": ["Danh sách nhà thuốc", "Tạo nhà thuốc"],
  "Người dùng": ["Danh sách người dùng", "Tạo người dùng"],
  "Nhà cung cấp": ["Danh sách nhà cung cấp", "Tạo nhà cung cấp"],
  "Đơn đặt hàng": ["Danh sách đơn đặt hàng(PO)", "Tạo đơn đặt hàng(PO)"],
  "Đơn hàng": ["Danh sách đơn hàng", "Tạo đơn hàng"],
  "Lô hàng": ["Danh sách lô hàng", "Tạo lô hàng"],
  "Phiếu nhập kho": ["Danh sách phiếu nhập", "Tạo phiếu nhập kho"],
  "Phiếu xuất kho": ["Danh sách phiếu xuất kho"],
  "Kho": ["Danh sách kho", "Tạo kho mới"],
};

interface SidebarProps {
  activeSidebar: string;
  handleChangePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar, handleChangePage }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(activeSidebar);
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  // Đặt màn hình mặc định cho SalesMan
  useEffect(() => {
    if (user?.roleName === "SalesMan" && activeSidebar !== "Danh sách nhà thuốc") {
      setActiveItem("Danh sách nhà thuốc");
      handleChangePage("Danh sách nhà thuốc");
    }
  }, [user, activeSidebar, handleChangePage]);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    handleChangePage(item);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Hàm kiểm tra quyền truy cập menu dựa trên vai trò
  const canAccessMenu = (menuKey: string) => {
    const role = user?.roleName;
    switch (menuKey) {
      case "Sản phẩm":
        return role === "Director" || role === "SalesManager";
      case "Người dùng":
      case "Nhà cung cấp":
        return role === "Director";
      case "Dashboard":
        return role === "SalesManager" || role === "Director";
      case "Nhà thuốc":
        return role === "SalesManager" || role === "Director" || role === "SalesMan";
      case "Đơn đặt hàng":
        return role === "WarehouseManager" || role === "Director";
      case "Lô hàng":
      case "Phiếu nhập kho":
      case "Phiếu xuất kho":
        return role === "SalesManager" || role === "WarehouseManager" || role === "Director";
      case "Kho":
        return role === "WarehouseManager" || role === "Director";
      case "Đơn hàng":
        return !!getOrderMenuItems().length; // Hiển thị nếu có mục con
      default:
        return true;
    }
  };

  // Hàm lọc các mục con của menu dựa trên vai trò
  const getMenuItems = (menuKey: string) => {
    const role = user?.roleName;
    let items = menus[menuKey as keyof typeof menus] || [];

    switch (menuKey) {
      case "Sản phẩm":
        if (role === "SalesManager") {
          return items.filter(item =>
            item === "Danh sách sản phẩm" || item === "Chủng loại" || item === "Danh sách danh mục thuốc"
          );
        }
        return items;
      case "Nhà thuốc":
        if (role !== "SalesMan") {
          return items.filter(item => item !== "Tạo nhà thuốc");
        }
        return items;
      case "Đơn đặt hàng":
        return items.filter(item =>
          item === "Danh sách đơn đặt hàng(PO)" ? (role === "WarehouseManager" || role === "Director") : role === "Director"
        );
      case "Lô hàng":
        return items.filter(item => item === "Tạo lô hàng" ? role === "WarehouseManager" : true);
      case "Phiếu nhập kho":
        return items.filter(item => item === "Tạo phiếu nhập kho" ? role === "WarehouseManager" : true);
      case "Kho":
        return items.filter(item => item === "Tạo kho mới" ? role === "Director" : true);
      case "Đơn hàng":
        return getOrderMenuItems();
      case "Phiếu xuất kho":
        return getIssueNoteMenuItems();
      default:
        return items;
    }
  };

  // Lọc menu "Đơn hàng" dựa trên vai trò
  const getOrderMenuItems = () => {
    if (user?.roleName === "Customer") {
      return ["Danh sách đơn hàng", "Tạo đơn hàng"];
    } else if (user?.roleName === "SalesManager") {
      return ["Đơn hàng (Sales Manager)"];
    } else if (user?.roleName === "WarehouseManager") {
      return ["Danh sách đơn hàng (Warehouse Manager)"];
    } else {
      return [];
    }
  };

  // Lọc menu "Phiếu xuất kho" dựa trên vai trò
  const getIssueNoteMenuItems = () => {
    if (user?.roleName === "WarehouseManager") {
      return ["Danh sách phiếu xuất kho (Warehouse Manager)"];
    } else {
      return ["Danh sách phiếu xuất kho"];
    }
  };

  // Nếu là Customer, chỉ hiển thị menu "Đơn hàng"
  const filteredMenus = user?.roleName === "Customer"
    ? { "Đơn hàng": menus["Đơn hàng"] }
    : Object.fromEntries(
        Object.entries(menus).filter(([menuKey]) => canAccessMenu(menuKey))
      );

  return (
    <div className="w-[260px] min-w-[260px] max-w-[260px] flex-shrink-0 border-r-[1px] border-r-gray-200 z-20 bg-white h-full overflow-y-auto">
      <div className="w-full">
        <img className="w-[150px] mx-auto my-1" src="/img/logoPharma.png" alt="Pharma Logo" />
      </div>

      <div className="p-5 w-full">
        {/* Render các menu */}
        {Object.entries(filteredMenus).map(([menuKey, _menuItems]) => {
          const menuItems = getMenuItems(menuKey);
          // Không hiển thị menu nếu không có mục con
          if (menuItems.length === 0) {
            return null;
          }

          return (
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
          );
        })}

        {/* Dashboard - Đặt ở cuối */}
        {canAccessMenu("Dashboard") && (
          <div
            className="px-[15px] mt-3 flex items-center cursor-pointer rounded-[4px] transition-all py-2.5 text-[15px] hover:text-white hover:bg-[#1b2850]"
            onClick={() => handleItemClick("Dashboard")}
          >
            <span className="flex items-center">
              <HomeIcon className="mr-[6px] w-4 h-4" />
              Dashboard
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;