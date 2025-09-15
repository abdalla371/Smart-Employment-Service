// Integration.js - Central event handling for Job Portal Website

// Utility Functions
const $ = (id) => document.getElementById(id);
const hide = (element) => element && (element.style.display = 'none');
const show = (element) => element && (element.style.display = 'block');

// Form Handling Functions
function handleLogin(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    const email = $('loginEmail')?.value;
    const password = $('loginPassword')?.value;
    
    if (!email || !password) {
        console.error('Login form missing required fields');
        alert('Please fill in all required fields');
        return;
    }
    
    // Simulate API call
    console.log(`Logging in with email: ${email}`);
    // In a real application, you would make a fetch request here
}

function handleSignup(event) {
    event.preventDefault();
    console.log('Signup form submitted');
    
    const name = $('signupName')?.value;
    const email = $('signupEmail')?.value;
    const phone = $('signupPhone')?.value;
    const password = $('signupPassword')?.value;
    const userType = $('userType')?.value;
    
    if (!name || !email || !phone || !password || !userType) {
        console.error('Signup form missing required fields');
        alert('Please fill in all required fields');
        return;
    }
    
    console.log(`Creating ${userType} account for: ${name}, ${email}`);
    // In a real application, you would make a fetch request here
}

function handlePostJob(event) {
    event.preventDefault();
    console.log('Post Job form submitted');
    
    const title = $('jobTitle')?.value;
    const description = $('jobDescription')?.value;
    const company = $('companyName')?.value;
    const location = $('jobLocation')?.value;
    const category = $('jobCategory')?.value;
    const deadline = $('applicationDeadline')?.value;
    
    if (!title || !description || !company || !location || !category || !deadline) {
        console.error('Post Job form missing required fields');
        alert('Please fill in all required fields');
        return;
    }
    
    console.log(`Posting job: ${title} at ${company}`);
    // In a real application, you would make a fetch request here
}

function handleJobSearch(event) {
    event.preventDefault();
    console.log('Job Search form submitted');
    
    const keyword = $('job-title')?.value;
    const location = $('location')?.value;
    const category = $('category')?.value;
    
    console.log(`Searching jobs with filters - Keyword: ${keyword}, Location: ${location}, Category: ${category}`);
    // In a real application, you would make a fetch request here
}

function handleApplyJob(event) {
    event.preventDefault();
    console.log('Apply Job form submitted');
    
    const name = $('applicantName')?.value;
    const email = $('applicantEmail')?.value;
    const phone = $('applicantPhone')?.value;
    const cvLink = $('cvLink')?.value;
    const jobId = $('applyJobId')?.value;
    
    if (!name || !email || !phone || !cvLink || !jobId) {
        console.error('Apply Job form missing required fields');
        alert('Please fill in all required fields');
        return;
    }
    
    console.log(`Applying to job ${jobId} with applicant: ${name}, ${email}`);
    // In a real application, you would make a fetch request here
}

// Modal Functions
function toggleModal(modalId, show) {
    const modal = $(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }
    
    modal.style.display = show ? 'block' : 'none';
    console.log(`${show ? 'Showing' : 'Hiding'} modal: ${modalId}`);
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    console.log('All modals closed');
}

// Navigation Functions
function handleTabSwitch(tabId) {
    console.log(`Switching to tab: ${tabId}`);
    
    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Activate the selected tab
    const selectedTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected form section
    const selectedSection = $(`${tabId}-form`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

// Password Visibility Toggle
function togglePassword(inputId, iconElement) {
    const passwordInput = $(inputId);
    if (!passwordInput) {
        console.error(`Password input with ID ${inputId} not found`);
        return;
    }
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
        console.log(`Password visible for field: ${inputId}`);
    } else {
        passwordInput.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
        console.log(`Password hidden for field: ${inputId}`);
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    
    if (!mobileNav || !overlay) {
        console.error('Mobile navigation elements not found');
        return;
    }
    
    const isActive = mobileNav.classList.contains('active');
    
    if (isActive) {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Mobile menu closed');
    } else {
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Mobile menu opened');
    }
}

// Event Handler Attachment Functions
function attachFormHandlers() {
    // Login form
    const loginForm = $('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Attached handler to login form');
    }
    
    // Signup form
    const signupForm = $('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        console.log('Attached handler to signup form');
    }
    
    // Post Job form
    const postJobForm = $('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', handlePostJob);
        console.log('Attached handler to post job form');
    }
    
    // Job Search form
    const jobSearchForm = $('jobSearchForm');
    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', handleJobSearch);
        console.log('Attached handler to job search form');
    }
    
    // Apply Job form
    const applyForm = $('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', handleApplyJob);
        console.log('Attached handler to apply job form');
    }
}

function attachModalHandlers() {
    // Modal open buttons
    const loginBtn = $('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal('loginModal', true);
        });
        console.log('Attached handler to login button');
    }
    
    const signupBtn = $('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal('signupModal', true);
        });
        console.log('Attached handler to signup button');
    }
    
    const postJobBtn = $('postJobBtn');
    if (postJobBtn) {
        postJobBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.userType === 'employer') {
                toggleModal('postJobModal', true);
            } else {
                alert('Only employers can post jobs');
                toggleModal('signupModal', true);
            }
        });
        console.log('Attached handler to post job button');
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    console.log(`Attached handlers to ${closeButtons.length} close buttons`);
    
    // Overlay click to close modals
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', closeAllModals);
        console.log('Attached handler to overlay');
    }
    
    // Switch between login and signup modals
    const switchToSignup = $('switchToSignup');
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            toggleModal('signupModal', true);
        });
        console.log('Attached handler to switch to signup');
    }
    
    const switchToLogin = $('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            toggleModal('loginModal', true);
        });
        console.log('Attached handler to switch to login');
    }
}

function attachTabHandlers() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            handleTabSwitch(tabId);
        });
    });
    console.log(`Attached handlers to ${tabs.length} tabs`);
    
    // Back to Job Seeker button
    const backToJobSeeker = document.querySelector('.btn-secondary');
    if (backToJobSeeker && backToJobSeeker.textContent.includes('Back to Job Seeker')) {
        backToJobSeeker.addEventListener('click', () => {
            handleTabSwitch('job-seeker');
        });
        console.log('Attached handler to back to job seeker button');
    }
}

function attachPasswordToggleHandlers() {
    // Password visibility toggles
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            togglePassword(inputId, this);
        });
    });
    console.log(`Attached handlers to ${toggleButtons.length} password toggle buttons`);
}

function attachMobileMenuHandlers() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
        console.log('Attached handler to mobile menu toggle');
    }
    
    // Mobile menu close
    const closeMenu = document.querySelector('.close-menu');
    if (closeMenu) {
        closeMenu.addEventListener('click', toggleMobileMenu);
        console.log('Attached handler to mobile menu close button');
    }
    
    // Mobile menu links
    const mobileLinks = document.querySelectorAll('.mobile-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
    console.log(`Attached handlers to ${mobileLinks.length} mobile menu links`);
}

function attachApplyJobHandlers() {
    // Apply job buttons
    const applyButtons = document.querySelectorAll('.btn-apply');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            const jobTitle = this.getAttribute('data-job-title');
            
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!user._id) {
                alert('Please log in to apply for jobs');
                toggleModal('loginModal', true);
                return;
            }
            
            if (user.userType !== 'job_seeker') {
                alert('Only job seekers can apply for jobs');
                return;
            }
            
            if ($('applyJobId')) {
                $('applyJobId').value = jobId;
            }
            
            if ($('applyJobTitle')) {
                $('applyJobTitle').textContent = jobTitle;
            }
            
            // Pre-fill form with user data if available
            if (user._id) {
                if ($('applicantName')) $('applicantName').value = user.name || '';
                if ($('applicantEmail')) $('applicantEmail').value = user.email || '';
                if ($('applicantPhone')) $('applicantPhone').value = user.phone || '';
            }
            
            toggleModal('applyModal', true);
        });
    });
    console.log(`Attached handlers to ${applyButtons.length} apply job buttons`);
}

// Initialize all event listeners
function init() {
    console.log('Initializing Integration.js');
    
    try {
        attachFormHandlers();
        attachModalHandlers();
        attachTabHandlers();
        attachPasswordToggleHandlers();
        attachMobileMenuHandlers();
        attachApplyJobHandlers();
        
        console.log('Integration.js initialized successfully');
    } catch (error) {
        console.error('Error during Integration.js initialization:', error);
    }
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
