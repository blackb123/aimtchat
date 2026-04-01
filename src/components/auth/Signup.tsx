import { useState } from "react";
import type { SignupComponentProps } from "@/types";
import { API_BASE_URL } from "@/constants";

export default function Signup({ isopen, setIsOpen }: SignupComponentProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // ... validation and fetch logic remains the same ...
    if (!username || !email || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) setIsOpen("login");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (isopen !== "signup") return null;

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* RadioKing uses a grid for name fields, but for a single username we stack */}
      <div className="space-y-6">
        
        {/* Username Field */}
        <div className="flex flex-col">
          <label className="text-[15px] font-bold text-[#1a1a1a] mb-2">
            Username
          </label>
          <input
            type="text"
            className="w-full bg-[#F6F7F9] border-none rounded-[8px] h-[56px] px-5 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col">
          <label className="text-[15px] font-bold text-[#1a1a1a] mb-2">
            E-mail address
          </label>
          <input
            type="email"
            className="w-full bg-[#F6F7F9] border-none rounded-[8px] h-[56px] px-5 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
            placeholder="xyz@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label className="text-[15px] font-bold text-[#1a1a1a] mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full bg-[#F6F7F9] border-none rounded-[8px] h-[56px] px-5 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
            placeholder="6 characters minimum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* RadioKing Style Checkbox (Optional but adds to the look) */}
        <div className="flex items-start gap-3 pt-2">
          <input 
            type="checkbox" 
            className="mt-1 h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500" 
            id="terms"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
            I accept the <span className="text-red-500 underline cursor-pointer">general conditions</span> and the <span className="text-red-500 underline cursor-pointer">privacy policy</span>.
          </label>
        </div>

        {/* Big Action Button */}
        <button
          className="w-full bg-[#FF4B55] hover:bg-[#e6434d] text-white text-lg font-bold h-[60px] rounded-[8px] transition-all shadow-lg shadow-red-500/20 mt-4"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create my account"}
        </button>
      </div>
    </div>
  );
}