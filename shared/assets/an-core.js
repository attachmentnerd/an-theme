/**
 * AN Theme Core JavaScript
 * Modern, lightweight JavaScript for Attachment Nerd themes
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Feature detection
  const supports = {
    intersectionObserver: 'IntersectionObserver' in window,
    customProperties: CSS.supports('color', 'var(--fake-var)'),
    smoothScroll: 'scrollBehavior' in document.documentElement.style
  };

  /**
   * Core AN Theme functionality
   */
  const ANTheme = {
    // Cache DOM elements
    elements: {
      header: null,
      hamburger: null,
      mobileMenu: null,
      dropdowns: [],
      countdowns: []
    },

    // Initialize all components
    init() {
      this.cacheElements();
      this.initMobileMenu();
      this.initStickyHeader();
      this.initDropdowns();
      this.initSmoothScroll();
      this.initLazyComponents();
      
      // Kajabi editor check
      if (!window.Kajabi?.theme?.editor) {
        this.initExitIntent();
      }
    },

    // Cache frequently used elements
    cacheElements() {
      this.elements.header = document.querySelector('.header');
      this.elements.hamburger = document.querySelector('.hamburger');
      this.elements.mobileMenu = document.querySelector('.header__content--mobile');
      this.elements.dropdowns = Array.from(document.querySelectorAll('.dropdown'));
      this.elements.countdowns = Array.from(document.querySelectorAll('.countdown'));
    },

    /**
     * Mobile Menu Handler
     */
    initMobileMenu() {
      const { hamburger, mobileMenu, header } = this.elements;
      if (!hamburger || !mobileMenu) return;

      let isOpen = false;

      const toggleMenu = () => {
        isOpen = !isOpen;
        hamburger.classList.toggle('hamburger--opened', isOpen);
        
        // Use CSS transitions instead of jQuery slideToggle
        if (isOpen) {
          mobileMenu.style.display = 'block';
          requestAnimationFrame(() => {
            mobileMenu.classList.add('is-open');
          });
        } else {
          mobileMenu.classList.remove('is-open');
          setTimeout(() => {
            if (!isOpen) mobileMenu.style.display = 'none';
          }, 300);
        }

        // Handle overlay header
        if (header.classList.contains('header--overlay') && window.scrollY === 0) {
          header.classList.toggle('header--fixed', isOpen);
        }
      };

      hamburger.addEventListener('click', toggleMenu);

      // Close on scroll if needed
      if (header.classList.contains('header--close-on-scroll')) {
        let scrolling = false;
        window.addEventListener('scroll', () => {
          if (!scrolling && isOpen) {
            scrolling = true;
            requestAnimationFrame(() => {
              toggleMenu();
              scrolling = false;
            });
          }
        }, { passive: true });
      }

      // Handle responsive layout changes
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      const handleResize = (e) => {
        const switchContent = document.querySelector('.header__switch-content');
        const logoBlock = document.querySelector('.header__block--logo');
        const cartBlock = document.querySelector('.header__block--cart');
        const headerContainer = document.querySelector('.header__container');

        if (!e.matches) {
          // Mobile layout
          if (switchContent && mobileMenu) {
            mobileMenu.prepend(switchContent);
          }
          if (logoBlock && headerContainer) {
            headerContainer.prepend(logoBlock);
          }
          // Add mobile cart classes
          if (cartBlock) {
            hamburger.classList.add('mobile-cart-header--hamburger');
            logoBlock?.classList.add('mobile-cart-header--logo');
            cartBlock.classList.add('mobile-cart-header--cart');
          }
        } else {
          // Desktop layout
          if (switchContent && headerContainer) {
            headerContainer.prepend(switchContent);
          }
          // Remove mobile cart classes
          if (cartBlock) {
            hamburger.classList.remove('mobile-cart-header--hamburger');
            logoBlock?.classList.remove('mobile-cart-header--logo');
            cartBlock.classList.remove('mobile-cart-header--cart');
          }
          // Close mobile menu if open
          if (isOpen) toggleMenu();
        }
      };

      mediaQuery.addEventListener('change', handleResize);
      handleResize(mediaQuery);
    },

    /**
     * Sticky Header Handler
     */
    initStickyHeader() {
      const { header } = this.elements;
      if (!header || !header.classList.contains('sticky')) return;

      let lastScroll = 0;
      let ticking = false;

      const updateHeader = () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 0) {
          header.classList.add('header--fixed');
          
          // Add padding to main for static headers
          if (header.classList.contains('header--static')) {
            document.querySelector('main').style.paddingTop = `${header.offsetHeight}px`;
          }
        } else {
          header.classList.remove('header--fixed');
          
          if (header.classList.contains('header--static')) {
            document.querySelector('main').style.paddingTop = '0';
          }
        }

        lastScroll = currentScroll;
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      }, { passive: true });
    },

    /**
     * Dropdown Handler
     */
    initDropdowns() {
      const { dropdowns } = this.elements;
      if (!dropdowns.length) return;

      let openDropdown = null;

      const closeDropdown = (dropdown) => {
        dropdown.classList.remove('dropdown--open');
        dropdown.dataset.isOpen = 'false';
        const icon = dropdown.querySelector('.dropdown__icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
      };

      const openDropdownMenu = (dropdown, trigger) => {
        dropdown.dataset.isOpen = 'true';
        dropdown.classList.add('dropdown--open');
        const icon = dropdown.querySelector('.dropdown__icon');
        if (icon) icon.style.transform = 'rotate(180deg)';

        // Position dropdown menu
        const menu = dropdown.querySelector('.dropdown__menu');
        if (!menu) return;

        const menuRect = menu.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();

        // Reset classes
        menu.className = 'dropdown__menu';

        // Check if menu would overflow viewport
        if (menuRect.right > window.innerWidth) {
          menu.classList.add('dropdown__menu--text-right');
          menu.style.left = 'auto';
        } else if (menuRect.left < 0) {
          menu.classList.add('dropdown__menu--text-left');
          menu.style.left = 'auto';
        } else if (dropdown.dataset.originalClass) {
          menu.classList.add(dropdown.dataset.originalClass);
          if (dropdown.dataset.originalClass === 'dropdown__menu--text-center') {
            const offset = (triggerRect.width / 2) - (menuRect.width / 2);
            menu.style.left = `${offset}px`;
          }
        }
      };

      // Handle dropdown triggers
      dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown__trigger');
        if (!trigger) return;

        // Store original alignment
        const menu = dropdown.querySelector('.dropdown__menu');
        if (menu) {
          ['text-left', 'text-center', 'text-right'].forEach(align => {
            if (menu.classList.contains(`dropdown__menu--${align}`)) {
              dropdown.dataset.originalClass = `dropdown__menu--${align}`;
            }
          });
        }

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();

          // Close other dropdowns
          if (openDropdown && openDropdown !== dropdown) {
            closeDropdown(openDropdown);
          }

          // Toggle current dropdown
          if (dropdown.dataset.isOpen === 'true') {
            closeDropdown(dropdown);
            openDropdown = null;
          } else {
            openDropdownMenu(dropdown, trigger);
            openDropdown = dropdown;
          }
        });
      });

      // Close dropdowns on outside click or resize
      document.addEventListener('click', () => {
        if (openDropdown) {
          closeDropdown(openDropdown);
          openDropdown = null;
        }
      });

      window.addEventListener('resize', () => {
        if (openDropdown) {
          closeDropdown(openDropdown);
          openDropdown = null;
        }
      });
    },

    /**
     * Smooth Scroll Handler
     */
    initSmoothScroll() {
      // Only init if not natively supported
      if (supports.smoothScroll) return;

      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (targetId === '#' || targetId === '#two-step' || targetId === '#next-pipeline-step') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 500;
        let start = null;

        const animation = (currentTime) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const ease = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
      });
    },

    /**
     * Lazy Component Loading
     */
    initLazyComponents() {
      // Load components only when needed
      if (this.elements.countdowns.length) {
        this.loadCountdowns();
      }


      // Check for AOS animations
      const aosElements = document.querySelectorAll('[data-aos]');
      if (aosElements.length) {
        this.loadAOS();
      }
    },

    /**
     * Load Countdown Functionality
     */
    loadCountdowns() {
      // Lightweight countdown without moment.js
      const updateCountdown = (element, targetTime) => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          // Handle countdown end
          this.handleCountdownEnd(element);
          return false;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display
        const daysEl = element.querySelector('.days');
        const hoursEl = element.querySelector('.hours');
        const minutesEl = element.querySelector('.minutes');
        const secondsEl = element.querySelector('.seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        return true;
      };

      this.elements.countdowns.forEach(countdown => {
        const event = countdown.closest('.event');
        if (!event) return;

        const eventTime = event.dataset.eventTime;
        if (!eventTime) return;

        // Parse offset if any
        const offsetNumber = parseInt(event.dataset.offsetNumber) || 0;
        const offsetPeriod = event.dataset.offsetPeriod || 'seconds';

        // Calculate target time (basic offset calculation)
        let targetTime = new Date(eventTime).getTime();
        const offsetMs = {
          seconds: offsetNumber * 1000,
          minutes: offsetNumber * 60 * 1000,
          hours: offsetNumber * 60 * 60 * 1000,
          days: offsetNumber * 24 * 60 * 60 * 1000
        };
        targetTime += offsetMs[offsetPeriod] || 0;

        // Initial update
        updateCountdown(countdown, targetTime);

        // Update every second
        const interval = setInterval(() => {
          if (!updateCountdown(countdown, targetTime)) {
            clearInterval(interval);
          }
        }, 1000);
      });
    },

    /**
     * Handle Countdown End
     */
    handleCountdownEnd(element) {
      const useEndAction = element.dataset.endActionUse === 'true';
      const endAction = element.dataset.endAction;
      const removeSection = element.dataset.removeSectionOnComplete === 'true';

      if (!window.Kajabi?.theme?.editor) {
        if (useEndAction && endAction) {
          if (endAction === '#next-pipeline-step' && window.Kajabi?.nextPipelineStepUrl) {
            window.location = window.Kajabi.nextPipelineStepUrl;
          } else {
            window.location.href = endAction;
          }
        }

        if (removeSection) {
          const section = element.closest('.section');
          if (section && section.parentElement) {
            section.parentElement.remove();
          }
        }
      }
    },


    /**
     * Load AOS (Animate On Scroll)
     */
    loadAOS() {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!window.AOS) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        script.onload = () => {
          window.AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            // Disable on mobile or when user prefers reduced motion
            disable: window.innerWidth < 768 || prefersReducedMotion ? true : false
          });
        };
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        document.head.appendChild(link);
      } else {
        window.AOS.refresh();
      }
    },

    /**
     * Exit Intent Handler
     */
    initExitIntent() {
      const exitPop = document.querySelector('.exit-pop');
      if (!exitPop) return;

      const isPreview = window.Kajabi?.theme?.previewThemeId;
      const cookieExpire = parseInt(exitPop.dataset.cookieExpire) || 0;
      const timedReveal = parseInt(exitPop.dataset.timedReveal) || 0;

      // Simple exit intent without ouibounce library
      let shown = false;
      
      const showModal = () => {
        if (shown) return;
        shown = true;
        
        exitPop.classList.add('modal--open');
        document.documentElement.classList.add('stop-scroll--html');
        document.body.classList.add('stop-scroll--body');
      };

      const hideModal = () => {
        exitPop.classList.remove('modal--open');
        document.documentElement.classList.remove('stop-scroll--html');
        document.body.classList.remove('stop-scroll--body');
      };

      // Close handlers
      exitPop.addEventListener('click', hideModal);
      const closeBtn = exitPop.querySelector('.close-x');
      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      
      const content = exitPop.querySelector('.modal__content');
      if (content) {
        content.addEventListener('click', (e) => e.stopPropagation());
      }

      // Exit intent detection
      if (!isPreview && cookieExpire > 0) {
        // Check cookie
        const cookieName = 'an_exit_shown';
        if (document.cookie.includes(cookieName)) return;
      }

      // Mouse leave detection
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) showModal();
      });

      // Timed reveal
      if (timedReveal > 0) {
        setTimeout(showModal, timedReveal * 1000);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ANTheme.init());
  } else {
    ANTheme.init();
  }

  // Handle Kajabi section reloads
  window.addEventListener('section:reload', () => {
    ANTheme.init();
  });

  // Export for use in other scripts
  window.ANTheme = ANTheme;

  /**
   * Accessibility Enhancements
   */
  // Make links with role="button" behave like buttons
  document.querySelectorAll('a[role="button"]').forEach(link => {
    // Add tabindex if not present
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    
    // Handle space key like a button
    link.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        link.click();
      }
    });
  });

  // Add skip to content link if not present
  if (!document.querySelector('.skip-to-content')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Custom Scroll Animation System (Fallback when AOS isn't used)
   */
  const initCustomScrollAnimations = () => {
    if (!supports.intersectionObserver) return;
    
    // Check if AOS is already handling animations
    if (window.AOS || document.querySelectorAll('[data-aos]').length > 0) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Find elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-fade-left, .animate-fade-right, .animate-scale-in, .animate-bounce-in, .animate-rotate-in, .animate-slide-up');
    
    if (animatedElements.length === 0) return;
    
    // Add initial state (invisible)
    animatedElements.forEach(el => {
      if (!el.classList.contains('animate-on-scroll')) {
        el.classList.add('animate-on-scroll');
      }
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Remove observer once animated
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));
  };

  /**
   * Stagger Animation Helper
   */
  const initStaggerAnimations = () => {
    document.querySelectorAll('.stagger-group').forEach(group => {
      const children = Array.from(group.children);
      children.forEach((child, index) => {
        if (!child.style.animationDelay) {
          child.style.animationDelay = `${(index + 1) * 0.05}s`;
        }
      });
    });
    
    document.querySelectorAll('.stagger-group-reverse').forEach(group => {
      const children = Array.from(group.children);
      children.forEach((child, index) => {
        if (!child.style.animationDelay) {
          child.style.animationDelay = `${(children.length - index) * 0.05}s`;
        }
      });
    });
  };

  // Initialize scroll animations and stagger on load
  window.addEventListener('load', () => {
    initCustomScrollAnimations();
    initStaggerAnimations();
  });

  // Re-initialize on Kajabi section reloads
  window.addEventListener('section:reload', () => {
    setTimeout(() => {
      initCustomScrollAnimations();
      initStaggerAnimations();
    }, 100);
  });

})();