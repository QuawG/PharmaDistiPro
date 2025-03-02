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
import CustomerDetailsModal from './CustomerDetail';

interface Customer {
  id: number;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CustomerTableProps {
  CUSTOMERS_DATA: Customer[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ CUSTOMERS_DATA }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const columns: ColumnDef<Customer>[] = [
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
      id: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => (
        <img src={row.original.avatar} alt={row.original.name} className="w-28 h-20 " />
      ),
      enableSorting: false,
    },
    { accessorKey: 'name', header: 'Tên khách hàng' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Số điện thoại' },
    { accessorKey: 'address', header: 'Địa chỉ' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button className="cursor-pointer p-1 hover:bg-blue-50 rounded text-blue-500" onClick={() => setIsOpen(true)}>
            <Eye className="w-4 h-4" />
          </button>
          <button className="cursor-pointer p-1 hover:bg-green-50 rounded text-green-500" onClick={() => handleEdit(row.original)}>
            <Pencil className="w-4 h-4" />
          </button>
          <button className="cursor-pointer p-1 hover:bg-red-50 rounded text-red-500" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  const handleEdit = (customer: Customer) => {
    console.log('Edit customer:', customer);
  };

  const table = useReactTable({
    data: CUSTOMERS_DATA,
    columns,
    state: { sorting, rowSelection, globalFilter, pagination: { pageSize, pageIndex: 0 } },
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
                  <th key={header.id} className="px-4 py-3 text-left text-[14px] font-bold">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ChevronUp className="w-4 h-4" />, desc: <ChevronDown className="w-4 h-4" /> }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
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
      <DeleteConfirmation isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
      <CustomerDetailsModal isOpen={isOpen} onClose={() => setIsOpen(false)} customer={undefined} />
    </div>
  );
};

export default CustomerTable;
