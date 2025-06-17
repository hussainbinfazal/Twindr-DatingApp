  import React from "react";
import { useEffect, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { useMatchStore } from "../store/useMatchStore";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import { initializeSocket, disconnectSocket } from "../socket/socketclient";
import Badge from "./Badge";
import { getSocket } from "../socket/socketclient";
const LeftHome = ({isConnectionVisible ,leftHeaderChatpage}) => {
  //  const [myMatches, setMyMatches] = useState([]);
  const { authUser } = useAuthStore();
  const { matches, getMyMatches } = useMatchStore();
  const {
    activeMatchId,
    setActiveMatchId,
    setActiveMatchName,
    activeMatchName,
    unreadCount,
    incrementUnreadCount,
    Messages,
    resetUnreadCount,
    getNewMessage,
    unSubscribeFromNewMessage,
    onlineUsers,
  } = useMessageStore();
  const setIsActive = () => {
    set({ isActive: !isActive });
  };
  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  useEffect(() => {
    if (authUser) {
      // Initialize the socket once the user is authenticated

      initializeSocket(authUser._id);
      getNewMessage(); // Start listening for new messages

      return () => {
        // Clean up by unsubscribing from socket events on component unmount
        unSubscribeFromNewMessage();
        disconnectSocket();
      };
    }
  }, [authUser]);

  useEffect(() => {
    // Check if the active match is selected, reset unread count for that match
    if (activeMatchId) {
      resetUnreadCount(); // Reset the unread count whenever the user opens a new chat
    }
  }, [activeMatchId, resetUnreadCount]);

  useEffect(() => {
    const handleRouteChange = () => {
      setActiveMatchId(null);
    };

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [location.pathname, setActiveMatchId]);

  return (
      
      <div className={`connection-panel w-[40%] sm:w-[30%] md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%] absolute sm:relative lg:relative md:relative xl:relative 2xl:relative z-50 h-full ${isConnectionVisible ? "block" : "hidden"} sm:block md:block lg:block xl:block 2xl:block sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col `}>
        <div className={`w-full ${leftHeaderChatpage ? "h-[75px] items-center pb-1 pt-4"  : "h-[63px] items-center"} px-4 flex justify-between  text-[#FD5169] bg-white border-b `}>
          <h2 className="text-sm sm:text-lg  md:text-2xl lg:text-2xl xl:text-2xl text-[#FD5169]">Your Connections</h2>
          <div className="relative">
            <FiMessageSquare className="text-2xl" />
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
        <div></div>
        <div className="w-full h-[93%] bg-white flex flex-col">
          {matches && matches.length > 0 ? (
            matches.map((match) => {
              const profilePicture = `${import.meta.env.VITE_API_URL}${match?.profile?.profilePicture}`;
              const matchName = match?.profile?.name || match?.name;
              const isOnline = onlineUsers.has(match._id);
  
              return (
                <Link to={`/chatpage/${match._id}`} key={match._id}>
                  <div
                    onClick={() => {
                      setActiveMatchName(matchName);
                      setActiveMatchId(match._id);
                    }}
                    className={`w-full h-[70px] flex items-center gap-2 px-4 border-b-[1px] border-gray-200 ${activeMatchId === match._id ? "bg-amber-200" : ""}`}
                  >
                    {match?.profile?.profilePicture ? (
                      <div className="relative">
                        <img
                          src={profilePicture}
                          alt="avatar"
                          className="w-[55px] h-[55px] rounded-full"
                        />
                        {isOnline && (
                          <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-1 right-1"></div>
                        )}
                      </div>
                    ) : (
                      <CgProfile
                        id="profileIcon"
                        className="h-[50px] w-[50px] relative"
                      />
                    )}
                    <h2 className="text-xl text-[#FD5169] ml-3 capitalize">
                      {matchName}
                    </h2>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <h2 className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl text-[#FD5169]">No Matches Yet</h2>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default LeftHome;
