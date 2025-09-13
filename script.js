document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Responsive adjustment for navigation
    function handleResize() {
        if (window.innerWidth > 768) {
            mainNav.style.display = '';
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Dropdown menu functionality for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = dropdown.querySelector('.dropdown-menu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Responsive adjustment for navigation
    function handleResize() {
        if (window.innerWidth > 768) {
            mainNav.style.display = '';
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

 // Animation for the Smart Employment section
        document.addEventListener('DOMContentLoaded', function() {
            const smartSection = document.querySelector('.smart-employment-section');
            
            // Add animation on scroll
            function animateOnScroll() {
                const scrollPosition = window.scrollY;
                const sectionPosition = smartSection.offsetTop;
                const windowHeight = window.innerHeight;
                
                if (scrollPosition > sectionPosition - windowHeight + 100) {
                    smartSection.style.opacity = '1';
                    smartSection.style.transform = 'translateY(0)';
                }
            }
            
            // Set initial state for animation
            smartSection.style.opacity = '0';
            smartSection.style.transform = 'translateY(30px)';
            smartSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            // Listen for scroll events
            window.addEventListener('scroll', animateOnScroll);
            // Trigger once on load
            animateOnScroll();
            
            // Add hover effects to buttons
            const buttons = document.querySelectorAll('.smart-btn');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px)';
                    this.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
        });