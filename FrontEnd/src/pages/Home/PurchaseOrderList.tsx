import React, { useState } from "react";
import PurchaseOrderTable from "../../components/PurchaseOrder/PurchaseOrderTable";

// Interface cho Supplier từ API
interface Supplier {
  id: number;
  supplierName: string;
  supplierCode: string;
  supplierAddress: string;
  supplierPhone: string;
  status: boolean;
  createdBy: number;
  createdDate: string;
}

// Interface cho PurchaseOrder từ API
interface PurchaseOrder {
  purchaseOrderId: number;
  purchaseOrderCode: string;
  supplierId: number | null;
  updatedStatusDate: string;
  totalAmount: number;
  status: number;
  createdBy: string | null;
  createDate: string;
  amountPaid: number | null;
  supplier: Supplier | null;
  products?: PurchaseOrderDetail[]; // Thêm trường products để lưu chi tiết (khớp với PurchaseOrderTable)
}

// Interface cho PurchaseOrderDetail từ API
interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unitId: number | null;
  categoryId: number;
  description: string;
  sellingPrice: number;
  createdBy: number;
  createdDate: string | null;
  status: boolean;
  vat: number;
  storageconditions: number;
  weight: number;
}

interface PurchaseOrderDetail {
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface PurchaseOrderListPageProps {
  handleChangePage: (page: string, purchaseOrderId?: number) => void;
}

const PurchaseOrderListPage: React.FC<PurchaseOrderListPageProps> = ({ handleChangePage }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
  };

  // Hàm xử lý khi xóa đơn hàng
  const handleDelete = (id: number) => {
    console.log("Xóa đơn hàng:", id);
    // Gọi API DELETE nếu có: axios.delete(`http://pharmadistiprobe.fun/api/PurchaseOrders/${id}`);
  };

  // Hàm xử lý khi cập nhật đơn hàng
  const handleUpdate = (updatedOrder: PurchaseOrder) => {
    console.log("Cập nhật đơn hàng:", updatedOrder);
    // Gọi API PUT nếu có: axios.put(`http://pharmadistiprobe.fun/api/PurchaseOrders/${updatedOrder.purchaseOrderId}`, updatedOrder);
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách đơn đặt hàng (PO)</h1>
          <p className="text-sm text-gray-500">Quản lý đơn đặt hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-5">
        <div id="printableArea">
          <PurchaseOrderTable
            handleChangePage={handleChangePage}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            rowSelection={{
              selectedRowKeys,
              onChange: handleRowSelectionChange,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderListPage;