const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/email');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('department', 'name code')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('department', 'name code')
      .populate('assignedTo', 'firstName lastName');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new contact
router.post('/', async (req, res) => {
  const contact = new Contact(req.body);
  try {
    const newContact = await contact.save();
    
    try {
      await sendContactNotification(req.body);
    } catch (emailErr) {
      console.error('Error sending contact email notification:', emailErr);
    }
    
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a contact
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name code')
     .populate('assignedTo', 'firstName lastName');
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contacts by status
router.get('/status/:status', async (req, res) => {
  try {
    const contacts = await Contact.find({ status: req.params.status })
      .populate('department', 'name code')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contacts by category
router.get('/category/:category', async (req, res) => {
  try {
    const contacts = await Contact.find({ category: req.params.category })
      .populate('department', 'name code')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Respond to a contact
router.post('/:id/respond', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    contact.response = req.body.response;
    contact.status = 'Resolved';
    contact.respondedAt = Date.now();
    contact.assignedTo = req.body.assignedTo;
    
    await contact.save();
    
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get new contacts
router.get('/new/all', async (req, res) => {
  try {
    const contacts = await Contact.find({ status: 'New' })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
