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
} from "@tanstack/react-table";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import DeleteConfirmation from "../Confirm/DeleteConfirm";
import UpdateSubCategory from "../Category/UpdateSubCategory";

interface SubCategory {
  id: number;
  name: string;
  parentCategory: string;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

interface SubCategoryTableProps {
  SUBCATEGORY_DATA: SubCategory[];
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ SUBCATEGORY_DATA }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(SUBCATEGORY_DATA);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleDelete = () => {
    console.log("Deleting subcategory:", selectedSubCategory);
    setIsDeleteModalOpen(false);
  };

  const handleUpdateSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories(prev => prev.map(sub => sub.id === updatedSubCategory.id ? updatedSubCategory : sub));
    // setIsEditModalOpen(false);
    // setAlertMessage("Cập nhật danh mục thành công!");
    // setTimeout(() => setAlertMessage(null), 3000);
  };

  const columns: ColumnDef<SubCategory>[] = [
    {
      accessorKey: "name",
      header: "Danh mục phụ",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image || "assets/img/product/noimage.png"}
            alt={row.original.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedSubCategory(row.original);
              setIsEditModalOpen(true);
            }}
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "parentCategory", header: "Danh mục chính" },
    { accessorKey: "code", header: "Mã danh mục" },
    { accessorKey: "description", header: "Mô tả" },
    { accessorKey: "createdBy", header: "Người tạo" },
    {
      id: "actions",
      header: "Tính năng",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer p-1 hover:bg-green-50 rounded text-green-500"
            onClick={() => {
              setSelectedSubCategory(row.original);
              setIsEditModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer p-1 hover:bg-red-50 rounded text-red-500"
            onClick={() => {
              setSelectedSubCategory(row.original);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: subCategories,
    columns,
    state: { sorting, globalFilter, pagination: { pageSize, pageIndex: 0 } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white">
      {alertMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {alertMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-none bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-[14px] font-bold">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-b-gray-200 hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-800 opacity-90">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmation isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
      
      <UpdateSubCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={selectedSubCategory}
        onSave={handleUpdateSubCategory}
      />
    </div>
  );
};

export default SubCategoryTable;
