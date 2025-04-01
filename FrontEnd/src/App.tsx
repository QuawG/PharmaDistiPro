import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./pages/Home/AuthContext";
function App() {

  return (
    <>
       <AuthProvider>
      <Router>
        {/* Navbar không cần đặt ở đây nữa vì đã có trong HomePage */}
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<HomePage />} />
          {/* Thêm các route khác nếu cần */}
        </Routes>
      </Router>
    </AuthProvider>
    </>
  )
}

export default App
