import React, { useState } from 'react';
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductTable from '../../components/Product/ProductTable';

interface ProductListPageProps {
  handleChangePage: (page: string) => void

}
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
const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Macbook pro",
    sku: "PT001",
    category: "Computers",
    brand: "N/D",
    price: "1500.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 2,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Orange",
    sku: "PT002",
    category: "Fruits",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 3,
    image: "https://genk.mediacdn.vn/139269124445442048/2023/6/6/macbook-air-15-inch-6-16860313066961124865501-1686038279968-168603828012719897017.jpg",
    name: "Pineapple",
    sku: "PT003",
    category: "Fruits",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 4,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Strawberry",
    sku: "PT004",
    category: "Fruits",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 5,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Avocat",
    sku: "PT005",
    category: "Accessories",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "150.00",
    createdBy: "Admin"
  },
  {
    id: 6,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Macbook Pro",
    sku: "PT006",
    category: "Shoes",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 7,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Apple Earpods",
    sku: "PT007",
    category: "Shoes",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 8,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "iPhone 11",
    sku: "PT008",
    category: "Fruits",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 9,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "samsung",
    sku: "PT009",
    category: "Earphones",
    brand: "N/D",
    price: "10.00",
    unit: "pc",
    qty: "100.00",
    createdBy: "Admin"
  },
  {
    id: 10,
    image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    name: "Banana",
    sku: "PT010",
    category: "Health Care",
    brand: "N/D",
    price: "10.00",
    unit: "kg",
    qty: "100.00",
    createdBy: "Admin"
  }
];

const ProductListPage: React.FC <ProductListPageProps> = ({handleChangePage}) => {


  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS_DATA);

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = PRODUCTS_DATA.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };



  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách sản phẩm</h1>
          <p className="text-sm text-gray-500">Quản lý sản phẩm</p>
        </div>
        <button 
        onClick={() => {
          handleChangePage('Thêm sản phẩm')
        }}
        className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Thêm sản phẩm mới
        </button>
      </div>

      {/* Search and Actions */}
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

        {/* Table */}
        <ProductTable PRODUCTS_DATA={filteredProducts}/>
        
      </div>
    </div>
  );
};

export default ProductListPage;