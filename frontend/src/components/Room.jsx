import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Chat from './Chat';
import VideoPlayer from './VideoPlayer';
import './Room.css';

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Room() {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { name, videoFile, videoSize, roomName } = location.state || {};
  
  useEffect(() => {
    if (!name || !videoFile) {
      navigate('/');
    }
  }, [name, videoFile, navigate]);
  
  const [socket, setSocket] = useState(null);

  const videoURL = useMemo(() => {
    return videoFile ? URL.createObjectURL(videoFile) : null;
  }, [videoFile]);
  
  useEffect(() => {
    if (!name || !videoFile) return;

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    
    newSocket.emit('new-user-joined', {
      name,
      roomCode,
      pfp: '' 
    });
    
    return () => {
      newSocket.disconnect();
      if (videoURL) URL.revokeObjectURL(videoURL);
    };
  }, [name, videoFile, roomCode, videoURL]);
  
  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('disconnectUser', { name });
      socket.disconnect();
    }
    navigate('/');
  };

  return (
    <div className="room-container">
      <div className="main-content">
        <div className="video-section">
          {videoURL && socket && (
            <VideoPlayer videoURL={videoURL} socket={socket} roomCode={roomCode} />
          )}
        </div>
        <div className="chat-section">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="room-name">Room Name : {roomName}</div>
              <div className="room-code">Room Code : {roomCode}</div>
            </div>
            <div className="chat-header-right">
              <button className="leave-room-button" onClick={handleLeaveRoom}>
                Leave Room
              </button>
            </div>
          </div>
          <div className="chat-messages-container">
            <Chat socket={socket} name={name} roomCode={roomCode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;





