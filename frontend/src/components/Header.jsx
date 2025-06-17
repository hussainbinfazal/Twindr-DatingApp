import React, { use } from "react";
import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { FaUsers } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

// Inside your JSX

const Header = ({
  value,
  toggleConnectionPanel,
  isConnectionVisible,
  toggleMenu,
  heartIcon,
  showName,
  matchedUserImage,
  profileId,
  headerChatpage

}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { logoutUser, authUser, authUserProfile, fetchProfile } =
    useAuthStore();
  const { getMyMatches } = useMatchStore();
  const navigate = useNavigate();
  const [finalName, setFinalName] = useState("");

  // Function to handle profile icon click to toggle the menu
  const handleProfileClick = () => {
    setIsMenuVisible((prevState) => !prevState); // Toggle the menu visibility
  };

  useEffect(() => {
    if (authUser) {
      const updatedName = authUser.name.split(" ")[0];
      setFinalName(updatedName);
    }
  }, [authUserProfile]);
  // Function to handle click event to hide the menu if clicked outside
  const handleClickOutside = (e) => {
    const menuElement = document.getElementById("toggleMenu");
    const profileIcon = document.getElementById("profileIcon");

    // Close menu if clicked outside of the menu or the profile icon
    if (
      menuElement &&
      !menuElement.contains(e.target) &&
      profileIcon &&
      !profileIcon.contains(e.target)
    ) {
      setIsMenuVisible(false); // Close menu if clicked outside
    }
  };

  // Attach event listeners when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  

  return (
    <div className={`w-full ${headerChatpage ? "h-[75px] pb-1  items-center pt-6" : "h-[65px] items-center"} flex justify-between  px-4 bg-[#fefcffdd] z-10`}>
      <FaHeart
        className={`heart-icon ${
          isConnectionVisible ? "hidden" : "block"
        } sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden h-[40px] w-[40px] text-red-500`}
        id={heartIcon}
        onClick={toggleConnectionPanel}
      />

      <img
        src="https://imgs.search.brave.com/94mnm1iJlf12UkKQZhtkrYq2TOanooDzGeWIByWp4Yc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/M2M1ODg0OWEwNWZk/NTJlZWNhMTE4NDQv/NjNjNTg4NDlhMDVm/ZDVjNTUwYTExOTQy/X2ZsYW1lLXJlZC1S/R0IlMjAxLndlYnA"
        alt=""
        className="sm:w-[50px] sm:h-[50px] w-[40px] h-[40px] cursor-pointer"
        onClick={() => navigate("/Home")}
      />

      {
        <div className="flex gap-4 items-center text-black sm:ml-20 md:ml-20 lg:ml-20 xl:ml-30 2xl:ml-30">
          {matchedUserImage && <img src={`${import.meta.env.VITE_API_URL}${matchedUserImage}`} srcSet="" alt=""  className="h-[40px] w-[40px] rounded-full  object-fit" />}
          <h2
            className="capitalize cursor-pointer"
            onClick={() => {
              if (value !== "Home") navigate(`/profile/${profileId}`);
              else navigate("/Home");
            }}
          >
            {value}
          </h2>
        </div>
      }

      {showName && (
        authUser ? (
          <div className="flex gap-2 items-center ">
            {" "}
            {authUserProfile ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${
                  authUserProfile.profilePicture
                }`}
                alt=""
                srcSet=""
                onClick={handleProfileClick}
                id="profileIcon"
                className="  h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] md:h-[50px] md:w-[50px]
              lg:h-[50px] lg:w-[50px] xl:h-[50px] xl:w-[50px] 2xl:h-[50px] 2xl:w-[50px]  relative rounded-full border-4 cursor-pointer border-[#FD5169] border-solid"
              />
            ) : (
              <img
                src={
                  "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                }
                alt=""
                srcSet=""
                onClick={handleProfileClick}
                id="profileIcon"
                className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] md:h-[50px] md:w-[50px]
              lg:h-[50px] lg:w-[50px] xl:h-[50px] xl:w-[50px] 2xl:h-[50px] 2xl:w-[50px]  relative rounded-full border-4 border-solid border-[#FD5169] cursor-pointer "
              />
            )}
            <h2 className="capitalize hidden sm:block md:block lg:block xl:block 2xl:block text-sm md:text-lg sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl whitespace-pre text-black !text-[18px]">
              {authUser ? authUser.name : "User Name"}
            </h2>
          </div>
        ) : (
          <CgProfile
            id="profileIcon"
            className="h-[50px] w-[50px] relative border-2 border-white"
            onClick={handleProfileClick}
          />
        )
      )}

      {isMenuVisible && (
        <div
          id="toggleMenu"
          className={`Toggle-Menu w-[140px] h-[145px] rounded-b-lg rounded-l-lg flex justify-center items-center absolute bg-white top-[48px] right-[48px] sm:top-[50px] sm:right-[118px] md:[50px] md:right-[118px] lg:top-[50px] lg:right-[128px] xl:top-[50px] xl:right-[138px] 2xl:top-[50px] 2xl:right-[136px] z-10 ${
            isMenuVisible ? "block" : "none"
          }`}
        >
          <ul className="list-none flex flex-col items-center justify-center gap-3 py-4">
            <Link to="/firstPage">
              <li className="text-black border-b-2 border-black pb-2 text-xl w-full text-center">
                Home
              </li>
            </Link>
            <Link to="/profile">
              <li className="text-black border-b-2  border-black pb-2 text-xl w-full text-center">
                {authUserProfile?.name === "" ? "Create Profile" : "My Profile"}
              </li>
            </Link>

            <li
              className="text-black border-black text-xl cursor-pointer "
              onClick={() => {
                logoutUser(navigate);
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
