import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
//import {configureSocket} from './utils/socketHandlers.js';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import Document from './models/Document.js';

// Load env vars
dotenv.config();
console.log("MongoDB URI:", process.env.MONGODB_URI);

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

///////////////////////////////////////////////////////////
// Define configureSocket function BEFORE using it
function configureSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Relay chat messages to everyone else in the room
    socket.on('chat-message', (msg) => {
      // msg: { roomId, userId, text, ts }
      if (!msg?.roomId) return;
      socket.to(msg.roomId).emit('chat-message', msg);
    });

    // (optional) typing indicator
    socket.on('chat-typing', ({ roomId, userId, isTyping }) => {
      if (!roomId) return;
      socket.to(roomId).emit('chat-typing', { userId, isTyping });
    });
    // Join a room
    socket.on('join-room', async (roomId, userId) => {
      try {
        socket.join(roomId);

        // Get the document for this room
        const document = await Document.findOne({ roomId });
        if (document) {
          socket.emit('document-load', document.content);
        }

        // Notify others that a user joined
        socket.to(roomId).emit('user-joined', userId);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    // Handle text changes
    socket.on('text-change', async (data) => {
      try {
        const { roomId, content, userId } = data;

        // First get the current document to check its version
        const currentDocument = await Document.findOne({ roomId });
        const currentVersion = currentDocument ? currentDocument.version : 0;

        // Update the document in the database
        const document = await Document.findOneAndUpdate(
          { roomId },
          {
            content,
            lastModifiedBy: userId,
            $inc: { version: 1 },
            $push: {
              history: {
                content,
                modifiedBy: userId,
                version: currentVersion + 1
              }
            }
          },
          { new: true, upsert: true }
        );

        // Broadcast changes to other users in the room
        socket.to(roomId).emit('text-change', { content, userId });
      } catch (error) {
        console.error('Error handling text change:', error);
      }
    });

    // Handle cursor position changes
    socket.on('cursor-position', (data) => {
      const { roomId, userId, position } = data;
      socket.to(roomId).emit('cursor-position', { userId, position });
    });

    // Handle user leaving
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
///////////////////////////////////////////////////////////
// Create io instance first
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configure socket
configureSocket(io);

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Basic route
app.get('/health', (req, res) => {
  res.json({ message: 'Collaborative Editor API is running!' });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});