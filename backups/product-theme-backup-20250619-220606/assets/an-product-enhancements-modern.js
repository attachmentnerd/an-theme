/* ==========================================================================
   AN Product Theme - Modern Experience Enhancements (No jQuery)
   Version: 2.0.0
   ========================================================================== */

(function() {
  'use strict';

  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Helper functions
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);
  
  // Animate helper
  function animate(element, property, start, end, duration, callback) {
    const startTime = performance.now();
    const diff = end - start;
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOut
      
      element.style[property] = start + (diff * easeProgress) + (property === 'width' ? '%' : 'px');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (callback) {
        callback();
      }
    }
    
    requestAnimationFrame(update);
  }

  // 1. Enhanced Navigation Experience
  function enhanceNavigation() {
    const currentPath = window.location.pathname;
    
    // Add active states
    $$('.header .link-list__link').forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
        link.classList.add('active');
        link.style.color = 'var(--an-teal)';
        link.style.background = 'var(--an-peach)';
      }
    });
    
    // Smooth scroll for anchor links
    $$('a[href^="#"]').forEach(link => {
      if (link.getAttribute('href') !== '#') {
        link.addEventListener('click', e => {
          e.preventDefault();
          const targetId = link.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      }
    });
    
    // Add breadcrumbs if needed
    if (document.referrer.includes(window.location.hostname) && !window.location.pathname.includes('/products')) {
      addBreadcrumbs();
    }
  }

  // 2. Breadcrumb Navigation
  function addBreadcrumbs() {
    const heroTitle = $('.product-hero h1');
    const currentTitle = heroTitle ? heroTitle.textContent : 'Current Course';
    
    const breadcrumbHtml = `
      <div class="breadcrumb">
        <div class="container">
          <ol>
            <li><a href="/">Home</a></li>
            <li class="separator">›</li>
            <li><a href="/products">My Courses</a></li>
            <li class="separator">›</li>
            <li class="current">${currentTitle}</li>
          </ol>
        </div>
      </div>
    `;
    
    const header = $('.header');
    if (header) {
      header.insertAdjacentHTML('afterend', breadcrumbHtml);
    }
  }

  // 3. Progress Tracking Enhancements
  function enhanceProgressTracking() {
    // Animate progress bars
    $$('.progress-bar').forEach(bar => {
      const width = parseFloat(getComputedStyle(bar).width);
      const parentWidth = parseFloat(getComputedStyle(bar.parentElement).width);
      const percentage = (width / parentWidth) * 100;
      const progress = parseInt(bar.getAttribute('aria-valuenow') || bar.dataset.progress || percentage);
      
      // Reset and animate
      bar.style.width = '0';
      setTimeout(() => {
        animate(bar, 'width', 0, progress, 1000);
      }, 100);
      
      // Add completion checkmark for 100%
      if (progress === 100) {
        bar.parentElement.classList.add('progress--complete');
        if (!bar.querySelector('.fa-check')) {
          bar.insertAdjacentHTML('beforeend', 
            '<i class="fa fa-check" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: white; font-size: 12px;"></i>'
          );
        }
      }
    });
    
    // Update progress text
    $$('.syllabus__card-progress .progress-text').forEach(text => {
      if (text.textContent === '100%') {
        text.innerHTML = '<i class="fa fa-check-circle"></i> Complete';
        text.classList.add('progress-complete');
      }
    });
  }

  // 4. Course Navigation Improvements
  function enhanceCourseNavigation() {
    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'ArrowRight':
            const nextLink = $('.post__nav-next') || $('.next-lesson');
            if (nextLink) window.location.href = nextLink.getAttribute('href');
            break;
          case 'ArrowLeft':
            const prevLink = $('.post__nav-prev') || $('.prev-lesson');
            if (prevLink) window.location.href = prevLink.getAttribute('href');
            break;
          case 'ArrowUp':
            const backLink = $('.back-to-course');
            window.location.href = backLink ? backLink.getAttribute('href') : '/products';
            break;
        }
      }
    });
    
    // Highlight current lesson
    const currentTitle = $('.post__title');
    if (currentTitle) {
      const currentText = currentTitle.textContent.trim();
      $$('.syllabus__module-title').forEach(title => {
        if (title.textContent.trim() === currentText) {
          const card = title.closest('.syllabus__module-card');
          card.classList.add('current-lesson');
          card.style.borderLeft = '4px solid var(--an-teal)';
        }
      });
      
      // Add lesson counter
      const cards = $$('.syllabus__module-card');
      const currentCard = $('.syllabus__module-card.current-lesson');
      if (currentCard && cards.length) {
        const currentIndex = Array.from(cards).indexOf(currentCard) + 1;
        currentTitle.insertAdjacentHTML('afterend', 
          `<p class="lesson-counter">Lesson ${currentIndex} of ${cards.length}</p>`
        );
      }
    }
  }

  // 5. Video Player Enhancements
  function enhanceVideoPlayer() {
    if (!window.Wistia) return;
    
    window._wq = window._wq || [];
    _wq.push({ 
      id: "_all", 
      onReady: function(video) {
        const playerVideo = $('.player__video');
        
        // Play/pause visual feedback
        video.bind('play', () => playerVideo?.classList.add('playing'));
        video.bind('pause', () => playerVideo?.classList.remove('playing'));
        
        // Auto-mark complete at 90%
        video.bind('percentwatchedchanged', percent => {
          if (percent >= 0.9) {
            const completeBtn = $('.post__mark-complete');
            if (completeBtn && !completeBtn.classList.contains('completed')) {
              completeBtn.click();
              showCompletionMessage();
            }
          }
        });
        
        // Auto-play next if enabled
        if (localStorage.getItem('autoPlayNext') === 'true') {
          video.bind('end', () => {
            setTimeout(() => {
              const nextBtn = $('.post__nav-next');
              if (nextBtn) nextBtn.click();
            }, 2000);
          });
        }
        
        // Save/restore video position
        const videoId = video.hashedId();
        const savedTime = localStorage.getItem(`video_${videoId}_time`);
        if (savedTime && parseFloat(savedTime) > 5) {
          video.time(savedTime);
        }
        
        // Save position periodically
        setInterval(() => {
          localStorage.setItem(`video_${videoId}_time`, video.time());
        }, 5000);
      }
    });
    
    // Add auto-play toggle
    addAutoPlayToggle();
  }

  // 6. Auto-play Toggle
  function addAutoPlayToggle() {
    const playerVideo = $('.player__video');
    if (!playerVideo) return;
    
    const isChecked = localStorage.getItem('autoPlayNext') === 'true';
    const autoPlayHtml = `
      <div class="autoplay-toggle">
        <label class="switch">
          <input type="checkbox" id="autoPlayNext" ${isChecked ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <span>Auto-play next lesson</span>
      </div>
    `;
    
    playerVideo.insertAdjacentHTML('afterend', autoPlayHtml);
    
    $('#autoPlayNext').addEventListener('change', e => {
      localStorage.setItem('autoPlayNext', e.target.checked);
    });
  }

  // 7. Completion Message
  function showCompletionMessage() {
    const messageHtml = `
      <div class="completion-message" style="display: none;">
        <div class="completion-message__content">
          <i class="fa fa-check-circle"></i>
          <h3>Great job! Lesson completed</h3>
          <p>Keep up the excellent work!</p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', messageHtml);
    const message = $('.completion-message');
    
    // Fade in
    setTimeout(() => {
      message.style.display = 'block';
      message.style.opacity = '0';
      animate(message, 'opacity', 0, 1, 300);
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
      animate(message, 'opacity', 1, 0, 300, () => message.remove());
    }, 3300);
  }

  // 8. Enhanced Course Cards
  function enhanceCourseCards() {
    $$('.syllabus__card').forEach(card => {
      const inner = card.querySelector('.syllabus__card-inner');
      const img = card.querySelector('img');
      
      card.addEventListener('mouseenter', () => {
        if (inner) inner.style.transform = 'translateY(-4px)';
        if (img) img.style.transform = 'scale(1.05)';
        
        // Re-animate progress bar
        const progressBar = card.querySelector('.progress-bar');
        if (progressBar) {
          const currentWidth = progressBar.style.width;
          progressBar.style.width = '0';
          setTimeout(() => progressBar.style.width = currentWidth, 10);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (inner) inner.style.transform = 'translateY(0)';
        if (img) img.style.transform = 'scale(1)';
      });
    });
  }

  // 9. Mobile Experience
  function enhanceMobileExperience() {
    // Touch navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    const swipeTargets = ['.post__content', '.player__video'];
    swipeTargets.forEach(selector => {
      const element = $(selector);
      if (!element) return;
      
      element.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      element.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
    });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // Swipe left - next
        const next = $('.post__nav-next');
        if (next) next.click();
      } else if (touchEndX > touchStartX + 50) {
        // Swipe right - previous
        const prev = $('.post__nav-prev');
        if (prev) prev.click();
      }
    }
    
    // Mobile menu
    const hamburger = $('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
      });
      
      // Close on outside click
      document.addEventListener('click', e => {
        if (!e.target.closest('.header') && document.body.classList.contains('menu-open')) {
          hamburger.click();
        }
      });
    }
  }

  // 10. Quick Access Shortcuts
  function addQuickAccessShortcuts() {
    const playerVideo = $('.player__video');
    if (!playerVideo) return;
    
    const shortcutsHtml = `
      <div class="quick-shortcuts">
        <button class="shortcut-btn" title="Course Overview (O)" data-key="o">
          <i class="fa fa-th"></i>
        </button>
        <button class="shortcut-btn" title="My Progress (P)" data-key="p">
          <i class="fa fa-chart-line"></i>
        </button>
        <button class="shortcut-btn" title="Downloads (D)" data-key="d">
          <i class="fa fa-download"></i>
        </button>
        <button class="shortcut-btn" title="Help (H)" data-key="h">
          <i class="fa fa-question-circle"></i>
        </button>
      </div>
    `;
    
    playerVideo.insertAdjacentHTML('afterend', shortcutsHtml);
    
    // Keyboard shortcuts
    document.addEventListener('keypress', e => {
      if (e.target.matches('input, textarea')) return;
      
      switch(e.key.toLowerCase()) {
        case 'o':
          window.location.href = '/products';
          break;
        case 'p':
          $('.sidebar__progress')?.click();
          break;
        case 'd':
          const downloads = $('.post__downloads');
          if (downloads) {
            downloads.style.display = downloads.style.display === 'none' ? 'block' : 'none';
          }
          break;
        case 'h':
          showHelpModal();
          break;
      }
    });
    
    // Button clicks
    $$('.shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        document.dispatchEvent(new KeyboardEvent('keypress', { key }));
      });
    });
  }

  // 11. Help Modal
  function showHelpModal() {
    if ($('.help-modal')) return;
    
    const helpHtml = `
      <div class="help-modal" style="display: none;">
        <div class="help-modal__content">
          <button class="help-modal__close">&times;</button>
          <h2>Keyboard Shortcuts</h2>
          <ul>
            <li><kbd>Ctrl</kbd> + <kbd>→</kbd> - Next lesson</li>
            <li><kbd>Ctrl</kbd> + <kbd>←</kbd> - Previous lesson</li>
            <li><kbd>O</kbd> - Course overview</li>
            <li><kbd>P</kbd> - View progress</li>
            <li><kbd>D</kbd> - Show downloads</li>
            <li><kbd>H</kbd> - This help menu</li>
          </ul>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', helpHtml);
    const modal = $('.help-modal');
    
    // Show modal
    setTimeout(() => {
      modal.style.display = 'block';
      modal.style.opacity = '0';
      animate(modal, 'opacity', 0, 1, 200);
    }, 10);
    
    // Close handlers
    const closeModal = () => {
      animate(modal, 'opacity', 1, 0, 200, () => modal.remove());
    };
    
    $('.help-modal__close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  // Initialize all enhancements
  function init() {
    enhanceNavigation();
    enhanceProgressTracking();
    enhanceCourseNavigation();
    enhanceVideoPlayer();
    enhanceCourseCards();
    enhanceMobileExperience();
    addQuickAccessShortcuts();
    
    // Add init class
    document.body.classList.add('an-enhanced');
  }

  // Run when ready
  ready(init);
  
  // Handle dynamic content
  document.addEventListener('ajax:complete', () => {
    enhanceProgressTracking();
    enhanceCourseCards();
  });
})();

// Utility: Format time
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
}