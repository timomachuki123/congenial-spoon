const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Academic', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Social', 'Other'],
    default: 'Academic'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  location: {
    type: String,
    required: true
  },
  venue: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  targetAudience: {
    type: String,
    enum: ['All', 'Students', 'Faculty', 'Staff', 'Public'],
    default: 'All'
  },
  maxParticipants: Number,
  registeredParticipants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  isRegistrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: Date,
  contactEmail: String,
  contactPhone: String,
  image: String,
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
