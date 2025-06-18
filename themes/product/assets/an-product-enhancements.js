/* ==========================================================================
   AN Product Theme - Experience Enhancements
   Version: 1.0.0
   ========================================================================== */

$(document).ready(function() {
  
  // 1. Enhanced Navigation Experience
  function enhanceNavigation() {
    // Add active states based on current page
    const currentPath = window.location.pathname;
    $('.header .link-list__link').each(function() {
      const linkPath = $(this).attr('href');
      if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
        $(this).addClass('active').css({
          'color': 'var(--an-teal)',
          'background': 'var(--an-peach)'
        });
      }
    });
    
    // Smooth scroll for anchor links
    $('a[href^="#"]').not('[href="#"]').on('click', function(e) {
      e.preventDefault();
      const target = $(this.hash);
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 100
        }, 500, 'swing');
      }
    });
    
    // Add breadcrumb navigation if coming from main site
    if (document.referrer.includes(window.location.hostname) && !window.location.pathname.includes('/products')) {
      addBreadcrumbs();
    }
  }
  
  // 2. Breadcrumb Navigation
  function addBreadcrumbs() {
    const breadcrumbHtml = `
      <div class="breadcrumb">
        <div class="container">
          <ol>
            <li><a href="/">Home</a></li>
            <li class="separator">›</li>
            <li><a href="/products">My Courses</a></li>
            <li class="separator">›</li>
            <li class="current">${$('.product-hero h1').text() || 'Current Course'}</li>
          </ol>
        </div>
      </div>
    `;
    $('.header').after(breadcrumbHtml);
  }
  
  // 3. Progress Tracking Enhancements
  function enhanceProgressTracking() {
    // Animate progress bars on page load
    $('.progress-bar').each(function() {
      const width = $(this).css('width');
      $(this).css('width', '0').animate({ width: width }, 1000, 'swing');
      
      // Add completion checkmark for 100% progress
      const percentage = parseInt($(this).attr('aria-valuenow') || $(this).data('progress') || 0);
      if (percentage === 100) {
        $(this).parent().addClass('progress--complete');
        $(this).append('<i class="fa fa-check" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: white; font-size: 12px;"></i>');
      }
    });
    
    // Update progress text
    $('.syllabus__card-progress .progress-text').each(function() {
      const text = $(this).text();
      if (text === '100%') {
        $(this).html('<i class="fa fa-check-circle"></i> Complete').addClass('progress-complete');
      }
    });
  }
  
  // 4. Course Navigation Improvements
  function enhanceCourseNavigation() {
    // Add keyboard navigation (Ctrl/Cmd + Arrow keys)
    $(document).on('keydown', function(e) {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'ArrowRight':
            // Next lesson
            window.location.href = $('.post__nav-next').attr('href') || $('.next-lesson').attr('href') || '#';
            break;
          case 'ArrowLeft':
            // Previous lesson
            window.location.href = $('.post__nav-prev').attr('href') || $('.prev-lesson').attr('href') || '#';
            break;
          case 'ArrowUp':
            // Back to course overview
            window.location.href = $('.back-to-course').attr('href') || '/products';
            break;
        }
      }
    });
    
    // Highlight current lesson in sidebar
    const currentPostTitle = $('.post__title').text().trim();
    $('.syllabus__module-title').each(function() {
      if ($(this).text().trim() === currentPostTitle) {
        $(this).closest('.syllabus__module-card')
          .addClass('current-lesson')
          .css('border-left', '4px solid var(--an-teal)');
      }
    });
    
    // Add lesson counter
    const totalLessons = $('.syllabus__module-card').length;
    const currentIndex = $('.syllabus__module-card.current-lesson').index() + 1;
    if (currentIndex > 0) {
      $('.post__title').after(`<p class="lesson-counter">Lesson ${currentIndex} of ${totalLessons}</p>`);
    }
  }
  
  // 5. Video Player Enhancements
  function enhanceVideoPlayer() {
    // Auto-play next video option
    if (window.Wistia) {
      window._wq = window._wq || [];
      _wq.push({ 
        id: "_all", 
        onReady: function(video) {
          // Add custom play button animation
          video.bind('play', function() {
            $('.player__video').addClass('playing');
          });
          
          video.bind('pause', function() {
            $('.player__video').removeClass('playing');
          });
          
          // Auto-mark complete at 90% watched
          video.bind('percentwatchedchanged', function(percent) {
            if (percent >= 0.9 && !$('.post__mark-complete').hasClass('completed')) {
              $('.post__mark-complete').click();
              showCompletionMessage();
            }
          });
          
          // Auto-play next video if enabled
          if (localStorage.getItem('autoPlayNext') === 'true') {
            video.bind('end', function() {
              setTimeout(function() {
                $('.post__nav-next').click();
              }, 2000);
            });
          }
        }
      });
    }
    
    // Add auto-play toggle
    addAutoPlayToggle();
  }
  
  // 6. Auto-play Toggle
  function addAutoPlayToggle() {
    const autoPlayHtml = `
      <div class="autoplay-toggle">
        <label class="switch">
          <input type="checkbox" id="autoPlayNext" ${localStorage.getItem('autoPlayNext') === 'true' ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <span>Auto-play next lesson</span>
      </div>
    `;
    $('.player__video').after(autoPlayHtml);
    
    $('#autoPlayNext').on('change', function() {
      localStorage.setItem('autoPlayNext', $(this).is(':checked'));
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
    $('body').append(messageHtml);
    $('.completion-message').fadeIn(300).delay(3000).fadeOut(300, function() {
      $(this).remove();
    });
  }
  
  // 8. Enhanced Course Cards
  function enhanceCourseCards() {
    // Add hover effects
    $('.syllabus__card').on('mouseenter', function() {
      $(this).find('.syllabus__card-inner').css('transform', 'translateY(-4px)');
      $(this).find('img').css('transform', 'scale(1.05)');
    }).on('mouseleave', function() {
      $(this).find('.syllabus__card-inner').css('transform', 'translateY(0)');
      $(this).find('img').css('transform', 'scale(1)');
    });
    
    // Add progress animation on hover
    $('.syllabus__card').on('mouseenter', function() {
      const progressBar = $(this).find('.progress-bar');
      const currentWidth = progressBar.css('width');
      progressBar.css('width', '0').animate({ width: currentWidth }, 500);
    });
  }
  
  // 9. Mobile Experience Enhancements
  function enhanceMobileExperience() {
    // Swipe navigation for lessons
    let touchStartX = 0;
    let touchEndX = 0;
    
    $('.post__content, .player__video').on('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    $('.post__content, .player__video').on('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // Swipe left - next lesson
        $('.post__nav-next').click();
      }
      if (touchEndX > touchStartX + 50) {
        // Swipe right - previous lesson
        $('.post__nav-prev').click();
      }
    }
    
    // Improve mobile menu
    $('.hamburger').on('click', function() {
      $('body').toggleClass('menu-open');
    });
    
    // Close menu on outside click
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.header').length && $('body').hasClass('menu-open')) {
        $('.hamburger').click();
      }
    });
  }
  
  // 10. Quick Access Shortcuts
  function addQuickAccessShortcuts() {
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
    
    if ($('.player__video').length) {
      $('.player__video').after(shortcutsHtml);
    }
    
    // Keyboard shortcuts
    $(document).on('keypress', function(e) {
      if (!$(e.target).is('input, textarea')) {
        switch(e.key.toLowerCase()) {
          case 'o':
            window.location.href = '/products';
            break;
          case 'p':
            $('.sidebar__progress').click();
            break;
          case 'd':
            $('.post__downloads').toggle();
            break;
          case 'h':
            showHelpModal();
            break;
        }
      }
    });
    
    // Click handlers
    $('.shortcut-btn').on('click', function() {
      const key = $(this).data('key');
      $(document).trigger($.Event('keypress', { key: key }));
    });
  }
  
  // 11. Help Modal
  function showHelpModal() {
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
    
    if (!$('.help-modal').length) {
      $('body').append(helpHtml);
    }
    
    $('.help-modal').fadeIn(200);
    
    $('.help-modal__close, .help-modal').on('click', function(e) {
      if (e.target === this) {
        $('.help-modal').fadeOut(200);
      }
    });
  }
  
  // 12. Save Progress Locally
  function saveProgressLocally() {
    // Save current position in video
    if (window.Wistia) {
      window._wq = window._wq || [];
      _wq.push({ 
        id: "_all", 
        onReady: function(video) {
          // Load saved position
          const savedTime = localStorage.getItem(`video_${video.hashedId()}_time`);
          if (savedTime && savedTime > 5) {
            video.time(savedTime);
          }
          
          // Save position every 5 seconds
          setInterval(function() {
            localStorage.setItem(`video_${video.hashedId()}_time`, video.time());
          }, 5000);
        }
      });
    }
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
    saveProgressLocally();
    
    // Add init class for CSS animations
    $('body').addClass('an-enhanced');
  }
  
  // Run initialization
  init();
  
  // Handle dynamic content
  $(document).on('ajax:complete', function() {
    enhanceProgressTracking();
    enhanceCourseCards();
  });
});

// Utility: Format time
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
}