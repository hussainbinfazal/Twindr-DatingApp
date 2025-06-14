import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [genderPreferences, setGenderPreferences] = useState("");
  const navigate = useNavigate();

  const { registerUser } = useAuthStore();
  const signUp = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }
    setEmail("");
    setPassword("");
    setGender("");
    setAge("");
    setName("");
    setGenderPreferences("");
  };
    const [emailError, setEmailError] = useState("");
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="w-full h-full gap-10 flex flex-col pt-10 sm:pt-0 md:pt-0 lg:pt-0 xl:pt-0 2xl:pt-0 sm:justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center items-center overflow-auto ">
      <h2 className="text-[#FD5169] font-lg text-4xl">Create new account</h2>
      <div className="w-4/4 px-4 sm:px-0 md:px-0 lg:px-0 xl:px-0 2xl:px-0 sm:w-2/4 md:w-2/4 lg:w-2/4 xl:w-2/4 2xl:w-2/4 h-2/4 flex flx-col justify-center ">
        <form
          className="w-full h-full flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            signUp();
            registerUser(
              { name, email, password, gender, age, genderPreferences },
              navigate
            );
          }}
        >
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6"
          />
          <input
            required
            value={gender}
            onChange={(e) => setGender(e.target.value.toLowerCase())}
            type="text"
            autoComplete="off"
            placeholder="male/female"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={email}
            onChange={(e) => handleEmailChange(e)}
            type="email"
            autoComplete="email"
            placeholder="Email Adress"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6"
          />
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            placeholder="Password"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="number"
            min={18}
            max={120}
            placeholder="Age"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={genderPreferences}
            onChange={(e) => setGenderPreferences(e.target.value)}
            type="text"
            placeholder="Gender Preferences"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <div className="w-full flex justify-center items-center mt-10">
            <button
              type="submit"
              className="text-white  w-[250px] h-[50px] rounded-full bg-[#FD5169] text-lg sm:mt-10 mt-0 md:mt-10 xl:mt-10 2xl:mt-10 mb-4 hover:scale-105 transition-all ease-in-out active:scale-90"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
