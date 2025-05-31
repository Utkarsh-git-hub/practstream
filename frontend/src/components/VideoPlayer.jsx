import React, { useRef, useEffect } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoURL, socket, roomCode }) {
  const videoRef = useRef(null);
  const isRemoteActionRef = useRef(false);
  const isSeekingRef = useRef(false);

  const handlePlay = () => {
    if (isRemoteActionRef.current) {
      isRemoteActionRef.current = false;
      return;
    }
    socket.emit('playerControl', { roomCode, message: 'play' });
  };

  const handlePause = () => {
    if (isRemoteActionRef.current) {
      isRemoteActionRef.current = false;
      return;
    }
    socket.emit('playerControl', { roomCode, message: 'pause' });
  };

  const handleSeeked = () => {
    if (isSeekingRef.current) {
      isSeekingRef.current = false;
      return;
    }
    socket.emit('playerControl', {
      roomCode,
      message: 'seek',
      context: videoRef.current.currentTime
    });
  };

  const handleVideoError = (e) => {
    console.error('Video failed to load:', e);
  };

  useEffect(() => {
    socket.on('playerControlUpdate', (data) => {
      const videoEl = videoRef.current;
      if (!videoEl) return;

      switch (data.message) {
        case 'play':
          isRemoteActionRef.current = true;
          videoEl.play();
          break;
        case 'pause':
          isRemoteActionRef.current = true;
          videoEl.pause();
          break;
        case 'seek':
          isSeekingRef.current = true;
          videoEl.currentTime = data.context;
          break;
        default:
          break;
      }
    });

    return () => {
      socket.off('playerControlUpdate');
    };
  }, [socket, roomCode]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoURL}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onError={handleVideoError}
      />
    </div>
  );
}

export default VideoPlayer;


