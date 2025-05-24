
const router = require('express').Router();
const Room = require('../models/Room');

const generateRoomCode = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

router.post('/create', async (req, res) => {
  let { roomName, roomCode, videoSize } = req.body;
  if (!roomName || !roomCode || !videoSize) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  
  try {
    let existingRoom = await Room.findOne({ roomCode });
    let attempts = 0;
    while (existingRoom && attempts < 5) {
      roomCode = generateRoomCode();
      existingRoom = await Room.findOne({ roomCode });
      attempts++;
    }
    if (existingRoom) {
      return res.status(400).json({ message: "Unable to generate a unique room code, please try again." });
    }
    const newRoom = new Room({
      roomName,
      roomCode,
      videoSize
    });
    await newRoom.save();
    return res.json({ message: "success", roomCode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating room", error });
  }
});

router.post('/join', async (req, res) => {
  const { roomCode, videoSize } = req.body;
  
  try {
    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.json({ message: "room code invalid" });
    }
    if (room.videoSize !== videoSize) {
      return res.json({ message: "video is different than the host's video." });
    }
    res.json({
      roomCode,
      videoSize,
      roomName: room.roomName,
      message: "success"
    });
  } catch (error) {
    return res.status(500).json({ message: "Error joining room", error });
  }
});

module.exports = router;




