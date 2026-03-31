import { useState } from "react";
import Signup from "@/components/auth/Signup";
import Login from "@/components/auth/Login";
import type { AuthPageProps } from "@/types";
import loginImage from "@/assets/logoaimt.jpeg"; 

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [openauth, setOpenAuth] = useState<"login" | "signup">("login");

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white font-sans">
      
      {/* LEFT IMAGE SECTION: 40% Width like RadioKing sidebar */}
      <div className="hidden md:block w-[40%] h-screen sticky top-0 bg-black">
        <img
          src={loginImage}
          alt="Auth Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM SECTION: 60% Width, Pure White, No Box */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 sm:px-12 lg:px-32 py-20">
        
        {/* The Form Wrapper - Max width is larger to match RadioKing's roomy feel */}
        <div className="w-full max-w-[580px]">
          
          {/* Exact RadioKing Header Sizing */}
          <header className="mb-12">
            <h1 className="text-[42px] font-bold text-[#1a1a1a] leading-tight tracking-tight">
              {openauth === "login" ? "Welcome back" : "Create your account"}
            </h1>
          </header>

          {/* Form Content */}
          <main className="w-full">
            {/* 
               CRITICAL FOR THE LOOK: 
               Ensure your inputs inside <Signup /> and <Login /> follow this:
               - Background: #F6F7F9
               - Height: h-[56px] (14 units)
               - Font Size: text-lg
               - Border: None
               - Rounded: rounded-md (small radius)
            */}
            {openauth === "signup" ? (
              <Signup isopen={openauth} setIsOpen={setOpenAuth} />
            ) : (
              <Login isopen={openauth} setIsOpen={setOpenAuth} onLogin={onLogin} />
            )}
          </main>

          {/* Footer Navigation */}
          <footer className="mt-10 pt-6">
            <p className="text-[15px] text-gray-500">
              {openauth === "login" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setOpenAuth(openauth === "login" ? "signup" : "login")}
                className="ml-2 text-red-500 font-bold hover:underline underline-offset-4"
              >
                {openauth === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile-only Top Image */}
      <div className="md:hidden w-full h-[25vh] bg-black">
         <img src={loginImage} className="w-full h-full object-cover" alt="mobile-header" />
      </div>
    </div>
  );
}