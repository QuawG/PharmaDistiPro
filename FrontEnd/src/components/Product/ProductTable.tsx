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
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import DeleteConfirmation from '../Confirm/DeleteConfirm';
import ProductDetailsModal from './ProductDetail';

interface Product {
  id: number;
  image: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: string;
  unit: string;
  qty: string;
  createdBy: string;
}

interface ProductTable {
  PRODUCTS_DATA: Product[]
}



const ProductTable: React.FC<ProductTable> = ({PRODUCTS_DATA}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = () => {
    setIsDeleteModalOpen(false)
  }
  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 custom-checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 custom-checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
            
      
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: 'Tên sản phẩm',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.original.image} 
            alt={row.original.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Danh mục chính',
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
    },
    {
      accessorKey: 'price',
      header: 'Giá',
      cell: ({ row }) => (
        <span>${parseFloat(row.original.price).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Đơn vị',
    },
    {
      accessorKey: 'qty',
      header: 'Số lượng',
      cell: ({ row }) => (
        <span>{parseFloat(row.original.qty).toFixed(2)}</span>
      ),
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
          <button 
            className="cursor-pointer p-1 hover:bg-blue-50 rounded text-blue-500"
            onClick={() => setIsOpen(true)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            className="cursor-pointer p-1 hover:bg-green-50 rounded text-green-500"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            className="cursor-pointer p-1 hover:bg-red-50 rounded text-red-500"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];



  const handleEdit = (product: Product) => {
    console.log('Edit product:', product);
  };



  const table = useReactTable({
    data: PRODUCTS_DATA,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination: {
        pageSize,
        pageIndex: 0,
      },
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
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-none bg-gray-50">
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className="px-4 py-3 text-left text-[14px] font-bold"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="w-4 h-4" />,
                          desc: <ChevronDown className="w-4 h-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id}
                className="border-b border-b-gray-200 hover:bg-gray-50 transition-colors"
              >
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

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              table.setPageSize(Number(e.target.value));
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </div>
          <div className="flex gap-1">
            <button
              className={`px-3 py-1 text-sm rounded ${
                !table.getCanPreviousPage()
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-[#FF9F43] text-white hover:bg-[#ff8f20]'
              }`}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${
                !table.getCanNextPage()
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-[#FF9F43] text-white hover:bg-[#ff8f20]'
              }`}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      <ProductDetailsModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default ProductTable;