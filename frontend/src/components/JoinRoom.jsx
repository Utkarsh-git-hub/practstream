import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import './JoinRoom.css';

const API_URL = import.meta.env.VITE_SERVER_URL;

function JoinRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !roomCode || !videoFile) {
      alert('Please fill all fields and select a video file.');
      return;
    }
    const videoSize = videoFile.size;
    try {
      const res = await axios.post(`${API_URL}/room/join`, {
        roomCode,
        videoSize
      });
      if (res.data.message === "success") {
        navigate(`/room/${roomCode}`, {
          state: { name, videoFile, videoSize, roomName: res.data.roomName }
        });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="main-container">
    <div className="join-room-container">
      <h2>Join Room</h2>
      <form className="join-room-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          required
        />
        {/* File Input Section - Same integrated style as in CreateRoom */}
        <div className="file-input-wrapper">
          <input
            type="file"
            id="videoFileInput"
            accept="video/mp4, video/x-matroska, video/webm"
            onChange={(e) => setVideoFile(e.target.files[0])}
            style={{ display: "none" }}
            required
          />
          <input
            type="text"
            placeholder="No file chosen"
            value={videoFile ? videoFile.name : ""}
            readOnly
            className="file-display-input"
          />
          <button
            type="button"
            className="file-choose-btn"
            onClick={() => document.getElementById("videoFileInput").click()}
          >
            Choose File
          </button>
        </div>
        <button type="submit" className="submit-btn">Join Room</button>
      </form>
      <Footer fixed />
    </div>
    </div>
  );
}

export default JoinRoom;




