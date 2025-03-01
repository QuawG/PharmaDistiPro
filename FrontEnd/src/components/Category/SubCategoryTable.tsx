import React, { useState } from 'react';
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
} from '@tanstack/react-table';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import DeleteConfirmation from '../Confirm/DeleteConfirm';
  
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  const handleDelete = () => {
    if (selectedSubCategory) {
      console.log("Deleting subcategory:", selectedSubCategory);
    }
    setIsDeleteModalOpen(false);
  };

  const columns: ColumnDef<SubCategory>[] = [
    {
      accessorKey: 'name',
      header: 'Danh mục phụ',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.original.image || 'assets/img/product/noimage.png'}
            alt={row.original.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'parentCategory',
      header: 'Danh mục chính',
    },
    {
      accessorKey: 'code',
      header: 'Mã danh mục',
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
    },
    {
      accessorKey: 'createdBy',
      header: 'Người tạo',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button className="cursor-pointer p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer p-2 bg-red-500 text-white rounded hover:bg-red-700"
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
    data: SUBCATEGORY_DATA,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-5">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-left text-sm text-gray-700">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 border-b border-gray-300">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' ? <ChevronUp className="w-4 h-4" /> : header.column.getIsSorted() === 'desc' ? <ChevronDown className="w-4 h-4" /> : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-gray-300 hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteConfirmation isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
    </div>
  );
};

export default SubCategoryTable;