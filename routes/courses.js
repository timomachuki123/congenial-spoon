const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('department', 'name code')
      .populate('instructor', 'firstName lastName email')
      .populate('prerequisites', 'name courseCode')
      .sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('department', 'name code')
      .populate('instructor', 'firstName lastName email')
      .populate('prerequisites', 'name courseCode')
      .populate('enrolledStudents', 'firstName lastName studentId');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  const course = new Course(req.body);
  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name code')
     .populate('instructor', 'firstName lastName email')
     .populate('prerequisites', 'name courseCode');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get courses by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const courses = await Course.find({ department: req.params.departmentId })
      .populate('department', 'name code')
      .populate('instructor', 'firstName lastName email')
      .sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get courses by level
router.get('/level/:level', async (req, res) => {
  try {
    const courses = await Course.find({ level: req.params.level })
      .populate('department', 'name code')
      .populate('instructor', 'firstName lastName email')
      .sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get courses by instructor
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructorId })
      .populate('department', 'name code')
      .populate('instructor', 'firstName lastName email')
      .sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
