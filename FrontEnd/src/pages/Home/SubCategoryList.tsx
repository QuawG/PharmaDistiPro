import React, { useState } from 'react';
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import SubCategoryTable from '../../components/Category/SubCategoryTable';

interface SubCategoryListPageProps {
    handleChangePage: (page: string) => void;
}

interface SubCategory {
    id: number;
    name: string;
    parentCategory: string;
    code: string;
    description: string;
    createdBy: string;
    image?: string;
}

const SUBCATEGORY_DATA: SubCategory[] = [
    { id: 1, name: 'Serum', parentCategory: 'Chăm sóc da mặt', code: 'SC001', description: 'Các loại serum dưỡng da', createdBy: 'Admin', image: 'assets/img/product/serum.png' },
    { id: 2, name: 'Cleansers', parentCategory: 'Chăm sóc da mặt', code: 'SC002', description: 'Sữa rửa mặt', createdBy: 'Admin', image: 'assets/img/product/cleanser.png' },
    { id: 3, name: 'Toner', parentCategory: 'Chăm sóc da mặt', code: 'SC003', description: 'Nước hoa hồng', createdBy: 'Admin', image: 'assets/img/product/toner.png' },
];

const SubCategoryList: React.FC<SubCategoryListPageProps> = ({ handleChangePage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>(SUBCATEGORY_DATA);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFilteredSubCategories(SUBCATEGORY_DATA.filter(subCategory =>
            subCategory.name.toLowerCase().includes(value.toLowerCase())
        ));
    };

    return (
        <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
            <div className="flex justify-between items-center mb-[25px]">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Danh mục thuốc</h1>
                    <p className="text-sm text-gray-500">Quản lý danh mục thuốc</p>
                </div>
                <button
                    onClick={() => handleChangePage('Tạo danh mục thuốc')}
                    className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2"
                >
                    <PlusIcon className='w-5 h-5 font-bold' /> Tạo danh mục thuốc mới
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
                <SubCategoryTable SUBCATEGORY_DATA={filteredSubCategories} />
            </div>
        </div>
    );
};

export default SubCategoryList;
