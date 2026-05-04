const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'stfrancistechnicalasumbi2@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const SCHOOL_EMAIL = process.env.SCHOOL_EMAIL || 'stfrancistechnicalasumbi2@gmail.com';

async function sendContactNotification(contactData) {
  const { name, email, phone, subject, category, message } = contactData;

  const mailOptions = {
    from: `"SFTTI Website" <${process.env.EMAIL_USER || 'school.email@gmail.com'}>`,
    to: SCHOOL_EMAIL,
    replyTo: email,
    subject: `[Contact Form] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">St. Francis Technical Training Institute</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">New Contact Form Submission</p>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Category:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${category || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px;">Message:</p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3c72;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
          <p>This email was sent from the SFTTI website contact form.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendAdmissionNotification(admissionData) {
  if (!admissionData) {
    throw new Error('Admission data is required');
  }
  
  const { firstName = '', lastName = '', email = '', phone, program = '', department, level = '', semester = '', year, dateOfBirth, gender, address, previousEducation, applicationId = '' } = admissionData;

  const departmentName = department && typeof department === 'object' && department.name ? department.name : (department || 'Not specified');
  
  let addressHtml = '';
  if (address && typeof address === 'object') {
    addressHtml = Object.values(address).filter(v => v).join(', ');
  } else if (address && typeof address === 'string') {
    addressHtml = address;
  }
  
  let educationHtml = '';
  if (previousEducation && Array.isArray(previousEducation)) {
    educationHtml = previousEducation.map(edu => 
      `<strong>${edu.institution || 'Institution'}</strong><br>
      ${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''} (${edu.year || ''})<br>GPA: ${edu.gpa || 'N/A'}`
    ).join('<br><br>');
  } else if (previousEducation && typeof previousEducation === 'string') {
    educationHtml = previousEducation;
  }

  const mailOptions = {
    from: `"SFTTI Website" <${process.env.EMAIL_USER || 'stfrancistechnicalasumbi2@gmail.com'}>`,
    to: SCHOOL_EMAIL,
    replyTo: email,
    subject: `[Admission Application] ${firstName} ${lastName} - ${program}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">St. Francis Technical Training Institute</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">New Admission Application</p>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #1e3c72; border-bottom: 2px solid #1e3c72; padding-bottom: 10px;">Personal Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Application ID:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${applicationId || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Full Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Date of Birth:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Gender:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${gender || 'Not provided'}</td>
            </tr>
          </table>

          <h2 style="color: #1e3c72; border-bottom: 2px solid #1e3c72; padding-bottom: 10px; margin-top: 20px;">Program Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Program:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${program}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Department:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${departmentName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Level:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${level || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Intake:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${semester || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Year:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${year >= 2026 ? year : 'Not specified'}</td>
            </tr>
          </table>

          ${addressHtml ? `
          <h2 style="color: #1e3c72; border-bottom: 2px solid #1e3c72; padding-bottom: 10px; margin-top: 20px;">Address</h2>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3c72;">
            ${addressHtml}
          </div>
          ` : ''}

          ${educationHtml ? `
          <h2 style="color: #1e3c72; border-bottom: 2px solid #1e3c72; padding-bottom: 10px; margin-top: 20px;">Previous Education</h2>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3c72;">
            ${educationHtml}
          </div>
          ` : ''}
        </div>
        <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
          <p>This email was sent from the SFTTI website admission form.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendContactNotification, sendAdmissionNotification };
