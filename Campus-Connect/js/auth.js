// Authentication and utility functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form if on login page
    if (document.getElementById('loginForm')) {
        initializeLogin();
    }
    
    // Initialize dashboard if on dashboard page
    if (document.querySelector('.dashboard-container')) {
        initializeDashboard();
    }
});

// Login functionality
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('errorMessage');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate inputs
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Validate password
        if (password !== 'password123') {
            showError('Invalid password. Please try again.');
            return;
        }
        
        // Check email suffix and redirect
        const userType = getUserTypeFromEmail(email);
        if (!userType) {
            showError('Invalid email domain. Please use your institutional email.');
            return;
        }
        
        // Store user data
        const userData = {
            email: email,
            type: userType,
            loginTime: new Date().toISOString(),
            name: getNameFromEmail(email)
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Show loading state
        showLoading();
        
        // Simulate authentication delay and redirect
        setTimeout(() => {
            window.location.href = `dashboards/${userType}.html`;
        }, 1500);
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    function showLoading() {
        const loginBtn = document.querySelector('.login-btn');
        const originalContent = loginBtn.innerHTML;
        
        loginBtn.innerHTML = '<div class="loading"></div><span>Signing In...</span>';
        loginBtn.disabled = true;
        
        // Reset button after redirect attempt
        setTimeout(() => {
            loginBtn.innerHTML = originalContent;
            loginBtn.disabled = false;
        }, 2000);
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getUserTypeFromEmail(email) {
    const domain = email.split('@')[1];
    
    if (email.endsWith('@student.usercampus.ac.za')) {
        return 'student';
    } else if (email.endsWith('@teacher.usercampus.ac.za')) {
        return 'teacher';
    } else if (email.endsWith('@admin.usercampus.ac.za')) {
        return 'admin';
    }
    
    return null;
}

function getNameFromEmail(email) {
    const username = email.split('@')[0];
    return username.split('.').map(name => 
        name.charAt(0).toUpperCase() + name.slice(1)
    ).join(' ');
}

// Dashboard functionality
function initializeDashboard() {
    // Check authentication
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    // Update user info in sidebar
    updateUserInfo(currentUser);
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize logout functionality
    initializeLogout();
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function updateUserInfo(user) {
    const userNameElement = document.querySelector('.user-info p');
    const userRoleElement = document.querySelector('.user-info .role');
    
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    if (userRoleElement) {
        userRoleElement.textContent = user.type;
    }
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            item.classList.add('active');
        }
        
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

function initializeMobileMenu() {
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.style.cssText = `
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 12px;
        padding: 12px;
        font-size: 18px;
        color: #667eea;
        cursor: pointer;
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(mobileToggle);
    
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
    
    // Show/hide mobile toggle based on screen size
    function toggleMobileButton() {
        if (window.innerWidth <= 768) {
            mobileToggle.style.display = 'block';
        } else {
            mobileToggle.style.display = 'none';
            sidebar.classList.remove('open');
        }
    }
    
    window.addEventListener('resize', toggleMobileButton);
    toggleMobileButton();
}

function initializeLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            }
        });
    }
}

// Utility functions for forms and interactions
function showSuccessMessage(message, container = document.body) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    
    container.insertBefore(successDiv, container.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showErrorMessage(message, container = document.body) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sample data generators for demonstration
function generateSampleData() {
    return {
        modules: [
            { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 3, instructor: 'Dr. Smith' },
            { id: 2, code: 'CS201', name: 'Data Structures', credits: 4, instructor: 'Prof. Johnson' },
            { id: 3, code: 'CS301', name: 'Database Systems', credits: 3, instructor: 'Dr. Brown' },
            { id: 4, code: 'CS401', name: 'Software Engineering', credits: 4, instructor: 'Prof. Davis' },
            { id: 5, code: 'CS501', name: 'Machine Learning', credits: 3, instructor: 'Dr. Wilson' }
        ],
        assignments: [
            { id: 1, title: 'Programming Assignment 1', module: 'CS101', dueDate: '2024-02-15', status: 'pending' },
            { id: 2, title: 'Data Structure Project', module: 'CS201', dueDate: '2024-02-20', status: 'submitted' },
            { id: 3, title: 'Database Design', module: 'CS301', dueDate: '2024-02-25', status: 'graded', grade: 85 }
        ],
        announcements: [
            { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will be held from March 1-5.', date: '2024-01-30', type: 'academic' },
            { id: 2, title: 'Library Hours Extended', content: 'Library will be open 24/7 during exam period.', date: '2024-01-28', type: 'facility' },
            { id: 3, title: 'New Course Registration', content: 'Registration for summer courses opens February 1.', date: '2024-01-25', type: 'registration' }
        ],
        grades: [
            { module: 'CS101', assignments: [{ name: 'Assignment 1', grade: 92 }, { name: 'Quiz 1', grade: 88 }], average: 90 },
            { module: 'CS201', assignments: [{ name: 'Project 1', grade: 85 }, { name: 'Midterm', grade: 78 }], average: 82 },
            { module: 'CS301', assignments: [{ name: 'Database Design', grade: 95 }, { name: 'SQL Quiz', grade: 89 }], average: 92 }
        ]
    };
}