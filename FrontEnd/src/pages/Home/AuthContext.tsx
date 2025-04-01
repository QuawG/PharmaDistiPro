// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  customerId: number;
  username: string;
  address: string;
  avatar?: string;
  roleName?: string; // Giữ roleName như hiện tại, hoặc đổi thành roleId nếu cần
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const loginResponse = await axios.post("http://pharmadistiprobe.fun/api/User/Login", {
        userName: username,
        password,
      });

      if (loginResponse.status === 200) {
        const { accessToken, refreshToken, userId, roleName, userName, userAvatar } = loginResponse.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("roleName", roleName);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userAvatar", userAvatar);

        const profileResponse = await axios.get(`http://pharmadistiprobe.fun/api/User/GetUserById/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData: User = {
          customerId: userId,
          username: userName,
          address: profileResponse.data.data.address || "Chưa có địa chỉ",
          avatar: userAvatar,
          roleName: roleName,
        };

        setUser(userData);
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        Cookies.set("token", accessToken, { expires: 7 });
      } else {
        throw new Error("Phản hồi không hợp lệ từ server!");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy endpoint đăng nhập. Vui lòng kiểm tra API!");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    Cookies.remove("token");
    Cookies.remove("cart");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};