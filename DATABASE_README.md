# College Website Database Integration

This document explains how to set up and use the MongoDB database integration for the college website.

## Prerequisites

1. **Node.js** - Install Node.js from <https://nodejs.org/>
2. **MongoDB** - Install MongoDB Community Edition from <https://www.mongodb.com/try/download/community>

## Setup Instructions

### 1. Install Dependencies

Navigate to the college directory and install the required npm packages:

```bash
cd college
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on your system. The default connection string is `mongodb://localhost:27017/college`.

**Windows:**

```bash
mongod
```

**macOS/Linux:**

```bash
sudo systemctl start mongod
# or
mongod
```

### 3. Seed the Database

Populate the database with initial college data:

```bash
npm run seed
```

This will create the following collections in the `college` database:

- `departments` - Academic departments
- `faculty` - Faculty members
- `courses` - Course offerings
- `students` - Student records
- `announcements` - College announcements
- `events` - Campus events
- `admissions` - Admission applications
- `contacts` - Contact form submissions

### 4. Start the Server

Start the Express server:

```bash
npm start
```

The server will run on <http://localhost:3001>

### 5. Access the Website

Open your browser and navigate to:

```text
http://localhost:3001
```

## API Endpoints

The following REST API endpoints are available:

### Departments

- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get a specific department
- `POST /api/departments` - Create a new department
- `PUT /api/departments/:id` - Update a department
- `DELETE /api/departments/:id` - Delete a department
- `GET /api/departments/code/:code` - Get department by code

### Faculty

- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:id` - Get a specific faculty member
- `POST /api/faculty` - Create a new faculty member
- `PUT /api/faculty/:id` - Update a faculty member
- `DELETE /api/faculty/:id` - Delete a faculty member
- `GET /api/faculty/department/:departmentId` - Get faculty by department
- `GET /api/faculty/position/:position` - Get faculty by position
- `GET /api/faculty/status/:status` - Get faculty by status

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course
- `GET /api/courses/department/:departmentId` - Get courses by department
- `GET /api/courses/level/:level` - Get courses by level
- `GET /api/courses/instructor/:instructorId` - Get courses by instructor

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student
- `GET /api/students/department/:departmentId` - Get students by department
- `GET /api/students/status/:status` - Get students by status

### Announcements

- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get a specific announcement
- `POST /api/announcements` - Create a new announcement
- `PUT /api/announcements/:id` - Update an announcement
- `DELETE /api/announcements/:id` - Delete an announcement
- `GET /api/announcements/category/:category` - Get announcements by category
- `GET /api/announcements/priority/:priority` - Get announcements by priority
- `GET /api/announcements/department/:departmentId` - Get announcements by department

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/category/:category` - Get events by category
- `GET /api/events/department/:departmentId` - Get events by department
- `GET /api/events/upcoming/all` - Get upcoming events
- `POST /api/events/:id/register` - Register for an event

### Admissions

- `GET /api/admissions` - Get all admissions
- `GET /api/admissions/:id` - Get a specific admission
- `POST /api/admissions` - Create a new admission application
- `PUT /api/admissions/:id` - Update an admission application
- `DELETE /api/admissions/:id` - Delete an admission application
- `GET /api/admissions/status/:status` - Get admissions by status
- `GET /api/admissions/department/:departmentId` - Get admissions by department
- `GET /api/admissions/program/:program` - Get admissions by program
- `POST /api/admissions/:id/review` - Review an admission application
- `GET /api/admissions/pending/all` - Get pending applications

### Contacts

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a specific contact
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact
- `GET /api/contacts/status/:status` - Get contacts by status
- `GET /api/contacts/category/:category` - Get contacts by category
- `POST /api/contacts/:id/respond` - Respond to a contact
- `GET /api/contacts/new/all` - Get new contacts

## Database Schema

### Department

```javascript
{
  name: String (required, unique),
  code: String (required, unique),
  description: String,
  headOfDepartment: ObjectId (ref: Faculty),
  faculty: [ObjectId (ref: Faculty)],
  courses: [ObjectId (ref: Course)],
  students: [ObjectId (ref: Student)],
  establishedYear: Number,
  location: String,
  phone: String,
  email: String,
  website: String,
  image: String,
  createdAt: Date
}
```

### Faculty

```javascript
{
  employeeId: String (required, unique),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String,
  dateOfBirth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  department: ObjectId (ref: Department),
  position: String (required, enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Instructor', 'Teaching Assistant']),
  specialization: String,
  qualifications: [{
    degree: String,
    field: String,
    institution: String,
    year: Number
  }],
  courses: [ObjectId (ref: Course)],
  officeHours: String,
  officeLocation: String,
  bio: String,
  researchInterests: [String],
  publications: [{
    title: String,
    journal: String,
    year: Number,
    url: String
  }],
  profileImage: String,
  joinDate: Date,
  status: String (enum: ['Active', 'On Leave', 'Retired', 'Resigned'], default: 'Active'),
  createdAt: Date
}
```

### Course

```javascript
{
  courseCode: String (required, unique),
  name: String (required),
  description: String,
  department: ObjectId (ref: Department, required),
  credits: Number (required),
  level: String (enum: ['Undergraduate', 'Graduate', 'Doctoral'], default: 'Undergraduate'),
  semester: String (enum: ['Fall', 'Spring', 'Summer', 'Winter']),
  year: Number,
  instructor: ObjectId (ref: Faculty),
  prerequisites: [ObjectId (ref: Course)],
  maxStudents: Number,
  enrolledStudents: [ObjectId (ref: Student)],
  schedule: {
    days: [String],
    startTime: String,
    endTime: String,
    room: String
  },
  syllabus: String,
  image: String,
  createdAt: Date
}
```

### Student

```javascript
{
  studentId: String (required, unique),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String,
  dateOfBirth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  department: ObjectId (ref: Department),
  enrollmentDate: Date,
  graduationDate: Date,
  status: String (enum: ['Active', 'Graduated', 'Suspended', 'Expelled', 'On Leave'], default: 'Active'),
  gpa: Number (min: 0, max: 4.0),
  courses: [ObjectId (ref: Course)],
  profileImage: String,
  createdAt: Date
}
```

### Announcement

```javascript
{
  title: String (required),
  content: String (required),
  category: String (enum: ['General', 'Academic', 'Events', 'Admissions', 'Sports', 'Clubs', 'Emergency'], default: 'General'),
  priority: String (enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium'),
  author: ObjectId (ref: Faculty),
  department: ObjectId (ref: Department),
  targetAudience: String (enum: ['All', 'Students', 'Faculty', 'Staff', 'Public'], default: 'All'),
  startDate: Date,
  endDate: Date,
  isActive: Boolean (default: true),
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Event

```javascript
{
  title: String (required),
  description: String,
  category: String (enum: ['Academic', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Social', 'Other'], default: 'Academic'),
  startDate: Date (required),
  endDate: Date (required),
  startTime: String,
  endTime: String,
  location: String (required),
  venue: String,
  organizer: ObjectId (ref: Faculty),
  department: ObjectId (ref: Department),
  targetAudience: String (enum: ['All', 'Students', 'Faculty', 'Staff', 'Public'], default: 'All'),
  maxParticipants: Number,
  registeredParticipants: [ObjectId (ref: Student)],
  isRegistrationRequired: Boolean (default: false),
  registrationDeadline: Date,
  contactEmail: String,
  contactPhone: String,
  image: String,
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Admission

```javascript
{
  applicationId: String (required, unique),
  firstName: String (required),
  lastName: String (required),
  email: String (required),
  phone: String,
  dateOfBirth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  program: String (required),
  department: ObjectId (ref: Department),
  level: String (required, enum: ['Undergraduate', 'Graduate', 'Doctoral']),
  semester: String (required, enum: ['Fall', 'Spring', 'Summer']),
  year: Number (required),
  previousEducation: [{
    institution: String,
    degree: String,
    field: String,
    year: Number,
    gpa: Number
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  status: String (enum: ['Pending', 'Under Review', 'Accepted', 'Rejected', 'Waitlisted', 'Withdrawn'], default: 'Pending'),
  reviewNotes: String,
  reviewedBy: ObjectId (ref: Faculty),
  reviewedAt: Date,
  decisionDate: Date,
  scholarshipApplied: Boolean (default: false),
  scholarshipAmount: Number,
  applicationFee: {
    amount: Number,
    paid: Boolean (default: false),
    paymentDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Contact

```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  department: ObjectId (ref: Department),
  category: String (enum: ['General Inquiry', 'Admissions', 'Academic', 'Technical Support', 'Feedback', 'Complaint', 'Other'], default: 'General Inquiry'),
  status: String (enum: ['New', 'In Progress', 'Resolved', 'Closed'], default: 'New'),
  assignedTo: ObjectId (ref: Faculty),
  response: String,
  respondedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Adding New Data

### Using the API

You can add new data using curl or any HTTP client:

```bash
# Add a new department
curl -X POST http://localhost:3001/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chemistry",
    "code": "CHEM",
    "description": "Department of Chemistry and Biochemistry",
    "establishedYear": 1992,
    "location": "Building F, Floor 1",
    "email": "stfrancistechnicalasumbi2@gmail.com"
  }'

# Add a new faculty member
curl -X POST http://localhost:3001/api/faculty \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "FAC006",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "stfrancistechnicalasumbi2@gmail.com",
    "position": "Assistant Professor",
    "department": "DEPARTMENT_ID_HERE"
  }'

# Add a new course
curl -X POST http://localhost:3001/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CHEM101",
    "name": "General Chemistry",
    "description": "Introduction to chemistry principles",
    "department": "DEPARTMENT_ID_HERE",
    "credits": 4,
    "level": "Undergraduate",
    "semester": "Fall",
    "year": 2024
  }'
```

### Using the Seed Script

To reset the database to initial data, run:

```bash
npm run seed
```

## Troubleshooting

### MongoDB Connection Error

If you see "Error connecting to MongoDB", ensure:

1. MongoDB is running
2. The connection string is correct in `server.js`
3. MongoDB is listening on port 27017

### Port Already in Use

If port 3001 is already in use, change the `PORT` variable in `server.js`:

```javascript
const PORT = 3002; // or any other available port
```

### CORS Issues

If you encounter CORS issues, the server is already configured with the `cors` middleware. Ensure you're accessing the site through `http://localhost:3001`.

## File Structure

```
college/
├── models/
│   ├── Department.js
│   ├── Faculty.js
│   ├── Course.js
│   ├── Student.js
│   ├── Announcement.js
│   ├── Event.js
│   ├── Admission.js
│   └── Contact.js
├── routes/
│   ├── departments.js
│   ├── faculty.js
│   ├── courses.js
│   ├── students.js
│   ├── announcements.js
│   ├── events.js
│   ├── admissions.js
│   └── contacts.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── index.html
│   ├── about.html
│   ├── departments.html
│   ├── courses.html
│   ├── faculty.html
│   ├── admissions.html
│   ├── contact.html
│   ├── events.html
│   └── announcements.html
├── server.js
├── seed.js
├── package.json
└── DATABASE_README.md
```

## Benefits of Database Integration

1. **Dynamic Content** - Update college content without editing HTML
2. **Admin Panel Ready** - API endpoints ready for an admin interface
3. **Student Management** - Store and retrieve student records
4. **Course Management** - Manage courses and enrollments
5. **Event Management** - Track campus events and registrations
6. **Admission Processing** - Handle admission applications efficiently
7. **Scalability** - Easy to add new sections or modify existing ones
8. **Separation of Concerns** - Data separated from presentation
