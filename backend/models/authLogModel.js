import mongoose from 'mongoose';

const authLogSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['signin', 'signup', 'reset', 'verify']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Not required because some failed attempts won't have a user ID
  },
  success: {
    type: Boolean,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AuthLog = mongoose.model('AuthLog', authLogSchema);

export default AuthLog;