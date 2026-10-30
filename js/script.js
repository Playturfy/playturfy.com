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

  // 8. Contact & Waitlist Forms - Asynchronous submission (Prevents redirect & Cloudflare 521 crashes)
  function handleFormSubmission(form, successMsg) {
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      let statusEl = form.querySelector('.form-status');
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'form-status';
        form.appendChild(statusEl);
      }
      statusEl.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch('https://formsubmit.co/ajax/turfy.sports@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          form.reset();
          statusEl.className = 'form-status form-success';
          statusEl.textContent = successMsg || '✓ Message sent successfully! We will get back to you soon.';
          statusEl.style.display = 'block';
        } else {
          throw new Error('Server returned ' + response.status);
        }
      } catch (err) {
        const nameVal = formData.get('name') || '';
        const msgVal = formData.get('message') || formData.get('email') || '';
        const mailtoUrl = `mailto:turfy.sports@gmail.com?subject=Inquiry from ${encodeURIComponent(nameVal || 'Playturfy Website')}&body=${encodeURIComponent(msgVal)}`;
        
        statusEl.className = 'form-status form-error';
        statusEl.innerHTML = `Message service is temporarily busy. <a href="${mailtoUrl}" style="color: var(--lime); text-decoration: underline; font-weight: 600;">Click here to send directly via Email</a>`;
        statusEl.style.display = 'block';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }
      }
    });
  }

  handleFormSubmission(
    document.querySelector('.contact-form'),
    '✓ Thank you! Your message has been sent to the Turfy team.'
  );

  const waitlistForm = document.querySelector('#waitlist-modal form');
  handleFormSubmission(
    waitlistForm,
    '✓ You’re on the waitlist! We’ll notify you when the iOS app launches.'
  );
})();
