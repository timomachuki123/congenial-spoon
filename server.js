const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/college', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import routes
const studentsRouter = require('./routes/students');
const departmentsRouter = require('./routes/departments');
const coursesRouter = require('./routes/courses');
const facultyRouter = require('./routes/faculty');
const announcementsRouter = require('./routes/announcements');
const eventsRouter = require('./routes/events');
const admissionsRouter = require('./routes/admissions');
const contactsRouter = require('./routes/contacts');
const studentPortalRouter = require('./routes/studentPortal');

// API routes
app.use('/api/students', studentsRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/admissions', admissionsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/portal', studentPortalRouter);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/departments', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'departments.html'));
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

app.get('/faculty', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faculty.html'));
});

app.get('/admissions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admissions.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

app.get('/announcements', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'announcements.html'));
});

app.get('/student-portal', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-portal.html'));
});

app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`College server running on http://localhost:${PORT}`);
});

module.exports = app;
