// Main JavaScript for College Website

// Course Tabs
function showTab(tabId) {
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => tab.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  const allLinks = document.querySelectorAll('.tabs ul li a');
  allLinks.forEach(link => link.classList.remove('active'));

  const activeLink = document.querySelector(`.tabs ul li a[href="#${tabId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Reset search when switching tabs
  const searchInput = document.getElementById('courseSearch');
  if (searchInput) {
    searchInput.value = '';
    const resultsText = document.getElementById('searchResults');
    if (resultsText) resultsText.textContent = '';
    // Show all items
    if (targetTab) {
      targetTab.querySelectorAll('.course-item').forEach(item => {
        item.style.display = '';
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Show first tab by default
  const firstTab = document.querySelector('.tab-content');
  if (firstTab) {
    firstTab.classList.add('active');
    const firstLink = document.querySelector('.tabs ul li a');
    if (firstLink) firstLink.classList.add('active');
  }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Initialize scroll reveal
  initScrollReveal();
  
  // Load stats on home page
  if (document.getElementById('studentCount')) {
    loadStats();
  }
  
  // Load departments on home page
  if (document.getElementById('departmentsGrid')) {
    loadDepartments();
  }
  
  // Load events on home page
  if (document.getElementById('eventsGrid')) {
    loadEvents();
  }
  
  // Load announcements on home page
  if (document.getElementById('announcementsGrid')) {
    loadAnnouncements();
  }

  // Initialize form validation
  initFormValidation();
});

// Scroll Reveal Animation
function initScrollReveal() {
  const sections = document.querySelectorAll('section:not(.hero):not(.page-header)');
  sections.forEach(section => section.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  sections.forEach(section => observer.observe(section));
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateInput(input);
        }
      });
    });
  });
}

function validateInput(input) {
  const isValid = input.value.trim() !== '';
  input.classList.toggle('invalid', !isValid);
  input.classList.toggle('valid', isValid && input.value.trim().length > 2);
  return isValid;
}

// Load Statistics
async function loadStats() {
  try {
    const [studentsRes, facultyRes, coursesRes, departmentsRes] = await Promise.all([
      fetch('/api/students'),
      fetch('/api/faculty'),
      fetch('/api/courses'),
      fetch('/api/departments')
    ]);
    
    const students = await studentsRes.json();
    const faculty = await facultyRes.json();
    const courses = await coursesRes.json();
    const departments = await departmentsRes.json();
    
    animateCounter('studentCount', students.length);
    animateCounter('facultyCount', faculty.length);
    animateCounter('courseCount', courses.length);
    animateCounter('departmentCount', departments.length);
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

// Animate Counter
function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 30);
}

// Load Departments for Home Page
async function loadDepartments() {
  try {
    const response = await fetch('/api/departments');
    const departments = await response.json();
    
    const grid = document.getElementById('departmentsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Show only first 3 departments on home page
    const displayDepts = departments.slice(0, 3);
    
    displayDepts.forEach(dept => {
      const card = document.createElement('div');
      card.className = 'department-card';
      card.innerHTML = `
        <h3>${dept.name}</h3>
        <p class="code">${dept.code}</p>
        <p class="description">${dept.description || 'No description available'}</p>
        <a href="/departments" class="btn btn-secondary">Learn More</a>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading departments:', err);
  }
}

// Load Events for Home Page
async function loadEvents() {
  try {
    const response = await fetch('/api/events/upcoming/all');
    const events = await response.json();
    
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Show only first 3 events on home page
    const displayEvents = events.slice(0, 3);
    
    if (displayEvents.length === 0) {
      grid.innerHTML = '<p class="no-results">No upcoming events at this time.</p>';
      return;
    }
    
    displayEvents.forEach(event => {
      const card = document.createElement('div');
      card.className = 'event-card';
      
      const startDate = new Date(event.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      card.innerHTML = `
        <div class="event-header">
          <span class="event-category">${event.category}</span>
        </div>
        <h3>${event.title}</h3>
        <p class="description">${event.description || 'No description available'}</p>
        <div class="event-details">
          <p><strong>📅 Date:</strong> ${startDate}</p>
          <p><strong>📍 Location:</strong> ${event.location}</p>
        </div>
        <a href="/events" class="btn btn-secondary">View Details</a>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading events:', err);
  }
}

// Load Announcements for Home Page
async function loadAnnouncements() {
  try {
    const response = await fetch('/api/announcements');
    const announcements = await response.json();
    
    const grid = document.getElementById('announcementsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Show only first 3 announcements on home page
    const displayAnnouncements = announcements.slice(0, 3);
    
    if (displayAnnouncements.length === 0) {
      grid.innerHTML = '<p class="no-results">No announcements at this time.</p>';
      return;
    }
    
    displayAnnouncements.forEach(announcement => {
      const card = document.createElement('div');
      card.className = `announcement-card priority-${announcement.priority.toLowerCase()}`;
      
      const createdAt = new Date(announcement.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      card.innerHTML = `
        <div class="announcement-header">
          <span class="announcement-category">${announcement.category}</span>
          <span class="announcement-priority priority-${announcement.priority.toLowerCase()}">${announcement.priority}</span>
        </div>
        <h3>${announcement.title}</h3>
        <p class="content">${announcement.content.substring(0, 150)}${announcement.content.length > 150 ? '...' : ''}</p>
        <div class="announcement-meta">
          <p><strong>📅 Posted:</strong> ${createdAt}</p>
        </div>
        <a href="/announcements" class="btn btn-secondary">Read More</a>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading announcements:', err);
  }
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Form Validation (legacy - used for submit checks)
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }
  });
  
  return isValid;
}

// Show Notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
