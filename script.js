// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu(); // تم تحديث هذه الوظيفة
    initTabs();
    initModals();
    // initFontSizeControls(); // تم تعطيلها مؤقتاً لعدم وجود الأزرار في الهيدر
    initScrollToTop();
    initSearchFunctionality();
    initSmoothScrolling();
    initAnimations();
    initFormValidations();
    initInteractiveElements();
    
    // -- تم إلغاء تهيئة عمود الرئيس القديم --
    // initPresidentSidebar(); 
    
    console.log('✅ جميع المكونات جاهزة للعمل!');
});

// Mobile Menu Functionality - (نسخة محسنة)
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    const navLinks = document.querySelectorAll('.nav-menu > li > a'); // الروابط الرئيسية فقط
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');

    if (mobileMenuToggle && navMenu) {
        // زر تبديل القائمة
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // إغلاق القائمة عند الضغط على زر Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // إدارة القوائم المنسدلة على الموبايل
    navDropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector(':scope > .nav-link');
        
        dropdownLink.addEventListener('click', (e) => {
            // التحقق من أننا في وضع الموبايل وأن العنصر هو قائمة منسدلة
            if (window.innerWidth <= 768 && dropdown.classList.contains('nav-dropdown')) {
                e.preventDefault(); // منع الانتقال للرابط
                e.stopPropagation();
                
                // إغلاق القوائم المنسدلة الأخرى
                navDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // تبديل القائمة الحالية
                dropdown.classList.toggle('active');
            }
        });
    });

    // إغلاق القائمة عند النقر على رابط رئيسي (ليس قائمة منسدلة)
    navLinks.forEach(link => {
        if (!link.parentElement.classList.contains('nav-dropdown')) {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        }
    });

    // إغلاق القائمة عند النقر على رابط داخل قائمة منسدلة
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // إعادة تعيين القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            navDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    function toggleMobileMenu() {
        const isActive = navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active', isActive);
        
        if (isActive) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.classList.add('menu-open');
            animateMenuItems();
        } else {
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.classList.remove('menu-open');
            // إغلاق جميع القوائم المنسدلة
            navDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
        
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
    }

    function closeMobileMenu() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // إغلاق جميع القوائم المنسدلة
            navDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }
}


// Animate menu items
function animateMenuItems() {
    const menuItems = document.querySelectorAll('.nav-menu > li'); // استهداف عناصر li
    menuItems.forEach((item, index) => {
        item.style.animation = 'none'; // إعادة تعيين
        item.offsetHeight; // إجبار المتصفح على إعادة الحساب
        item.style.animation = `slideInRight 0.4s ease forwards ${index * 0.07}s`;
    });
}

// Tab Functionality
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');

    // Set first tab as active by default
    if (tabHeaders.length > 0 && !document.querySelector('.tab-header.active')) {
        tabHeaders[0].classList.add('active');
        const firstTabId = tabHeaders[0].getAttribute('data-tab');
        const firstTabContent = document.getElementById(firstTabId);
        if (firstTabContent) {
            firstTabContent.classList.add('active');
        }
    }

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Remove active class from all headers and contents
            tabHeaders.forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked header
            header.classList.add('active');
            header.setAttribute('aria-selected', 'true');
            
            // Show corresponding content with animation
            const tabId = header.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
                
                // Add entrance animation
                tabContent.style.animation = 'none';
                setTimeout(() => {
                    tabContent.style.animation = 'fadeIn 0.5s ease';
                }, 10);
            }
        });
    });
}

// Modal Windows Functionality
function initModals() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const registerLink = document.getElementById('registerLink');

    // Function to open a modal
    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
            
            // Add escape key listener
            document.addEventListener('keydown', escapeHandler);
        }
    }

    // Function to close a modal
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', escapeHandler);
        }
    }
    
    // Escape handler
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    };


    // Event listeners for opening modals
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }

    // Event listeners for closing modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Register link
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة طلب العضوية قريباً', 'info');
            closeModal(loginModal);
            
            setTimeout(() => {
                showNotification('نظام العضوية قيد التطوير حالياً', 'warning');
            }, 2000);
        });
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Form submission handlers
    const loginForm = document.querySelector('#loginModal .auth-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(loginForm)) {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                simulateLogin(email, password);
            }
        });
    }
}

// Font Size Controls (معطلة مؤقتاً)
function initFontSizeControls() {
    // ... (الكود موجود ولكنه غير مستدعى)
}

// Scroll to Top Functionality
function initScrollToTop() {
    let scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.setAttribute('aria-label', 'الانتقال إلى الأعلى');
        document.body.appendChild(scrollBtn);
        scrollBtn.addEventListener('click', scrollToTop);
    }
    
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton(); // Check on load

    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) {
        showNotification('يرجى إدخال كلمة للبحث', 'warning');
        return;
    }

    const searchBtn = document.querySelector('.search-btn');
    const originalHtml = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;

    setTimeout(() => {
        searchBtn.innerHTML = originalHtml;
        searchBtn.disabled = false;
        showNotification(`تم العثور على 15 نتيجة لـ "${query}"`, 'success');
        console.log(`Searching for: ${query}`);
    }, 1500);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations
function initAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    obs.unobserve(entry.target); // إيقاف المراقبة بعد العرض
                }
            });
        }, observerOptions);

        document.querySelectorAll('.quick-card, .article-card, .judgement-card, .archive-card, .feature-item, .sidebar-card').forEach(el => {
            el.classList.add('to-animate'); // إضافة كلاس للتهيئة
            observer.observe(el);
        });

        if (!document.querySelector('#animation-styles')) {
            const animationStyles = `
                <style id="animation-styles">
                    .to-animate {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    }
                    
                    .animate-in {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', animationStyles);
        }
    }
}


// Form Validations
function initFormValidations() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.closest('.form-group').classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    });
}

// Validate individual field
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;
    
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    formGroup.classList.remove('success', 'error');

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }
    
    else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMessage = 'البريد الإلكتر الإلكتروني غير صالح';
    }
    
    else if (field.type === 'password' && value && value.length < 6) {
        isValid = false;
        errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (isValid) {
        formGroup.classList.add('success');
    } else {
        formGroup.classList.add('error');
        // يمكن إضافة رسالة خطأ هنا
    }
    
    return isValid;
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Interactive Elements
function initInteractiveElements() {
    // Magazine cover interactions
    const coverDesign = document.querySelector('.cover-design');
    if (coverDesign) {
        coverDesign.addEventListener('click', function() {
            showNotification('جاري فتح العدد الحالي...', 'info');
            // يمكنك هنا إضافة رابط لفتح العدد
        });
    }

    // Quick card interactions
    const quickCards = document.querySelectorAll('.quick-card');
    quickCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = this.querySelector('h3').textContent;
            showNotification(`جاري التوجه إلى ${cardTitle}...`, 'info');
        });
    });
}

// -- تم إلغاء الوظائف الخاصة بعمود الرئيس القديم --
/*
function initPresidentSidebar() {
    // ... (ملغي)
}
function closePresidentCard() {
    // ... (ملغي)
}
*/


// Simulate Login Process
function simulateLogin(email, password) {
    const submitBtn = document.querySelector('#loginModal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        
        closeModal(document.getElementById('loginModal'));
        
        updateUserInterface(true, email.split('@')[0]); // إرسال اسم المستخدم
        
        showNotification('تم تسجيل الدخول بنجاح! مرحباً بعودتك.', 'success');
    }, 2000);
}

// Update UI based on authentication state
function updateUserInterface(isLoggedIn, username = 'زائر') {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <span class="welcome-message">أهلاً، ${username}</span>
            <button class="btn btn-outline" id="logoutBtn" title="تسجيل الخروج">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;
        
        // Add event listener for logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            updateUserInterface(false);
            showNotification('تم تسجيل الخروج بنجاح!', 'info');
        });

        // إضافة تنسيق لرسالة الترحيب
        if (!document.querySelector('#welcome-style')) {
            document.head.insertAdjacentHTML('beforeend', `
                <style id="welcome-style">
                    .welcome-message {
                        color: white;
                        font-weight: 500;
                        margin-left: 1rem;
                        opacity: 0.9;
                    }
                    #logoutBtn {
                        padding: 0.5rem 1rem;
                    }
                </style>
            `);
        }

    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline" id="loginBtn"><i class="fas fa-sign-in-alt"></i> دخول الأعضاء</button>
        `;
        
        // إعادة تهيئة الزر الجديد
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(document.getElementById('loginModal'));
            });
        }
    }
}


// Show Notification
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-exclamation-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="إغلاق الإشعار">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    const autoRemoveTimer = setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemoveTimer);
        notification.remove();
    });
}

// Utility Functions

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    // Tab navigation for modals
    if (e.key === 'Tab' && document.querySelector('.modal.active')) {
        const modal = document.querySelector('.modal.active');
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

console.log('🚀 مجلة هيئة قضايا الدولة - جاهزة للعمل!');