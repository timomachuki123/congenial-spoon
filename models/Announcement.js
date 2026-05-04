const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Academic', 'Events', 'Admissions', 'Sports', 'Clubs', 'Emergency'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  author: {
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
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Announcement', announcementSchema);
