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
            window.location.href = `${userType}.html`;
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getUserTypeFromEmail(email) {
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
    return username.charAt(0).toUpperCase() + username.slice(1);
}

// Dashboard functionality
function initializeDashboard() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    updateUserInfo(currentUser);
    initializeNavigation();
    initializeMobileMenu();
    initializeLogout();
    loadDashboardData(currentUser.type);
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function updateUserInfo(user) {
    const userInfoElement = document.querySelector('.user-info p');
    const roleElement = document.querySelector('.user-info .role');
    
    if (userInfoElement) {
        userInfoElement.textContent = user.name;
    }
    
    if (roleElement) {
        roleElement.textContent = user.type;
    }
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

function initializeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 12px;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        display: none;
    `;
    
    document.body.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
    
    // Show mobile menu button on small screens
    function toggleMobileButton() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
            sidebar.classList.remove('open');
        }
    }
    
    toggleMobileButton();
    window.addEventListener('resize', toggleMobileButton);
}

function initializeLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear user data
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = 'index.html';
    });
}

function showSuccessMessage(message, container = document.body) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    container.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            container.removeChild(successDiv);
        }, 300);
    }, 3000);
}

function showErrorMessage(message, container = document.body) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    container.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            container.removeChild(errorDiv);
        }, 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function generateSampleData() {
    return {
        modules: [
            { id: 1, name: 'Computer Science Fundamentals', code: 'CS101', grade: 'A', credits: 3 },
            { id: 2, name: 'Data Structures & Algorithms', code: 'CS201', grade: 'B+', credits: 4 },
            { id: 3, name: 'Database Systems', code: 'CS301', grade: 'A-', credits: 3 },
            { id: 4, name: 'Software Engineering', code: 'CS401', grade: 'B', credits: 4 }
        ],
        assignments: [
            { id: 1, title: 'Final Project Submission', module: 'CS401', dueDate: '2024-01-15', status: 'Submitted' },
            { id: 2, title: 'Database Design Report', module: 'CS301', dueDate: '2024-01-10', status: 'Pending' },
            { id: 3, title: 'Algorithm Analysis', module: 'CS201', dueDate: '2024-01-08', status: 'Submitted' }
        ],
        events: [
            { id: 1, title: 'Career Fair', date: '2024-01-20', time: '10:00 AM', location: 'Main Hall' },
            { id: 2, title: 'Tech Workshop', date: '2024-01-25', time: '2:00 PM', location: 'Lab 3' },
            { id: 3, title: 'Student Council Meeting', date: '2024-01-30', time: '4:00 PM', location: 'Conference Room' }
        ]
    };
}

function loadDashboardData(userType) {
    const data = generateSampleData();
    
    // Load data based on user type
    switch(userType) {
        case 'student':
            loadStudentDashboard(data);
            break;
        case 'teacher':
            loadTeacherDashboard(data);
            break;
        case 'admin':
            loadAdminDashboard(data);
            break;
    }
}

function loadStudentDashboard(data) {
    // Load modules and grades
    const modulesContainer = document.getElementById('modulesContainer');
    if (modulesContainer) {
        modulesContainer.innerHTML = data.modules.map(module => `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon blue">
                        <i class="fas fa-book"></i>
                    </div>
                    <div>
                        <div class="card-title">${module.name}</div>
                        <div class="card-subtitle">${module.code} • ${module.credits} credits</div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="stat-number" style="color: #667eea;">${module.grade}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Load assignments
    const assignmentsContainer = document.getElementById('assignmentsContainer');
    if (assignmentsContainer) {
        assignmentsContainer.innerHTML = data.assignments.map(assignment => `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon ${assignment.status === 'Submitted' ? 'green' : 'orange'}">
                        <i class="fas fa-upload"></i>
                    </div>
                    <div>
                        <div class="card-title">${assignment.title}</div>
                        <div class="card-subtitle">${assignment.module} • Due: ${formatDate(assignment.dueDate)}</div>
                    </div>
                </div>
                <div class="card-content">
                    <span class="badge ${assignment.status === 'Submitted' ? 'success' : 'warning'}">${assignment.status}</span>
                </div>
            </div>
        `).join('');
    }
}

function loadTeacherDashboard(data) {
    // Load student submissions
    const submissionsContainer = document.getElementById('submissionsContainer');
    if (submissionsContainer) {
        submissionsContainer.innerHTML = data.assignments.map(assignment => `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon ${assignment.status === 'Submitted' ? 'green' : 'orange'}">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div>
                        <div class="card-title">${assignment.title}</div>
                        <div class="card-subtitle">${assignment.module} • Due: ${formatDate(assignment.dueDate)}</div>
                    </div>
                </div>
                <div class="card-content">
                    <span class="badge ${assignment.status === 'Submitted' ? 'success' : 'warning'}">${assignment.status}</span>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-sm">Review</button>
                    <button class="btn btn-secondary btn-sm">Grade</button>
                </div>
            </div>
        `).join('');
    }
}

function loadAdminDashboard(data) {
    // Load system statistics
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">1,247</div>
                <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">89</div>
                <div class="stat-label">Faculty Members</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">156</div>
                <div class="stat-label">Active Courses</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">98.5%</div>
                <div class="stat-label">System Uptime</div>
            </div>
        `;
    }
}

// Utility functions for form handling
function handleFormSubmission(formId, successMessage) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showSuccessMessage(successMessage);
            form.reset();
        });
    }
}

// Initialize form handlers
document.addEventListener('DOMContentLoaded', function() {
    handleFormSubmission('assignmentForm', 'Assignment submitted successfully!');
    handleFormSubmission('announcementForm', 'Announcement posted successfully!');
    handleFormSubmission('userForm', 'User updated successfully!');
});