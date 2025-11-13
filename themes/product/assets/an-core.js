/**
 * AN Theme Core JavaScript
 * Modern, lightweight JavaScript for Attachment Nerd themes
 * Version: 1.0.0
 */

(function () {
  "use strict";

  // Add JS flag as early as possible for CSS fail-open logic
  try {
    document.documentElement.classList.add("an-js");
  } catch (e) {}

  // Feature detection
  const supports = {
    intersectionObserver: "IntersectionObserver" in window,
    customProperties: CSS.supports("color", "var(--fake-var)"),
    smoothScroll: "scrollBehavior" in document.documentElement.style,
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
      countdowns: [],
    },

    /**
     * Initialize all components
     * Modular initialization for better organization and maintainability
     */
    init() {
      this.cacheElements();

      // Compute motion/FX gating once per init
      try {
        this.enableFX =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: no-preference)")
            .matches &&
          window.innerWidth >= 768;
      } catch (e) {
        this.enableFX = window.innerWidth >= 768;
      }

      // Initialize major feature modules
      this.initNavigation(); // Mobile menu and dropdowns
      // Gate heavy animation work behind user preference and viewport size
      this.initAnimations(); // AOS and custom animations
      this.initInteractions(); // Smooth scroll and sticky header
      this.initDynamicContent(); // Countdowns and lazy loading
      this.initAccessibility(); // Accessibility features

      // Initialize marketing features (only outside Kajabi editor)
      if (!window.Kajabi?.theme?.editor) {
        this.initMarketing(); // Exit intent popups
      }

      // Handle hash navigation on page load
      this.handleInitialHash();
    },

    /**
     * Navigation Module
     * Handles mobile menu and dropdown interactions
     */
    initNavigation() {
      this.initMobileMenu();
      this.initDropdowns();
    },

    /**
     * Animations Module
     * Handles AOS library and custom scroll animations
     */
    initAnimations() {
      // Skip animations if FX are disabled
      if (!this.enableFX) return;

      // Check for AOS animations
      const aosElements = document.querySelectorAll("[data-aos]");
      if (aosElements.length) {
        this.loadAOS();
      }

      // Initialize custom animations if AOS not present
      this.initCustomScrollAnimations();
      this.initStaggerAnimations();
    },

    /**
     * Interactions Module
     * Handles user interactions like smooth scrolling and sticky header
     */
    initInteractions() {
      this.initSmoothScroll();
      this.initStickyHeader();
    },

    /**
     * Dynamic Content Module
     * Handles dynamic elements like countdowns and lazy loading
     */
    initDynamicContent() {
      this.initLazyComponents();
    },

    /**
     * Accessibility Module
     * Enhances accessibility features across the theme
     */
    initAccessibility() {
      this.initButtonRoles();
      this.initSkipLinks();
    },

    /**
     * Marketing Module
     * Handles marketing features like exit intent popups
     */
    initMarketing() {
      this.initExitIntent();
    },

    // Cache frequently used elements
    cacheElements() {
      this.elements.header = document.querySelector(".header");
      this.elements.hamburger = document.querySelector(".hamburger");
      this.elements.mobileMenu = document.querySelector(
        ".header__content--mobile"
      );
      this.elements.countdowns = Array.from(
        document.querySelectorAll(".countdown")
      );
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
        hamburger.classList.toggle("hamburger--opened", isOpen);

        // Use CSS transitions instead of jQuery slideToggle
        if (isOpen) {
          mobileMenu.style.display = "block";
          requestAnimationFrame(() => {
            mobileMenu.classList.add("is-open");
          });
        } else {
          mobileMenu.classList.remove("is-open");
          setTimeout(() => {
            if (!isOpen) mobileMenu.style.display = "none";
          }, 300);
        }

        // Handle overlay header
        if (
          header.classList.contains("header--overlay") &&
          window.scrollY === 0
        ) {
          header.classList.toggle("header--fixed", isOpen);
        }
      };

      hamburger.addEventListener("click", toggleMenu);

      // Close on scroll if needed
      if (header.classList.contains("header--close-on-scroll")) {
        let scrolling = false;
        window.addEventListener(
          "scroll",
          () => {
            if (!scrolling && isOpen) {
              scrolling = true;
              requestAnimationFrame(() => {
                toggleMenu();
                scrolling = false;
              });
            }
          },
          { passive: true }
        );
      }

      // Handle responsive layout changes
      const mediaQuery = window.matchMedia("(min-width: 768px)");
      const handleResize = (e) => {
        const switchContent = document.querySelector(".header__switch-content");
        const logoBlock = document.querySelector(".header__block--logo");
        const cartBlock = document.querySelector(".header__block--cart");
        const headerContainer = document.querySelector(".header__container");

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
            hamburger.classList.add("mobile-cart-header--hamburger");
            logoBlock?.classList.add("mobile-cart-header--logo");
            cartBlock.classList.add("mobile-cart-header--cart");
          }
        } else {
          // Desktop layout
          if (switchContent && headerContainer) {
            headerContainer.prepend(switchContent);
          }
          // Remove mobile cart classes
          if (cartBlock) {
            hamburger.classList.remove("mobile-cart-header--hamburger");
            logoBlock?.classList.remove("mobile-cart-header--logo");
            cartBlock.classList.remove("mobile-cart-header--cart");
          }
          // Close mobile menu if open
          if (isOpen) toggleMenu();
        }
      };

      mediaQuery.addEventListener("change", handleResize);
      handleResize(mediaQuery);
    },

    /**
     * Sticky Header Handler
     */
    initStickyHeader() {
      const { header } = this.elements;
      if (!header || !header.classList.contains("sticky")) return;

      let lastScroll = 0;
      let ticking = false;
      let headerHeight = null;

      const updateHeader = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 0) {
          // Cache header height before adding class to avoid forced reflow
          if (headerHeight === null) {
            headerHeight = header.offsetHeight;
          }

          header.classList.add("header--fixed");

          // Add padding to main for static headers
          if (header.classList.contains("header--static")) {
            document.querySelector("main").style.paddingTop = `${headerHeight}px`;
          }
        } else {
          header.classList.remove("header--fixed");

          if (header.classList.contains("header--static")) {
            document.querySelector("main").style.paddingTop = "0";
          }
        }

        lastScroll = currentScroll;
        ticking = false;
      };

      // Recalculate header height on resize
      window.addEventListener("resize", () => {
        headerHeight = null;
      }, { passive: true });

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
          }
        },
        { passive: true }
      );
    },

    /**
     * Dropdown Handler with Event Delegation
     */
    initDropdowns() {
      let openDropdown = null;

      const closeDropdown = (dropdown) => {
        dropdown.classList.remove("dropdown--open");
        dropdown.dataset.isOpen = "false";
        const icon = dropdown.querySelector(".dropdown__icon");
        if (icon) icon.style.transform = "rotate(0deg)";
      };

      const openDropdownMenu = (dropdown, trigger) => {
        dropdown.dataset.isOpen = "true";
        dropdown.classList.add("dropdown--open");
        const icon = dropdown.querySelector(".dropdown__icon");
        if (icon) icon.style.transform = "rotate(180deg)";

        // Position dropdown menu
        const menu = dropdown.querySelector(".dropdown__menu");
        if (!menu) return;

        // Use requestAnimationFrame to batch layout reads after DOM writes
        // This prevents forced reflow by allowing the browser to paint first
        requestAnimationFrame(() => {
          // Batch all layout reads together
          const menuRect = menu.getBoundingClientRect();
          const triggerRect = trigger.getBoundingClientRect();
          const viewportWidth = window.innerWidth;

          // Reset classes (DOM write)
          menu.className = "dropdown__menu";

          // Store original alignment if not already stored
          if (!dropdown.dataset.originalClass) {
            ["text-left", "text-center", "text-right"].forEach((align) => {
              if (menu.classList.contains(`dropdown__menu--${align}`)) {
                dropdown.dataset.originalClass = `dropdown__menu--${align}`;
              }
            });
          }

          // Batch all DOM writes together based on read values
          if (menuRect.right > viewportWidth) {
            menu.classList.add("dropdown__menu--text-right");
            menu.style.left = "auto";
          } else if (menuRect.left < 0) {
            menu.classList.add("dropdown__menu--text-left");
            menu.style.left = "auto";
          } else if (dropdown.dataset.originalClass) {
            menu.classList.add(dropdown.dataset.originalClass);
            if (
              dropdown.dataset.originalClass === "dropdown__menu--text-center"
            ) {
              const offset = triggerRect.width / 2 - menuRect.width / 2;
              menu.style.left = `${offset}px`;
            }
          }
        });
      };

      // Single delegated event listener for all dropdowns
      document.addEventListener("click", (e) => {
        const trigger = e.target.closest(".dropdown__trigger");

        if (!trigger) {
          // If click is outside any dropdown, close the open one
          if (openDropdown) {
            closeDropdown(openDropdown);
            openDropdown = null;
          }
          return;
        }

        e.stopPropagation();
        const dropdown = trigger.closest(".dropdown");
        if (!dropdown) return;

        // Close other dropdowns
        if (openDropdown && openDropdown !== dropdown) {
          closeDropdown(openDropdown);
        }

        // Toggle current dropdown
        if (dropdown.dataset.isOpen === "true") {
          closeDropdown(dropdown);
          openDropdown = null;
        } else {
          openDropdownMenu(dropdown, trigger);
          openDropdown = dropdown;
        }
      });

      // Close dropdowns on resize
      window.addEventListener("resize", () => {
        if (openDropdown) {
          closeDropdown(openDropdown);
          openDropdown = null;
        }
      });
    },

    /**
     * Handle initial page load with hash in URL
     */
    handleInitialHash() {
      if (!window.location.hash || window.location.hash.length <= 1) return;

      // Wait for DOM to be fully loaded
      setTimeout(() => {
        const hash = window.location.hash;
        let target = document.querySelector(hash);

        // If exact match not found, try multiple strategies
        if (!target && hash.length > 1) {
          const baseId = hash.substring(1); // Remove the #

          // Strategy 1: Look for sections with ID starting with the base ID
          target = document.querySelector(`[id^="${baseId}-"]`);

          // Strategy 2: Look for sections where section_id setting matches
          if (!target) {
            target = document.querySelector(`[id*="${baseId}"]`);
          }

          // Strategy 3: Look for data attributes
          if (!target) {
            target = document.querySelector(`[data-section-id="${baseId}"]`);
          }
        }

        if (target) {
          // Use requestAnimationFrame to batch layout reads
          requestAnimationFrame(() => {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    },

    /**
     * Smooth Scroll Handler
     */
    initSmoothScroll() {
      // Handle all anchor links, regardless of native support
      // This ensures Kajabi's dynamic section IDs work properly
      document.addEventListener("click", (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute("href");
        if (
          targetId === "#" ||
          targetId === "#two-step" ||
          targetId === "#next-pipeline-step"
        )
          return;

        let target = document.querySelector(targetId);

        // If exact match not found, try multiple strategies
        if (!target && targetId.length > 1) {
          const baseId = targetId.substring(1); // Remove the #

          // Strategy 1: Look for sections with ID starting with the base ID
          target = document.querySelector(`[id^="${baseId}-"]`);

          // Strategy 2: Look for sections with data-section-id attribute
          if (!target) {
            target = document.querySelector(`[data-section-id="${baseId}"]`);
          }

          // Strategy 3: Look for sections where id contains the base ID
          if (!target) {
            // This will match things like "hero-video-abc123" when searching for "hero-video"
            const allSections = document.querySelectorAll('[id*="-"]');
            for (let section of allSections) {
              if (section.id.startsWith(baseId + '-')) {
                target = section;
                break;
              }
            }
          }

          // Strategy 4: Look for data-anchor attribute
          if (!target) {
            target = document.querySelector(`[data-anchor="${baseId}"]`);
          }

          // Strategy 5: Case-insensitive search
          if (!target) {
            const lowerBaseId = baseId.toLowerCase();
            const allElements = document.querySelectorAll('[id]');
            for (let element of allElements) {
              if (element.id.toLowerCase().startsWith(lowerBaseId)) {
                target = element;
                break;
              }
            }
          }
        }

        if (!target) {
          // Debug mode: Log helpful information
          if (window.location.hostname === 'localhost' || window.anDebugScroll) {
            console.warn(`Anchor target not found: ${targetId}`);
            console.log('Available section IDs:');
            document.querySelectorAll('section[id]').forEach(section => {
              console.log(`  - #${section.id}`);
              if (section.dataset.sectionId) {
                console.log(`    (data-section-id: ${section.dataset.sectionId})`);
              }
              if (section.dataset.anchor) {
                console.log(`    (data-anchor: ${section.dataset.anchor})`);
              }
            });
          }
          // If target doesn't exist, let the browser handle it normally
          // This allows navigation to sections that may not be loaded yet
          return;
        }

        e.preventDefault();

        // Use requestAnimationFrame to batch layout reads and prevent forced reflow
        requestAnimationFrame(() => {
          // Batch all layout reads together
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition =
            target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

          // Use native smooth scroll if available, otherwise use custom animation
          if (supports.smoothScroll) {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          } else {
            // Custom smooth scroll animation for older browsers
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
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            };

            requestAnimationFrame(animation);
          }
        });
      });

      // Handle hash on page load
      if (window.location.hash) {
        setTimeout(() => {
          const hash = window.location.hash;
          const link = document.createElement('a');
          link.href = hash;
          link.click();
        }, 100); // Small delay to ensure DOM is ready
      }
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
      const aosElements = document.querySelectorAll("[data-aos]");
      if (this.enableFX && aosElements.length) {
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
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display
        const daysEl = element.querySelector(".days");
        const hoursEl = element.querySelector(".hours");
        const minutesEl = element.querySelector(".minutes");
        const secondsEl = element.querySelector(".seconds");

        if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

        return true;
      };

      this.elements.countdowns.forEach((countdown) => {
        const event = countdown.closest(".event");
        if (!event) return;

        const eventTime = event.dataset.eventTime;
        if (!eventTime) return;

        // Parse offset if any
        const offsetNumber = parseInt(event.dataset.offsetNumber) || 0;
        const offsetPeriod = event.dataset.offsetPeriod || "seconds";

        // Calculate target time (basic offset calculation)
        let targetTime = new Date(eventTime).getTime();
        const offsetMs = {
          seconds: offsetNumber * 1000,
          minutes: offsetNumber * 60 * 1000,
          hours: offsetNumber * 60 * 60 * 1000,
          days: offsetNumber * 24 * 60 * 60 * 1000,
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
      const useEndAction = element.dataset.endActionUse === "true";
      const endAction = element.dataset.endAction;
      const removeSection = element.dataset.removeSectionOnComplete === "true";

      if (!window.Kajabi?.theme?.editor) {
        if (useEndAction && endAction) {
          if (
            endAction === "#next-pipeline-step" &&
            window.Kajabi?.nextPipelineStepUrl
          ) {
            window.location = window.Kajabi.nextPipelineStepUrl;
          } else {
            window.location.href = endAction;
          }
        }

        if (removeSection) {
          const section = element.closest(".section");
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
      // Do not load AOS assets if FX are disabled
      if (!this.enableFX) return;
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!window.AOS) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
        script.onload = () => {
          window.AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            // Disable on mobile or when user prefers reduced motion
            disable:
              window.innerWidth < 768 || prefersReducedMotion ? true : false,
          });
        };
        document.head.appendChild(script);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/aos@2.3.1/dist/aos.css";
        document.head.appendChild(link);
      } else {
        window.AOS.refresh();
      }
    },

    /**
     * Exit Intent Handler
     */
    initExitIntent() {
      const exitPop = document.querySelector(".exit-pop");
      if (!exitPop) return;

      const isPreview = window.Kajabi?.theme?.previewThemeId;
      const cookieExpire = parseInt(exitPop.dataset.cookieExpire) || 0;
      const timedReveal = parseInt(exitPop.dataset.timedReveal) || 0;

      // Simple exit intent without ouibounce library
      let shown = false;

      const showModal = () => {
        if (shown) return;
        shown = true;

        exitPop.classList.add("modal--open");
        document.documentElement.classList.add("stop-scroll--html");
        document.body.classList.add("stop-scroll--body");
      };

      const hideModal = () => {
        exitPop.classList.remove("modal--open");
        document.documentElement.classList.remove("stop-scroll--html");
        document.body.classList.remove("stop-scroll--body");
      };

      // Close handlers
      exitPop.addEventListener("click", hideModal);
      const closeBtn = exitPop.querySelector(".close-x");
      if (closeBtn) closeBtn.addEventListener("click", hideModal);

      const content = exitPop.querySelector(".modal__content");
      if (content) {
        content.addEventListener("click", (e) => e.stopPropagation());
      }

      // Exit intent detection
      if (!isPreview && cookieExpire > 0) {
        // Check cookie
        const cookieName = "an_exit_shown";
        if (document.cookie.includes(cookieName)) return;
      }

      // Mouse leave detection
      document.addEventListener("mouseleave", (e) => {
        if (e.clientY <= 0) showModal();
      });

      // Timed reveal
      if (timedReveal > 0) {
        setTimeout(showModal, timedReveal * 1000);
      }
    },

    /**
     * Custom Scroll Animation System (Fallback when AOS isn't used)
     * Provides lightweight scroll-triggered animations
     */
    initCustomScrollAnimations() {
      if (!supports.intersectionObserver) return;

      // Check if AOS is already handling animations
      if (window.AOS || document.querySelectorAll("[data-aos]").length > 0)
        return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      // Find elements with animation classes
      const animatedElements = document.querySelectorAll(
        ".animate-fade-up, .animate-fade-in, .animate-fade-left, .animate-fade-right, .animate-scale-in, .animate-bounce-in, .animate-rotate-in, .animate-slide-up"
      );

      if (animatedElements.length === 0) return;

      // Add initial state (invisible)
      animatedElements.forEach((el) => {
        if (!el.classList.contains("animate-on-scroll")) {
          el.classList.add("animate-on-scroll");
        }
      });

      // Create intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              // Remove observer once animated
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      // Observe all animated elements
      animatedElements.forEach((el) => observer.observe(el));
    },

    /**
     * Stagger Animation Helper
     * Adds animation delays to create staggered effect
     */
    initStaggerAnimations() {
      document.querySelectorAll(".stagger-group").forEach((group) => {
        const children = Array.from(group.children);
        children.forEach((child, index) => {
          if (!child.style.animationDelay) {
            child.style.animationDelay = `${(index + 1) * 0.05}s`;
          }
        });
      });

      document.querySelectorAll(".stagger-group-reverse").forEach((group) => {
        const children = Array.from(group.children);
        children.forEach((child, index) => {
          if (!child.style.animationDelay) {
            child.style.animationDelay = `${(children.length - index) * 0.05}s`;
          }
        });
      });
    },

    /**
     * Initialize button role accessibility
     * Makes links with role="button" behave like buttons
     */
    initButtonRoles() {
      document.querySelectorAll('a[role="button"]').forEach((link) => {
        // Add tabindex if not present
        if (!link.hasAttribute("tabindex")) {
          link.setAttribute("tabindex", "0");
        }

        // Handle space key like a button
        link.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            link.click();
          }
        });
      });
    },

    /**
     * Initialize skip links for accessibility
     * Adds skip to content link if not present
     */
    initSkipLinks() {
      if (!document.querySelector(".skip-to-content")) {
        const skipLink = document.createElement("a");
        skipLink.href = "#main-content";
        skipLink.className = "skip-to-content";
        skipLink.textContent = "Skip to main content";
        document.body.insertBefore(skipLink, document.body.firstChild);
      }
    },
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ANTheme.init());
  } else {
    ANTheme.init();
  }

  // Handle Kajabi section reloads
  window.addEventListener("section:reload", () => {
    ANTheme.init();
  });

  // Export for use in other scripts
  window.ANTheme = ANTheme;

  // Add global scrollToSection helper
  window.scrollToSection = function(sectionId) {
    // Remove # if present
    const cleanId = sectionId.replace('#', '');

    // Create a temporary anchor and trigger click
    const tempLink = document.createElement('a');
    tempLink.href = '#' + cleanId;
    tempLink.click();
  };

  // Initialize animations on window load (for elements that might be added later)
  window.addEventListener("load", () => {
    ANTheme.initAnimations();

    // In Kajabi editor/preview, force AOS-visible to avoid blank sections
    const inEditor =
      location.search.includes("preview") ||
      !!document.querySelector(
        "[data-kajabi-theme-editor],[data-builder],[data-editor]"
      ) ||
      (function () {
        try {
          return window.top !== window.self;
        } catch (e) {
          return true;
        }
      })();

    if (inEditor) {
      document.querySelectorAll("[data-aos]").forEach((el) => {
        el.classList.add("aos-animate");
      });
    } else {
      // Timer fallback in case IO/AOS is blocked
      setTimeout(() => {
        document
          .querySelectorAll("[data-aos]:not(.aos-animate)")
          .forEach((el) => el.classList.add("aos-animate"));
      }, 1600);
    }
  });

  // Re-initialize on Kajabi section reloads
  window.addEventListener("section:reload", () => {
    setTimeout(() => {
      ANTheme.initAnimations();
    }, 100);
  });
})();
