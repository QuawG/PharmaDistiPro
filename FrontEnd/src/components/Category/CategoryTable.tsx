import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteConfirmation from '../Confirm/DeleteConfirm';
import UpdateCategory from '../Category/UpdateCategory';

interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

interface CategoryTableProps {
  CATEGORY_DATA: Category[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ CATEGORY_DATA }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORY_DATA);
  const handleDelete = () => {
    if (selectedCategory) {
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdate = (updatedCategory: Category) => {
    setCategories(categories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
    
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Tên danh mục',
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
    { accessorKey: 'code', header: 'Mã danh mục' },
    { accessorKey: 'description', header: 'Mô tả' },
    { accessorKey: 'createdBy', header: 'Người tạo' },
    {
      id: 'actions',
      header: 'Tính năng',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer p-1 hover:bg-green-50 rounded text-green-500"
            onClick={() => {
              setSelectedCategory(row.original);
              setIsEditModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer p-1 hover:bg-red-50 rounded text-red-500"
            onClick={() => {
              setSelectedCategory(row.original);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-none bg-gray-50">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-[14px] font-bold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-b-gray-200 hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-800 opacity-90">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Update Category */}
      <UpdateCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onSave={handleUpdate}
      />

      {/* Popup Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CategoryTable;
