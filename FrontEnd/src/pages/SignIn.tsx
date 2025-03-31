import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!userName || !password) {
      alert("Vui lòng nhập email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://pharmadistiprobe.fun/api/User/Login", {
        userName,
        password,
      });

      if (response.status === 200) {
        const { accessToken, refreshToken, userId, roleName, userName, userAvatar } = response.data.data;

        // Lưu thông tin vào localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("roleName", roleName);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userAvatar", userAvatar);

        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      alert(error.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-[#ff9f43] text-center">Đăng nhập</h3>

        {/* Input fields */}
        <input
          type="text"
          placeholder="Email"
          value={userName}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />

        {/* Sign In Button */}
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
