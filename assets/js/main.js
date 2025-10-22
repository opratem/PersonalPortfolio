/**
 * main.js - Main JavaScript file for Praise Temiloluwa Olufemi's portfolio
 * Contains functionality for mobile menu, theme toggle, loading screen, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeThemeToggle();
    initializeScrollAnimations();
    setupProjectCardInteractions();
});

// Wait for the page to fully load before hiding the loading screen
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 500);
    }
});

/**
 * Mobile menu functionality
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.navbar nav');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close mobile menu when pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Add click event to nav links to close menu when clicked
    const navLinks = document.querySelectorAll('.navbar nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

/**
 * Theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or use device preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    } else if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Update the toggle button's aria-label based on current theme
    updateThemeToggleLabel();

    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        updateThemeToggleLabel();
    });

    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
            }
            updateThemeToggleLabel();
        }
    });
}

/**
 * Update theme toggle button label based on current theme
 */
function updateThemeToggleLabel() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

/**
 * Initialize scroll reveal animations using Intersection Observer
 */
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation is triggered to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with the scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Add scroll-reveal class to all project cards, about section, and contact section if they don't have it
    document.querySelectorAll('.project-card, .about-wrapper, .contact-section').forEach(el => {
        if (!el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        }
    });
}

/**
 * Setup interactions for project cards
 */
function setupProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        // Add focus functionality for keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = card.querySelector('.project-link');
                if (link) link.click();
            }
        });

        // Add hover functionality for touch devices
        card.addEventListener('touchstart', () => {
            projectCards.forEach(c => c.classList.remove('touch-focus'));
            card.classList.add('touch-focus');
        }, { passive: true });
    });

    // Remove focus on touch outside
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.project-card')) {
            document.querySelectorAll('.project-card.touch-focus').forEach(card => {
                card.classList.remove('touch-focus');
            });
        }
    }, { passive: true });
}