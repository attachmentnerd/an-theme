/**
 * AN Theme Confetti Animation
 * Lightweight confetti celebration for lesson completions
 * Version: 1.0.0
 */

(function() {
  'use strict';

  const ANConfetti = {
    /**
     * Launch confetti celebration
     * @param {Object} options - Configuration options
     */
    celebrate(options = {}) {
      const config = {
        particleCount: options.particleCount || 100,
        spread: options.spread || 70,
        origin: options.origin || { y: 0.6 },
        colors: options.colors || ['#5E3BFF', '#18D5E4', '#FF8BCB', '#FFE86B'],
        duration: options.duration || 3000,
        ...options
      };

      this.createConfetti(config);
    },

    /**
     * Create confetti particles
     */
    createConfetti(config) {
      const container = document.createElement('div');
      container.className = 'an-confetti-container';
      container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(container);

      const particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(this.createParticle(config, container));
      }

      // Animate particles
      this.animateParticles(particles);

      // Clean up after animation
      setTimeout(() => {
        container.remove();
      }, config.duration);
    },

    /**
     * Create a single confetti particle
     */
    createParticle(config, container) {
      const particle = document.createElement('div');
      particle.className = 'an-confetti-particle';

      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const size = Math.random() * 8 + 4;
      const startX = (config.origin.x || 0.5) * window.innerWidth;
      const startY = (config.origin.y || 0.5) * window.innerHeight;

      // Random velocity and angle
      const angle = (Math.random() - 0.5) * config.spread * (Math.PI / 180);
      const velocity = Math.random() * 10 + 10;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - Math.random() * 5;

      // Rotation
      const rotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 10;

      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${startX}px;
        top: ${startY}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transform: rotate(${rotation}deg);
      `;

      container.appendChild(particle);

      return {
        element: particle,
        x: startX,
        y: startY,
        vx: vx,
        vy: vy,
        rotation: rotation,
        rotationSpeed: rotationSpeed,
        opacity: 1
      };
    },

    /**
     * Animate all particles
     */
    animateParticles(particles) {
      const gravity = 0.5;
      const drag = 0.99;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        let allDone = true;

        particles.forEach(p => {
          if (p.opacity <= 0) return;

          allDone = false;

          // Apply physics
          p.vy += gravity;
          p.vx *= drag;
          p.vy *= drag;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          // Fade out
          if (elapsed > 2000) {
            p.opacity -= 0.02;
          }

          // Update DOM
          p.element.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
          p.element.style.opacity = p.opacity;
        });

        if (!allDone) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },

    /**
     * Milestone celebration (different patterns based on progress)
     */
    celebrateMilestone(percent) {
      if (percent === 25) {
        this.celebrate({ particleCount: 50, colors: ['#18D5E4', '#5E3BFF'] });
      } else if (percent === 50) {
        this.celebrate({ particleCount: 75, colors: ['#FF8BCB', '#5E3BFF'] });
      } else if (percent === 75) {
        this.celebrate({ particleCount: 100, colors: ['#FFE86B', '#5E3BFF'] });
      } else if (percent === 100) {
        // Extra celebration for 100%
        this.celebrate({ particleCount: 150 });
        setTimeout(() => {
          this.celebrate({ particleCount: 100, origin: { x: 0.3, y: 0.4 } });
        }, 200);
        setTimeout(() => {
          this.celebrate({ particleCount: 100, origin: { x: 0.7, y: 0.4 } });
        }, 400);
      }
    }
  };

  // Expose globally
  window.ANConfetti = ANConfetti;

  // Auto-initialize on lesson completion
  document.addEventListener('DOMContentLoaded', () => {
    // Listen for completion events
    const completionButtons = document.querySelectorAll('[data-post-completion-toggle]');

    completionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const wasCompleted = this.getAttribute('data-post-completion-toggle') === 'true';

        // If marking as complete (not uncompleting)
        if (!wasCompleted) {
          setTimeout(() => {
            ANConfetti.celebrate({ particleCount: 80 });
          }, 300);

          // Check for course progress milestones
          const progressBar = document.querySelector('.progress__fill');
          if (progressBar) {
            const percent = parseInt(progressBar.getAttribute('aria-valuenow'));
            if ([25, 50, 75, 100].includes(percent)) {
              setTimeout(() => {
                ANConfetti.celebrateMilestone(percent);
              }, 500);
            }
          }
        }
      });
    });
  });
})();
