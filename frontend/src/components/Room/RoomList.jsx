import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { roomsAPI } from '../../services/api';
import Button from '../UI/Button';
import CreateRoomModal from './CreateRoomModal';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomsAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      setError('Failed to load rooms');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleRoomCreated = (newRoom) => {
    setRooms(prevRooms => [newRoom, ...prevRooms]);
    setShowCreateModal(false);
    // Navigate to the new room
    navigate(`/room/${newRoom._id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="room-list">
      <div className="room-list-header">
        <div>
          <h2>Welcome back, {user?.username}!</h2>
          <p>Choose a room to start collaborating</p>
        </div>
        <Button onClick={handleCreateRoom} variant="primary">
          Create New Room
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchRooms} className="retry-button">
            Try Again
          </button>
        </div>
      )}
      
      <div className="rooms-container">
        {rooms.length === 0 ? (
          <div className="empty-state">
            <h3>No rooms available</h3>
            <p>Create your first room to start collaborating!</p>
            <Button onClick={handleCreateRoom} variant="primary">
              Create Room
            </Button>
          </div>
        ) : (
          rooms.map(room => (
            <div key={room._id} className="room-card">
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="room-description">{room.description}</p>
                <div className="room-meta">
                  <span className="language">{room.language}</span>
                  <span className="members">{room.members?.length || 0} member{(room.members?.length || 0) !== 1 ? 's' : ''}</span>
                  <span className="visibility">{room.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <div className="room-creator">
                  Created by {room.createdBy?.username}
                </div>
              </div>
              <div className="room-actions">
                <Button 
                  onClick={() => handleJoinRoom(room._id)}
                  variant="primary"
                >
                  Join Room
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
};

export default RoomList