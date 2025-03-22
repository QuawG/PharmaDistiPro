import React, { useState } from "react";
import { GiftIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faMotorcycle, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
}

const NewSale: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("fruit");
  const [orderItems, setOrderItems] = useState<{ id: string; name: string; quantity: number; price: number }[]>([]);

  const products: { [key: string]: Product[] } = {
    fruit: [
      { id: "PT001", name: "Orange", category: "Fruit", image: "/img/orange.jpg", price: 150.0 },
      { id: "PT002", name: "Apple", category: "Fruit", image: "/img/apple.jpg", price: 120.0 },
      { id: "PT003", name: "Lemon", category: "Fruit", image: "/img/lemon.jpg", price: 180.0 },
    ],
    moto: [
      { id: "PT004", name: "Moto1", category: "Moto", image: "/img/moto1.jpg", price: 1000.0 },
      { id: "PT005", name: "Moto2", category: "Moto", image: "/img/moto2.jpg", price: 2000.0 },
    ],
    car: [
      { id: "PT006", name: "Car1", category: "Car", image: "/img/car1.jpg", price: 5000.0 },
      { id: "PT007", name: "Car2", category: "Car", image: "/img/car2.jpg", price: 7000.0 },
    ],
  };

  const categories = [
    { id: "fruit", icon: <GiftIcon className="w-6 h-6 text-green-500" />, label: "Fruit" },
    { id: "moto", icon: <FontAwesomeIcon icon={faMotorcycle} className="w-6 h-6 text-blue-500" />, label: "Moto" },
    { id: "car", icon: <FontAwesomeIcon icon={faCar} className="w-6 h-6 text-red-500" />, label: "Car" },
  ];

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id: product.id, name: product.name, quantity: 1, price: product.price }];
      }
    });
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id: string, amount: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="p-6 pt-[60px] flex flex-col md:flex-row gap-6">
      {/* Left - Danh mục và sản phẩm */}
      <div className="w-full md:w-2/3">
        <h1 className="text-xl font-bold">Categories</h1>
        <p className="text-gray-500">Manage your purchases</p>

        <div className="flex gap-4 mt-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`p-3 rounded-md transition ${
                selectedCategory === category.id ? "bg-green-500 text-white" : "bg-gray-300 text-black"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {products[selectedCategory].map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => addToCart(product)}
            >
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
              <p className="text-sm text-gray-500 mt-2">{product.category}</p>
              <h2 className="text-lg font-bold mt-1">{product.name}</h2>
              <p className="text-red-500 font-bold mt-1">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Giỏ hàng */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Cart</h2>
        <p className="text-gray-500">Total items: {orderItems.length}</p>

        {orderItems.length > 0 ? (
          <div className="mt-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-lg" src={`/img/${item.name.toLowerCase()}.jpg`} alt={item.name} />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-500">{item.id}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          setOrderItems((prev) =>
                            prev.map((itm) =>
                              itm.id === item.id ? { ...itm, quantity: Math.max(1, Number(e.target.value)) } : itm
                            )
                          )
                        }
                        className="w-10 text-center border border-gray-300 rounded-md"
                        min="1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button className="text-red-500" onClick={() => removeItem(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">Your cart is empty.</p>
        )}

        <div className="mt-4 font-bold">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p className="text-lg text-green-600">Total: ${total.toFixed(2)}</p>
        </div>

        <button className="w-full bg-green-500 text-white py-2 mt-4 rounded-md">Checkout</button>
      </div>
    </div>
  );
};

export default NewSale;
