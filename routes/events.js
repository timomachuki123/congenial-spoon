const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('organizer', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email')
      .populate('department', 'name code')
      .populate('registeredParticipants', 'firstName lastName studentId');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'firstName lastName')
     .populate('department', 'name code');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get events by category
router.get('/category/:category', async (req, res) => {
  try {
    const events = await Event.find({ 
      category: req.params.category,
      isActive: true 
    })
      .populate('organizer', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get events by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const events = await Event.find({ 
      department: req.params.departmentId,
      isActive: true 
    })
      .populate('organizer', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming events
router.get('/upcoming/all', async (req, res) => {
  try {
    const events = await Event.find({ 
      startDate: { $gte: new Date() },
      isActive: true 
    })
      .populate('organizer', 'firstName lastName')
      .populate('department', 'name code')
      .sort({ startDate: 1 })
      .limit(10);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register for an event
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    if (event.registeredParticipants.includes(req.body.studentId)) {
      return res.status(400).json({ message: 'Already registered' });
    }
    
    event.registeredParticipants.push(req.body.studentId);
    await event.save();
    
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
