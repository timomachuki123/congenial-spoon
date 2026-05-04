const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate('department', 'name code')
      .populate('courses', 'name courseCode')
      .sort({ lastName: 1, firstName: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific faculty member
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('department', 'name code')
      .populate('courses', 'name courseCode credits');
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new faculty member
router.post('/', async (req, res) => {
  const faculty = new Faculty(req.body);
  try {
    const newFaculty = await faculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a faculty member
router.put('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name code')
     .populate('courses', 'name courseCode');
    
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a faculty member
router.delete('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get faculty by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const faculty = await Faculty.find({ department: req.params.departmentId })
      .populate('department', 'name code')
      .populate('courses', 'name courseCode')
      .sort({ lastName: 1, firstName: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get faculty by position
router.get('/position/:position', async (req, res) => {
  try {
    const faculty = await Faculty.find({ position: req.params.position })
      .populate('department', 'name code')
      .populate('courses', 'name courseCode')
      .sort({ lastName: 1, firstName: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get faculty by status
router.get('/status/:status', async (req, res) => {
  try {
    const faculty = await Faculty.find({ status: req.params.status })
      .populate('department', 'name code')
      .populate('courses', 'name courseCode')
      .sort({ lastName: 1, firstName: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
