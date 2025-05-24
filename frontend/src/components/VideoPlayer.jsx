import React, { useRef, useEffect } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoURL, socket, roomCode }) {
  const videoRef = useRef(null);
  const isSeekingRef = useRef(false);

  const handlePlay = () => {
    socket.emit('playerControl', { roomCode, message: 'play' });
  };

  const handlePause = () => {
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
    socket.on('playerControlUpdate', data => {
      const video = videoRef.current;
      if (!video) return;
      if (data.message === 'play') {
        video.play();
      } else if (data.message === 'pause') {
        video.pause();
      } else if (data.message === 'seek') {
        isSeekingRef.current = true;
        video.currentTime = data.context;
      }
    });
    return () => {
      socket.off('playerControlUpdate');
    };
  }, [socket]);

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

