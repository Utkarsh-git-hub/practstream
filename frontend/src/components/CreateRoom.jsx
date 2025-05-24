import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import './CreateRoom.css';

const API_URL = import.meta.env.VITE_SERVER_URL;

function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [roomCode, setRoomCode] = useState('');

  const generateRoomCode = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomCode(code);
  };

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !roomName || !videoFile || !roomCode) {
      alert('Please fill all fields, select a video file, and generate a room code.');
      return;
    }
    const videoSize = videoFile.size;

    try {
      const res = await axios.post(`${API_URL}/room/create`, {
        roomName,
        roomCode,
        videoSize
      });
      if (res.data.message === "success") {
        const finalCode = res.data.roomCode || roomCode;
        navigate(`/room/${finalCode}`, {
          state: { name, videoFile, videoSize, roomName }
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
    <div className="create-room-container">
      <h2>Create Room</h2>
      <form className="create-room-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        {/* Combined File Input Field */}
        <div className="file-input-wrapper">
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
          <input 
            type="file" 
            id="videoFileInput" 
            accept="video/mp4, video/x-matroska, video/webm" 
            onChange={(e) => setVideoFile(e.target.files[0])} 
            style={{ display: "none" }} 
            required 
          />
        </div>
        {/* Room Code Section */}
        <div className="room-code-section">
          <button
            type="button"
            onClick={generateRoomCode}
            className="generate-code-btn"
          >
            Generate Room Code
          </button>
          {roomCode && (
            <div className="room-code-display-container">
              <span className="room-code-display"> {roomCode}</span>
              <button
                type="button"
                onClick={copyRoomCode}
                className="copy-code-btn"
              >
                Copy
              </button>
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn">Create Room</button>
      </form>
      <Footer fixed />
    </div>
    </div>
  );
}

export default CreateRoom;









