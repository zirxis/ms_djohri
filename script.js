/**
 * Enhanced JavaScript for Djohri Website
 * Optimized for performance, accessibility, and modern features
 */

// --- Performance Optimizations ---
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// --- DOM Elements Cache ---
const elements = {
    backToTopBtn: null,
    progressBar: null,
    mobileMenuBtn: null,
    navLinks: null,
    loadingSpinner: null,
    notification: null,
    notificationText: null,
    searchBar: null,
    searchBtn: null,
    searchResults: null,
    themeToggle: null
};

// --- Enhanced Search Data ---
const searchData = [
    { 
        title: 'تركيب البروتين', 
        content: 'البروتين الأحماض الأمينية الشفرة الوراثية الترجمة النسخ الريبوسوم', 
        url: '#lessons',
        category: 'درس'
    },
    { 
        title: 'الإنزيمات', 
        content: 'المحفزات الحيوية التفاعلات الكيميائية الموقع النشط الركيزة', 
        url: '#lessons',
        category: 'درس'
    },
    { 
        title: 'المناعة', 
        content: 'جهاز المناعة الأجسام المضادة اللقاحات المناعة الطبيعية المكتسبة', 
        url: '#lessons',
        category: 'درس'
    },
    { 
        title: 'الاتصال العصبي', 
        content: 'الجهاز العصبي السيال العصبي المشابك العصبية الخلايا', 
        url: '#lessons',
        category: 'درس'
    },
    { 
        title: 'التركيب الضوئي', 
        content: 'النباتات الضوء الكلوروفيل التفاعلات الضوئية اللاضوئية', 
        url: '#lessons',
        category: 'درس'
    },
    { 
        title: 'بنية ووظيفة البروتين', 
        content: 'التركيب الثلاثي الوظيفة البيولوجية الطي البروتيني', 
        url: '#lessons',
        category: 'درس'
    },
    { 
        title: 'تمارين الوحدات', 
        content: 'تمارين حلول تدريبات اختبارات تطبيقات', 
        url: '#exercises',
        category: 'تمارين'
    }
];

// --- Utility Functions ---
const utils = {
    // Smooth scroll with offset
    smoothScrollTo: (element, offset = 80) => {
        if (!element) return;
        
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Enhanced local storage with error handling
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('Failed to save to localStorage:', error);
                return false;
            }
        },
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Failed to read from localStorage:', error);
                return defaultValue;
            }
        }
    },

    // Intersection Observer for animations
    createObserver: (callback, options = {}) => {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    },

    // Enhanced error handling
    handleError: (error, context = 'Unknown') => {
        console.error(`Error in ${context}:`, error);
        showNotification('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', 'error');
    }
};

// --- Performance Optimized Scroll Handler ---
let isScrolling = false;
const handleScroll = throttle(() => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            toggleBackToTopButton();
            updateProgressBar();
            isScrolling = false;
        });
        isScrolling = true;
    }
}, 16); // ~60fps

// --- Enhanced Functions ---
function toggleBackToTopButton() {
    if (!elements.backToTopBtn) return;
    
    const scrollThreshold = 300;
    const shouldShow = window.pageYOffset > scrollThreshold;
    
    elements.backToTopBtn.classList.toggle('visible', shouldShow);
    elements.backToTopBtn.setAttribute('aria-hidden', !shouldShow);
}

function updateProgressBar() {
    if (!elements.progressBar) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    elements.progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    elements.progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
}

function toggleMobileMenu() {
    if (!elements.navLinks || !elements.mobileMenuBtn) return;
    
    const isActive = elements.navLinks.classList.toggle('active');
    elements.mobileMenuBtn.setAttribute('aria-expanded', isActive);
    elements.mobileMenuBtn.innerHTML = isActive ?
        '<i class="fas fa-times" aria-hidden="true"></i>' : 
        '<i class="fas fa-bars" aria-hidden="true"></i>';
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
    
    // Focus management
    if (isActive) {
        const firstLink = elements.navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        utils.storage.set('theme', newTheme);
        
        if (elements.themeToggle) {
            const icon = elements.themeToggle.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            elements.themeToggle.setAttribute('aria-label', 
                newTheme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع المظلم'
            );
        }
        
        showNotification(
            newTheme === 'dark' ? 'تم تفعيل الوضع المظلم' : 'تم تفعيل الوضع الفاتح',
            'success'
        );
    } catch (error) {
        utils.handleError(error, 'toggleTheme');
    }
}

function smoothScrollToSection(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        utils.smoothScrollTo(targetElement);

        // Close mobile menu if open
        if (elements.navLinks && elements.navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }

        // Update active nav link
        updateActiveNavLink(targetId);
    }
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function showNotification(message, type = 'success') {
    if (!elements.notification || !elements.notificationText) return;
    
    try {
        elements.notificationText.textContent = message;
        elements.notification.className = `notification ${type}`;
        elements.notification.classList.add('show');
        
        // Clear existing timeout
        if (window.notificationTimeout) {
            clearTimeout(window.notificationTimeout);
        }
        
        // Auto-hide notification
        window.notificationTimeout = setTimeout(() => {
            elements.notification.classList.remove('show');
        }, 4000);
        
        // Announce to screen readers
        elements.notification.setAttribute('aria-live', 'polite');
    } catch (error) {
        console.error('Failed to show notification:', error);
    }
}

function toggleLoadingSpinner(show) {
    if (!elements.loadingSpinner) return;
    
    elements.loadingSpinner.classList.toggle('active', show);
    elements.loadingSpinner.setAttribute('aria-hidden', !show);
    
    if (show) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function openPDF(pdfUrl) {
    if (!pdfUrl) return;
    
    toggleLoadingSpinner(true);

    setTimeout(() => {
        toggleLoadingSpinner(false);
        showNotification(`جاري تحميل ملف ${pdfUrl.split('/').pop()}...`, 'success');

        try {
            const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            if (!newWindow) {
                showNotification('تم حظر النوافذ المنبثقة. الرجاء السماح بها لتحميل الملف.', 'warning');
            }
        } catch (error) {
            utils.handleError(error, 'openPDF');
        }
    }, 800);
}

function handlePDFClick(element, pdfUrl, unitName) {
    if (!element || !pdfUrl) return;
    
    // Visual feedback
    element.style.opacity = '0.7';
    element.style.transform = 'scale(0.98)';
    
    toggleLoadingSpinner(true);

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        toggleLoadingSpinner(false);
        
        showNotification(`جاري تحميل تمارين ${unitName}، شكراً لصبرك 💜`, 'success');
        
        try {
            const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            if (!newWindow) {
                showNotification('تم حظر النوافذ المنبثقة. الرجاء السماح بها لتحميل الملف.', 'warning');
            }
        } catch (error) {
            utils.handleError(error, 'handlePDFClick');
        }
    }, 1000);
}

// --- Enhanced Search Functions ---
function handleSearch() {
    if (!elements.searchBar) return;
    
    const searchTerm = elements.searchBar.value.trim();
    if (searchTerm.length < 2) {
        showNotification('الرجاء إدخال كلمتين على الأقل للبحث.', 'warning');
        return;
    }
    
    const results = performSearch(searchTerm);
    displaySearchResults(results);
    
    if (results.length > 0) {
        showNotification(`تم العثور على ${results.length} نتيجة للبحث عن: "${searchTerm}"`, 'success');
    } else {
        showNotification(`لم يتم العثور على نتائج للبحث عن: "${searchTerm}"`, 'info');
    }
}

function performSearch(searchTerm) {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    return searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(normalizedTerm);
        const contentMatch = item.content.toLowerCase().includes(normalizedTerm);
        const categoryMatch = item.category.toLowerCase().includes(normalizedTerm);
        
        return titleMatch || contentMatch || categoryMatch;
    }).sort((a, b) => {
        // Prioritize title matches
        const aTitle = a.title.toLowerCase().includes(normalizedTerm);
        const bTitle = b.title.toLowerCase().includes(normalizedTerm);
        
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
    });
}

function handleSearchInput() {
    if (!elements.searchBar) return;
    
    const searchTerm = elements.searchBar.value.trim();
    
    if (searchTerm.length > 1) {
        const results = performSearch(searchTerm);
        displaySearchResults(results.slice(0, 5)); // Limit to 5 results for performance
    } else {
        hideSearchResults();
    }
}

function displaySearchResults(results) {
    if (!elements.searchResults) return;
    
    if (results.length === 0) {
        elements.searchResults.innerHTML = '<div class="search-result-item">لم يتم العثور على نتائج</div>';
    } else {
        elements.searchResults.innerHTML = results.map((result, index) => 
            `<div class="search-result-item" 
                  role="option" 
                  tabindex="0"
                  data-url="${result.url}"
                  aria-label="نتيجة البحث: ${result.title}">
                <strong>${result.title}</strong>
                <span class="search-category">${result.category}</span>
             </div>`
        ).join('');
        
        // Add click and keyboard event listeners
        elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => navigateToResult(item.dataset.url));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToResult(item.dataset.url);
                }
            });
        });
    }
    
    elements.searchResults.style.display = 'block';
    elements.searchResults.setAttribute('aria-expanded', 'true');
}

function hideSearchResults() {
    if (!elements.searchResults) return;
    
    elements.searchResults.style.display = 'none';
    elements.searchResults.setAttribute('aria-expanded', 'false');
}

function navigateToResult(url) {
    hideSearchResults();
    if (elements.searchBar) elements.searchBar.value = '';
    
    if (url.startsWith('#')) {
        const targetElement = document.querySelector(url);
        if (targetElement) {
            utils.smoothScrollTo(targetElement);
            updateActiveNavLink(url);
        }
    } else {
        window.location.href = url;
    }
}

// --- Keyboard Navigation Enhancement ---
function enhanceKeyboardNavigation() {
    // Add keyboard support for interactive elements
    document.querySelectorAll('button, a, [tabindex="0"]').forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || (e.key === ' ' && el.tagName === 'BUTTON')) {
                e.preventDefault();
                el.click();
            }
        });
    });

    // Escape key to close mobile menu and search results
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.navLinks && elements.navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
            if (elements.searchResults && elements.searchResults.style.display === 'block') {
                hideSearchResults();
            }
        }
    });
}

// --- Theme Initialization ---
function initializeTheme() {
    try {
        const savedTheme = utils.storage.get('theme', 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (elements.themeToggle) {
            const icon = elements.themeToggle.querySelector('i');
            if (icon) {
                icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            elements.themeToggle.setAttribute('aria-label', 
                savedTheme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع المظلم'
            );
        }
    } catch (error) {
        utils.handleError(error, 'initializeTheme');
    }
}

// --- Image Lazy Loading Enhancement ---
function enhanceImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// --- Animation on Scroll ---
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.topic-card, .unit-card, .cta-section');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Back to top button
    if (elements.backToTopBtn) {
        elements.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile menu toggle
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Search functionality
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', handleSearch);
    }
    
    if (elements.searchBar) {
        elements.searchBar.addEventListener('input', debounce(handleSearchInput, 300));
        elements.searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScrollToSection);
    });

    // Topic links
    document.querySelectorAll('.topic-link').forEach(button => {
        button.addEventListener('click', (event) => {
            const pdfName = event.currentTarget.dataset.pdf;
            if (pdfName) {
                openPDF(pdfName);
            }
        });
    });

    // Unit cards
    document.querySelectorAll('.unit-card').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const unitName = event.currentTarget.dataset.unitName;
            const pdfUrl = event.currentTarget.href;
            handlePDFClick(event.currentTarget, pdfUrl, unitName);
        });
    });
}

// --- Cache DOM Elements ---
function cacheElements() {
    elements.backToTopBtn = document.getElementById('backToTop');
    elements.progressBar = document.getElementById('progressBar');
    elements.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    elements.navLinks = document.getElementById('navLinks');
    elements.loadingSpinner = document.getElementById('loadingSpinner');
    elements.notification = document.getElementById('notification');
    elements.notificationText = document.getElementById('notificationText');
    elements.searchBar = document.getElementById('searchBar');
    elements.searchBtn = document.getElementById('searchBtn');
    elements.searchResults = document.getElementById('searchResults');
    elements.themeToggle = document.getElementById('themeToggle');
}

// --- Service Worker Registration ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Service worker can be implemented for caching
            // navigator.serviceWorker.register('/sw.js');
        });
    }
}

// --- Performance Monitoring ---
function initializePerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                });
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
            console.warn('Performance monitoring not available:', error);
        }
    }
}

// --- Main Initialization ---
function initialize() {
    try {
        cacheElements();
        initializeTheme();
        setupEventListeners();
        enhanceKeyboardNavigation();
        enhanceImageLoading();
        initializeScrollAnimations();
        registerServiceWorker();
        initializePerformanceMonitoring();
        
        // Initial state setup
        toggleBackToTopButton();
        updateProgressBar();
        
        console.log('Website initialized successfully');
    } catch (error) {
        utils.handleError(error, 'initialize');
    }
}

// --- DOM Content Loaded Event ---
document.addEventListener('DOMContentLoaded', initialize);

// --- Global Functions (for inline event handlers) ---
window.showNotification = showNotification;
window.toggleLoadingSpinner = toggleLoadingSpinner;

