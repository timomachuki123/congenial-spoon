const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const { authMiddleware, generateToken } = require('../utils/auth');

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { admissionNumber, password } = req.body;

    if (!admissionNumber || !password) {
      return res.status(400).json({ message: 'Admission number and password are required.' });
    }

    const student = await Student.findOne({ admissionNumber: admissionNumber.trim() })
      .populate('department', 'name code')
      .populate('courses', 'name courseCode level');

    if (!student) {
      return res.status(401).json({ message: 'Invalid admission number or password.' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admission number or password.' });
    }

    if (student.status !== 'Active') {
      return res.status(403).json({ message: 'Your account is not active. Please contact administration.' });
    }

    const token = generateToken(student);

    res.json({
      token,
      student: {
        id: student._id,
        studentId: student.studentId,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        department: student.department,
        program: student.program,
        level: student.level,
        semester: student.semester,
        year: student.year,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
        gpa: student.gpa,
        courses: student.courses,
        profileImage: student.profileImage
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Get Student Dashboard (Protected)
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id)
      .populate('department', 'name code')
      .populate('courses', 'name courseCode level description');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({
      student: {
        id: student._id,
        studentId: student.studentId,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        address: student.address,
        department: student.department,
        program: student.program,
        level: student.level,
        semester: student.semester,
        year: student.year,
        enrollmentDate: student.enrollmentDate,
        graduationDate: student.graduationDate,
        status: student.status,
        gpa: student.gpa,
        courses: student.courses,
        profileImage: student.profileImage
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'An error occurred loading dashboard.' });
  }
});

// Get Student Grades (Protected)
router.get('/grades', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id)
      .populate('courses', 'name courseCode level');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Simulated grades data - in production, this would come from a Grades model
    const grades = student.courses.map(course => ({
      course: course,
      grade: ['A', 'B+', 'B', 'C+', 'C', 'D', 'E'].sort(() => Math.random() - 0.5)[0],
      points: Math.floor(Math.random() * 4) + 1,
      status: Math.random() > 0.2 ? 'Completed' : 'In Progress'
    }));

    res.json({
      grades,
      gpa: student.gpa || (Math.random() * 2 + 2).toFixed(2)
    });
  } catch (err) {
    console.error('Grades error:', err);
    res.status(500).json({ message: 'An error occurred loading grades.' });
  }
});

// Get Student Timetable (Protected)
router.get('/timetable', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id)
      .populate('courses', 'name courseCode level');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Sample timetable data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '1:00 PM - 3:00 PM', '3:00 PM - 5:00 PM'];

    const timetable = days.map(day => ({
      day,
      classes: timeSlots.slice(0, Math.floor(Math.random() * 3) + 1).map(time => ({
        time,
        course: student.courses.length > 0
          ? student.courses[Math.floor(Math.random() * student.courses.length)]
          : { name: 'General Studies', courseCode: 'GS101' },
        room: `Room ${Math.floor(Math.random() * 50) + 100}`
      }))
    }));

    res.json({ timetable });
  } catch (err) {
    console.error('Timetable error:', err);
    res.status(500).json({ message: 'An error occurred loading timetable.' });
  }
});

// Update Student Profile (Protected)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { phone, address } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      { phone, address },
      { new: true, runValidators: true }
    ).populate('department', 'name code')
      .populate('courses', 'name courseCode level');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({
      message: 'Profile updated successfully.',
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        address: student.address,
        department: student.department,
        program: student.program
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'An error occurred updating profile.' });
  }
});

// Change Password (Protected)
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const isMatch = await student.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    student.password = newPassword;
    await student.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'An error occurred changing password.' });
  }
});

module.exports = router;
