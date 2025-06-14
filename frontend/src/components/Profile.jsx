import React, { useState } from "react";
import { MdOutlineWorkOutline } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { Link } from "react-router-dom";
const Profile = ({ name, university, work, imageUrl, Age,profileId }) => {
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <Link to={`/profile/${profileId}`}>
      <div className="w-[450px] relative  h-[500px] rounded-2xl overflow-hidden border-2 border-neutral-300 shadow-[0px_1px_4px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset]">
        <img
          src={`${
            imageUrl ? `${import.meta.env.VITE_API_URL}${imageUrl}` : ""
          }`}
          alt=""
          className="w-full h-full rounded-lg  px-2 py-2 opacity-95"
        />
        <div className="absolute bottom-0 left-0 pl-8 pb-8 shadow-[0px_1px_4px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset] ">
          <h3 className="text-4xl font-semibold text-neutral-800 flex gap-3  items-center ">
            {((name).toUpperCase())},
            <span className="font-light text-2xl ">{Age}</span>
          </h3>
          <h4 className="flex items-center gap-2 text-lg mb-4 mt-2 text-neutral-800 ">
            <span>
              <MdOutlineWorkOutline />
            </span>
            {university}
          </h4>
          <h4 className="flex items-center gap-2 text-lg mb-4 text-neutral-800">
            <span>
              <HiOutlineAcademicCap />
            </span>
            {work}
          </h4>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default Profile;
