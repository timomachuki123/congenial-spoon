const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  program: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  level: {
    type: String,
    enum: ['Level 3', 'Level 4', 'Level 5', 'Level 6'],
    required: true
  },
  semester: {
    type: String,
    enum: ['January Intake', 'May Intake', 'September Intake'],
    required: true
  },
  year: {
    type: Number,
    min: 2026,
    required: true
  },
  previousEducation: [{
    institution: String,
    degree: String,
    field: String,
    year: Number,
    gpa: Number
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Accepted', 'Rejected', 'Waitlisted', 'Withdrawn'],
    default: 'Pending'
  },
  reviewNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  reviewedAt: Date,
  decisionDate: Date,
  scholarshipApplied: {
    type: Boolean,
    default: false
  },
  scholarshipAmount: Number,
  applicationFee: {
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    },
    paymentDate: Date
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

module.exports = mongoose.model('Admission', admissionSchema);
