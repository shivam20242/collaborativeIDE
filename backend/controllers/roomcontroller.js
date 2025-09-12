// const Room = require('../models/Room');
// const Document = require('../models/Document');
import Room from "../models/Room.js";
import Document from "../models/Document.js";
// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, description, isPublic, language } = req.body;

    const room = await Room.create({
      name,
      description,
      createdBy: req.user._id,
      isPublic,
      language,
      members: [{ user: req.user._id }]
    });

    // Create an empty document for the room
    await Document.create({
      content: '',
      roomId: room._id,
      createdBy: req.user._id
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms for a user
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { createdBy: req.user._id },
        { 'members.user': req.user._id },
        { isPublic: true }
      ]
    }).populate('createdBy', 'username').sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single room
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('members.user', 'username');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user has access to the room
    const hasAccess = room.isPublic || 
                     room.createdBy._id.toString() === req.user._id.toString() || 
                     room.members.some(member => member.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a room
export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isPublic) {
      return res.status(403).json({ message: 'Room is private' });
    }

    // Check if user is already a member
    const isMember = room.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      room.members.push({ user: req.user._id });
      await room.save();
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//module.exports = { createRoom, getRooms, getRoom, joinRoom };