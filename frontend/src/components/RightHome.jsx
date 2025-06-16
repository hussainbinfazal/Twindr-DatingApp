import React, { useCallback } from "react";
import Profile from "./Profile";
import Header from "./Header";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import TinderCard from "react-tinder-card";
import { useProfileStore } from "../store/useProfileStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
const RightHome = ({
  isConnectionVisible,
  toggleConnectionPanel,
  toggleMenu,
  heartIcon,
}) => {
  const { getAllProfiles, profiles } = useProfileStore();
  const { createMatch, deleteMatches, unMatchProfile } = useMatchStore();
  const { authUser, authUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [headerName, setHeaderName] = useState("Home");
  const tinderCardRefs = useRef([]);
  // const initialPeople = [
  //   {
  //     name: "John",
  //     imgUrl:
  //       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGluZGVyJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  //     university: "University of United kingdom",
  //     work: "Software Engineer",
  //     age: "24",
  //   },
  //   {
  //     name: "Mary",
  //     imgUrl:
  //       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGluZGVyJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  //     university: "University of United states of America",
  //     work: "Doctor",
  //     age: "26",
  //   },
  //   {
  //     name: "Jane",
  //     imgUrl:
  //       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGluZGVyJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D1",
  //     university: "University of United kingdom",
  //     work: "Software developer",
  //     age: "22",
  //   },
  // ];

  const [people, setPeople] = useState([]);
  const [swipedCount, setSwipedCount] = useState(0);
  const swiped = (direction, person) => {
    if (direction === "right") {
      // Create match when swiped to the right
      createMatch(person.user);
    } else if (direction === "left") {
      // Unmatch profile when swiped to the left
      unMatchProfile(person.user);
    }
    setSwipedCount((prevCount) => prevCount + 1);
  };

  // on swipe-left we shall run unmatchProfile functon //
  // on swipe-left we shall run createMatch functon //
  const outOfFrame = (name) => {};
  const cardStyles = {
    transform: `rotate(${Math.random() * 10 - 5}deg)`, // Adjust this logic to implement swipe effects
  };
  useEffect(() => {
    if (swipedCount === Array.isArray(people) && people.length) {
      setSwipedCount(0); // Reset swipe count
    }
  }, [swipedCount]);

  useEffect(() => {
    if (profiles && Array.isArray(profiles.profiles)) {
      setPeople(profiles.profiles);
      setLoading(false); // Set loading to false once profiles are fetched
    } else {
      setLoading(true); // In case no profiles found, stop loading
    }
  }, [profiles]);
  const addTinderCardRef = (index, ref) => {
    tinderCardRefs.current[index] = ref;
  };

  // Trigger swipe programmatically when button is clicked
  const handleSwipe = (direction, index) => {
    if (
      tinderCardRefs.current[index] &&
      typeof tinderCardRefs.current[index].swipe === "function"
    ) {
      tinderCardRefs.current[index].swipe(direction);
    }
  };

  const getProfiles = useCallback(async () => {
    try {
      await getAllProfiles();
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  },[getAllProfiles]);
  useEffect(() => {
    if (authUserProfile) {
      getProfiles();
    }
  }, [, authUserProfile, handleSwipe]);

  useEffect(() => {
    let interval;
    if (profiles.length === 0 && !loading) {
      setLoading(true);
      interval = setInterval(() => {
        getAllProfiles();
      }, 10000);
    }


    return () => {
      clearInterval(interval);
      setLoading(false);
    };
  }, [profiles, loading, getAllProfiles]);

  return (
    <div
      className="w-[100%] sm:w-[70%] md:w-[70%] lg:w-[70%] xl:w-[70%] 2xl:w-[70%] h-full bg-[#E85A6B] flex flex-col items-center justify-between "
      id={toggleMenu}
    >
      <Header
        value={headerName}
        toggleConnectionPanel={toggleConnectionPanel}
        isConnectionVisible={isConnectionVisible}
        toggleMenu={toggleMenu}
        heartIcon={heartIcon}
        showName={true}
      />
      <div className="w-full max-h-screen flex flex-col justify-center items-center relative h-[93%] overflow-hidden shadow-[0px_1px_4px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset]">
        {authUserProfile ? (
          loading && people.length === 0 ? (
            <h2 className="text-black z-10">Fetching profiles ..........</h2>
          ) : people && people.length > 0 ? (
            people.map((person, index) => {
              addTinderCardRef(index);
              return (
                <TinderCard
                  key={index}
                  onSwipe={(dir) => swiped(dir, person)}
                  onCardLeftScreen={() => outOfFrame(person.name)}
                  className="absolute"
                  style={cardStyles}
                  ref={(ref) => addTinderCardRef(index, ref)}
                >
                  <Profile
                    name={person?.name}
                    university={person?.education}
                    work={person?.occupation}
                    imageUrl={
                      person?.profilePicture ? `${person?.profilePicture}` : ""
                    }
                    Age={person?.age}
                    profileId={person?.user}
                  />
                  <div className="w-full h-[7%] flex items-center justify-center py-6">
                    <div className="w-3/5 h-[7%] flex items-center justify-center gap-18">
                      <button
                        className="w-[80px] h-[80px] bg-white flex rounded-full justify-center items-center cursor-pointer hover:scale-105 transition-all ease-in-out active:scale-90"
                        onClick={() => handleSwipe("left", index)}
                      >
                        <RxCross1 className=" text-green-600 hover:text-green-900 font-semibold" />
                      </button>
                      <button
                        className="w-[80px] h-[80px] bg-white flex rounded-full justify-center items-center cursor-pointer hover:scale-105 transition-all ease-in-out active:scale-90"
                        onClick={() => handleSwipe("right", index)}
                      >
                        <FaHeart className="hover:text-[#ff4545] text-[#fd5169]" />
                      </button>
                    </div>
                  </div>
                </TinderCard>
              );
            })
          ) : (
            <h2 className="text-black text-lg z-10 whitespace-pre">
              Fetching more profiles ............
            </h2>
          )
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-6">
            <h2 className="text-black z-10 w-full flex flex-col text-xl justify-center items-center">
              <h3>Please create your profile first</h3>
              <Link to="/profile" className="text-white font-semibold text-xl">
                <span>Create profile</span>
              </Link>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightHome;
