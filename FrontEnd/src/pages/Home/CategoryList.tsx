import React, { useState } from 'react';
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



const CategoryList: React.FC<CategoryListPageProps> = ({handleChangePage}) => {
  const [filteredCategories, ] = useState<Category[]>(CATEGORY_DATA);



  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Chủng loại</h1>
          <p className=" font-semibold text-gray-600">Quản lý danh sách chủng loại</p>
        </div>
       
      </div>

      <div className='bg-white rounded-lg shadow p-5'>
        <div className="flex justify-between items-center mb-4">
          
          
        </div>
        <CategoryTable 
  CATEGORY_DATA={filteredCategories} 
  handleChangePage={handleChangePage} 
/>
      </div>
    </div>
  );
};

export default CategoryList;
