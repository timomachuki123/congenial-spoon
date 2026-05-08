import process from "node:process";
import mongoose from "mongoose";
import Department from "./models/Department.js";
import Faculty from "./models/Faculty.js";
import Course from "./models/Course.js";
import Student from "./models/Student.js";
import Announcement from "./models/Announcement.js";
import Event from "./models/Event.js";
import Admission from "./models/Admission.js";
import Contact from "./models/Contact.js";

mongoose.connect('mongodb://localhost:27017/college', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    await Department.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Announcement.deleteMany({});
    await Event.deleteMany({});
    await Admission.deleteMany({});
    await Contact.deleteMany({});
    
    console.log('Cleared existing data');
    
    const departments = await Department.insertMany([
      { name: 'Computer Science', code: 'CS', description: 'Department of Computer Science and Engineering', establishedYear: 1990, location: 'Building A, Floor 3', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Mathematics', code: 'MATH', description: 'Department of Mathematics and Statistics', establishedYear: 1985, location: 'Building B, Floor 2', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Physics', code: 'PHY', description: 'Department of Physics and Astronomy', establishedYear: 1988, location: 'Building C, Floor 1', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Business Administration', code: 'BUS', description: 'School of Business Administration', establishedYear: 1995, location: 'Building D, Floor 4', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'English', code: 'ENG', description: 'Department of English and Literature', establishedYear: 1980, location: 'Building E, Floor 2', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Institute of Management', code: 'MGT', description: 'Institute of Management providing leadership and organizational management education', establishedYear: 2000, location: 'Building F, Floor 1', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Business Management', code: 'BMGT', description: 'Department of Business Management', establishedYear: 2002, location: 'Building F, Floor 2', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Human Resource Management', code: 'HRM', description: 'Department of Human Resource Management', establishedYear: 2005, location: 'Building F, Floor 3', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Liberal Studies', code: 'LIBS', description: 'Department of Liberal Studies', establishedYear: 1998, location: 'Building G, Floor 1', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
      { name: 'Engineering', code: 'ENGR', description: 'Department of Engineering', establishedYear: 1992, location: 'Building H, Floor 1', phone: '+254705096085', email: 'stfrancistechnical@ac.ke' },
    ]);
    console.log('Created 10 departments');
    
    const faculty = await Faculty.insertMany([
      { employeeId: 'FAC001', firstName: 'John', lastName: 'Smith', email: 'john.smith@stfrancistechnical.ac.ke', phone: '+254705096085', gender: 'Male', department: departments[0]._id, position: 'Professor' },
      { employeeId: 'FAC002', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@stfrancistechnical.ac.ke', phone: '+254705096085', gender: 'Female', department: departments[0]._id, position: 'Associate Professor' },
      { employeeId: 'FAC003', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@stfrancistechnical.ac.ke', phone: '+254705096085', gender: 'Male', department: departments[1]._id, position: 'Lecturer' },
      { employeeId: 'FAC004', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@stfrancistechnical.ac.ke', phone: '+254705096085', gender: 'Female', department: departments[2]._id, position: 'Assistant Lecturer' },
      { employeeId: 'FAC005', firstName: 'Robert', lastName: 'Wilson', email: 'robert.wilson@stfrancistechnical.ac.ke', phone: '+254705096085', gender: 'Male', department: departments[3]._id, position: 'Professor' },
    ]);
    console.log('Created 5 faculty');
    
    // CDACC Courses
    const courseTemplates = [
      { courseCode: 'GM301', name: 'Garment Making', description: 'Pattern design and sewing techniques', deptIdx: 8, level: 'Level 3', credits: 3 },
      { courseCode: 'CJ301', name: 'Carpentry and Joinery', description: 'Woodworking and construction', deptIdx: 9, level: 'Level 3', credits: 3 },
      { courseCode: 'EI301', name: 'Electrical Installation', description: 'Electrical wiring and maintenance', deptIdx: 9, level: 'Level 3', credits: 4 },
      { courseCode: 'SS301', name: 'Secretarial Studies', description: 'Office management', deptIdx: 5, level: 'Level 3', credits: 3 },
      { courseCode: 'ICT301', name: 'Information and Communication Technology', description: 'Computer applications', deptIdx: 0, level: 'Level 3', credits: 3 },
      { courseCode: 'SW301', name: 'Social Work & Community Development', description: 'Community outreach', deptIdx: 8, level: 'Level 3', credits: 3 },
      { courseCode: 'FD301', name: 'Fashion Design', description: 'Fashion illustration', deptIdx: 8, level: 'Level 3', credits: 3 },
      { courseCode: 'AG301', name: 'Agriculture', description: 'Crop production', deptIdx: 8, level: 'Level 3', credits: 3 },
      { courseCode: 'SK301', name: 'Store Keeping', description: 'Inventory management', deptIdx: 6, level: 'Level 3', credits: 3 },
      { courseCode: 'PL301', name: 'Plumbing', description: 'Plumbing systems', deptIdx: 9, level: 'Level 3', credits: 3 },
      { courseCode: 'CA301', name: 'Catering & Accommodation', description: 'Hospitality management', deptIdx: 3, level: 'Level 3', credits: 3 },
      { courseCode: 'BT301', name: 'Baking Technology', description: 'Baking techniques', deptIdx: 3, level: 'Level 3', credits: 3 },
      { courseCode: 'FB301', name: 'Food & Beverage Production', description: 'Food safety', deptIdx: 3, level: 'Level 3', credits: 3 },
      { courseCode: 'SP301', name: 'Solar PV Installation', description: 'Solar installation', deptIdx: 9, level: 'Level 3', credits: 4 },
      { courseCode: 'FB401', name: 'Food and Beverage Management', description: 'Menu planning', deptIdx: 3, level: 'Level 4', credits: 4 },
      { courseCode: 'BT401', name: 'Beauty Therapy', description: 'Skincare and spa therapies', deptIdx: 8, level: 'Level 4', credits: 4 },
      { courseCode: 'HR401', name: 'Human Resource Management', description: 'HR principles', deptIdx: 7, level: 'Level 4', credits: 4 },
      { courseCode: 'SW401', name: 'Social Work & Community Development', description: 'Advanced community work', deptIdx: 8, level: 'Level 4', credits: 4 },
      { courseCode: 'SS401', name: 'Secretarial Studies', description: 'Advanced office management', deptIdx: 5, level: 'Level 4', credits: 4 },
      { courseCode: 'ICT401', name: 'Information and Communication Technology', description: 'Advanced IT', deptIdx: 0, level: 'Level 4', credits: 4 },
      { courseCode: 'FD401', name: 'Fashion Design', description: 'Advanced pattern making', deptIdx: 8, level: 'Level 4', credits: 4 },
      { courseCode: 'AG401', name: 'Agriculture', description: 'Advanced agriculture', deptIdx: 8, level: 'Level 4', credits: 4 },
      { courseCode: 'BT402', name: 'Building Technology', description: 'Construction methods', deptIdx: 9, level: 'Level 4', credits: 4 },
      { courseCode: 'SK401', name: 'Store Keeping', description: 'Advanced inventory', deptIdx: 6, level: 'Level 4', credits: 4 },
      { courseCode: 'CA401', name: 'Catering & Accommodation', description: 'Advanced hospitality', deptIdx: 3, level: 'Level 4', credits: 4 },
      { courseCode: 'BK401', name: 'Baking Technology', description: 'Advanced baking', deptIdx: 3, level: 'Level 4', credits: 4 },
      { courseCode: 'PL401', name: 'Plumbing', description: 'Advanced plumbing', deptIdx: 9, level: 'Level 4', credits: 4 },
      { courseCode: 'EE401', name: 'Electrical & Electronic Engineering', description: 'Circuit design', deptIdx: 9, level: 'Level 4', credits: 4 },
      { courseCode: 'SS501', name: 'Secretarial Studies', description: 'Professional office management', deptIdx: 5, level: 'Level 5', credits: 5 },
      { courseCode: 'ICT501', name: 'Information and Communication Technology', description: 'IT infrastructure', deptIdx: 0, level: 'Level 5', credits: 5 },
      { courseCode: 'SW501', name: 'Social Work & Community Development', description: 'Professional social services', deptIdx: 8, level: 'Level 5', credits: 5 },
      { courseCode: 'FD501', name: 'Fashion Design', description: 'Professional fashion design', deptIdx: 8, level: 'Level 5', credits: 5 },
      { courseCode: 'AG501', name: 'Agriculture', description: 'Advanced agricultural science', deptIdx: 8, level: 'Level 5', credits: 5 },
      { courseCode: 'HR501', name: 'Human Resource Management', description: 'Advanced HR strategies', deptIdx: 7, level: 'Level 5', credits: 5 },
      { courseCode: 'BT501', name: 'Building Technology', description: 'Construction management', deptIdx: 9, level: 'Level 5', credits: 5 },
      { courseCode: 'SK501', name: 'Store Keeping', description: 'Supply chain management', deptIdx: 6, level: 'Level 5', credits: 5 },
      { courseCode: 'CE501', name: 'Civil Engineering', description: 'Infrastructure design', deptIdx: 9, level: 'Level 5', credits: 5 },
      { courseCode: 'CA501', name: 'Catering & Accommodation', description: 'Professional hospitality', deptIdx: 3, level: 'Level 5', credits: 5 },
      { courseCode: 'BK501', name: 'Baking Technology', description: 'Professional baking', deptIdx: 3, level: 'Level 5', credits: 5 },
      { courseCode: 'FB501', name: 'Food & Beverage Production', description: 'Advanced food production', deptIdx: 3, level: 'Level 5', credits: 5 },
      { courseCode: 'EE501', name: 'Electrical & Electronic Engineering', description: 'Advanced electronics', deptIdx: 9, level: 'Level 5', credits: 5 },
      { courseCode: 'ICT601', name: 'Information and Communication Technology', description: 'IT and cybersecurity', deptIdx: 0, level: 'Level 6', credits: 6 },
      { courseCode: 'HR601', name: 'Human Resource Management', description: 'Strategic HR leadership', deptIdx: 7, level: 'Level 6', credits: 6 },
      { courseCode: 'BM601', name: 'Business Management', description: 'Business strategy', deptIdx: 6, level: 'Level 6', credits: 6 },
      { courseCode: 'CE601', name: 'Civil Engineering', description: 'Structural analysis', deptIdx: 9, level: 'Level 6', credits: 6 },
      { courseCode: 'EE601', name: 'Electrical & Electronic Engineering', description: 'Power systems', deptIdx: 9, level: 'Level 6', credits: 6 },
      { courseCode: 'SW601', name: 'Social Work & Community Development', description: 'Community leadership', deptIdx: 8, level: 'Level 6', credits: 6 },
      { courseCode: 'FD601', name: 'Fashion Design', description: 'Fashion brand development', deptIdx: 8, level: 'Level 6', credits: 6 },
      { courseCode: 'AG601', name: 'Agriculture', description: 'Agribusiness management', deptIdx: 8, level: 'Level 6', credits: 6 },
      { courseCode: 'HM601', name: 'Hospitality Management', description: 'Hotel and tourism', deptIdx: 3, level: 'Level 6', credits: 6 },
      { courseCode: 'BT601', name: 'Building Technology', description: 'Construction leadership', deptIdx: 9, level: 'Level 6', credits: 6 },
    ];

    const courses = await Course.insertMany(courseTemplates.map((c, i) => ({
      courseCode: c.courseCode,
      name: c.name,
      description: c.description,
      department: departments[c.deptIdx]._id,
      credits: c.credits,
      level: c.level,
      semester: ['January', 'May', 'September'][i % 3],
      year: 2026,
      instructor: faculty[i % faculty.length]._id,
      maxStudents: 100,
      schedule: { days: ['Monday', 'Wednesday', 'Friday'], startTime: '8:00 AM', endTime: '10:00 AM', room: `Room ${101 + (i % 50)}` }
    })));
    console.log(`Created ${courses.length} courses`);
    
    // Generate 1000 Students
    console.log('Generating 1000 students...');
    
    const firstNames = [
      'James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles',
      'Christopher','Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua',
      'Kenneth','Kevin','Brian','George','Timothy','Ronald','Edward','Jason','Jeffrey','Ryan',
      'Jacob','Gary','Nicholas','Eric','Jonathan','Stephen','Larry','Justin','Scott','Brandon',
      'Benjamin','Samuel','Raymond','Gregory','Frank','Alexander','Patrick','Jack','Dennis','Jerry',
      'Mary','Patricia','Jennifer','Linda','Elizabeth','Barbara','Susan','Jessica','Sarah','Karen',
      'Lisa','Nancy','Betty','Margaret','Sandra','Ashley','Dorothy','Kimberly','Emily','Donna',
      'Michelle','Carol','Amanda','Melissa','Deborah','Stephanie','Rebecca','Sharon','Laura','Cynthia',
      'Kathleen','Amy','Angela','Shirley','Anna','Brenda','Pamela','Emma','Nicole','Helen',
      'Samantha','Katherine','Christine','Debra','Rachel','Carolyn','Janet','Catherine','Maria','Heather',
      'Diane','Ruth','Julie','Olivia','Joyce','Virginia','Victoria','Kelly','Lauren','Christina',
      'Joan','Evelyn','Judith','Megan','Andrea','Cheryl','Hannah','Jacqueline','Martha','Gloria',
      'Teresa','Ann','Sara','Madison','Frances','Kathryn','Janice','Jean','Abigail','Alice',
      'Judy','Sophia','Grace','Denise','Amber','Doris','Marilyn','Danielle','Beverly','Isabella',
      'Theresa','Diana','Natalie','Brittany','Charlotte','Marie','Kayla','Alexis','Lori','Rose'
    ];

    const lastNames = [
      'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
      'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
      'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
      'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
      'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts',
      'Ochieng','Kamau','Wanjiku','Mwangi','Otieno','Njoroge','Kimani','Wambui','Njeri','Muthoni',
      'Kipchoge','Chebet','Kiprop','Jepkosgei','Mutai','Korir','Cheruiyot','Kiplagat','Kenyatta','Odinga',
      'Moi','Kibaki','Ruto','Wafula','Barasa','Wekesa','Simiyu','Nasimiyu','Akinyi','Adhiambo',
      'Awuor','Anyango','Atieno','Omondi','Oduya','Okello','Owino','Ouma','Maina','Macharia',
      'Kariuki','Ndungu','Wainaina','Mbugua','Githinji','Njenga','Kamande','Kinyanjui','Abdi','Hassan',
      'Mohamed','Ali','Omar','Ahmed','Ibrahim','Yusuf','Fatima','Amina','Kibet','Kipkoech',
      'Rotich','Koech','Langat','Kosgei','Kimutai','Sang','Ngeny','Tanui','Mumo','Mutua',
      'Wambua','Kyalo','Musyoka','Kitheka','Mwendwa','Muteti','Nduku','Mwikali','Syombua','Kavutha'
    ];

    const programs = [
      'Garment Making','Carpentry and Joinery','Electrical Installation','Secretarial Studies',
      'Information and Communication Technology','Social Work & Community Development','Fashion Design',
      'Agriculture','Store Keeping','Plumbing','Catering & Accommodation','Baking Technology',
      'Food & Beverage Production','Solar PV Installation','Food and Beverage Management',
      'Beauty Therapy','Human Resource Management','Building Technology','Civil Engineering',
      'Electrical & Electronic Engineering','Business Management','Hospitality Management'
    ];

    const levels = ['Level 3', 'Level 4', 'Level 5', 'Level 6'];
    const semesters = ['January', 'May', 'September'];
    const genders = ['Male', 'Female'];
    
    const coursesByLevel = {};
    levels.forEach(l => {
      coursesByLevel[l] = courses.filter(c => c.level === l);
    });

    const batchSize = 100;
    const totalStudents = 1000;
    
    for (let batch = 0; batch < totalStudents / batchSize; batch++) {
      const studentsBatch = [];
      
      for (let i = 0; i < batchSize; i++) {
        const num = batch * batchSize + i + 1;
        const paddedNum = String(num).padStart(4, '0');
        const firstName = firstNames[(num - 1) % firstNames.length];
        const lastName = lastNames[(num - 1) % lastNames.length];
        const gender = genders[num % 2];
        const deptIdx = (num - 1) % departments.length;
        const program = programs[(num - 1) % programs.length];
        const level = levels[(num - 1) % levels.length];
        const semester = semesters[(num - 1) % semesters.length];
        
        const levelCourses = coursesByLevel[level] || courses;
        const numCourses = Math.min(levelCourses.length, 2 + (num % 3));
        const studentCourses = levelCourses.slice(0, numCourses).map(c => c._id);
        
        studentsBatch.push({
          studentId: `STU${paddedNum}`,
          admissionNumber: `SFTTI/2026/${paddedNum}`,
          firstName,
          lastName,
          email: `student${paddedNum}@stfrancistechnical.ac.ke`,
          password: 'student123',
          phone: `+254${700000000 + num}`,
          gender,
          department: departments[deptIdx]._id,
          program,
          level,
          semester,
          year: 2026,
          status: 'Active',
          gpa: parseFloat((2.0 + Math.random() * 2.0).toFixed(2)),
          courses: studentCourses
        });
      }
      
      await Student.insertMany(studentsBatch);
      console.log(`  Created ${(batch + 1) * batchSize} students...`);
    }
    
    console.log('All 1000 students created');
    
    // Announcements
    await Announcement.insertMany([
      { title: 'Fall Semester Registration Now Open', content: 'Registration for Fall 2026 is now open.', category: 'Academic', priority: 'High', author: faculty[0]._id, targetAudience: 'All', startDate: new Date('2026-05-01'), endDate: new Date('2026-05-15') },
      { title: 'Campus Career Fair', content: 'Join us for the annual career fair on May 20th.', category: 'Events', priority: 'Medium', author: faculty[4]._id, targetAudience: 'Students', startDate: new Date('2026-05-20'), endDate: new Date('2026-05-20') },
      { title: 'Library Hours Extended', content: 'Library open 24/7 during finals week.', category: 'General', priority: 'Low', author: faculty[2]._id, targetAudience: 'All', startDate: new Date('2026-05-25'), endDate: new Date('2026-06-01') },
    ]);
    console.log('Created announcements');
    
    // Events
    await Event.insertMany([
      { title: 'Welcome Week', description: 'Welcome new students.', category: 'Social', startDate: new Date('2026-05-04'), endDate: new Date('2026-05-08'), startTime: '9:00 AM', endTime: '5:00 PM', location: 'Main Campus' },
      { title: 'AI Research Symposium', description: 'Annual AI symposium.', category: 'Academic', startDate: new Date('2026-05-20'), endDate: new Date('2026-05-20'), startTime: '9:00 AM', endTime: '5:00 PM', location: 'Conference Hall' },
    ]);
    console.log('Created events');
    
    // Admissions
    await Admission.insertMany([
      { applicationId: 'ADM001', firstName: 'James', lastName: 'Miller', email: 'james.miller@email.com', phone: '+254705096085', gender: 'Male', program: 'Computer Science', department: departments[0]._id, status: 'Pending' },
      { applicationId: 'ADM002', firstName: 'Jennifer', lastName: 'Lee', email: 'jennifer.lee@email.com', phone: '+254705096085', gender: 'Female', program: 'Mathematics', department: departments[1]._id, status: 'Pending' },
    ]);
    console.log('Created admissions');
    
    // Contacts
    await Contact.insertMany([
      { name: 'Thomas Anderson', email: 'thomas.anderson@email.com', phone: '+254705096085', subject: 'Admission Inquiry', message: 'Information about Computer Science program.', department: departments[0]._id, status: 'New' },
    ]);
    console.log('Created contacts');
    
    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Total Courses: ${courses.length}`);
    console.log(`Total Departments: ${departments.length}`);
    console.log('========================================');
    console.log('Sample Login Credentials:');
    console.log('  Admission: SFTTI/2026/0001  Password: student123');
    console.log('  Admission: SFTTI/2026/0100  Password: student123');
    console.log('  Admission: SFTTI/2026/0500  Password: student123');
    console.log('  Admission: SFTTI/2026/0750  Password: student123');
    console.log('  Admission: SFTTI/2026/1000  Password: student123');
    console.log('========================================');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
});
