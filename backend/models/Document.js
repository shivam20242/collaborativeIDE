import mongoose from 'mongoose';

export const documentSchema = new mongoose.Schema({
  content: {
    type: String,
    default: ''
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 0
  },
  history: [{
    content: String,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    version: Number
  }]
}, {
  timestamps: true
});

// Export the model as default
const Document = mongoose.model('Document', documentSchema);
export default Document;