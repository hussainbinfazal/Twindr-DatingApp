import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress bar
  const updateProgress = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / duration) * 100);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!isFinite(duration)) return
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;
    audioRef.current.currentTime = seekTime;
  };

  // Format time (e.g., 65 seconds -> 1:05)
  const formatTime = (time) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleEnded = () => {
    setIsPlaying(false); // Set isPlaying to false when audio ends
  };
  // Set initial duration
  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      updateProgress();
    };

    const handleEnded = () => {
      setIsPlaying(false); // Set isPlaying to false when audio ends
    };
    const handleError = (e) => {
        
        setIsLoading(false); 
      };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);


  return (
    <div className="custom-audio-player">
      <audio ref={audioRef} src={audioUrl} type="audio/webm" />
      <button onClick={togglePlayPause} className="play-pause-button">
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <div className="progress-bar" onClick={handleProgressClick}>
        <div
          className="progress"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="time">
        {formatTime(currentTime)} / {duration ? formatTime(duration) : "Loading..."}
      </span>
    </div>
  );
};

export default AudioPlayer;