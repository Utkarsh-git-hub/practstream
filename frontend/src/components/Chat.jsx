import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ socket, name, roomCode }) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data) => {
      setChatMessages((prev) => [...prev, data]);
    };

    const handleUserJoined = (data) => {
      setChatMessages((prev) => [
        ...prev,
        { system: true, message: `${data.name} joined the room.` }
      ]);
    };

    const handleLeft = (data) => {
      setChatMessages((prev) => [
        ...prev,
        { system: true, message: `${data.name} left the room.` }
      ]);
    };

    const handleLeftDefault = (data) => {
      setChatMessages((prev) => [
        ...prev,
        { system: true, message: `${data.name} disconnected.` }
      ]);
    };

    socket.on('receive', handleReceive);
    socket.on('user-joined', handleUserJoined);
    socket.on('left', handleLeft);
    socket.on('leftdefault', handleLeftDefault);

    return () => {
      socket.off('receive', handleReceive);
      socket.off('user-joined', handleUserJoined);
      socket.off('left', handleLeft);
      socket.off('leftdefault', handleLeftDefault);
    };
  }, [socket]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      if (container.scrollHeight - container.scrollTop <= container.clientHeight + 50) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [chatMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    socket.emit('send', message);
    setChatMessages((prev) => [...prev, { name, message }]);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={messagesContainerRef}>
        {chatMessages.map((msg, index) => {
          if (msg.system) {
            return (
              <div key={index} className="chat-message system">
                <em>{msg.message}</em>
              </div>
            );
          } else {
            const isMyMessage = msg.name === name;
            return (
              <div key={index} className="chat-message">
                <span className={`name-box ${isMyMessage ? 'my-name' : 'other-name'}`}>
                  {msg.name}
                </span>
                <span className="message-content">{msg.message}</span>
              </div>
            );
          }
        })}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;







