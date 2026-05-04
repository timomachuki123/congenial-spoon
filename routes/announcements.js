const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('author', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'firstName lastName')
      .populate('department', 'name code');
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new announcement
router.post('/', async (req, res) => {
  const announcement = new Announcement(req.body);
  try {
    const newAnnouncement = await announcement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an announcement
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName')
     .populate('department', 'name code');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an announcement
router.delete('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get announcements by category
router.get('/category/:category', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      category: req.params.category,
      isActive: true 
    })
      .populate('author', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get announcements by priority
router.get('/priority/:priority', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      priority: req.params.priority,
      isActive: true 
    })
      .populate('author', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get announcements by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      department: req.params.departmentId,
      isActive: true 
    })
      .populate('author', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
