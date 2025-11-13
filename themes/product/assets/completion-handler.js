/**
 * AN Theme Completion Handler
 * Enhanced lesson completion with loading states and celebrations
 * Version: 1.0.0
 *
 * Integrates with Kajabi's completion system
 */

(function() {
  'use strict';

  const CompletionHandler = {
    init() {
      this.setupCompletionButtons();
      this.setupProgressTracking();
    },

    /**
     * Setup completion button interactions
     */
    setupCompletionButtons() {
      const buttons = document.querySelectorAll('[data-post-completion-toggle]');

      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleCompletion(button);
        });
      });
    },

    /**
     * Handle lesson completion
     */
    async handleCompletion(button) {
      const isCompleted = button.getAttribute('data-post-completion-toggle') === 'true';
      const token = button.getAttribute('data-token');
      const nextPage = button.getAttribute('data-page');

      // Show loading state
      button.classList.add('is-loading');
      button.setAttribute('aria-busy', 'true');

      try {
        // Call Kajabi completion API
        const response = await this.toggleCompletion(token, isCompleted);

        if (response.ok) {
          // Show success state
          button.classList.remove('is-loading');
          button.classList.add('is-success');

          // Update button state
          const newState = !isCompleted;
          button.setAttribute('data-post-completion-toggle', newState);

          // Update text
          const textSpan = button.querySelector('.btn__text');
          if (textSpan) {
            const completeText = button.getAttribute('data-complete-text');
            const incompleteText = button.getAttribute('data-incomplete-text');
            textSpan.textContent = newState ? incompleteText : completeText;
          }

          // Update ARIA label
          button.setAttribute('aria-label', newState ? 'Mark lesson as incomplete' : 'Mark lesson as complete');

          // If completing (not un-completing), celebrate!
          if (!isCompleted) {
            // Trigger confetti if available
            if (window.ANConfetti) {
              setTimeout(() => {
                window.ANConfetti.celebrate({ particleCount: 80 });
              }, 200);
            }

            // Check for milestone
            this.checkMilestone();
          }

          // Remove success state after animation
          setTimeout(() => {
            button.classList.remove('is-success');
            button.setAttribute('aria-busy', 'false');

            // If there's a next page and we completed, optionally redirect
            if (!isCompleted && nextPage && button.hasAttribute('data-auto-advance')) {
              window.location.href = nextPage;
            }
          }, 1500);

        } else {
          throw new Error('Completion failed');
        }

      } catch (error) {
        console.error('Completion error:', error);

        // Show error state
        button.classList.remove('is-loading', 'is-success');
        button.classList.add('is-error');
        button.setAttribute('aria-busy', 'false');

        setTimeout(() => {
          button.classList.remove('is-error');
        }, 2000);
      }
    },

    /**
     * Toggle completion via Kajabi API
     */
    async toggleCompletion(token, isCompleted) {
      // Use Kajabi's completion endpoint
      const url = isCompleted ? `/posts/${token}/incomplete` : `/posts/${token}/complete`;

      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      });
    },

    /**
     * Check for course completion milestones
     */
    checkMilestone() {
      const progressBars = document.querySelectorAll('.progress__fill');

      progressBars.forEach(bar => {
        const percent = parseInt(bar.getAttribute('aria-valuenow') || 0);

        // Trigger milestone celebrations
        if ([25, 50, 75, 100].includes(percent)) {
          if (window.ANConfetti) {
            setTimeout(() => {
              window.ANConfetti.celebrateMilestone(percent);

              // Show milestone message
              this.showMilestoneMessage(percent);
            }, 400);
          }
        }
      });
    },

    /**
     * Show milestone achievement message
     */
    showMilestoneMessage(percent) {
      const messages = {
        25: '🎯 25% Complete! You\'re making great progress!',
        50: '⭐ Halfway there! Keep up the excellent work!',
        75: '🔥 75% Complete! You\'re almost done!',
        100: '🎉 Congratulations! You completed the course!'
      };

      const message = messages[percent];
      if (!message) return;

      // Create toast notification
      const toast = document.createElement('div');
      toast.className = 'an-milestone-toast';
      toast.innerHTML = `
        <div class="an-milestone-toast__content">
          <div class="an-milestone-toast__text">${message}</div>
        </div>
      `;

      // Add to page
      document.body.appendChild(toast);

      // Show with animation
      setTimeout(() => toast.classList.add('show'), 100);

      // Remove after delay
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },

    /**
     * Setup progress bar animations
     */
    setupProgressTracking() {
      const progressBars = document.querySelectorAll('.progress__fill');

      // Animate progress bars on page load
      progressBars.forEach(bar => {
        const percent = bar.getAttribute('aria-valuenow');
        bar.style.width = '0%';

        // Trigger reflow
        bar.offsetWidth;

        // Animate to actual width
        setTimeout(() => {
          bar.style.transition = 'width 0.8s ease-out';
          bar.style.width = percent + '%';
        }, 100);
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CompletionHandler.init());
  } else {
    CompletionHandler.init();
  }

  // Expose globally for manual triggers
  window.ANCompletionHandler = CompletionHandler;

})();
