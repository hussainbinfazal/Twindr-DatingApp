import React from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "./Login";
const FirstPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div className="w-full h-full max-h-screen gap-8 flex flex-col justify-center items-center">
      <div className="w-1/5 h-1/5 flex flex-col items-center">
        <img
          src="https://imgs.search.brave.com/94mnm1iJlf12UkKQZhtkrYq2TOanooDzGeWIByWp4Yc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/M2M1ODg0OWEwNWZk/NTJlZWNhMTE4NDQv/NjNjNTg4NDlhMDVm/ZDVjNTUwYTExOTQy/X2ZsYW1lLXJlZC1S/R0IlMjAxLndlYnA"
          alt=""
          className="w-4/5 h-full"
        />
      </div>
      <h2 className="text-[#FD5169] font-medium text-3xl sm:text-5xl">Find Your Soul Mate</h2>
      <h4 className="text-black w-[70%] break-words sm:w-[25%] text-xl sm:text-2xl text-center">
        Match and chat with the people you like in your area
      </h4>

      <button
        className="bg-[#FD5169] w-2/4 sm:w-1/4 h-[60px] rounded-4xl border-none outline-none "
        onClick={() => navigate("/login")}
      >
        Log In
      </button>
      <button
        className="bg-transparent text-black border-gray-200 border-[2px] border-solid w-2/4 sm:w-1/4 h-[60px] rounded-4xl outline-none "
        onClick={() => navigate("/register")}
      >
        Sign Up
      </button>
      
    </div>
  );
};

export default FirstPage;
