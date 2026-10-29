/**
 * Turfy - Main JavaScript
 * Lightweight, zero dependencies, accessible interactions
 */

(function () {
  'use strict';

  // 1. Sticky Header scroll effect
  const header = document.getElementById('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Smooth scrolling for hash links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 4. Role Tabs (Player / Captain / Organizer)
  const roleTabButtons = document.querySelectorAll('.role-tab-btn');
  const rolePanels = document.querySelectorAll('.role-panel');
  if (roleTabButtons.length && rolePanels.length) {
    roleTabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetRole = btn.getAttribute('data-role');
        roleTabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        rolePanels.forEach((panel) => {
          if (panel.id === `role-${targetRole}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // 5. FAQ Accordion (accessible with aria-expanded)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all items
      faqItems.forEach((other) => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 6. iPhone Waitlist Modal
  const waitlistTriggers = document.querySelectorAll('[data-open-waitlist]');
  const waitlistModal = document.getElementById('waitlist-modal');
  const waitlistClose = document.getElementById('waitlist-close');

  const openWaitlist = () => {
    if (waitlistModal) {
      waitlistModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const input = waitlistModal.querySelector('input[type="email"]');
      if (input) input.focus();
    }
  };

  const closeWaitlist = () => {
    if (waitlistModal) {
      waitlistModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  waitlistTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWaitlist();
    });
  });

  if (waitlistClose) {
    waitlistClose.addEventListener('click', closeWaitlist);
  }

  if (waitlistModal) {
    waitlistModal.addEventListener('click', (e) => {
      if (e.target === waitlistModal) closeWaitlist();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && waitlistModal && waitlistModal.classList.contains('open')) {
      closeWaitlist();
    }
  });

  // 7. Auto-detect iOS to offer waitlist CTA
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    const stickyDownload = document.getElementById('sticky-download-btn');
    if (stickyDownload) {
      stickyDownload.textContent = 'iPhone Waitlist';
      stickyDownload.href = '#';
      stickyDownload.addEventListener('click', (e) => {
        e.preventDefault();
        openWaitlist();
      });
    }
  }

  // 8. Contact Form - submits to formsubmit.co naturally, no e.preventDefault() blocking it
  // (We do not interfere so messages are safely delivered to turfy.sports@gmail.com)
})();
