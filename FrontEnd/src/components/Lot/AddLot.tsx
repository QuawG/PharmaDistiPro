import React, { useState } from "react";
import Select from "react-select";
import { PRODUCTS_DATA } from "../data/product";

interface AddLotProps {
  handleChangePage: (page: string) => void;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: string;
  quantity: number;
  manufacturedDate: string;
  expiredDate: string;
  status?: string;
}

const AddLot: React.FC<AddLotProps> = ({ handleChangePage }) => {
  const [lotNumber, setLotNumber] = useState<string>("");
  const [status] = useState<string>("Đang chờ");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [error, setError] = useState<string>("");

  const productOptions = PRODUCTS_DATA.map((p) => ({
    value: String(p.ProductId),
    label: p.ProductName,
  }));

  const handleSelectProduct = (selectedOption: any) => {
    const product = PRODUCTS_DATA.find((p) => String(p.ProductId) === selectedOption.value);
    if (product && !selectedProducts.some((p) => p.id === String(product.ProductId))) {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: String(product.ProductId),
          name: product.ProductName,
          price: "",
          quantity: 0, // Mặc định quantity = 0
          manufacturedDate: "",
          expiredDate: "",
          status: "Đã hết hàng",
        },
      ]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  // Xử lý lưu lô hàng
  const handleSave = () => {
    if (!lotNumber.trim()) {
      setError("Vui lòng nhập số lô.");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    for (const product of selectedProducts) {
      if (!product.price.trim() || !product.manufacturedDate || !product.expiredDate) {
        setError("Vui lòng nhập đầy đủ thông tin cho tất cả sản phẩm.");
        return;
      }
    }

    setError(""); // Xóa lỗi nếu hợp lệ

    const newLot = {
      lotNumber,
      status,
      products: selectedProducts,
    };

    console.log("Lưu lô hàng:", newLot);

    alert("Lô hàng đã được lưu thành công!");
    handleChangePage("Danh sách lô hàng");
  };

  return (
    <div className="p-6 mt-16 overflow-auto w-full bg-gray-100">
      <h1 className="text-xl font-semibold text-gray-900">Tạo mới lô hàng</h1>

      <div className="bg-white rounded-lg shadow p-5">
        {error && <p className="text-red-500">{error}</p>}

        <label className="block text-gray-700 font-medium mb-1">Số lô</label>
        <input
          type="text"
          className="border px-2 py-1 w-full mb-4"
          placeholder="VD: L0001"
          value={lotNumber}
          onChange={(e) => setLotNumber(e.target.value)}
        />



        <label className="block text-gray-700 font-medium mb-1">Sản phẩm</label>
        <Select options={productOptions} onChange={handleSelectProduct} placeholder="Chọn sản phẩm..." />

        {selectedProducts.length > 0 && (
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Mã SP</th>
                <th className="border p-2">Tên SP</th>
                <th className="border p-2">Giá nhập</th>
                <th className="border p-2">Ngày sản xuất</th>
                <th className="border p-2">Ngày hết hạn</th>
                <th className="border p-2">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="border p-2">{product.id}</td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="border px-2 py-1 w-full"
                      value={product.price}
                      onChange={(e) =>
                        setSelectedProducts(
                          selectedProducts.map((p) =>
                            p.id === product.id ? { ...p, price: e.target.value } : p
                          )
                        )
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="date"
                      className="border px-2 py-1 w-full"
                      value={product.manufacturedDate}
                      onChange={(e) =>
                        setSelectedProducts(
                          selectedProducts.map((p) =>
                            p.id === product.id ? { ...p, manufacturedDate: e.target.value } : p
                          )
                        )
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="date"
                      className="border px-2 py-1 w-full"
                      value={product.expiredDate}
                      onChange={(e) =>
                        setSelectedProducts(
                          selectedProducts.map((p) =>
                            p.id === product.id ? { ...p, expiredDate: e.target.value } : p
                          )
                        )
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleRemoveProduct(product.id)} className="text-red-500">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg">
          Lưu
        </button>

        <button onClick={() => handleChangePage("Danh sách lô hàng")} className="ml-3 text-gray-600">
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default AddLot;
