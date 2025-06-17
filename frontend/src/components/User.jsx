import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ImCross } from "react-icons/im";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import LeftHome from "./LeftHome";
import toast, { Toaster } from "react-hot-toast";
import { useCallback } from "react";


const User = ({
  toggleConnectionPanel,
  setIsConnectionVisible,
  isConnectionVisible,
}) => {
  const {
    authUser,
    createProfile,
    updateProfile,
    fetchProfile,
    authUserProfile,
    deleteProfile,
    logoutUser,
  } = useAuthStore();

  const [name, setName] = useState(authUser?.profile?.name || "");
  const [age, setAge] = useState(authUser?.profile?.age || "");
  const [gender, setGender] = useState(authUser?.profile?.gender || "");
  const [email, setEmail] = useState(authUser?.profile?.email || "");
  const [genderPreferences, setGenderPreferences] = useState(
    authUser?.profile?.genderPreferences || ""
  );
  const [bio, setBio] = useState(authUser?.profile?.bio || "");
  const [profilePicture, setProfilePicture] = useState("");
  const [interests, setInterests] = useState(
    authUser?.profile?.interests || ""
  );
  const [education, setEducation] = useState(
    authUser?.profile?.education || ""
  );
  const [occupation, setOccupation] = useState(
    authUser?.profile?.occupation || ""
  );
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInput = useRef();
  const [headerName, setHeaderName] = useState("Profile");

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

  const createdProfile = () => {
    setName("");
    setAge("");
    setGender("");
    setEmail("");
    setGenderPreferences("");
    setBio("");
    setProfilePicture("");
    setInterests("");
    setEducation("");
    setOccupation("");
  };

  const handleDeleteProfile = (e) => {
    e.preventDefault();
    const isConfirm = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (!isConfirm) return;
    if (authUser && authUser._id && authUserProfile) {
      if (window.confirm("Are you sure you want to delete your profile?")) {
        deleteProfile(authUserProfile._id);
        fetchProfile(authUser._id);
        createdProfile();
      }
    } else {
    }
  };
  const fetchProfileDetails = useCallback(() => {
    if (authUserProfile) {
      setName(authUserProfile.name || "");
      setAge(authUserProfile.age || "");
      setGender(authUserProfile.gender || "");
      setEmail(authUserProfile.email || "");
      // setPassword(authUserProfile.password || "");
      setBio(authUserProfile.bio || "");
      setProfilePicture(authUserProfile.profilePicture || "");
      setInterests(authUserProfile.interests?.join(", ") || "");
      setEducation(authUserProfile.education || "");
      setOccupation(authUserProfile.occupation || "");
      setGenderPreferences(authUserProfile.genderPreferences || "");
    }
  },[authUserProfile]);
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (authUser && authUser._id) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("gender", gender);
      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address.");
        toast.error("Please enter a valid email address.");
        return;
      }
      formData.append("email", email);
      formData.append("genderPreferences", genderPreferences);
      formData.append("bio", bio);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      formData.append("interests", interests);
      formData.append("education", education);
      formData.append("occupation", occupation);
      formData.append("user", authUser._id);

      await createProfile(formData);

    } else {
    }
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", gender);
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }
    formData.append("email", email);
    // formData.append("password", password);
    formData.append("genderPreferences", genderPreferences);
    formData.append("bio", bio);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    formData.append("interests", interests);
    formData.append("education", education);
    formData.append("occupation", occupation);

    await updateProfile(formData, authUser._id);
    fetchProfile(authUser._id);
    // updateProfile({ name, age, gender,email, genderPreferences,bio,profilePicture,interests,education,occupation}, authUser._id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
      // setImageName(file.name);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setProfilePicture("");
    // Clear the profilePicture("");
  };

  useEffect(() => {
    if (authUserProfile && authUserProfile.profilePicture) {
      setPreview(
        `${import.meta.env.VITE_API_URL}${authUserProfile.profilePicture}`
      );
    }
  }, [authUserProfile]);
  useEffect(() => {
    if (authUser && authUser._id) {
      fetchProfile(authUser._id);
    }
  }, [authUser]);
  useEffect(() => {
    if (authUserProfile) {
      fetchProfileDetails();
    }
  }, [authUserProfile]);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Function to handle profile icon click to toggle the menu
  const handleProfileClick = () => {
    setIsMenuVisible((prevState) => !prevState); // Toggle the menu visibility
  };

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
    <div className="scrollbar-hide w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden ">
      {isConnectionVisible && (
        <LeftHome
          isConnectionVisible={isConnectionVisible}
          toggleConnectionPanel={toggleConnectionPanel}
        />
      )}
      <Header
        value={headerName}
        isConnectionVisible={isConnectionVisible}
        toggleConnectionPanel={toggleConnectionPanel}
        showName={true}
        profileId={authUser?._id}
      />
      <div className=" w-full  h-[90%] flex flex-col justify-center items-center ">
        <form
          className="w-full sm:w-2/4 md:w-2/4 lg:w-2/4 xl:w-2/4 2xl:w-2/4 h-full flex flex-col  gap-8 mt-3 p-6"
          encType="multipart/form-data"
        >
          <input
            required
            type="text"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder="User Name"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={gender}
            onChange={(e) => setGender(e.target.value.toLowerCase())}
            type="text"
            maxLength={40}
            autoComplete="off"
            placeholder="Gender"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={email}
            onChange={(e) => handleEmailChange(e)}
            type="email"
            maxLength={40}
            autoComplete="email"
            placeholder="Email Adress"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6"
          />

          <input
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="number"
            min={18}
            max={120}
            placeholder="Age"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6"
          />
          <input
            required
            value={genderPreferences}
           onChange={(e) => setGenderPreferences(e.target.value.toLowerCase())}
            type="text"
            maxLength={40}
            placeholder="Gender Preferences"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            type="text"
            maxLength={40}
            placeholder="Bio"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            type="text"
            maxLength={40}
            placeholder="Your Interests"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 "
          />
          <input
            required
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            type="text"
            maxLength={40}
            placeholder="Education"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 capitalize"
          />
          <input
            required
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            type="text"
            maxLength={40}
            placeholder="occupation"
            className="h-[60px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 capitalize"
          />
          <div
            className={` w-[450px] h-[450px] flex justify-start items-center mt-2 pl-10 relative`}
          ></div>
          <div>
            <input
              type="file"
              ref={fileInput}
              className="hidden"
              name="profilePicture"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                fileInput.current?.click();
              }}
              className={`${
                preview ? "hidden" : "block"
              } h-[40px] w-[330px] border-2 border-gray-300 border-solid outline-none rounded-full  text-gray-800  placeholder:text-gray-400 placeholder:text-2xl placeholder:px-4 p-6 flex justify-center items-center !text-[14px]`}
            >
              Upload Profile Picture
            </button>
            {/* {imageName && <p className="mt-2 text-gray-800">{imageName}</p>} */}
            {preview ? (
              <div
                className=" w-[350px] h-[350px] flex justify-start items-center pr-4 
              sm:pl-10 md:pl-5 lg:pl-5 xl:pl-5 2xl:pl-5 sm:pr-10 md:pr-10 lg:pr-10 xl:pr-10 2xl:pr-10  relative object-contain p-4 roudned-lg"
              >
                <img
                  src={
                    preview ||
                    `${import.meta.env.VITE_API_URL}${
                      authUserProfile?.profilePicture
                    }`
                  }
                  alt=""
                  className="relative top-0 right-0 w-full h-full rounded-lg"
                />
                <div className="absolute top-2 right-8 w-[30px] h-[30px] rounded-full bg-red-300 flex items-center justify-center">
                  <ImCross
                    className={`top-0 right-0 text-[#FA2E60] w-[20px] h-[20px] cursor-pointer rounded-full`}
                    onClick={handleClear}
                  />
                </div>
              </div>
            ) : (
              <div className="text-black pl-12 text-lg">*No image selected</div>
            )}
          </div>
          <div className="w-full flex justify-center items-center ">
            {authUserProfile ? (
              <div className="w-full flex justify-center items-center mt-4 gap-4 pb-8">
                <button
                  onClick={handleUpdateProfile}
                  className="text-white w-[250px] h-[50px] rounded-full bg-[#FD5169] text-lg mt-6"
                >
                  Update Profile
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="text-white w-[250px] h-[50px] rounded-full bg-[#FD5169] text-lg mt-6"
                >
                  Delete Profile
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center mt-10">
                <button
                  onClick={handleCreateProfile}
                  className="text-white w-[250px] h-[50px] rounded-full bg-[#FD5169] text-lg mt-10 mb-4"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default User;
