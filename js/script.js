// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Settings dropdown functionality
    const userSettingsIcon = document.getElementById('user-settings-icon');
    const userSettingsDropdown = document.getElementById('user-settings-dropdown');
    const settingAcc = document.getElementById('setting-acc');
    
    if (userSettingsIcon && userSettingsDropdown) {
        // Toggle dropdown when settings icon is clicked
        userSettingsIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (userSettingsDropdown.style.display === 'block') {
                userSettingsDropdown.style.display = 'none';
            } else {
                userSettingsDropdown.style.display = 'block';
            }
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function() {
            userSettingsDropdown.style.display = 'none';
        });
        
        // Prevent dropdown from closing when clicking inside it
        userSettingsDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle "Setting Acc" click
    if (settingAcc) {
        settingAcc.addEventListener('click', function() {
            // Hide dropdown
            if (userSettingsDropdown) {
                userSettingsDropdown.style.display = 'none';
            }
            // Show user settings modal
            document.getElementById('user-settings-modal').style.display = 'flex';
            if (window.loggedInEmail) {
                document.getElementById('settings-email').value = window.loggedInEmail;
            }
        });
    }
    
    // Always set nav-user click handler so modal opens
    const navUser = document.getElementById('nav-user');
    if (navUser) {
      navUser.style.cursor = 'pointer';
      navUser.addEventListener('click', function() {
        // Use global email if set, else just open modal
        document.getElementById('user-settings-modal').style.display = 'flex';
        if (window.loggedInEmail) {
          document.getElementById('settings-email').value = window.loggedInEmail;
        }
      });
    }
    // Also ensure initials are pointer
    const navUserInitials = document.getElementById('nav-user-initials');
    if (navUserInitials) navUserInitials.style.cursor = 'pointer';

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Services Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Service Action Button Interactions
    const serviceActionBtns = document.querySelectorAll('.service-action-btn');
    serviceActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceName = this.closest('.service-showcase').querySelector('h3').textContent;
            showNotification(`Interested in ${serviceName}? We'll contact you soon!`, 'success');
            
            // Scroll to contact section
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Enhanced animations for service showcases
    const observeServiceShowcases = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe service showcases for animation
    const serviceShowcases = document.querySelectorAll('.service-showcase');
    serviceShowcases.forEach((showcase, index) => {
        showcase.style.opacity = '0';
        showcase.style.transform = 'translateY(50px)';
        showcase.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observeServiceShowcases.observe(showcase);
    });

    // Hero stats counter animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            
            if (numericValue && numericValue > 0) {
                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue = Math.floor(current);
                    if (isPercentage) displayValue += '%';
                    if (isPlus) displayValue += '+';
                    
                    counter.textContent = displayValue;
                }, 30);
            }
        });
    };

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Product Category Filter
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Product Quick View Modal
    const quickViewBtns = document.querySelectorAll('.btn-overlay');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showQuickViewModal(this);
        });
    });

    // --- Cart Logic ---
    const addToCartBtns = document.querySelectorAll('.btn-cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const badge = document.getElementById('cart-count');
        if (cart.length > 0) {
            badge.textContent = cart.length;
            badge.style.display = 'block';
        } else {
            badge.textContent = '';
            badge.style.display = 'none';
        }
    }
    function updateCartModal() {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        cartItemsDiv.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p style="color:#64748b;text-align:center;">Your cart is empty.</p>';
        } else {
            cart.forEach((item, idx) => {
                total += item.price;
                cartItemsDiv.innerHTML += `<div style='display:flex;align-items:center;gap:12px;margin-bottom:18px;'>
                  <img src='${item.img}' style='width:60px;height:60px;object-fit:cover;border-radius:10px;'>
                  <div style='flex:1;'>
                    <div style='font-weight:600;color:#e5e7eb;'>${item.name}</div>
                   <div style='color:#FFD700;font-weight:700;'>฿${item.price.toLocaleString()}</div>
                  </div>
                  <button data-idx='${idx}' class='cart-remove-btn' style='background:none;border:none;color:#ef4444;font-size:1.3em;cursor:pointer;'><i class='fas fa-trash'></i></button>
                </div>`;
            });
        }
        cartTotalSpan.textContent = 'Total: ฿' + total.toLocaleString();
        // Remove item
        document.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.onclick = function() {
                const idx = this.getAttribute('data-idx');
                cart.splice(idx, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartModal();
            };
        });
    }
    updateCartCount();

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = parseInt(productCard.querySelector('.current-price').textContent.replace(/[^\d]/g, ''));
            const productImg = productCard.querySelector('img').src;
            // Add to cart
            cart.push({ name: productName, price: productPrice, img: productImg });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${productName} added to cart!`);
            // Animation
            this.style.background = '#10b981';
            this.textContent = 'Added!';
            setTimeout(() => {
               this.style.background = '#FFD700';
               this.style.color = '#000';
               this.textContent = 'Add to Cart';
            }, 2000);
        });
    });
    
    // Check if user is logged in and update UI
    function updateUserDisplay() {
        // Optional: demo auth seeding (explicitly gated)
        if (window.__DEMO_AUTH__ === true) {
            if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
                console.log("[DEMO_AUTH] Seeding test user");
                localStorage.setItem('token', 'local-dev-token');
                localStorage.setItem('user', JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com'
                }));
            }
        }
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                const email = user.email || '';
                
                // Make sure these elements exist before trying to manipulate them
                const loginBtn = document.getElementById('nav-login-btn-li');
                const userDisplay = document.getElementById('nav-user');
                
                if (loginBtn) loginBtn.style.display = 'none';
                if (userDisplay) userDisplay.style.display = 'flex';
                
                // Use email to get initials (first and last part before @)
                const emailName = email.split('@')[0];
                let initials = '';
                if (emailName.includes('.')) {
                  const parts = emailName.split('.');
                  initials = (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
                } else if (emailName.length >= 2) {
                  initials = emailName.slice(0,2).toUpperCase();
                } else if (emailName.length === 1) {
                  initials = emailName[0].toUpperCase();
                } else {
                  initials = 'U';
                }
                document.getElementById('nav-user-initials').textContent = initials;
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }
    
    // Call function to update user display
    updateUserDisplay();
    
    // Add logout functionality
    document.getElementById('logout-btn').addEventListener('click', async function(e) {
        e.stopPropagation();
        try {
            const response = await fetch('http://localhost:4000/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Update UI to show logged out state
                document.getElementById('nav-user').style.display = 'none';
                document.getElementById('nav-login-btn-li').style.display = 'block';
                document.getElementById('user-settings-modal').style.display = 'none';
                
                // Clear any stored user data
                window.loggedInEmail = null;
                
                // Show success message
                showNotification('You have been logged out successfully', 'success');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            showNotification('Error logging out. Please try again.', 'error');
        }
    });

    // Removed duplicate event listener code

    // User settings form logic (basic demo)
    document.getElementById('user-settings-form').onsubmit = function(e) {
      e.preventDefault();
      // You can add AJAX here to update details in backend
      document.getElementById('settings-message').style.color = 'green';
      document.getElementById('settings-message').textContent = 'Changes saved!';
      setTimeout(() => { document.getElementById('user-settings-modal').style.display = 'none'; }, 1200);
    };
    // Keep cart on reload
    window.addEventListener('storage', function() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartCount();
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            if (name && email && message) {
                showNotification('Message sent successfully! We\'ll get back to you soon.');
                this.reset();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    // Hero Buttons Functionality
    const exploreBtn = document.querySelector('.btn-primary');
    const demoBtn = document.querySelector('.btn-secondary');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            document.querySelector('#reviews').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (demoBtn) {
        demoBtn.addEventListener('click', function() {
            showDemoModal();
        });
    }

    // Read Review Buttons
    const readReviewBtns = document.querySelectorAll('.review-card .btn-small');
    readReviewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewCard = this.closest('.review-card');
            const productName = reviewCard.querySelector('h3').textContent;
            showReviewModal(productName);
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.review-card, .product-card, .stat-item, .feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.getElementById('cart-icon').addEventListener('click', function() {
        // 确保这里没有阻止点击事件的代码
        console.log('Cart icon clicked');
        // 进一步的处理逻辑
    });
    // Initialize My Bookings UI
    if (typeof createBookingsUI === 'function') {
      try { createBookingsUI(); } catch(_) {}
    }
});

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showQuickViewModal(btn) {
    const productCard = btn.closest('.product-card');
    const productName = productCard.querySelector('h4').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    const productImage = productCard.querySelector('img').src;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; background: white; border-radius: 20px; overflow: hidden;">
            <div class="modal-header" style="padding: 2rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #1e293b;">${productName}</h3>
                <button class="modal-close" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #64748b;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="modal-image">
                    <img src="${productImage}" alt="${productName}" style="width: 100%; border-radius: 10px;">
                </div>
                <div class="modal-info">
                    <div class="modal-rating" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div class="stars" style="color: #fbbf24;">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span style="color: #64748b;">4.5/5 (127 reviews)</span>
                    </div>
                    <div class="modal-price" style="font-size: 2rem; font-weight: 700; color: #FFD700; margin-bottom: 1rem;">${productPrice}</div>
                    <p style="color: #64748b; margin-bottom: 1.5rem; line-height: 1.6;">This is a detailed description of the ${productName}. It features cutting-edge technology and premium build quality that makes it stand out from the competition.</p>
                    <div class="modal-features" style="margin-bottom: 2rem;">
                        <h4 style="margin-bottom: 1rem; color: #1e293b;">Key Features:</h4>
                        <ul style="color: #64748b; padding-left: 1.5rem;">
                            <li>Premium build quality</li>
                            <li>Advanced technology</li>
                            <li>Excellent performance</li>
                            <li>Great value for money</li>
                        </ul>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: 1rem;">
                        <button class="btn-primary modal-cart" style="flex: 1; padding: 1rem; background: #FFD700; color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Add to Cart</button>
                        <button class="btn-secondary modal-wishlist" style="flex: 1; padding: 1rem; background: transparent; color: #FFD700; border: 2px solid #FFD700; border-radius: 8px; font-weight: 600; cursor: pointer;">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    const modalCartBtn = modal.querySelector('.modal-cart');
    modalCartBtn.addEventListener('click', () => {
        showNotification(`${productName} added to cart!`);
        closeModal(modal);
    });
}

function showReviewModal(productName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; background: white; border-radius: 20px; overflow: hidden; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header" style="padding: 2rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #1e293b;">${productName} - Full Review</h3>
                <button class="modal-close" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #64748b;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 2rem;">
                <div class="review-summary" style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; padding: 1.5rem; background: #f8fafc; border-radius: 10px;">
                    <div class="review-score" style="text-align: center;">
                        <span class="score" style="font-size: 3rem; font-weight: 700; color: #FFD700;">4.8</span>
                        <div class="stars" style="color: #fbbf24; margin-top: 0.5rem;">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                    <div class="review-categories" style="flex: 1;">
                        <div class="category" style="margin-bottom: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span style="color: #cbd5e1;">Design</span>
                                <span style="color: #FFD700; font-weight: 600;">9.0</span>
                            </div>
                            <div style="background: #333; height: 6px; border-radius: 3px;">
                                <div style="background: #FFD700; height: 100%; width: 90%; border-radius: 3px;"></div>
                            </div>
                        </div>
                        <div class="category" style="margin-bottom: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span style="color: #cbd5e1;">Performance</span>
                                <span style="color: #FFD700; font-weight: 600;">8.5</span>
                            </div>
                            <div style="background: #333; height: 6px; border-radius: 3px;">
                                <div style="background: #FFD700; height: 100%; width: 85%; border-radius: 3px;"></div>
                            </div>
                        </div>
                        <div class="category">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span style="color: #cbd5e1;">Value</span>
                                <span style="color: #FFD700; font-weight: 600;">8.8</span>
                            </div>
                            <div style="background: #333; height: 6px; border-radius: 3px;">
                                <div style="background: #FFD700; height: 100%; width: 88%; border-radius: 3px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="review-text" style="color: #64748b; line-height: 1.7;">
                    <h4 style="color: #1e293b; margin-bottom: 1rem;">Our Verdict</h4>
                    <p style="margin-bottom: 1.5rem;">The ${productName} represents a significant leap forward in technology and design. Our comprehensive testing reveals a product that not only meets but exceeds expectations in almost every category.</p>
                    
                    <h4 style="color: #1e293b; margin-bottom: 1rem;">Pros</h4>
                    <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
                        <li>Exceptional build quality and premium materials</li>
                        <li>Outstanding performance in real-world scenarios</li>
                        <li>Intuitive user interface and seamless experience</li>
                        <li>Excellent value proposition for the price point</li>
                    </ul>
                    
                    <h4 style="color: #1e293b; margin-bottom: 1rem;">Cons</h4>
                    <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
                        <li>Limited availability in some regions</li>
                        <li>Learning curve for advanced features</li>
                    </ul>
                    
                    <div style="background: #0f0f0f; color:#e5e7eb; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #FFD700;">
                        <h4 style="color: #1e293b; margin-bottom: 0.5rem;">Editor's Note</h4>
                        <p style="margin: 0;">This product has earned our Editor's Choice award for its exceptional combination of innovation, quality, and value. We highly recommend it for both professionals and enthusiasts.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function showDemoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; background: white; border-radius: 20px; overflow: hidden; text-align: center;">
            <div class="modal-header" style="padding: 2rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #1e293b;">Watch Our Demo</h3>
                <button class="modal-close" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #64748b;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 2rem;">
               <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 3rem; border-radius: 10px; color: #FFD700; margin-bottom: 2rem;">
                    <i class="fas fa-play-circle" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <h4 style="margin-bottom: 1rem;">Demo Video Coming Soon!</h4>
                    <p style="opacity: 0.9;">We're preparing an exciting demo video that showcases all the amazing features of Jys_media. Stay tuned!</p>
                </div>
               <button class="btn-primary" onclick="closeModal(this.closest('.modal-overlay'))" style="padding: 1rem 2rem; background: #FFD700; color: #000; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">Got it!</button>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}

// Mobile navigation styles moved to jys-dynamic-styles

// Improved Booking and Support Ticket System
// This function overrides the one defined in the HTML file
window.openBooking = function(service) {
    // Create a new booking request and chat with admin
    initiateSupportTicket(service);
};

async function initiateSupportTicket(service) {
    try {
        // Optional: demo auth seeding (explicitly gated)
        if (window.__DEMO_AUTH__ === true) {
            if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
                console.log("[DEMO_AUTH] Seeding test user for booking");
                localStorage.setItem('token', 'local-dev-token');
                localStorage.setItem('user', JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com'
                }));
            }
        }
        
        // Check login status - ensure both token and user data exist
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (!token || !userStr) {
            showNotification('Please login first to book a consultation.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        // Handle the special case for the featured button
        if (service === undefined) {
            service = 'consulting-plus'; // Default to the featured service
        }
        
        // Pricing data for different services
        const servicePricing = {
            'meta-ads': {
                name: 'Meta Ads Setup',
                basePrice: 299,
                packages: {
                    'basic': { name: 'Basic', multiplier: 1 },
                    'standard': { name: 'Standard', multiplier: 1.5 },
                    'premium': { name: 'Premium', multiplier: 2 }
                },
                durations: {
                    '1': { name: '1 Month', multiplier: 1 },
                    '3': { name: '3 Months', multiplier: 2.7 },
                    '6': { name: '6 Months', multiplier: 5 }
                }
            },
            'seo': {
                name: 'SEO Monthly Plan',
                basePrice: 499,
                packages: {
                    'basic': { name: 'Basic', multiplier: 1 },
                    'standard': { name: 'Standard', multiplier: 1.8 },
                    'premium': { name: 'Premium', multiplier: 2.5 }
                },
                durations: {
                    '1': { name: '1 Month', multiplier: 1 },
                    '3': { name: '3 Months', multiplier: 2.7 },
                    '6': { name: '6 Months', multiplier: 5 }
                }
            },
            'funnels': {
                name: 'Sales Funnel Build',
                basePrice: 799,
                packages: {
                    'basic': { name: 'Basic (1 Funnel)', multiplier: 1 },
                    'standard': { name: 'Standard (2 Funnels)', multiplier: 1.8 },
                    'premium': { name: 'Premium (3 Funnels)', multiplier: 2.5 }
                },
                durations: {
                    '1': { name: 'One-time', multiplier: 1 }
                }
            },
            'consulting': {
                name: 'Sales Consulting',
                basePrice: 199,
                packages: {
                    'basic': { name: 'Basic', multiplier: 1 },
                    'standard': { name: 'Standard', multiplier: 1.5 },
                    'premium': { name: 'Premium', multiplier: 2 }
                },
                durations: {
                    '1': { name: '1 Session', multiplier: 1 },
                    '3': { name: '3 Sessions', multiplier: 2.7 },
                    '5': { name: '5 Sessions', multiplier: 4 }
                }
            },
            'consulting-plus': {
                name: 'Sales Consulting & Deal Closing',
                basePrice: 299,
                packages: {
                    'basic': { name: 'Basic', multiplier: 1 },
                    'standard': { name: 'Standard', multiplier: 1.5 },
                    'premium': { name: 'Premium', multiplier: 2 }
                },
                durations: {
                    '1': { name: '1 Session', multiplier: 1 },
                    '3': { name: '3 Sessions', multiplier: 2.7 },
                    '5': { name: '5 Sessions', multiplier: 4 }
                }
            }
        };
        
        // Default to a generic service if not found
        const serviceData = servicePricing[service] || {
            name: service,
            basePrice: 199,
            packages: {
                'basic': { name: 'Basic', multiplier: 1 }
            },
            durations: {
                '1': { name: '1 Month', multiplier: 1 }
            }
        };
        
        // Show booking form modal
        const overlay = document.createElement('div');
        overlay.className = 'pricing-modal-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(5px);
        `;
        
        // Get user info if available
        let userInfo = {};
        try {
            if (localStorage.getItem('user')) {
                userInfo = JSON.parse(localStorage.getItem('user'));
            } else if (sessionStorage.getItem('user')) {
                userInfo = JSON.parse(sessionStorage.getItem('user'));
            }
        } catch (e) {
            console.error('Error parsing user info:', e);
        }
        
        // Generate package options HTML
        let packageOptionsHTML = '';
        Object.entries(serviceData.packages).forEach(([key, pkg]) => {
            packageOptionsHTML += `
                <div class="chip ${key === 'standard' ? 'active' : ''}" data-package="${key}" data-multiplier="${pkg.multiplier}">
                    ${pkg.name}
                </div>
            `;
        });
        
        // Generate duration options HTML
        let durationOptionsHTML = '';
        Object.entries(serviceData.durations).forEach(([key, duration]) => {
            durationOptionsHTML += `
                <div class="chip ${key === '3' ? 'active' : ''}" data-duration="${key}" data-multiplier="${duration.multiplier}">
                    ${duration.name}
                </div>
            `;
        });
        
        overlay.innerHTML = `
          <div class="pricing-modal">
            <h3 style="margin: 0; padding: 1.5rem; border-bottom: 1px solid #333; font-size: 1.3rem; display: flex; align-items: center; gap: 10px; color: #FFD700;">
              <i class="fas fa-calendar-check"></i> Book ${serviceData.name}
            </h3>
            <div class="booking-form">
              <div class="field">
                <label>Name</label>
                <input type="text" id="booking-name" placeholder="Your name" required value="${userInfo?.name || ''}" />
              </div>
              <div class="field">
                <label>Email</label>
                <input type="email" id="booking-email" placeholder="Your email" required value="${userInfo?.email || ''}" />
              </div>
              <div class="field">
                <label>Phone (optional)</label>
                <input type="tel" id="booking-phone" placeholder="Your phone number" />
              </div>
              <div class="field full-width">
                <label>Package Type</label>
                <div class="chip-group" id="package-options">
                    ${packageOptionsHTML}
                </div>
              </div>
              <div class="field full-width">
                <label>Duration</label>
                <div class="chip-group" id="duration-options">
                    ${durationOptionsHTML}
                </div>
              </div>
              <div class="field full-width">
                <label>Message</label>
                <textarea id="booking-message" placeholder="Tell us about your project" rows="4"></textarea>
              </div>
              <div class="field full-width">
                <label>Service</label>
                <input type="text" id="booking-service" disabled value="${serviceData.name}" />
              </div>
              <div class="estimate-card">
                <div class="estimate-label">Estimated Price</div>
                <div class="estimate-amt" id="price-estimate">$0</div>
                <div class="estimate-note">Final price may vary based on project requirements</div>
              </div>
              <div id="booking-error-message" class="error-message"></div>
            </div>
            <div class="pricing-actions">
              <button class="btn-small-sec" onclick="this.closest('.pricing-modal-overlay').remove()">Cancel</button>
              <button class="btn-small-pri" id="booking-submit">Book Now</button>
            </div>
          </div>`;
        
        document.body.appendChild(overlay);
        
        // Show the modal with animation
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);

        // Price calculation function
        function calculatePrice() {
            const selectedPackage = overlay.querySelector('#package-options .chip.active');
            const selectedDuration = overlay.querySelector('#duration-options .chip.active');
            
            if (!selectedPackage || !selectedDuration) return 0;
            
            const packageMultiplier = parseFloat(selectedPackage.dataset.multiplier);
            const durationMultiplier = parseFloat(selectedDuration.dataset.multiplier);
            const basePrice = serviceData.basePrice;
            
            const totalPrice = Math.round(basePrice * packageMultiplier * durationMultiplier);
            return totalPrice;
        }
        
        // Update displayed price
        function updatePriceDisplay() {
            const priceElement = overlay.querySelector('#price-estimate');
            const totalPrice = calculatePrice();
            priceElement.textContent = '$' + totalPrice.toLocaleString();
        }
        
        // Set initial price
        updatePriceDisplay();
        
        // Add event listeners to package options
        const packageChips = overlay.querySelectorAll('#package-options .chip');
        packageChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class from all chips
                packageChips.forEach(c => c.classList.remove('active'));
                // Add active class to clicked chip
                chip.classList.add('active');
                // Update price
                updatePriceDisplay();
            });
        });
        
        // Add event listeners to duration options
        const durationChips = overlay.querySelectorAll('#duration-options .chip');
        durationChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class from all chips
                durationChips.forEach(c => c.classList.remove('active'));
                // Add active class to clicked chip
                chip.classList.add('active');
                // Update price
                updatePriceDisplay();
            });
        });
        
        // Handle form submission
        const submitBtn = overlay.querySelector('#booking-submit');
        submitBtn.onclick = async () => {
            const name = overlay.querySelector('#booking-name').value.trim();
            const email = overlay.querySelector('#booking-email').value.trim();
            const phone = overlay.querySelector('#booking-phone').value.trim();
            const message = overlay.querySelector('#booking-message').value.trim();
            const selectedPackage = overlay.querySelector('#package-options .chip.active');
            const selectedDuration = overlay.querySelector('#duration-options .chip.active');
            const errorMessage = overlay.querySelector('#booking-error-message');
            
            // Clear previous error
            errorMessage.style.display = 'none';
            
            // Validate form fields
            if (!name) {
                errorMessage.textContent = 'Please enter your name';
                errorMessage.style.display = 'block';
                return;
            }
            
            if (!email) {
                errorMessage.textContent = 'Please enter your email address';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = 'Please enter a valid email address';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Validate package and duration selections
            if (!selectedPackage) {
                errorMessage.textContent = 'Please select a package type';
                errorMessage.style.display = 'block';
                return;
            }
            
            if (!selectedDuration) {
                errorMessage.textContent = 'Please select a duration';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            try {
                // Show inline error instead of alert
                const errorMessage = document.getElementById('booking-error-message');
                errorMessage.style.display = 'none';
                
                let response, data;
                
                // When running locally (file://), create a mock response for testing
                if (window.location.protocol === 'file:') {
                    // Simulate successful response
                    response = {
                        ok: true,
                        json: () => Promise.resolve({
                            id: Math.floor(Math.random() * 10000),
                            success: true
                        })
                    };
                    data = await response.json();
                } else {
                    // Real API call
                    response = await fetch('/api/contacts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            name,
                            email,
                            phone,
                            message,
                            service
                        })
                    });
                    
                    data = await response.json();
                }
                
                if (response.ok) {
                    // Success - close modal with animation
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                        
                        // Persist booking locally
                        try {
                          const __bid = (data && (data.id || data.bookingId || (data.session && data.session.id))) || Date.now();
                          saveBookingToLocal({ id: __bid, name, email, service: productId || service, timestamp: Date.now(), status: 'new' });
                        } catch(_) {}
                        // Show success message with ticket number
                        const successToast = document.createElement('div');
                        successToast.className = 'success-toast';
                        successToast.style.cssText = `
                            position: fixed;
                            bottom: 20px;
                            right: 20px;
                            background: linear-gradient(135deg, #10b981, #059669);
                            color: white;
                            padding: 0;
                            border-radius: 12px;
                            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
                            z-index: 1000;
                            opacity: 1;
                            transition: opacity 0.3s ease;
                        `;
                        
                        successToast.innerHTML = `
                            <div class="success-toast-content" style="display: flex; align-items: center; gap: 12px; padding: 16px 20px;">
                                <i class="fas fa-check-circle" style="font-size: 24px; color: white;"></i>
                                <div>
                                    <div style="font-weight: 700; margin-bottom: 4px;">Booking Confirmed</div>
                                    <span>Ticket #${data.id || '00000'} created. Our team will contact you shortly.</span>
                                </div>
                            </div>
                        `;
                        
                        document.body.appendChild(successToast);
                        
                        // Auto remove toast after 5 seconds
                        setTimeout(() => {
                            successToast.style.opacity = '0';
                            setTimeout(() => successToast.remove(), 300);
                        }, 5000);
                        
                        // Show chat widget after successful booking
                        setTimeout(() => {
                        const __bid = (data && (data.id || data.bookingId || (data.session && data.session.id))) || Date.now();
                        window.__currentBooking = { id: __bid, name, email, service };
                        initiateChatWidget(service);
                        }, 1000);
                    }, 300);
                } else {
                    // Error handling - show inline error
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Book Now';
                    
                    const errorMessage = overlay.querySelector('#booking-error-message');
                    errorMessage.textContent = data.message || 'Failed to submit booking. Please try again.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Booking error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Book Now';
                
                const errorMessage = overlay.querySelector('#booking-error-message');
                errorMessage.textContent = 'Network error. Please try again.';
                errorMessage.style.display = 'block';
            }
        };
        
        // Close on ESC key
        document.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escListener);
            }
        });
        
        // Close on outside click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
    } catch (error) {
        console.error('Error initiating booking:', error);
        showNotification('Failed to open booking form. Please try again.', 'error');
    }
}

// Chat widget for active tickets
function initiateChatWidget(service) {
    const booking = window.__currentBooking || {};
    const bookingId = booking.id != null ? booking.id : null;
    const user = { name: booking.name || 'User', email: booking.email || '', service: booking.service || service };
    // Create floating chat widget
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-widget-header">
            <div class="chat-widget-title">
                <i class="fas fa-comments"></i>
                <span>Support Chat</span>
            </div>
            <div class="chat-widget-actions">
                <button class="chat-widget-minimize"><i class="fas fa-minus"></i></button>
                <button class="chat-widget-close"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="chat-widget-body">
            <div class="chat-widget-messages" id="chat-widget-messages">
                <div class="chat-widget-message received">
                    <div class="message-content">Thanks for your booking! An agent will be with you shortly.</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div class="typing-indicator" id="user-typing-indicator" style="display:none; padding:10px; font-size:12px; color:#9ca3af; font-style:italic;">
                    <i class="fas fa-keyboard"></i> Admin is typing...
                </div>
            </div>
            <div class="chat-widget-input">
                <textarea id="chat-widget-text" placeholder="Type your message..."></textarea>
                <button id="chat-widget-send"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    // Add CSS styles for both chat widget and booking form if not already present
    if (!document.getElementById('jys-dynamic-styles')) {
        const styles = document.createElement('style');
        styles.id = 'jys-dynamic-styles';
        styles.textContent = `
            /* Booking Form Responsive Styles */
            .pricing-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.75);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 1;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(5px);
            }
            
            .pricing-modal {
                background: #0f0f0f;
                border-radius: 12px;
                width: 600px;
                max-width: 95%;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
                overflow: hidden;
            }
            
            .pricing-modal h3 {
                margin: 0;
                padding: 1.5rem;
                border-bottom: 1px solid #333;
                font-size: 1.3rem;
                display: flex;
                align-items: center;
                gap: 10px;
                color: #FFD700;
            }
            
            .booking-form {
                padding: 1.5rem;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .field {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .field.full-width {
                grid-column: 1 / -1;
            }
            
            .field label {
                font-weight: 600;
                color: #cbd5e1;
            }
            
            .field input, .field textarea {
                background: #111;
                border: 1px solid #333;
                color: #e5e7eb;
                padding: 0.75rem;
                border-radius: 8px;
                font-size: 0.95rem;
            }
            
            .field textarea {
                resize: vertical;
            }
            
            .field input:focus, .field textarea:focus {
                outline: none;
                border-color: #FFD700;
            }
            
            .field input:disabled {
                color: #FFD700;
                opacity: 0.8;
            }
            
            .chip-group {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .chip {
                padding: 0.5rem 1rem;
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 25px;
                color: #e5e7eb;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
            }
            
            .chip:hover {
                background: #222;
                transform: translateY(-2px);
            }
            
            .chip.active {
                background: linear-gradient(135deg, #FFD700, #B8860B);
                color: black;
                border: 1px solid #B8860B;
            }
            
            .estimate-card {
                grid-column: 1/-1;
                text-align: center;
            }
            
            .estimate-label {
                font-size: 0.9rem;
                color: #cbd5e1;
                margin-bottom: 0.5rem;
            }
            
            .estimate-amt {
                font-size: 2rem;
                font-weight: 800;
                color: #FFD700;
            }
            
            .estimate-note {
                font-size: 0.8rem;
                color: #9ca3af;
                margin-top: 0.25rem;
            }
            
            .error-message {
                color: #ef4444;
                font-size: 0.9rem;
                grid-column: 1 / -1;
                display: none;
                padding: 0.5rem 0;
            }
            
            .pricing-actions {
                padding: 1.5rem;
                border-top: 1px solid #333;
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
            }
            
            .btn-small-sec {
                background: #1a1a1a;
                border: 1px solid #333;
                color: #e5e7eb;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .btn-small-pri {
                background: linear-gradient(135deg, #FFD700, #B8860B);
                color: black;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                padding: 0.75rem 1.5rem;
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .booking-form {
                    grid-template-columns: 1fr;
                }
                
                .pricing-actions {
                    flex-direction: column;
                    padding: 1rem;
                }
                
                .pricing-actions button {
                    width: 100%;
                    margin-bottom: 0.5rem;
                }
                
                .chip {
                    flex-grow: 1;
                    text-align: center;
                }
            }
            
            /* Touch device improvements */
            @media (pointer: coarse) {
                .chip {
                    padding: 0.75rem 1rem;
                    min-height: 2.5rem;
                }
                
                .booking-form input,
                .booking-form textarea {
                    font-size: 16px !important; /* Prevents iOS zoom on focus */
                }
            }
            
            /* Chat Widget Styles */
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 450px;
                background: #0f0f0f;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                z-index: 12000;
                border: 1px solid #333;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            .chat-widget.minimized {
                height: 60px;
                overflow: hidden;
            }
            .chat-widget-header {
                padding: 12px 16px;
                background: linear-gradient(135deg, #FFD700, #B8860B);
                color: #000;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-widget-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .chat-widget-actions {
                display: flex;
                gap: 8px;
            }
            .chat-widget-actions button {
                background: none;
                border: none;
                color: #000;
                cursor: pointer;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
            }
            .chat-widget-actions button:hover {
                background: rgba(0,0,0,0.1);
            }
            .chat-widget-body {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .chat-widget-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .chat-widget-message {
                max-width: 85%;
                padding: 10px 12px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            .chat-widget-message.sent {
                background: linear-gradient(135deg, #FFD700, #B8860B);
                color: #000;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .chat-widget-message.received {
                background: #1a1a1a;
                color: #e5e7eb;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }
            .message-time {
                font-size: 0.7rem;
                opacity: 0.7;
                margin-top: 4px;
                text-align: right;
            }
            .chat-widget-input {
                padding: 12px;
                border-top: 1px solid #333;
                display: flex;
                gap: 8px;
            }
            .chat-widget-input textarea {
                flex: 1;
                padding: 10px;
                border: 1px solid #333;
                background: #1a1a1a;
                color: #e5e7eb;
                border-radius: 8px;
                resize: none;
                height: 40px;
                font-family: inherit;
                font-size: 0.9rem;
            }
            .chat-widget-input textarea:focus {
                outline: none;
                border-color: #FFD700;
            }
            .chat-widget-input button {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                background: linear-gradient(135deg, #FFD700, #B8860B);
                color: #000;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .chat-widget-input button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255,215,0,0.3);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(chatWidget);

    // WebSocket hookup for live chat using bookingId
    const messagesContainer = chatWidget.querySelector('#chat-widget-messages');
    let ws;
    try {
        ws = new WebSocket('ws://localhost:4000');
        ws.onopen = () => {
            if (bookingId != null) {
                ws.send(JSON.stringify({
                    type: 'auth',
                    role: 'client',
                    sessionId: String(bookingId),
                    name: user.name,
                    email: user.email,
                    service: user.service
                }));
            }
        };
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'chat_message' && data.sender === 'admin' && String(data.bookingId) === String(bookingId)) {
                    const responseEl = document.createElement('div');
                    responseEl.className = 'chat-widget-message received';
                    responseEl.innerHTML = `
                        <div class="message-content">${data.content}</div>
                        <div class="message-time">${new Date(data.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    `;
                    messagesContainer.appendChild(responseEl);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                } else if (data.type === 'typing_indicator' && data.sender === 'admin' && String(data.sessionId) === String(bookingId)) {
                    const typingIndicator = document.getElementById('user-typing-indicator');
                    if (typingIndicator) {
                        if (data.isTyping) {
                            typingIndicator.style.display = 'block';
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        } else {
                            typingIndicator.style.display = 'none';
                        }
                    }
                }
            } catch (_) {}
        };
    } catch (_) {}
    
    // Handle minimize/maximize
    const minimizeBtn = chatWidget.querySelector('.chat-widget-minimize');
    minimizeBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('minimized');
        minimizeBtn.innerHTML = chatWidget.classList.contains('minimized') ?
            '<i class="fas fa-expand"></i>' : '<i class="fas fa-minus"></i>';
    });
    
    // Handle close
    const closeBtn = chatWidget.querySelector('.chat-widget-close');
    closeBtn.addEventListener('click', () => {
        // Smooth fade out animation
        chatWidget.style.opacity = '0';
        setTimeout(() => chatWidget.remove(), 300);
    });
    
    // Handle sending messages
    const sendBtn = chatWidget.querySelector('#chat-widget-send');
    const textArea = chatWidget.querySelector('#chat-widget-text');
    
    function sendMessage() {
        const text = textArea.value.trim();
        if (!text) return;
        
        // Add message to chat
        const messagesContainer = chatWidget.querySelector('#chat-widget-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-widget-message sent';
        messageEl.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear input
        textArea.value = '';
        
        // Send to server via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN && bookingId != null) {
            try {
                ws.send(JSON.stringify({
                    type: 'chat_message',
                    sessionId: String(bookingId),
                    content: text,
                    sender: 'client',
                    name: user.name,
                    email: user.email,
                    service: user.service,
                    timestamp: new Date().toISOString()
                }));
            } catch (e) {
                console.error('WS send error:', e);
            }
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    
    textArea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Add typing indicator functionality for user
    let typingTimer;
    let isTyping = false;
    
    textArea.addEventListener('input', () => {
        if (!isTyping && ws && ws.readyState === WebSocket.OPEN && bookingId != null) {
            isTyping = true;
            // Send typing start indicator
            ws.send(JSON.stringify({
                type: 'typing_indicator',
                sessionId: String(bookingId),
                isTyping: true,
                sender: 'client'
            }));
        }
        
        // Clear existing timer
        clearTimeout(typingTimer);
        
        // Set new timer to stop typing indicator after 1 second of no input
        typingTimer = setTimeout(() => {
            if (isTyping && ws && ws.readyState === WebSocket.OPEN && bookingId != null) {
                isTyping = false;
                // Send typing stop indicator
                ws.send(JSON.stringify({
                    type: 'typing_indicator',
                    sessionId: String(bookingId),
                    isTyping: false,
                    sender: 'client'
                }));
            }
        }, 1000);
    });
}

// Function to send messages to the ticketing system
async function sendToTicketingSystem(message, service) {
    try {
        // Make API call to backend
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                message,
                service,
                type: 'message'
            })
        });
        
        // Handle response
        if (!response.ok) {
            console.error('Failed to send message to ticketing system');
        }
    } catch (error) {
        console.error('Error sending message to ticketing system:', error);
    }
}

// Booking persistence and panel
function getBookings(){
  try { return JSON.parse(localStorage.getItem('bookings')||'[]'); } catch(_) { return []; }
}
function saveBookingToLocal(b){
  const list = getBookings();
  // Deduplicate by id if exists
  const idx = list.findIndex(x => String(x.id) === String(b.id));
  if (idx >= 0) list[idx] = Object.assign({}, list[idx], b);
  else list.unshift(b);
  localStorage.setItem('bookings', JSON.stringify(list));
}
function openBookingsPanel(){
  const list = getBookings();
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(3px);z-index:11000;display:flex;align-items:center;justify-content:center;';
  const panel = document.createElement('div');
  panel.style.cssText = 'width:700px;max-width:95%;max-height:85vh;overflow:auto;background:#0f0f0f;color:#e5e7eb;border:1px solid #333;border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,.35);';
  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid #333;">
      <div style="display:flex;align-items:center;gap:10px;">
        <i class="fas fa-calendar-check" style="color:#FFD700;"></i>
        <strong>My Bookings</strong>
      </div>
      <div style="display:flex;gap:10px;align-items:center;">
        <a href="#home" style="color:#FFD700;text-decoration:none;">Home</a>
        <a href="#services" style="color:#FFD700;text-decoration:none;">Services</a>
        <a href="#about" style="color:#FFD700;text-decoration:none;">About</a>
        <a href="#contact" style="color:#FFD700;text-decoration:none;">Contact</a>
        <button id="mb-close" style="background:none;border:none;color:#9ca3af;font-size:20px;cursor:pointer;">&times;</button>
      </div>
    </div>
    <div style="padding:1rem 1.25rem;">
      ${list.length ? '' : '<div style="color:#9ca3af;">No bookings yet.</div>'}
      ${list.map(b => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid #222;gap:10px;">
          <div>
            <div style="font-weight:700;color:#FFD700;">${(b.service||'Service')}</div>
            <div style="font-size:.9rem;color:#9ca3af;">${new Date(b.timestamp||Date.now()).toLocaleString()}</div>
            <div style="font-size:.85rem;color:#cbd5e1;">${b.name||'User'} • ${b.email||''}</div>
          </div>
          <div style="display:flex;gap:8px;">
            <span class="status-badge ${b.status==='active'?'status-active':'status-new'}">${b.status||'new'}</span>
            <button class="btn-small" data-bid="${b.id}" data-service="${b.service||''}"><i class="fas fa-comments"></i> Open Chat</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) overlay.remove(); });
  const closeBtn = panel.querySelector('#mb-close'); if(closeBtn) closeBtn.onclick = ()=> overlay.remove();
  panel.querySelectorAll('.btn-small[data-bid]').forEach(btn => {
    btn.addEventListener('click', ()=>{
      const bid = btn.getAttribute('data-bid');
      const svc = btn.getAttribute('data-service');
      const list = getBookings();
      const b = list.find(x => String(x.id) === String(bid)) || {};
      window.__currentBooking = { id: bid, name: b.name || 'User', email: b.email || '', service: svc };
      initiateChatWidget(svc || (b && b.service));
      overlay.remove();
    });
  });
}
function createBookingsUI(){
  if (document.getElementById('my-bookings-toggle')) return;
  const btn = document.createElement('button');
  btn.id = 'my-bookings-toggle';
  btn.innerHTML = '<i class="fas fa-calendar-check"></i> My Bookings';
  btn.style.cssText = 'position:fixed;left:20px;bottom:20px;background:linear-gradient(135deg,#FFD700,#B8860B);color:#000;border:none;border-radius:24px;padding:.6rem 1rem;font-weight:700;box-shadow:0 10px 24px rgba(0,0,0,.18);z-index:12000;cursor:pointer;display:flex;align-items:center;gap:8px;';
  btn.addEventListener('click', openBookingsPanel);
  document.body.appendChild(btn);
}
