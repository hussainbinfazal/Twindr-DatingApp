import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useProfileStore } from "../store/useProfileStore";
import Loading from "../components/Loading";
import { RxCross1 } from "react-icons/rx";
import { FaHeart } from "react-icons/fa";
import { useMatchStore } from "../store/useMatchStore";
import React, { useState } from "react";
import { MdOutlineWorkOutline } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi";
import LeftHome from "../components/LeftHome";
import { useCallback } from "react";
const MatchProfile = ({
  toggleConnectionPanel,
  isConnectionVisible,
  setIsConnectionVisible,
}) => {
  const { profileId } = useParams();

  const { matchProfile, getSingleProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { createMatch, deleteMatches, unMatchProfile } = useMatchStore();

  const handleImage = (image) => {
    if (image?.startsWith("http://") || image?.startsWith("https://")) {
      return `${image}`;
    } else {
      return `${import.meta.env.VITE_API_URL}${image}`;
    }
  };

   const fetchProfileData = useCallback(async () => {
      setLoading(true);
      try{
        await getSingleProfile(profileId);
      }catch (error) {
        // console.error("Error fetching profile data:", error);
      }
      setLoading(false);
    },[profileId]);
  useEffect(() => {
    fetchProfileData();
  }, [profileId, getSingleProfile]);

  useEffect(() => {
    setProfile(matchProfile);
  }, [matchProfile]);

  if (loading ) {
    return <Loading />;
  }
  return (
    <div className="w-full min-h-screen flex  items-start justify-center bg-white flex-col text-neutral-400 relative gap-4 pb-4 ">
      {isConnectionVisible && (
        <LeftHome
          isConnectionVisible={isConnectionVisible}
          toggleConnectionPanel={toggleConnectionPanel}
        />
      )}
      <Header
        profileId={profile?.user}
        showName={true}
        value={profile?.name}
        matchedUserImage={profile?.profilePicture}
        toggleConnectionPanel={toggleConnectionPanel}
        isConnectionVisible={isConnectionVisible}
        setIsConnectionVisible={setIsConnectionVisible}
      />
      <div className="min-h-[200px] h-2/4 w-full sm:w-full sm:h-2/4 md:w-full md:h-2/4 lg:w-full lg:h-2/3 xl:w-full xl:h-[70%] absolute -top-5 lg:-top-20 xl:-top-30 2xl:-top-60 rounded-b-full bg-gradient-to-b from-[#f57190] to-[#ffd2e0] z-[1] clip-half-circle"></div>
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="sm:w-3/5 md:w-2/5 lg:w-2/5 xl:w-2/5 2xl:w-[40%] w-full  bg-white min-h-[calc(100vh-60px)] flex flex-col items-center my-auto py-2 z-10 2xl:px-8  border-t-none border-b border-x border-gray-100 rounded-md ">
        <div className="w-full h-1/2 px-4 py-2 flex justify-center items-center">
          <img
            src={handleImage(profile?.profilePicture)}
            alt="Profile Picture"
            className="w-full h-full object-fit rounded-r-md rounded-l-md"
          />
        </div>
        <div className="w-full h-1/2 px-4 py-2 flex flex-col divide-y-2 divide-gray-100 space-y-4">
          <span className="flex flex-col gap-2 pb-10">
            <span className="w-full flex gap-1 text-gray-700">
              <h2 className="text-3xl font-bold text-gray-700">
                {profile.name &&
                  profile.name.toString().slice(0, 1).toUpperCase() +
                    profile.name.toString().slice(1)}
              </h2>
              ,
              <h2 className="text-3xl font-bold text-gray-700">
                {profile.age && profile.age}
              </h2>
            </span>
            <span className="flex gap-2 text-xl items-center text-gray-700 ">
              <MdOutlineWorkOutline />
              {profile.occupation && profile.occupation}
            </span>
            <span className="flex gap-2 text-xl items-center text-gray-700">
              <HiOutlineAcademicCap />
              {profile.education && profile.education}
            </span>
          </span>
          <span className="flex flex-row gap-2 pb-2">
            <h3>{profile.bio && profile.bio}</h3>
          </span>
          <span className="flex flex-row gap-2 pb-2">
            <h3>{profile.interests && profile.interests.join(", ")}</h3>
          </span>
          <div className="w-full h-[7%] flex items-center justify-center py-6 my-auto">
            <div className="w-3/5 h-[7%] flex items-center justify-center gap-18">
              <button
                className="w-[80px] h-[80px] bg-white flex rounded-full justify-center items-center cursor-pointer hover:scale-105 transition-all ease-in-out active:scale-90 border-2 border-gray-200"
                onClick={() => unMatchProfile(profile.user)}
              >
                <RxCross1 className=" text-green-600 hover:text-green-900 font-semibold" />
              </button>
              <button
                className="w-[80px] h-[80px] bg-white flex rounded-full justify-center items-center cursor-pointer hover:scale-105 transition-all ease-in-out active:scale-90 border-2 border-gray-200"
                onClick={() => createMatch(profile.user)}
              >
                <FaHeart className="hover:text-[#ff4545] text-[#fd5169]" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MatchProfile;
