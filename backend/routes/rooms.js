import express from 'express';
import { protect } from '../middleware/auth.js';
import { createRoom, getRoom, getRooms, joinRoom } from '../controllers/roomcontroller.js';

const roomRoutes = express.Router();

roomRoutes.use(protect);

roomRoutes.route('/')
  .post(createRoom)
  .get(getRooms);

roomRoutes.route('/:id')
  .get(getRoom);

roomRoutes.post('/:id/join', joinRoom);

export default roomRoutes;