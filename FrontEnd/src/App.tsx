import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./pages/Home/AuthContext";
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PaymentFailed from './pages/Payment/PaymentFailed';
function App() {
  const handleChangePage = (page: string, orderId?: number) => {
    console.log("handleChangePage called:", { page, orderId });
    // Logic điều hướng, ví dụ:
    if (page === "Danh sách đơn hàng") {
      window.location.href = "/"; // HomePage chứa danh sách đơn hàng
    } else if (page === "Tạo đơn hàng") {
      window.location.href = "/"; // HomePage sẽ xử lý
    }
    // Thêm logic cho các trang khác nếu cần
  };
  return (
    <>
       <AuthProvider>
      <Router>
        {/* Navbar không cần đặt ở đây nữa vì đã có trong HomePage */}
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<HomePage />} />
          <Route
              path="/payment/success"
              element={<PaymentSuccess handleChangePage={handleChangePage} />}
            />
            <Route
              path="/payment/failed"
              element={<PaymentFailed handleChangePage={handleChangePage} />}
            />
          {/* Thêm các route khác nếu cần */}
        </Routes>
      </Router>
    </AuthProvider>
    </>
  )
}

export default App
