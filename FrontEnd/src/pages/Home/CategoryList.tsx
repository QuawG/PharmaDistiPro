import React, { useState } from 'react';
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CategoryTable from '../../components/Category/CategoryTable';

interface CategoryListPageProps {
  handleChangePage: (page: string) => void;
}

interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

const CATEGORY_DATA: Category[] = [
  { id: 1, name: 'Chăm sóc da mặt', code: 'CT001', description: 'Đây là các sản phẩm về chăm sóc da mặt ', createdBy: 'Admin', image: 'https://dulichmedia.dalat.vn//Images/LDG/haitra/yte/dalieua_636791882642800724.png' },
  { id: 2, name: 'Fruits', code: 'CT002', description: 'Fruits Description', createdBy: 'Admin', image: 'assets/img/product/fruits.png' },
  { id: 3, name: 'Accessories', code: 'CT003', description: 'Accessories Description', createdBy: 'Admin', image: 'assets/img/product/accessories.png' },
];

const CategoryList: React.FC<CategoryListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(CATEGORY_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredCategories(CATEGORY_DATA.filter(category =>
      category.name.toLowerCase().includes(value.toLowerCase())
    ));
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh mục chính</h1>
          <p className="text-sm text-gray-500">Quản lý danh mục chính</p>
        </div>
        <button
          onClick={() => handleChangePage('Thêm danh mục chính')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold' /> Thêm danh mục chính mới
        </button>
      </div>

      <div className='bg-white rounded-lg shadow p-5'>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9F43] p-2 rounded-lg">
              <FunnelIcon className="w-5 h-5 text-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8 pr-4 py-1 border border-gray-300 rounded-lg w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
        <CategoryTable CATEGORY_DATA={filteredCategories} />
      </div>
    </div>
  );
};

export default CategoryList;
