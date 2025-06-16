import { useState } from "react";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import LeftHome from "./components/LeftHome.jsx";
import RightHome from "./components/RightHome.jsx";
import FirstPage from "./components/FirstPage.jsx";
import Chatpage from "./components/Chatpage.jsx";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import User from "./components/User.jsx";
import MatchProfile from "./pages/MatchProfile.jsx";
function App() {
  const { checkAuth, authUser } = useAuthStore();
  const { getMyMatches } = useAuthStore();

  const [isConnectionVisible, setIsConnectionVisible] = useState(false);

  const toggleConnectionPanel = () => {
    setIsConnectionVisible((prevState) => !prevState);
  };
  const HandleConnectionsPanel = (e) => {
    const connectionPanel = document.querySelector(".connection-panel");
    const heartIcon = e.target.closest(".heart-icon");
    if (!connectionPanel || !heartIcon) {
      setIsConnectionVisible(false); 
    }
  };
  useEffect(() => {
    document.addEventListener("click", HandleConnectionsPanel);

    
    return () => {
      document.removeEventListener("click", HandleConnectionsPanel);
    };
  }, []);
  useEffect(() => {
    
    checkAuth(); 
  }, [checkAuth]);

  return (
    <div className="text-3xl text-white  w-screen h-screen">
      <Routes>
        {/* Home Route */}
        <Route
          path="/Home"
          element={
            authUser ? (
              <Home
                isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel}
              />
            ) : (
              <Navigate to="/firstPage" />
            )
          }
        />
        <Route
          path="/"
          element={
            authUser ? (
              <Home
                isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel}
              />
            ) : (
              <Navigate to="/firstPage" />
            )
          }
        />

        {/* First Page Route */}
        <Route
          path="/firstPage"
          element={authUser ? <Navigate to="/Home" /> : <FirstPage />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/Home" /> : <Login />}
        />

        {/* Register Route */}
        <Route
          path="/register"
          element={authUser ? <Navigate to="/Home" /> : <Register />}
        />

        {/* Left Home Route */}
        <Route
          path="/leftHome"
          element={
            authUser ? (
              <LeftHome
                isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Right Home Route */}
        <Route
          path="/rightHome"
          element={
            authUser ? (
              <RightHome
                isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel}
              />
            ) : (
              <Navigate to="/firstPage" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            authUser ? (
              <User
                isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel}
              />
            ) : (
              <Navigate to="/firstPage" />
            )
          }
        />
        <Route
          path="/chatpage/:matchedUserId"
          element={authUser ? <Chatpage /> : <Navigate to="/firstPage" />}
        />
        <Route
          path="/profile/:profileId"
          element={authUser ? <MatchProfile toggleConnectionPanel={toggleConnectionPanel} isConnectionVisible={isConnectionVisible} setIsConnectionVisible={setIsConnectionVisible}/> : <Navigate to="/firstPage" />}
        />
        
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
