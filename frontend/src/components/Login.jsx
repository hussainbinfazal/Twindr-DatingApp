import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginDetails = () => {
    setEmail("");
    setPassword("");
  };
  const { loginUser,loading } = useAuthStore();

  return (
    <div className="w-full h-full gap-10 flex flex-col sm:justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center pt-10 items-center">
      <h2 className="text-[#FD5169] font-lg text-4xl">Log In</h2>
      <div className="w-full  sm:w-2/4 md:w-2/4 lg:w-2/4 xl:w-2/4 2xl:w-2/4 px-4 sm:px-0 md:px-0 lg:px-0 xl:px-0 2xl:px-0 h-2/4 flex flx-col justify-center  ">
        <form
          className="w-full h-full flex flex-col gap-8"
          onSubmit={(e) => {
            setLoading(true);
            e.preventDefault();
            loginDetails();
            loginUser({ email, password }, navigate);
            setLoading(false);
          }}
        >
          <input
            type="text"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Email Address"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 pl-6"
          />
          <input
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="off"
            placeholder="Password"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6"
          />

          <div className="w-full flex justify-center items-center ">
            <button
              type="submit"
              className={`text-white  w-[250px] h-[50px] rounded-full bg-[#FD5169] text-lg sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 hover:scale-105 transform transition-all duration-300 ease-in-out ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {loading ? ("Logging in") : ("Log In")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
