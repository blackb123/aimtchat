import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginComponentProps } from "@/types";

export default function Login({ isopen, setIsOpen, onLogin }: LoginComponentProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", data.user_name);

        onLogin(data.access_token, data.user_id, data.user_name);  
        navigate("/chat");            
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Network error");
    }
    setLoading(false);
  };

  if (isopen !== "login") return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        
        {/* Username Field */}
        <div className="flex flex-col">
          <label className="text-[15px] font-bold text-[#1a1a1a] mb-2">
            User name
          </label>
          <input
            type="text"
            className="w-full bg-[#F6F7F9] border-none rounded-[8px] h-[56px] px-5 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[15px] font-bold text-[#1a1a1a]">
              Password
            </label>
            
          </div>
          <input
            type="password"
            className="w-full bg-[#F6F7F9] border-none rounded-[8px] h-[56px] px-5 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {/* Action Button */}
        <button
          className="w-full bg-[#FF4B55] hover:bg-[#e6434d] text-white text-lg font-bold h-[60px] rounded-[8px] transition-all shadow-lg shadow-red-500/10 mt-4 active:scale-[0.98]"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login to Chat"}
        </button>

        {/* Responsive Mobile Toggle */}
        <p className="text-center md:hidden text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setIsOpen("signup")}
            className="text-red-600 font-bold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}