// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('darkModeToggle');
    const getStartedBtn = document.getElementById('getStartedBtn');

    // Theme Management
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        // Update icon based on current theme
        const icon = themeToggle.querySelector('i');
        icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Get Started Button
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            window.location.href = 'resume-builder.html';
        });
    }
});

// Animation Functions
function animateElement(element, animation) {
    element.classList.add('animated', animation);
    element.addEventListener('animationend', () => {
        element.classList.remove('animated', animation);
    });
} 