// Integration.js - Connects frontend to backend API
// Base URL for API endpoints
const API_BASE_URL = 'https://smart-employment-service-6.onrender.com';

// Utility function to get element by ID
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found`);
    }
    return element;
}

// Show notification message to user
function showMessage(message, isError = false) {
    // Create message element if it doesn't exist
    let messageEl = document.getElementById('api-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'api-message';
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.padding = '15px 20px';
        messageEl.style.borderRadius = '5px';
        messageEl.style.zIndex = '10000';
        messageEl.style.maxWidth = '300px';
        messageEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        messageEl.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        messageEl.style.fontSize = '14px';
        messageEl.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(messageEl);
    }

    // Style based on error/success
    if (isError) {
        messageEl.style.backgroundColor = '#ffebee';
        messageEl.style.color = '#c62828';
        messageEl.style.borderLeft = '4px solid #c62828';
    } else {
        messageEl.style.backgroundColor = '#e8f5e9';
        messageEl.style.color = '#2e7d32';
        messageEl.style.borderLeft = '4px solid #2e7d32';
    }

    messageEl.textContent = message;
    messageEl.style.opacity = '1';
    messageEl.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 300);
    }, 5000);
}

// Handle form submission
async function handleFormSubmit(event, endpoint, method = 'POST') {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable submit button to prevent multiple submissions
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log(`Submitting to ${endpoint}:`, data);
        
        // Send request to API
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Success handling
            console.log('API Success:', result);
            showMessage(result.message || 'Operation completed successfully!');
            
            // Reset form on successful submission
            form.reset();
            
            // Redirect if needed
            if (endpoint === '/api/login' && result.redirect) {
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 1500);
            }
        } else {
            // Error handling
            console.error('API Error:', result);
            showMessage(result.message || 'An error occurred. Please try again.', true);
        }
    } catch (error) {
        console.error('Request failed:', error);
        showMessage('Network error. Please check your connection and try again.', true);
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Initialize event listeners for forms
function initializeFormListeners() {
    console.log('Initializing form listeners...');
    
    // Create Account Form (create-account.html)
    const createAccountForm = getElement('signupForm');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, '/api/create-account');
        });
        console.log('Create account form listener added');
    }
    
    // Login Form (login.html)
    const loginForm = getElement('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, '/api/login');
        });
        console.log('Login form listener added');
    }
    
    // Post Job Form (post-job.html)
    const postJobForm = getElement('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, '/api/post-job');
        });
        console.log('Post job form listener added');
    }
    
    // Internship Form (internship.html)
    const internshipForm = getElement('internshipForm');
    if (internshipForm) {
        internshipForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, '/api/internship');
        });
        console.log('Internship form listener added');
    }
    
    // Additional forms can be added here as needed
    
    console.log('All form listeners initialized');
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing integration...');
    
    // Add some basic styles for the message element
    const style = document.createElement('style');
    style.textContent = `
        #api-message {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize all form listeners
    initializeFormListeners();
    
    console.log('Integration.js loaded successfully');
});

// Handle page navigation without breaking the script
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache, reinitialize listeners
        setTimeout(initializeFormListeners, 100);
    }
});
