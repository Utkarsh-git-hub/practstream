const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;


const server = app.listen(port, err => {
  if (err) throw err;
  console.log(`API listening on port ${port}.`);
});


const io = socketIO(server, { 
  cors: { origin: '*' } 
});

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.error("MongoDB connection error:", err));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/room', require('./routes/room'));

// In-memory store for users
const users = {};

io.on('connection', socket => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('new-user-joined', data => {
    users[socket.id] = { name: data.name, roomCode: data.roomCode, pfp: data.pfp };
    socket.join(data.roomCode);

    const members = Object.values(users).filter(user => user.roomCode === data.roomCode).length;

    socket.broadcast.to(data.roomCode).emit('user-joined', {
      name: data.name,
      roomCode: data.roomCode,
      pfp: data.pfp,
      members
    });
    
    socket.emit('updateMemberInfo', { roomCode: data.roomCode, members });
  });

  socket.on('send', message => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.roomCode).emit('receive', {
        message,
        name: user.name,
        pfp: user.pfp
      });
    }
  });

  socket.on('playerControl', data => {
    socket.to(data.roomCode).emit('playerControlUpdate', {
      message: data.message,
      context: data.context,
      username: users[socket.id] && users[socket.id].name
    });
  });

  socket.on('disconnectUser', () => {
    const user = users[socket.id];
    if (user) {
      const members = Object.values(users).filter(u => u.roomCode === user.roomCode).length - 1;
      socket.to(user.roomCode).emit('left', { 
        name: user.name,
        pfp: user.pfp,
        members
      });
      delete users[socket.id];
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const members = Object.values(users).filter(u => u.roomCode === user.roomCode).length - 1;
      socket.to(user.roomCode).emit('leftdefault', {
        name: user.name,
        pfp: user.pfp,
        members
      });
      delete users[socket.id];
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});
