import mongoose from 'mongoose';

const networkingMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientRole: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['LinkedIn Connection', 'Cold Email', 'Follow-up Email'],
    required: true
  },
  generatedContent: {
    type: String,
    required: true
  }
}, { timestamps: true });

const NetworkingMessage = mongoose.model('NetworkingMessage', networkingMessageSchema);
export default NetworkingMessage;
