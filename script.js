document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 700);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const setMenu = (open, focusFirst = false) => {
    const wasOpen = navLinks.classList.contains('is-open');

    menuToggle.classList.toggle('is-open', open);
    navLinks.classList.toggle('is-open', open);
    navBackdrop.classList.toggle('is-visible', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    if (open && focusFirst) {
      requestAnimationFrame(() => {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      });
    } else if (wasOpen && navLinks.contains(document.activeElement)) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener('click', (event) => {
    const open = !navLinks.classList.contains('is-open');
    setMenu(open, event.detail === 0);
  });

  navBackdrop.addEventListener('click', () => setMenu(false));

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  const headerBrand = document.querySelector('.site-header .brand');
  if (headerBrand) headerBrand.addEventListener('click', () => setMenu(false));

  let touchStartX = null;

  navLinks.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  navLinks.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (deltaX > 70) setMenu(false);
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
      setMenu(false);
      menuToggle.focus();
    }

    if (event.key === 'Tab' && navLinks.classList.contains('is-open')) {
      const focusable = [
        ...navLinks.querySelectorAll('a[href], button'),
        menuToggle
      ].filter((el) => el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && navLinks.classList.contains('is-open')) {
      setMenu(false);
    }
  });

  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const counterEls = document.querySelectorAll('[data-count]');

  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;

    if (reduceMotion) {
      el.textContent = target.toLocaleString('en-KE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
      return;
    }

    let start = null;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      el.textContent = value.toLocaleString('en-KE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (counterEls.length) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counterEls.forEach((el) => counterObserver.observe(el));
    } else {
      counterEls.forEach(runCounter);
    }
  }

  const planData = {
    muscle: {
      title: 'Hypertrophy Builder',
      blurb: 'Progressive strength work with enough volume to add lean size — without living in the gym.',
      tags: ['Muscle', 'Strength', 'Recovery'],
      splits: {
        2: ['Full A', 'Full B'],
        3: ['Push', 'Pull', 'Legs'],
        4: ['Upper', 'Lower', 'Upper', 'Lower'],
        5: ['Push', 'Pull', 'Legs', 'Upper', 'Lower']
      }
    },
    fat: {
      title: 'Lean & Athletic',
      blurb: 'Strength training paired with smart conditioning so you lose fat and keep the muscle you build.',
      tags: ['Fat loss', 'Strength', 'Conditioning'],
      splits: {
        2: ['Strength', 'Cardio'],
        3: ['Strength', 'Cardio', 'Full'],
        4: ['Upper', 'Cardio', 'Lower', 'Cardio'],
        5: ['Push', 'Pull', 'Legs', 'Cardio', 'Full']
      }
    },
    strength: {
      title: 'Strength First',
      blurb: 'A focused progression on the big lifts, with accessory work to keep you moving well and injury-free.',
      tags: ['Strength', 'Power', 'Technique'],
      splits: {
        2: ['Squat', 'Press'],
        3: ['Squat', 'Press', 'Pull'],
        4: ['Squat', 'Press', 'Pull', 'Upper'],
        5: ['Squat', 'Press', 'Pull', 'Lower', 'Upper']
      }
    },
    endurance: {
      title: 'Engine Builder',
      blurb: 'Interval work and aerobic base building that raises your ceiling without flattening your strength.',
      tags: ['Endurance', 'Conditioning', 'Stamina'],
      splits: {
        2: ['Intervals', 'Long'],
        3: ['Intervals', 'Tempo', 'Long'],
        4: ['Intervals', 'Strength', 'Tempo', 'Long'],
        5: ['Intervals', 'Strength', 'Tempo', 'Aerobic', 'Long']
      }
    },
    health: {
      title: 'Foundation Reset',
      blurb: 'A sustainable mix of strength, mobility and low-impact conditioning for feeling good every day.',
      tags: ['Habits', 'Mobility', 'Longevity'],
      splits: {
        2: ['Full A', 'Full B'],
        3: ['Strength', 'Mobility', 'Cardio'],
        4: ['Upper', 'Lower', 'Mobility', 'Cardio'],
        5: ['Push', 'Pull', 'Legs', 'Mobility', 'Cardio']
      }
    }
  };

  const levelLabels = {
    beginner: 'New to training',
    intermediate: 'Some experience',
    advanced: 'Advanced'
  };

  const levelStyle = {
    beginner: 'Guided',
    intermediate: 'Hybrid',
    advanced: 'Performance'
  };

  const levelMinutes = {
    beginner: '45 min',
    intermediate: '55 min',
    advanced: '70 min'
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trainingDays = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4]
  };

  const builderState = { goal: 'muscle', level: 'intermediate', days: 4 };

  const planTitle = document.getElementById('planTitle');
  const planBlurb = document.getElementById('planBlurb');
  const planTags = document.getElementById('planTags');
  const planSessions = document.getElementById('planSessions');
  const planLength = document.getElementById('planLength');
  const planStyle = document.getElementById('planStyle');
  const planBadge = document.getElementById('planBadge');
  const planWeek = document.getElementById('planWeek');
  const planCta = document.getElementById('planCta');
  const goalSelect = document.getElementById('goal');

  const renderPlan = () => {
    const plan = planData[builderState.goal];
    const split = plan.splits[builderState.days];
    const activeDays = trainingDays[builderState.days];

    planTitle.textContent = plan.title;
    planBlurb.textContent = plan.blurb;
    planSessions.textContent = builderState.days + ' / wk';
    planLength.textContent = levelMinutes[builderState.level];
    planStyle.textContent = levelStyle[builderState.level];
    planBadge.textContent = levelLabels[builderState.level];

    planTags.replaceChildren();
    plan.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      planTags.appendChild(span);
    });

    planWeek.replaceChildren();
    let workoutIndex = 0;

    dayNames.forEach((day, index) => {
      const isTraining = activeDays.includes(index);
      const cell = document.createElement('div');
      cell.className = 'day' + (isTraining ? ' is-training' : '');

      const name = document.createElement('span');
      name.className = 'day-name';
      name.textContent = day;

      const focus = document.createElement('span');
      focus.className = 'day-focus';
      focus.textContent = isTraining ? split[workoutIndex] : 'Rest';

      if (isTraining) workoutIndex += 1;

      cell.append(name, focus);
      planWeek.appendChild(cell);
    });
  };

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      const value = chip.dataset.value;

      document.querySelectorAll(`.chip[data-group="${group}"]`).forEach((sibling) => {
        sibling.setAttribute('aria-pressed', String(sibling === chip));
      });

      builderState[group] = group === 'days' ? parseInt(value, 10) : value;
      renderPlan();
    });
  });

  planCta.addEventListener('click', () => {
    if (goalSelect) goalSelect.value = builderState.goal;
  });

  renderPlan();

  const billingMonthly = document.getElementById('billingMonthly');
  const billingQuarterly = document.getElementById('billingQuarterly');
  const pricingNote = document.getElementById('pricingNote');
  const priceAmounts = document.querySelectorAll('.price-amount');
  const billedNotes = document.querySelectorAll('.price-billed');

  const setBilling = (period) => {
    billingMonthly.setAttribute('aria-pressed', String(period === 'monthly'));
    billingQuarterly.setAttribute('aria-pressed', String(period === 'quarterly'));

    priceAmounts.forEach((el) => {
      const value = Number(el.dataset[period]);
      el.textContent = value.toLocaleString('en-KE');
    });

    billedNotes.forEach((note) => {
      note.textContent = period === 'monthly'
        ? 'Billed monthly. Cancel anytime.'
        : 'Billed quarterly. You save 15%.';
    });

    pricingNote.textContent = period === 'monthly'
      ? 'All plans include a free 20-minute consult. Prices in Kenyan shillings.'
      : 'Quarterly plans are billed every 3 months. All prices in Kenyan shillings.';
  };

  billingMonthly.addEventListener('click', () => setBilling('monthly'));
  billingQuarterly.addEventListener('click', () => setBilling('quarterly'));

  const track = document.getElementById('testimonialTrack');
  const slides = Array.from(track.children);
  const dotsContainer = document.getElementById('carouselDots');
  const prevSlide = document.getElementById('prevSlide');
  const nextSlide = document.getElementById('nextSlide');
  const carouselCount = document.getElementById('carouselCount');
  const carouselViewport = document.getElementById('testimonialViewport');
  const carouselShell = document.querySelector('.testimonial-shell');

  let slideIndex = 0;
  let autoplayTimer = null;

  const dots = slides.map((_, index) => {
    const button = document.createElement('button');
    button.className = 'dot-btn';
    button.type = 'button';
    button.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    button.addEventListener('click', () => {
      goToSlide(index);
      restartAutoplay();
    });
    dotsContainer.appendChild(button);
    return button;
  });

  const goToSlide = (index) => {
    slideIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    carouselCount.textContent = `${String(slideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;

    dots.forEach((dot, dotIndex) => {
      if (dotIndex === slideIndex) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    slides.forEach((slide, slideIdx) => {
      slide.setAttribute('aria-hidden', String(slideIdx !== slideIndex));
    });
  };

  const startAutoplay = () => {
    if (reduceMotion) return;
    stopAutoplay();
    autoplayTimer = window.setInterval(() => goToSlide(slideIndex + 1), 7000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  prevSlide.addEventListener('click', () => {
    goToSlide(slideIndex - 1);
    restartAutoplay();
  });

  nextSlide.addEventListener('click', () => {
    goToSlide(slideIndex + 1);
    restartAutoplay();
  });

  carouselShell.addEventListener('mouseenter', stopAutoplay);
  carouselShell.addEventListener('mouseleave', startAutoplay);
  carouselShell.addEventListener('focusin', stopAutoplay);
  carouselShell.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  carouselViewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      goToSlide(slideIndex - 1);
      restartAutoplay();
    }
    if (event.key === 'ArrowRight') {
      goToSlide(slideIndex + 1);
      restartAutoplay();
    }
  });

  goToSlide(0);
  startAutoplay();

  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  const setFaqState = (item, open) => {
    const button = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');

    button.setAttribute('aria-expanded', String(open));
    panel.style.maxHeight = open ? `${panel.scrollHeight + 32}px` : '0px';
  };

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-q');

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      faqItems.forEach((other) => setFaqState(other, false));

      if (!isOpen) setFaqState(item, true);
    });
  });

  const syncOpenFaq = () => {
    faqItems.forEach((item) => {
      const button = item.querySelector('.faq-q');
      if (button.getAttribute('aria-expanded') === 'true') {
        const panel = item.querySelector('.faq-a');
        panel.style.maxHeight = `${panel.scrollHeight + 32}px`;
      }
    });
  };

  if (faqItems.length) {
    setFaqState(faqItems[0], true);
    window.addEventListener('resize', syncOpenFaq);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncOpenFaq);
    }
  }

  const form = document.getElementById('bookingForm');
  const formCard = document.getElementById('formCard');
  const successName = document.getElementById('successName');
  const formSuccess = document.getElementById('formSuccess');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (input, hasError) => {
    const field = input.closest('.form-field');
    field.classList.toggle('has-error', hasError);
    input.setAttribute('aria-invalid', String(hasError));
  };

  const validateName = () => {
    const valid = nameField.value.trim().length > 0;
    setFieldError(nameField, !valid);
    return valid;
  };

  const validateEmail = () => {
    const valid = emailPattern.test(emailField.value.trim());
    setFieldError(emailField, !valid);
    return valid;
  };

  nameField.addEventListener('input', () => {
    if (nameField.value.trim()) setFieldError(nameField, false);
  });

  emailField.addEventListener('input', () => {
    if (emailPattern.test(emailField.value.trim())) setFieldError(emailField, false);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();

    if (!nameValid || !emailValid) {
      if (!nameValid) {
        nameField.focus();
      } else {
        emailField.focus();
      }
      return;
    }

    const firstName = nameField.value.trim().split(/\s+/)[0];
    successName.textContent = firstName;
    formCard.classList.add('is-success');
    form.reset();
    formSuccess.setAttribute('tabindex', '-1');
    formSuccess.focus({ preventScroll: true });
  });

  const navSectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navSectionLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );

    navSectionLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section && section.id !== 'home') sectionObserver.observe(section);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
});
