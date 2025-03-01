import React from "react";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-[#ff9f43] text-center">Sign Up</h3>

        {/* Input fields */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-[#ff9f43] outline-none"
        />

        {/* Sign Up Button */}
        <button className="w-full bg-[#ff9f43] text-white py-2 rounded-lg mt-6 font-bold transition-all hover:bg-[#e68a36]">
          Sign Up
        </button>

        {/* Chuyển sang SignIn */}
        <p className="text-gray-700 text-center mt-4">
          Already have an account? {" "}
          <span
            className="text-[#ff9f43] cursor-pointer hover:underline font-semibold"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
