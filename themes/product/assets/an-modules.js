/**
 * AN Theme Additional Modules
 * Modular components loaded as needed
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Social Share Module
   */
  const SocialShare = {
    init() {
      const PROVIDERS = {
        facebook: {
          url: 'https://www.facebook.com/sharer/sharer.php',
          params: (data) => ({ u: data.url }),
          window: { width: 550, height: 750 }
        },
        linkedin: {
          url: 'https://www.linkedin.com/shareArticle',
          params: (data) => ({ url: data.url }),
          window: { width: 600, height: 600 }
        },
        twitter: {
          url: 'https://twitter.com/intent/tweet',
          params: (data) => ({ text: `${data.message}\n\n${data.url}` }),
          window: { width: 600, height: 750 }
        },
        email: {
          url: 'mailto:',
          params: (data) => ({ 
            body: `${data.message}\n\n${data.url}` 
          }),
          window: false
        }
      };

      const shareData = {
        url: window.location.href,
        message: 'Visit us at'
      };

      // Initialize modal containers
      document.querySelectorAll('[data-social-share-block-container]').forEach(container => {
        const modalId = container.dataset.socialShareBlockContainer;
        const modal = document.querySelector(`[data-social-share-modal="${modalId}"]`);
        
        if (modal && modal.parentElement.tagName !== 'BODY') {
          document.body.appendChild(modal);
        }
      });

      // Menu triggers
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-social-share-trigger="menu"] > a, [data-social-share-trigger="menu"] > button');
        if (!trigger) return;
        
        e.preventDefault();
        const container = trigger.closest('[data-social-share-block-container]');
        if (container) this.toggleModal(container);
      });

      // Share triggers
      Object.keys(PROVIDERS).forEach(provider => {
        document.addEventListener('click', (e) => {
          const trigger = e.target.closest(`[data-social-share-trigger="${provider}"]`);
          if (!trigger) return;
          
          e.preventDefault();
          this.share(provider, shareData, PROVIDERS[provider]);
        });
      });

      // Copy to clipboard
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-social-share-trigger="copy"]');
        if (!trigger) return;
        
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareData.url).catch(console.error);
        }
      });
    },

    toggleModal(container) {
      const modalId = container.dataset.socialShareBlockContainer;
      const modal = document.querySelector(`[data-social-share-modal="${modalId}"]`);
      if (!modal) return;

      const isActive = modal.classList.contains('social-share-modal--active');
      const menu = modal.querySelector('[data-social-share-menu]');
      const backdrop = modal.querySelector('[data-social-share-backdrop]');

      if (isActive) {
        modal.classList.remove('social-share-modal--active');
        menu.removeAttribute('style');
      } else {
        // Use requestAnimationFrame to batch layout reads and prevent forced reflow
        requestAnimationFrame(() => {
          // Position menu - batch all layout reads together
          const trigger = container.querySelector('[data-social-share-trigger="menu"] > a, [data-social-share-trigger="menu"] > button');
          const triggerRect = trigger.getBoundingClientRect();
          const bodyWidth = document.body.offsetWidth;
          const scrollTop = document.documentElement.scrollTop;

          const position = {
            left: triggerRect.left + triggerRect.width / 2 - 100,
            top: scrollTop + triggerRect.bottom
          };

          // Adjust for viewport boundaries
          if (position.left < 0) {
            position.left = triggerRect.left;
          } else if (position.left + 200 > bodyWidth) {
            position.left = null;
            position.right = bodyWidth - triggerRect.right;
          }

          // Apply position (batch DOM writes)
          Object.assign(menu.style, {
            left: position.left ? `${position.left}px` : 'auto',
            right: position.right ? `${position.right}px` : 'auto',
            top: `${position.top}px`
          });

          modal.classList.add('social-share-modal--active');
        });

        // Close on backdrop click
        const closeHandler = () => {
          this.toggleModal(container);
          backdrop.removeEventListener('click', closeHandler);
        };
        backdrop.addEventListener('click', closeHandler);
      }
    },

    share(provider, data, config) {
      if (!config) return;

      const params = new URLSearchParams(config.params(data));
      const url = config.url + (provider === 'email' ? '?' : '?') + params.toString();

      if (config.window) {
        const features = {
          ...config.window,
          noopener: true,
          noreferrer: true,
          toolbar: 0,
          top: Math.round((window.screen.height - config.window.height) / 4),
          left: Math.round((window.screen.width - config.window.width) / 2)
        };

        const featuresStr = Object.entries(features)
          .map(([key, value]) => `${key}=${value}`)
          .join(',');

        window.open(url, '_blank', featuresStr);
      } else {
        window.location.href = url;
      }
    }
  };

  /**
   * Event Video Module
   */
  const EventVideo = {
    init() {
      document.querySelectorAll('.event-video').forEach(container => {
        const eventTime = container.dataset.eventTime;
        const offsetNumber = parseInt(container.dataset.offsetNumber) || 0;
        const offsetPeriod = container.dataset.offsetPeriod || 'seconds';

        if (!eventTime) return;

        // Calculate target time
        let targetTime = new Date(eventTime).getTime();
        const offsetMs = {
          seconds: offsetNumber * 1000,
          minutes: offsetNumber * 60 * 1000,
          hours: offsetNumber * 60 * 60 * 1000,
          days: offsetNumber * 24 * 60 * 60 * 1000
        };
        targetTime += offsetMs[offsetPeriod] || 0;

        this.updateVideoState(container, targetTime);
      });
    },

    updateVideoState(container, targetTime) {
      const now = new Date().getTime();
      const diff = targetTime - now;

      const items = {
        before: container.querySelector('.event-video__item--before'),
        join: container.querySelector('.event-video__item--join'),
        during: container.querySelector('.event-video__item--during'),
        after: container.querySelector('.event-video__item--after')
      };

      // Hide all items first
      Object.values(items).forEach(item => {
        if (item) item.classList.remove('active');
      });

      if (diff > 0) {
        // Before event
        if (items.before) items.before.classList.add('active');
        this.startCountdown(container, targetTime);
      } else {
        // During or after event
        const wistiaEmbed = container.querySelector('.wistia_embed');
        if (wistiaEmbed) {
          this.handleWistiaVideo(container, items, targetTime);
        } else {
          if (items.after) items.after.classList.add('active');
        }
      }
    },

    startCountdown(container, targetTime) {
      const countdown = container.querySelector('.countdown--video');
      if (!countdown) return;

      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          this.updateVideoState(container, targetTime);
          return false;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.querySelector('.days')?.textContent = String(days).padStart(2, '0');
        countdown.querySelector('.hours')?.textContent = String(hours).padStart(2, '0');
        countdown.querySelector('.minutes')?.textContent = String(minutes).padStart(2, '0');
        countdown.querySelector('.seconds')?.textContent = String(seconds).padStart(2, '0');

        return true;
      };

      updateCountdown();
      const interval = setInterval(() => {
        if (!updateCountdown()) clearInterval(interval);
      }, 1000);
    },

    handleWistiaVideo(container, items, targetTime) {
      const embedId = container.querySelector('.wistia_embed').id.split('_')[1];
      
      window._wq = window._wq || [];
      window._wq.push({
        id: embedId,
        onReady: (video) => {
          const now = new Date().getTime();
          const elapsed = (now - targetTime) / 1000; // seconds

          if (video.duration() < elapsed) {
            // Video has ended
            if (items.after) items.after.classList.add('active');
          } else {
            // Show join button
            if (items.join) {
              items.join.classList.add('active');
              
              const joinLink = items.join.querySelector('a');
              if (joinLink) {
                joinLink.addEventListener('click', (e) => {
                  e.preventDefault();
                  
                  // Hide join, show video
                  items.join.classList.remove('active');
                  if (items.during) items.during.classList.add('active');
                  
                  // Start video at elapsed time
                  video.time(elapsed);
                  video.play();
                  
                  video.bind('end', () => {
                    items.during?.classList.remove('active');
                    if (items.after) items.after.classList.add('active');
                  });
                }, { once: true });
              }
            }
          }
        }
      });
    }
  };

  /**
   * Two-Step Opt-in Module
   */
  const TwoStep = {
    init() {
      const triggers = document.querySelectorAll('[data-target="#two-step"]');
      const modal = document.querySelector('.two-step');
      
      if (!triggers.length || !modal) return;

      const closeBtn = modal.querySelector('.close-x');
      const content = modal.querySelector('.modal__content');

      const openModal = () => {
        modal.classList.add('modal--open');
        document.documentElement.classList.add('stop-scroll--html');
        document.body.classList.add('stop-scroll--body');
      };

      const closeModal = () => {
        modal.classList.remove('modal--open');
        document.documentElement.classList.remove('stop-scroll--html');
        document.body.classList.remove('stop-scroll--body');
      };

      // Open triggers
      triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      });

      // Close handlers
      modal.addEventListener('click', closeModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (content) {
        content.addEventListener('click', (e) => e.stopPropagation());
      }
    }
  };

  /**
   * Responsive Video Embeds
   */
  const ResponsiveVideos = {
    providers: ['brightcove', 'dailymotion', 'facebook', 'sproutvideo', 'ustream', 'wistia', 'vimeo', 'vooplayer', 'youtube'],
    
    init() {
      const containers = [
        '.blog-listing__content',
        '.blog-post-body',
        '.page__content',
        '.sales-page-body'
      ];

      const hasContainers = containers.some(selector => document.querySelector(selector));
      if (!hasContainers) return;

      this.wrapVideos();
      
      window.addEventListener('section:reload', () => {
        this.wrapVideos();
      });
    },

    wrapVideos() {
      const selectors = this.providers.map(provider => `iframe[src*="${provider}"]`).join(', ');
      document.querySelectorAll(selectors).forEach((iframe, index) => {
        if (iframe.closest('.responsive-embed')) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'responsive-embed';
        wrapper.id = `responsive-embed--${index}`;
        
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
      });
    }
  };

  /**
   * Search Filters
   */
  const SearchFilters = {
    init() {
      // Announcement search
      const announcementSearch = document.querySelector('.announcement-search');
      if (announcementSearch) {
        const filterField = announcementSearch.querySelector('.filter__field');
        const productIdField = announcementSearch.querySelector('.announcement-search__product-id');
        
        if (filterField && productIdField) {
          filterField.addEventListener('change', (e) => {
            productIdField.value = e.target.value || '';
          });
        }
      }

      // Member search
      const memberSearch = document.querySelector('.member-search');
      if (memberSearch) {
        const filterField = memberSearch.querySelector('.filter__field');
        const searchControls = memberSearch.querySelectorAll('.search__control');
        
        if (filterField && searchControls.length) {
          filterField.addEventListener('change', (e) => {
            searchControls.forEach(control => {
              control.classList.toggle('hidden', control.name !== e.target.value);
            });
          });
        }
      }
    }
  };

  // Initialize modules when DOM is ready
  const initModules = () => {
    SocialShare.init();
    EventVideo.init();
    TwoStep.init();
    ResponsiveVideos.init();
    SearchFilters.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModules);
  } else {
    initModules();
  }

  // Export modules
  window.ANModules = {
    SocialShare,
    EventVideo,
    TwoStep,
    ResponsiveVideos,
    SearchFilters
  };

})();