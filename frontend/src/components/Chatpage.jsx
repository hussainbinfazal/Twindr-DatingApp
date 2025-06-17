import { useRef, useEffect } from "react";
import React from "react";
import LeftHome from "./LeftHome";
import RightHome from "./RightHome";
import Header from "./Header";
import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { useMessageStore } from "../store/useMessageStore";
import { useParams } from "react-router-dom";
import { initializeSocket, disconnectSocket } from "../socket/socketclient";
import moment from "moment";
import AudioRecorder from "./AudioRecorder";
import AudioPlayer from "./AudioPlayer";
import { FaCheck, FaCheckDouble, FaExclamationTriangle } from "react-icons/fa";
import { PiDotsThreeVerticalLight } from "react-icons/pi";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const Chatpage = () => {
  const { authUser, authUserProfile } = useAuthStore();
  const {
    Messages,
    getAllMessagesBetweenUser,
    createMessage,
    getNewMessage,
    unSubscribeFromNewMessage,
    activeMatchName,
    setActiveMatchName,
    resetUnreadCount,
    updateMessageStatus,
    deleteMessage,
    updateMessage,
  } = useMessageStore();
  const [componentName, setComponentName] = useState("Chat");
  const [message, setMessage] = useState("");
  const { matchProfile, getSingleProfile } = useProfileStore();
  const { matchedUserId } = useParams();
  const messagesEndRef = useRef(null);
  const hasFetchedMessages = useRef(false);
  const sender = authUser._id;
  const receiver = matchedUserId;
  const [audioBlob, setAudioBlob] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const typingTimeoutRef = useRef(null);
  const [menuOpenMessageId, setMenuOpenMessageId] = useState(null);
  const [editMessage, setEditMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const menuRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [headerChatpage, setHeaderChatpage] = useState(true);
  const [leftHeaderChatpage, setLeftHeaderChatpage] = useState(true);
  const handleUpdateMessageStatus = (messageId, messageStatus) => {
    updateMessageStatus(messageId, messageStatus);
  };

  const handleCreateMessage = async (audioBlob = null) => {
    const formData = new FormData();
    try {
      if (audioBlob) {
        // Handle audio message
        formData.append("audio", audioBlob, "audio-message.webm");
        formData.append("type", "audio");
      } else if (message.trim()) {
        // Handle text message
        formData.append("message", message);
        formData.append("type", "text");
      } else {
        return; // Don't send empty messages
      }

      formData.append("sender", sender);
      formData.append("receiver", receiver);
      formData.append("timestamp", new Date().toISOString());

      await createMessage(formData);

      setMessage("");
    } catch (error) {
    }
  };

  const handleAudioRecorded = (audioBlob) => {
    handleCreateMessage(audioBlob);
  };
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
    }, 1000);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateMessage();
    }
  };

  const getMessageStatusIcon = (messageStatus) => {
    if (messageStatus === "sent") {
      return <FaCheck className="text-gray-500 text-sm" />;
    }
    if (messageStatus === "delivered") {
      return <FaCheckDouble className="text-gray-500 text-sm" />;
    }
    if (messageStatus === "seen") {
      return <FaCheckDouble className="text-blue-500 font-semibold text-sm" />;
    }
    if (messageStatus === "error") {
      return <FaExclamationTriangle className="text-red-500 text-sm" />;
    }
    // return null;
  };


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [Messages]);
  useEffect(() => {
    if (authUser && matchedUserId) {
      getAllMessagesBetweenUser(authUser._id, matchedUserId);
    }
  }, [authUser._id, matchedUserId, updateMessageStatus]);
  useEffect(() => {
    if (authUser && authUser._id && authUserProfile) {
      setProfilePicture(
        `${import.meta.env.VITE_API_URL}${authUserProfile.profilePicture}`
      );
    }
  }, [authUser, Messages]);



  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {}, [updateMessageStatus]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-message-id");
            const messageStatus = entry.target.getAttribute(
              "data-message-status"
            );
            if (messageStatus === "delivered" && messageStatus !== "seen") {
              handleUpdateMessageStatus(messageId, "seen");
            }
            
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    const messageElements = document.querySelectorAll(".message");
    messageElements.forEach((element) => observer.observe(element));

    return () => {
      messageElements.forEach((element) => observer.unobserve(element));
    };
  }, [Messages, handleUpdateMessageStatus]);

  const handleMenuOpen = (messageId) => {
    setMenuOpenMessageId((prevId) => (prevId === messageId ? null : messageId));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenMessageId(null);
      }
    };

    if (menuOpenMessageId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenMessageId]);

  const handleUpdateMessage = async (messageId, editedMessage) => {
   
    const trimmedMessage = editedMessage.trim();
    await updateMessage(messageId, trimmedMessage);
    setEditingMessage(null);
    setEditMessage(null);
    setMenuOpenMessageId(null);
  };
  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
    toast.success("Message deleted successfully");
    setMenuOpenMessageId(null);
  };
  const fetchProfile = async () => {
    await getSingleProfile(matchedUserId);
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };
  return (
    <div className="w-full h-full flex min-h-screen overflow-y none">
      <div ref={messagesEndRef} />
      <LeftHome leftHeaderChatpage={leftHeaderChatpage}/>
      <div className="w-full md:w-[70%] lg:w-[70%] xl:[70%] 2xl:w-[70%] h-full">
        <Header
          value={activeMatchName ? activeMatchName : componentName}
          profileId={matchedUserId}
          showName={true}
          matchedUserImage={matchProfile.profilePicture}
          headerChatpage={true}
        />
        <div className="w-full h-[calc(100%-60px)] flex flex-col justify-between items-center bg-white">
          <div className="Messages w-full h-full text-black  relative overflow-y-auto ">
            {Messages && Messages.length > 0 ? (
              Messages.map((message, index) => {
                const isSender = message.sender === authUser._id;
                const formattedTime = moment(message.timestamp).format(
                  "h:mm A"
                );

                return (
                  <div
                    key={index}
                    className={`message w-full flex items-start p-4 gap-4 ${
                      isSender ? "justify-end" : ""
                    }`}
                    data-message-id={message._id}
                    data-message-status={message.messageStatus}
                  >
                    {!isSender && (
                      <img
                        src={`${profilePicture}`}
                        alt=""
                        className="w-[50px] h-[50px] rounded-full"
                      />
                    )}

                    <div
                      className={`w-[40%] max-w-[80%] h-auto flex flex-col justify-start relative ${
                        isSender
                          ? "items-end bg-[#E85A6B]"
                          : "items-start bg-yellow-600"
                      } ${
                        isSender
                          ? "rounded-lg rounded-tr-none"
                          : "rounded-lg rounded-tl-none"
                      } mt-1 relative pb-2`}
                    >
                      {isSender && (
                        <div className="absolute top-0 -right-1 text-2xl text-white">
                          <PiDotsThreeVerticalLight
                            onClick={() => handleMenuOpen(message?._id)}
                            className="cursor-pointer"
                          />
                        </div>
                      )}
                      {menuOpenMessageId === message?._id && isSender && (
                        <div
                          className="menuDiv absolute divide-y-2 top-5 right-3 min-h-[50px] min-w-[100px] bg-neutral-600/30 text-gray-200 flex flex-col text-lg justify-between items-start  p-2 rounded-br-md rounded-tl-md rounded-bl-md "
                          ref={menuRef}
                        >
                          <span
                            className=" cursor-pointer w-full p-1"
                            onClick={() => {
                              setEditMessage(true);
                              setEditingMessageId(message?._id);
                              setEditingMessage(message?.message);
                            }}
                          >
                            Edit
                          </span>
                          <span
                            className="w-full p-1 cursor-pointer"
                            onClick={() => handleDeleteMessage(message?._id)}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                      <h1
                        className={`text-xl w-full ${
                          isSender ? "text-white" : "text-red-800"
                        } pl-2 border-b-[1px] border-gray-200 ${
                          isSender ? "hidden" : "block"
                        }`}
                      >
                        {message?.senderName}
                      </h1>
                      <div className=" w-full h-auto flex justify-start items-start pl-2 pt-2 pb-2 word-break overflow-hidden">
                        {message.type === "audio" ? (
                          // <audio
                          //   controls
                          //   className="custom-audio-playerw-full max-w-[250px]"
                          // >
                          //   <source
                          //     src={`${import.meta.env.VITE_API_URL}${
                          //       message.audioUrl
                          //     }`}
                          //     type="audio/webm"
                          //   />
                          //   Your browser does not support audio playback.
                          // </audio>
                          <AudioPlayer
                            audioUrl={`${import.meta.env.VITE_API_URL}${
                              message.audioUrl
                            }`}
                          />
                        ) : editMessage &&
                          message._id === editingMessageId &&
                          isSender ? (
                          <div className="min-w-4/5 min-h-[90%] text-xl">
                            <input
                              type="text"
                              value={editingMessage}
                              onChange={(e) =>
                                setEditingMessage(e.target.value)
                              }
                              className="border-1 outline-none border-gray-200 bg-white"
                            />
                          </div>
                        ) : (
                          <h1 className="text-white text-xl">
                            {message?.message}
                          </h1>
                        )}
                      </div>
                      <h1 className="text-white text-sm italic absolute opacity-75 bottom-1 right-2 mb-[-2]">
                        {formattedTime}
                      </h1>
                      {isSender && getMessageStatusIcon(message.messageStatus)}
                    </div>
                    {isSender &&
                      editMessage &&
                      message._id === editingMessageId && (
                        <div>
                          <button
                            className="text-white bg-pink-600 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            onClick={() => {
                              handleUpdateMessage(message._id, editingMessage);
                              setEditMessage(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      )}
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-white">No Messages</h1>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
          <div className="Message-Input w-full h-[10%]">
            <div className="w-full h-full flex justify-center items-center bg-[#E85A6B]">
              <div className="Imput text w-full h-full flex justify-center items-center">
                <input
                  type="text"
                  value={message}
                  placeholder="Type a message"
                  className="w-[93%] h-[70%] border-amber-100 border-2 border-solid rounded-full outline-none p-2 placeholder:p-2"
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateMessage();
                      setMessage("");
                    }
                  }}
                />
                <div className="relative flex flex-col items-start">
                  <button
                    className="text-white px-2 py-1"
                    onClick={() => setShowEmojiPicker((val) => !val)}
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 -left-80 z-50">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
                <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                <button
                  type="submit"
                  onClick={() => {
                    handleCreateMessage();
                    setMessage("");
                  }}
                  className=" flex justify-center items-center h-[90%] w-[7%%] text-5xl"
                >
                  <LuSendHorizontal />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
