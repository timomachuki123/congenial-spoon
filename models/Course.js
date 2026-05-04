const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['Level 3', 'Level 4', 'Level 5', 'Level 6'],
    default: 'Level 3'
  },
  semester: {
    type: String,
    enum: ['January', 'May', 'September']
  },
  year: Number,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  maxStudents: Number,
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: {
    days: [String],
    startTime: String,
    endTime: String,
    room: String
  },
  syllabus: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
