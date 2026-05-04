const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const { sendAdmissionNotification } = require('../utils/email');

// Get all admissions
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find()
      .populate('department', 'name code')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific admission
router.get('/:id', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate('department', 'name code')
      .populate('reviewedBy', 'firstName lastName');
    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }
    res.json(admission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new admission application
router.post('/', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      dateOfBirth, 
      gender, 
      program, 
      department, 
      level, 
      semester, 
      year, 
      address, 
      previousEducation 
    } = req.body;
    
    // Parse year
    const parsedYear = parseInt(year);
    const admissionYear = !isNaN(parsedYear) ? parsedYear : 2026;
    
    // Determine level from program if not provided
    let admissionLevel = level;
    if (!admissionLevel && program) {
      const levelMatch = program.match(/\(Level\s*(\d+)\)/i);
      if (levelMatch) {
        admissionLevel = `Level ${levelMatch[1]}`;
      } else {
        admissionLevel = 'Level 3';
      }
    }
    
    // Parse previous education if provided as a string
    let parsedPreviousEducation = null;
    if (previousEducation) {
      if (typeof previousEducation === 'string' && previousEducation.trim()) {
        const entries = previousEducation.split(/\n\s*\n|;\s*/).filter(e => e.trim());
        parsedPreviousEducation = entries.map(entry => {
          const lines = entry.split('\n').map(l => l.trim()).filter(l => l);
          const eduObj = { institution: '', degree: '', field: '', year: null, gpa: null };
          lines.forEach(line => {
            if (!eduObj.institution) {
              eduObj.institution = line;
            } else if (line.toLowerCase().includes('gpa') && /\d+\.?\d*/.test(line)) {
              const gpaMatch = line.match(/\d+\.?\d*/);
              if (gpaMatch) eduObj.gpa = parseFloat(gpaMatch[0]);
            } else if (/\d{4}/.test(line)) {
              const yearMatch = line.match(/\d{4}/);
              if (yearMatch) {
                eduObj.year = parseInt(yearMatch[0]);
                const degreeMatch = line.match(/(Bachelor|Master|PhD|Diploma|Certificate|Degree)\s+(?:of\s+)?(\w+)?/i);
                if (degreeMatch) {
                  eduObj.degree = degreeMatch[1];
                  eduObj.field = degreeMatch[2] || '';
                }
              }
            } else if (/(Bachelor|Master|PhD|Diploma|Certificate|Degree)/i.test(line)) {
              const degreeMatch = line.match(/(Bachelor|Master|PhD|Diploma|Certificate|Degree)\s+(?:of\s+)?(\w+)?/i);
              if (degreeMatch) {
                eduObj.degree = degreeMatch[1];
                if (degreeMatch[2]) eduObj.field = degreeMatch[2];
              }
            }
          });
          return eduObj;
        });
      } else if (Array.isArray(previousEducation)) {
        parsedPreviousEducation = previousEducation;
      }
    }
    
    const count = await Admission.countDocuments() + 1;
    const applicationId = `SFTTI/${admissionYear}/${String(count).padStart(4, '0')}`;
    
    const admissionData = {
      applicationId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      program,
      level: admissionLevel,
      semester,
      year: admissionYear,
      address: address || '',
      previousEducation: parsedPreviousEducation
    };
    
    // Only add department if provided and looks like an ObjectId
    if (department && mongoose.Types.ObjectId.isValid(department)) {
      admissionData.department = department;
    }
    
    const admission = new Admission(admissionData);
    const newAdmission = await admission.save();
    
    try {
      await sendAdmissionNotification(newAdmission);
    } catch (emailErr) {
      console.error('Error sending admission email notification:', emailErr);
    }
    
    res.status(201).json(newAdmission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an admission application
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name code')
     .populate('reviewedBy', 'firstName lastName');
    
    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }
    res.json(admission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an admission application
router.delete('/:id', async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }
    res.json({ message: 'Admission application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get admissions by status
router.get('/status/:status', async (req, res) => {
  try {
    const admissions = await Admission.find({ status: req.params.status })
      .populate('department', 'name code')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get admissions by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const admissions = await Admission.find({ department: req.params.departmentId })
      .populate('department', 'name code')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get admissions by program
router.get('/program/:program', async (req, res) => {
  try {
    const admissions = await Admission.find({ program: req.params.program })
      .populate('department', 'name code')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Review an admission application
router.post('/:id/review', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'Admission application not found' });
    }
    
    admission.status = req.body.status;
    admission.reviewNotes = req.body.reviewNotes;
    admission.reviewedBy = req.body.reviewedBy;
    admission.reviewedAt = Date.now();
    admission.decisionDate = Date.now();
    
    if (req.body.scholarshipAmount) {
      admission.scholarshipAmount = req.body.scholarshipAmount;
    }
    
    await admission.save();
    
    res.json(admission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending applications
router.get('/pending/all', async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'Pending' })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;