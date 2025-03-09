import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import DeleteConfirmation from "../Confirm/DeleteConfirm";
import ProductDetailsModal from "./ProductDetail";

interface Product {
  id: number;
  ProductCode: string;
  Manufacturer: string;
  ProductName: string;
  unit: string;
  category: string;
  Description: string;
  status: string;
  VAT: string;
  image: string;
}

interface ProductTableProps {
  PRODUCTS_DATA: Product[];
  handleChangePage: (page: string, productId?: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ PRODUCTS_DATA, handleChangePage }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "ProductName",
      header: "Tên sản phẩm",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image}
            alt={row.original.ProductName}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
          />
          <span className="font-medium">{row.original.ProductName}</span>
        </div>
      ),
    },
    {
      accessorKey: "ProductCode",
      header: "Mã sản phẩm",
    },
    {
      accessorKey: "category",
      header: "Danh mục",
    },
    {
      accessorKey: "Manufacturer",
      header: "Nhà cung cấp",
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
    },
    {
      accessorKey: "VAT",
      header: "Thuế VAT",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
    },
    {
      accessorKey: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            className="p-1 text-blue-600 hover:bg-gray-200 rounded"
            onClick={() => {
              setSelectedProduct(row.original);
              setIsOpen(true);
            }}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-green-600 hover:bg-gray-200 rounded"
            onClick={() => handleChangePage("Chỉnh sửa sản phẩm", row.original.id)}
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            className="p-1 text-red-600 hover:bg-gray-200 rounded"
            onClick={() => {
              setSelectedProduct(row.original);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: PRODUCTS_DATA,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Thanh tìm kiếm */}


      {/* Bảng dữ liệu */}
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left text-sm font-bold">
                  <div className="flex items-center gap-2" onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => setPagination((prev) => ({ ...prev, pageSize: Number(e.target.value) }))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">mục</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))}
            disabled={pagination.pageIndex === 0}
          >
            Trước
          </button>
          <span className="text-sm">
            Trang {pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.min(prev.pageIndex + 1, table.getPageCount() - 1) }))}
            disabled={pagination.pageIndex >= table.getPageCount() - 1}
          >
            Tiếp
          </button>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmation isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
      <ProductDetailsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default ProductTable;
