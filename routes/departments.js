const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('headOfDepartment', 'firstName lastName email')
      .populate('faculty', 'firstName lastName position')
      .populate('courses', 'name courseCode')
      .sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific department
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('headOfDepartment', 'firstName lastName email')
      .populate('faculty', 'firstName lastName position email')
      .populate('courses', 'name courseCode credits')
      .populate('students', 'firstName lastName studentId');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new department
router.post('/', async (req, res) => {
  const department = new Department(req.body);
  try {
    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a department
router.put('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('headOfDepartment', 'firstName lastName email')
     .populate('faculty', 'firstName lastName position')
     .populate('courses', 'name courseCode');
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get department by code
router.get('/code/:code', async (req, res) => {
  try {
    const department = await Department.findOne({ code: req.params.code })
      .populate('headOfDepartment', 'firstName lastName email')
      .populate('faculty', 'firstName lastName position email')
      .populate('courses', 'name courseCode credits');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
