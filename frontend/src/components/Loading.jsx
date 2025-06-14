import React from 'react'
import '../App.css'; // Adjust the path as necessary

const Loading = () => {
    return (
        <div className="loading-container h-screen w-full  flex jsutify-center items-center">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
}

export default Loading
