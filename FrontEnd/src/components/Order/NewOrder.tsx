// NewSale.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Divider, Image, InputNumber, List, message, Row, Select, Typography, Space, Collapse, Input } from "antd";
import { DeleteOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useAuth } from "../../pages/Home/AuthContext";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Category {
  id: number;
  categoryMainId: number | null;
  categoryName: string;
  categoryCode: string;
  image?: string;
  subCategories: Category[];
}

interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unit: string;
  categoryId: number;
  description: string;
  sellingPrice: number;
  createdBy: number;
  createdDate: string | null;
  status: boolean;
  vat: number;
  storageconditions: number;
  weight: number;
  images?: string;
}

interface OrderDetail {
  cartId: number;
  orderDetailId: number;
  productId: number;
  productName: string;
  price: number;
  image?: string;
  quantity: number;
}

const NewSale: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderDetail[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<string>("");

  useEffect(() => {
    axios.get("http://pharmadistiprobe.fun/api/Category/subcategory").then((response) => {
      setCategories(Array.isArray(response.data) ? response.data : response.data.data || []);
    }).catch((error) => {
      console.error("Error fetching categories:", error);
      message.error("Không thể lấy danh sách danh mục.");
    });
  }, []);

  useEffect(() => {
    axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct").then((response) => {
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(data);
      setFilteredProducts(data);
    }).catch((error) => {
      console.error("Error fetching products:", error);
      message.error("Không thể lấy danh sách sản phẩm.");
    });
  }, []);

  useEffect(() => {
    axios.get("http://pharmadistiprobe.fun/api/GHN/provinces").then((response) => {
      setProvinces(response.data.data || []);
    }).catch((error) => {
      console.error("Error fetching provinces:", error);
      message.error("Không thể lấy danh sách tỉnh thành phố.");
    });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`http://pharmadistiprobe.fun/api/GHN/districts/${selectedProvince}`).then((response) => {
        setDistricts(response.data.data || []);
        setSelectedDistrict(null);
        setSelectedWard(null);
      }).catch((error) => {
        console.error("Error fetching districts:", error);
        message.error("Không thể lấy danh sách quận huyện.");
      });
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`http://pharmadistiprobe.fun/api/GHN/wards/${selectedDistrict}`).then((response) => {
        setWards(response.data.data || []);
        setSelectedWard(null);
      }).catch((error) => {
        console.error("Error fetching wards:", error);
        message.error("Không thể lấy danh sách phường xã.");
      });
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const calculateShippingFee = () => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      axios.get("http://pharmadistiprobe.fun/api/GHN/calculate-fee/1", {
        params: { provinceId: selectedProvince, districtId: selectedDistrict, wardId: selectedWard, weight: 1000 },
      }).then((response) => {
        setShippingFee(response.data.fee || 0);
        message.success("Tính phí vận chuyển thành công!");
      }).catch((error) => {
        console.error("Error calculating shipping fee:", error);
        message.error("Không thể tính phí vận chuyển.");
      });
    } else {
      message.warning("Vui lòng chọn đầy đủ địa chỉ giao hàng!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const calculateEstimatedDeliveryTime = () => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      axios.post("http://pharmadistiprobe.fun/api/GHN/calculate-expected-delivery-time", null, {
        params: { fromDistrictId: 1542, fromWardCode: "1B1507", toDistrictId: selectedDistrict, toWardCode: selectedWard },
      }).then((response) => {
        setEstimatedDeliveryTime(formatDate(response.data.data.expectedDeliveryDate));
      }).catch((error) => {
        console.error("Error calculating delivery time:", error);
        message.error("Không thể tính thời gian giao hàng.");
      });
    }
  };

  const removeVietnameseTones = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  };

  const handleFilter = () => {
    const normalizedKeyword = removeVietnameseTones(searchKeyword.toLowerCase());
    const filtered = products.filter((product) => {
      const normalizedProductName = removeVietnameseTones(product.productName.toLowerCase());
      const matchesKeyword = normalizedProductName.includes(normalizedKeyword);
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      const matchesPrice = (!minPrice || product.sellingPrice >= minPrice) && (!maxPrice || product.sellingPrice <= maxPrice);
      return matchesKeyword && matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchKeyword, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    const cartFromCookie = Cookies.get("cart");
    if (cartFromCookie) {
      setOrderItems(JSON.parse(cartFromCookie));
    }
  }, []);

  const addToCart = (product: Product) => {
    axios.post("http://pharmadistiprobe.fun/api/Cart/AddToCart", { productId: product.productId, quantity: 1 }, {
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.data.success) {
        setOrderItems((prev) => {
          const existingItem = prev.find((item) => item.productId === product.productId);
          const updatedItems = existingItem
            ? prev.map((item) => item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item)
            : [...prev, { cartId: 0, orderDetailId: Date.now(), productId: product.productId, productName: product.productName, price: product.sellingPrice, image: product.images, quantity: 1 }];
          Cookies.set("cart", JSON.stringify(updatedItems), { expires: 7 });
          return updatedItems;
        });
        message.success(`Thêm ${product.productName} vào giỏ hàng`);
      }
    }).catch((error) => {
      console.error("Error adding to cart:", error);
      message.error("Không thể thêm sản phẩm vào giỏ hàng.");
    });
  };

  const updateQuantity = (productId: number, value: number) => {
    axios.put(`http://pharmadistiprobe.fun/api/Cart/UpdateCart/${productId}/${value}`).then((response) => {
      if (response.data.success) {
        setOrderItems((prev) => {
          const updatedItems = prev.map((item) => item.productId === productId ? { ...item, quantity: value } : item);
          Cookies.set("cart", JSON.stringify(updatedItems), { expires: 7 });
          return updatedItems;
        });
        message.success("Cập nhật số lượng thành công");
      }
    }).catch((error) => {
      console.error("Error updating quantity:", error);
      setOrderItems((prev) => {
        const updatedItems = prev.map((item) => item.productId === productId ? { ...item, quantity: value } : item);
        Cookies.set("cart", JSON.stringify(updatedItems), { expires: 7 });
        return updatedItems;
      });
    });
  };

  const removeItem = (productId: number) => {
    axios.delete(`http://pharmadistiprobe.fun/api/Cart/RemoveFromCart/${productId}`).then((response) => {
      if (response.data.success) {
        setOrderItems((prev) => {
          const updatedItems = prev.filter((item) => item.productId !== productId);
          Cookies.set("cart", JSON.stringify(updatedItems), { expires: 7 });
          return updatedItems;
        });
        message.success("Xóa sản phẩm khỏi giỏ hàng");
      }
    }).catch((error) => {
      console.error("Error removing item:", error);
      setOrderItems((prev) => {
        const updatedItems = prev.filter((item) => item.productId !== productId);
        Cookies.set("cart", JSON.stringify(updatedItems), { expires: 7 });
        return updatedItems;
      });
    });
  };

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = orderItems.reduce((acc, item) => {
    const product = products.find((p) => p.productId === item.productId);
    return acc + item.price * item.quantity * (product ? product.vat / 100 : 0);
  }, 0);
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để thanh toán!");
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      message.warning("Vui lòng chọn đầy đủ địa chỉ giao hàng!");
      return;
    }

    if (!user.address) {
      message.warning("Thông tin người dùng không có địa chỉ. Vui lòng cập nhật địa chỉ!");
      return;
    }

    if (orderItems.length === 0) {
      message.warning("Giỏ hàng trống, không thể thanh toán!");
      return;
    }

    const token = Cookies.get("token");
    const payload = {
      customerId: user.customerId,
      updatedStatusDate: new Date().toISOString(),
      stockReleaseDate: new Date().toISOString(),
      totalAmount: Math.round(total),
      wardCode: selectedWard || "",
      districtId: selectedDistrict || 0,
      deliveryFee: shippingFee || 0,
      address: user.address,
      createdDate: new Date().toISOString(),
      ordersDetails: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    console.log("Payload gửi lên API Checkout:", JSON.stringify(payload, null, 2));

    axios
      .post("http://pharmadistiprobe.fun/api/Order/CheckOut", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Phản hồi từ API Checkout:", response.data);
        if (response.data.success) {
          message.success("Thanh toán thành công!");
          setOrderItems([]);
          Cookies.remove("cart");
          setSelectedProvince(null);
          setSelectedDistrict(null);
          setSelectedWard(null);
          setShippingFee(null);
          setEstimatedDeliveryTime("");
        } else {
          message.error(response.data.message || "Không thể tạo đơn hàng!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tạo đơn hàng:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        message.error(
          "Lỗi khi thanh toán: " +
            (error.response?.data?.message || error.response?.data || error.message)
        );
      });
  };

  return (
    <div style={{ padding: 20, marginTop: 60 }}>
      <Title level={4}>Tìm kiếm sản phẩm</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Input
            placeholder="Nhập tên sản phẩm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ marginBottom: 16, width: "50%" }}
            allowClear
          />
          <Button onClick={() => setShowFilter(!showFilter)} icon={<FilterOutlined />} style={{ marginBottom: 16 }}>
            Lọc nâng cao
          </Button>

          {showFilter && (
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Lọc nâng cao" key="1">
                <Space direction="vertical" style={{ marginBottom: 16 }}>
                  <Select
                    placeholder="Chọn danh mục"
                    value={selectedCategory || undefined}
                    onChange={(value) => setSelectedCategory(value)}
                    style={{ width: 200 }}
                    allowClear
                  >
                    {categories.map((category) => (
                      <Select.Option key={category.id} value={category.id}>{category.categoryName}</Select.Option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Lọc khoảng giá"
                    style={{ width: 200 }}
                    value={minPrice !== null || maxPrice !== null ? `${minPrice}-${maxPrice}` : undefined}
                    onChange={(value) => {
                      const [min, max] = value.split("-").map(Number);
                      setMinPrice(isNaN(min) ? null : min);
                      setMaxPrice(isNaN(max) ? null : max);
                    }}
                    allowClear
                  >
                    <Select.Option value="0-100000">Dưới 100k</Select.Option>
                    <Select.Option value="100000-500000">100k - 500k</Select.Option>
                    <Select.Option value="500000-1000000">500k - 1 triệu</Select.Option>
                    <Select.Option value="1000000-">Trên 1 triệu</Select.Option>
                  </Select>
                  <Button
                    type="default"
                    danger
                    onClick={() => {
                      setSearchKeyword("");
                      setSelectedCategory(null);
                      setMinPrice(null);
                      setMaxPrice(null);
                      setFilteredProducts(products);
                      message.success("Đã xóa tất cả bộ lọc!");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </Space>
              </Panel>
            </Collapse>
          )}

          <Row gutter={[16, 16]} justify="center">
            {filteredProducts
              .filter((product) => !selectedCategory || product.categoryId === selectedCategory)
              .map((product) => (
                <Col key={product.productId} xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Card
                    hoverable
                    style={{ height: 260, width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                    cover={<Image src={product.images} alt={product.productName} style={{ height: 150, objectFit: "cover" }} />}
                  >
                    <div onClick={() => addToCart(product)} style={{ textAlign: "center", padding: "8px 0", cursor: "pointer" }}>
                      <Title level={5} ellipsis={{ tooltip: product.productName }}>{product.productName}</Title>
                      <Text strong>Giá: {product.sellingPrice} VND</Text>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>

        <Col xs={24} md={8}>
          <Divider />
          <Title level={4}>Giỏ hàng</Title>
          <List
            dataSource={orderItems}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <img
                    src={item.image || "assets/img/product/noimage.png"}
                    alt={item.productName}
                    style={{ width: 100, height: 100, objectFit: "cover", marginRight: 16 }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Text>{item.productName}</Text>
                    <Text>Giá: {item.price} VND</Text>
                    <div>
                      <InputNumber min={1} value={item.quantity} onChange={(value) => updateQuantity(item.productId, value || 1)} />
                      <Button danger onClick={() => removeItem(item.productId)} icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
          <Divider />

          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={4}>Thông tin giao hàng</Typography.Title>
            {user && <Text strong>Địa chỉ: {user.address}</Text>}
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn tỉnh"
                  value={selectedProvince || undefined}
                  onChange={(value) => setSelectedProvince(value)}
                  style={{ width: "100%" }}
                  allowClear
                >
                  {provinces.map((province) => (
                    <Select.Option key={province.provinceID} value={province.provinceID}>{province.provinceName}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn quận/huyện"
                  value={selectedDistrict || undefined}
                  onChange={(value) => setSelectedDistrict(value)}
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!selectedProvince}
                >
                  {districts.map((district) => (
                    <Select.Option key={district.districtID} value={district.districtID}>{district.districtName}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn phường/xã"
                  value={selectedWard || undefined}
                  onChange={(value) => setSelectedWard(value)}
                  style={{ width: "100%" }}
                  allowClear
                  disabled={!selectedDistrict}
                >
                  {wards.map((ward) => (
                    <Select.Option key={ward.wardCode} value={ward.wardCode}>{ward.wardName}</Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={12}>
                <Button type="primary" block onClick={calculateShippingFee}>Tính phí vận chuyển</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" block onClick={calculateEstimatedDeliveryTime}>Tính thời gian giao hàng</Button>
              </Col>
            </Row>
            {shippingFee && <Text strong style={{ marginTop: "16px" }}>Phí vận chuyển: {shippingFee} VND</Text>}
            {estimatedDeliveryTime && <Text strong style={{ marginTop: "8px" }}>Thời gian giao hàng ước tính: {estimatedDeliveryTime}</Text>}
            <Space direction="vertical" style={{ marginTop: "24px", width: "100%" }}>
              <Text strong style={{ fontSize: 16 }}>Tạm tính: {subtotal.toFixed(0)} VND</Text>
              <Text strong style={{ fontSize: 16 }}>Thuế: {tax.toFixed(0)} VND</Text>
              <Text strong style={{ fontSize: 16 }}>Tổng: {total.toFixed(0)} VND</Text>
              <Button
                type="primary"
                onClick={handleCheckout}
                style={{ marginTop: "16px", width: "100%" }}
                disabled={orderItems.length === 0}
              >
                Thanh toán
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default NewSale;