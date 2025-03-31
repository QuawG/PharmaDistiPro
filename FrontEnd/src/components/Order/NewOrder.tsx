import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Divider, Image, InputNumber, List, message, Row, Select, Typography, Space, Input, Collapse } from "antd";
import { DeleteOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;
// Interfaces
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
  // Lấy danh sách danh mục
  useEffect(() => {
    axios
      .get("http://pharmadistiprobe.fun/api/Category/subcategory")
      .then((response) => {
        const data = response.data;
        // Kiểm tra nếu phản hồi chứa mảng trong thuộc tính "data"
        if (Array.isArray(data)) {
          setCategories(data);

        } else if (Array.isArray(data.data)) {
          setCategories(data.data);

        } else {
          setCategories([]);
          message.warning("Dữ liệu danh mục không đúng định dạng!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
        message.error("Không thể lấy danh sách danh mục.");
        setCategories([]);
      });
  }, []);


  useEffect(() => {
    axios
      .get("http://pharmadistiprobe.fun/api/Product/ListProduct")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data); // Hiển thị toàn bộ sản phẩm ban đầu
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
          message.warning("Dữ liệu sản phẩm không đúng định dạng!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error);
        message.error("Không thể lấy danh sách sản phẩm.");
        setProducts([]);
        setFilteredProducts([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://pharmadistiprobe.fun/api/GHN/provinces")
      .then((response) => {
        const provincesData = response.data.data;
        if (Array.isArray(provincesData)) {
          setProvinces(provincesData);
        } else {
          setProvinces([]);
          message.warning("Dữ liệu tỉnh thành không đúng định dạng!");
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        message.error("Không thể lấy danh sách tỉnh thành phố.");
        setProvinces([]);
      });
  }, []);

  // Lấy danh sách quận huyện khi chọn tỉnh thành
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`http://pharmadistiprobe.fun/api/GHN/districts/${selectedProvince}`)
        .then((response) => {
          console.log('Dữ liệu quận huyện:', response.data); // Kiểm tra xem dữ liệu có hợp lệ không
          const districtsData = response.data.data;
          if (Array.isArray(districtsData)) {
            setDistricts(districtsData);
            setSelectedDistrict(null); // Reset quận huyện khi thay tỉnh thành
            setSelectedWard(null); // Reset phường xã khi thay tỉnh thành
          } else {
            setDistricts([]);
            message.warning("Dữ liệu quận huyện không đúng định dạng!");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu quận huyện:", error); // Kiểm tra lỗi
          message.error("Không thể lấy danh sách quận huyện.");
          setDistricts([]);
        });
    } else {
      setDistricts([]);
      setSelectedDistrict(null); // Reset quận huyện khi không chọn tỉnh thành
      setSelectedWard(null); // Reset phường xã khi không chọn tỉnh thành
    }
  }, [selectedProvince]);

  const handleDistrictChange = (value: number) => {
    console.log('Quận đã chọn:', value); // Kiểm tra giá trị
    setSelectedDistrict(value);
  };
  const handleWardChange = (value: string) => {
    console.log('Phường/xã đã chọn:', value);
    setSelectedWard(value);
  };
  // Lấy danh sách phường xã khi chọn quận huyện
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`http://pharmadistiprobe.fun/api/GHN/wards/${selectedDistrict}`)
        .then((response) => {
          console.log('Wards data:', response.data); // Check API response
          const wardsData = response.data.data;
          if (Array.isArray(wardsData)) {
            setWards(wardsData);
            setSelectedWard(null); // Reset selectedWard when district changes
          } else {
            setWards([]);
            message.warning("Dữ liệu phường xã không đúng định dạng!");
          }
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
          message.error("Không thể lấy danh sách phường xã.");
          setWards([]);
        });
    } else {
      setWards([]);
      setSelectedWard(null); // Reset when no district selected
    }
  }, [selectedDistrict]);



  // Tính phí vận chuyển
  const calculateShippingFee = () => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      axios
        .get(`http://pharmadistiprobe.fun/api/GHN/calculate-fee/1`, {
          params: {
            provinceId: selectedProvince,
            districtId: selectedDistrict,
            wardId: selectedWard,
            weight: 1000, // Ví dụ trọng lượng có thể được điều chỉnh
          },
        })
        .then((response) => {
          if (response.data && response.data.fee) {
            setShippingFee(response.data.fee);
            message.success("Tính phí vận chuyển thành công!");
          } else {
            message.warning("Không thể tính phí vận chuyển. Dữ liệu trả về không hợp lệ.");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tính phí vận chuyển:", error);
          message.error("Không thể tính phí vận chuyển.");
        });
    } else {
      message.warning("Vui lòng chọn đầy đủ tỉnh thành, quận huyện, xã phường.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và đảm bảo có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng và đảm bảo có 2 chữ số
    const year = date.getFullYear(); // Lấy năm
    return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
  };
  // Tính thời gian giao hàng
  const calculateEstimatedDeliveryTime = () => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      axios
        .post(
          "http://pharmadistiprobe.fun/api/GHN/calculate-expected-delivery-time",
          null,
          {
            params: {
              fromDistrictId: 1542,
              fromWardCode: "1B1507",
              toDistrictId: selectedDistrict,
              toWardCode: selectedWard,
            },
          }
        )
        .then((response) => {
          console.log("API Response:", response.data); // In toàn bộ phản hồi
          if (response.data && response.data.data && response.data.data.expectedDeliveryDate) {
            setEstimatedDeliveryTime(response.data.data.expectedDeliveryDate);
            setEstimatedDeliveryTime(formatDate(response.data.data.expectedDeliveryDate)); // Định dạng lại ngày tháng
            // message.success("Tính thời gian giao hàng thành công!");
          } else {
            message.warning("Không thể tính thời gian giao hàng. Dữ liệu trả về không hợp lệ.");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tính thời gian giao hàng:", error);
          message.error("Không thể tính thời gian giao hàng.");
        });

    } else {
      message.warning("Vui lòng chọn đầy đủ tỉnh thành, quận huyện, xã phường.");
    }
  };
  useEffect(() => {
    // Gọi lại khi thay đổi tỉnh thành, quận huyện, hoặc xã phường
    if (selectedProvince && selectedDistrict && selectedWard) {
        calculateEstimatedDeliveryTime();
    }
}, [selectedProvince, selectedDistrict, selectedWard]);

const handleCalculateDeliveryTime = () => {
    // Tính toán lại thời gian giao hàng khi nhấn nút
    if (selectedProvince && selectedDistrict && selectedWard) {
        calculateEstimatedDeliveryTime();
    } else {
        message.warning("Vui lòng chọn đầy đủ tỉnh thành, quận huyện, xã phường.");
    }
};


  const removeVietnameseTones = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  };

  const onSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
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


  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.productId);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          cartId: 0, // Temporary or default value
          orderDetailId: Date.now(),
          productId: product.productId,
          productName: product.productName,
          price: product.sellingPrice,
          image: product.images,
          quantity: 1,
        },
      ];
    });
    message.success(`Thêm ${product.productName} vào giỏ hàng`);
  };


  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId: number, value: number) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: value } : item))
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (productId: number) => {
    setOrderItems((prev) => prev.filter((item) => item.productId !== productId));
    message.success("Xóa sản phẩm khỏi giỏ hàng");
  };

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = orderItems.reduce((acc, item) => {
    const product = products.find((p) => p.productId === item.productId);
    const vatRate = product ? product.vat / 100 : 0;
    return acc + item.price * item.quantity * vatRate;
  }, 0);
  const total = subtotal + tax;



  const handleCheckout = () => {
    message.success("Thanh toán thành công!");
    setOrderItems([]);
  };

  return  (
    <div style={{ padding: 20, marginTop: 60 }}>
      <Title level={4}>Tìm kiếm sản phẩm</Title>
      
      <Row gutter={[16, 16]}>
        {/* Left Side - Products Section */}
        <Col xs={24} md={16}>
          <Input
            placeholder="Nhập tên sản phẩm"
            value={searchKeyword}
            onChange={handleSearchChange}
            prefix={<SearchOutlined />}
            style={{ marginBottom: 16, width: '100%' }}
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
                      <Select.Option key={category.id} value={category.id}>
                        {category.categoryName}
                      </Select.Option>
                    ))}
                  </Select>

                  <Select
                    placeholder="Lọc khoảng giá"
                    style={{ width: 200 }}
                    value={minPrice !== null || maxPrice !== null ? `${minPrice}-${maxPrice}` : undefined}
                    onChange={(value) => {
                      const [min, max] = value.split("-").map(Number);
                      setMinPrice(isNaN(min) ? null : min); // Nếu không có giá trị, đặt là null
                      setMaxPrice(isNaN(max) ? null : max); // Nếu không có giá trị, đặt là null
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
                      setFilteredProducts(products); // Hiển thị toàn bộ sản phẩm
                      message.success("Đã xóa tất cả bộ lọc!");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </Space>
              </Panel>
            </Collapse>
          )}

          <Row gutter={[8, 8]} justify="start">
            {filteredProducts
              .filter((product) => !selectedCategory || product.categoryId === selectedCategory)
              .map((product) => (
                <Col key={product.productId} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card
                    hoverable
                    onClick={() => addToCart(product)}
                    style={{ marginBottom: 8, height: 220, width: "100%" }}
                    cover={
                      <Image
                        src={product.images}
                        alt={product.productName}
                        style={{ height: 120, objectFit: "cover" }}
                      />
                    }
                  >
                    <Title level={5} ellipsis={{ tooltip: product.productName }}>
                      {product.productName}
                    </Title>
                    <Text>Giá: {product.sellingPrice}00 VND</Text>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>

        {/* Right Side - Cart and Shipping Section */}
        <Col xs={24} md={8}>
          <Divider />
          <Title level={4}>Giỏ hàng</Title>
          <List
            dataSource={orderItems}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Text>{item.productName}</Text>
                  <Text>Giá: {item.price}00 VND</Text>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => updateQuantity(item.productId, value || 1)}
                  />
                  <Button danger onClick={() => removeItem(item.productId)} icon={<DeleteOutlined />} />
                </Space>
              </List.Item>
            )}
          />
          <Divider />

          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Title level={4}>Nhập địa chỉ giao hàng</Typography.Title>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn tỉnh"
                  value={selectedProvince || undefined}
                  onChange={(value) => setSelectedProvince(value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {provinces.map((province) => (
                    <Select.Option key={province.provinceID} value={province.provinceID}>
                      {province.provinceName}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn quận/huyện"
                  value={selectedDistrict || undefined}
                  onChange={handleDistrictChange}
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!selectedProvince}
                >
                  {districts.map((district) => (
                    <Select.Option key={district.districtID} value={district.districtID}>
                      {district.districtName}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn phường/xã"
                  value={selectedWard || undefined}
                  onChange={handleWardChange}
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!selectedDistrict}
                >
                  {wards.map((ward) => (
                    <Select.Option key={ward.wardCode} value={ward.wardCode}>
                      {ward.wardName}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Button
                  type="primary"
                  block
                  onClick={calculateShippingFee}
                >
                  Tính phí vận chuyển
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  block
                  onClick={handleCalculateDeliveryTime}
                >
                  Tính thời gian giao hàng
                </Button>
              </Col>
            </Row>

            {shippingFee && (
              <Text strong style={{ marginTop: '16px' }}>
                Phí vận chuyển: {shippingFee} VND
              </Text>
            )}

            {estimatedDeliveryTime && (
              <Text strong style={{ marginTop: '8px' }}>
                Thời gian giao hàng ước tính: {estimatedDeliveryTime}
              </Text>
            )}

            <Space direction="vertical" style={{ marginTop: '24px', width: '100%' }}>
              <Text strong style={{ fontSize: 16 }}>
                Tạm tính: {subtotal.toFixed(0)}00 VND
              </Text>
              <Text strong style={{ fontSize: 16 }}>
                Thuế: {tax.toFixed(0)}00 VND
              </Text>
              <Text strong style={{ fontSize: 16 }}>
                Tổng: {total.toFixed(0)}00 VND
              </Text>

              <Button
                type="primary"
                onClick={handleCheckout}
                style={{ marginTop: '16px', width: '100%' }}
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
