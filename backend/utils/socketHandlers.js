import Document from "../models/Document.js";

export function configureSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

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