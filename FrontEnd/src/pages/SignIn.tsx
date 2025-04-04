// src/pages/SignIn.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Home/AuthContext";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập username và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      alert("Đăng nhập thành công!");
      navigate("/"); // Điều hướng về HomePage, logic trang mặc định sẽ xử lý ở HomePage
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      alert(error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-[#ff9f43] text-center">Đăng nhập</h3>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />

        <button
          onClick={handleSignIn}
          className={`w-full text-white py-2 rounded-lg mt-6 font-bold transition-all ${
            loading ? "bg-gray-400" : "bg-[#ff9f43] hover:bg-[#e68a36]"
          }`}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default SignIn;