import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
   
    if (email && password) {
      navigate("/");
    } else {
      alert("Vui lòng nhập email và mật khẩu!!");
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
          value={email}
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
          className="w-full bg-[#ff9f43] text-white py-2 rounded-lg mt-6 font-bold transition-all hover:bg-[#e68a36]"
        >
          Sign In
        </button>

        {/* Chuyển sang SignUp */}
        
      </div>
    </div>
  );
};

export default SignIn;
