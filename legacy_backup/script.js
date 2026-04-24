/* =============================================
   PORTFOLIO — MAIN SCRIPT
   GSAP + ScrollTrigger + Lenis
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ─── LENIS SMOOTH SCROLL ────────────────────
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ─── CUSTOM CURSOR ──────────────────────────
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursor && cursorDot && window.innerWidth > 768) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(cursorDot, { x: mx, y: my, duration: 0.1 });
    });

    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      gsap.set(cursor, { x: cx, y: cy });
    });

    document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ─── PAGE LOADER ────────────────────────────
  const loader = document.querySelector('.page-loader');
  const loaderTl = gsap.timeline({
    onComplete: () => {
      if (loader) loader.style.display = 'none';
      initAnimations();
    }
  });

  loaderTl
    .to('.loader-text', { opacity: 1, duration: 0.6, ease: 'power2.out' })
    .to('.loader-text', { opacity: 0, duration: 0.4, delay: 0.4 })
    .to(loader, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' });

  // ─── NAV SCROLL ─────────────────────────────
  const nav = document.querySelector('.nav');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.scroll() > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  });

  // ─── MAIN ANIMATIONS ───────────────────────
  function initAnimations() {
    // HERO
    const heroTl = gsap.timeline();
    heroTl
      .from('#hero', {
        opacity: 0, duration: 1.5, ease: 'power2.inOut'
      })
      .from('.hero-scroll', {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.5');

    // Signature Endgame swooping in
    gsap.fromTo('.hero-signature', 
      {
        opacity: 0,
        scale: 2.5,
        y: 150,
        rotationZ: -10
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationZ: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      }
    );

    // Parallax shapes
    gsap.to('.shape-1', {
      y: '-30vh',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
    gsap.to('.shape-2', {
      y: '20vh',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });

    // ─── ABOUT — WORD REVEAL ────────────────
    const aboutWords = document.querySelectorAll('.about-statement .word');
    if (aboutWords.length) {
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 75%',
        end: 'bottom 45%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          aboutWords.forEach((word, i) => {
            const wordProgress = i / aboutWords.length;
            if (progress > wordProgress) {
              word.classList.add('active');
            } else {
              word.classList.remove('active');
            }
          });
        }
      });
    }

    // ─── PROJECTS — HORIZONTAL SCROLL ───────
    const track = document.querySelector('.horizontal-track');
    const cards = document.querySelectorAll('.project-card');
    if (track && cards.length) {
      const totalScroll = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: '.horizontal-wrap',
          start: 'top top',
          end: () => '+=' + totalScroll,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: 'horizontalScroll'
        }
      });

      // Cinematic Coverflow Reveal
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { opacity: 0.3, scale: 0.85 },
          { 
            opacity: 1, scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById('horizontalScroll'),
              start: 'left 80%',
              end: 'left 40%',
              scrub: true
            }
          }
        );
        gsap.to(card, {
          opacity: 0.3, scale: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById('horizontalScroll'),
            start: 'right 60%',
            end: 'right 20%',
            scrub: true
          }
        });

        // Intense Image Parallax Zoom
        const img = card.querySelector('.project-image');
        if (img) {
          gsap.from(img, {
            scale: 1.4,
            xPercent: -20,
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById('horizontalScroll'),
              start: 'left 100%',
              end: 'right 0%',
              scrub: true
            }
          });
        }
      });
    }

    // ─── SKILLS CARDS REVEAL ────────────────
    const skillCards = gsap.utils.toArray('.skill-card');
    skillCards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.1
      });
    });

    // ─── EXPERIENCE TIMELINE ────────────────
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ─── CREDENTIALS REVEAL ─────────────────
    const credItems = gsap.utils.toArray('.credential-item, .achievement-item');
    credItems.forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.05
      });
    });

    // ─── CONTACT ────────────────────────────
    gsap.from('.contact-sub', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });

    gsap.from('.contact-links', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.4,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });

    // ─── SECTION LABELS ─────────────────────
    gsap.utils.toArray('.section-label').forEach(label => {
      gsap.from(label, {
        opacity: 0,
        x: -20,
        duration: 0.6,
        scrollTrigger: {
          trigger: label,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ─── PREMIUM BLUR REVEAL FOR HEADERS ────
    gsap.utils.toArray('.projects-header h2, .skills-header h2, .exp-header h2, .credentials-col h3, .contact-title').forEach(h => {
      gsap.from(h, {
        opacity: 0,
        y: 60,
        filter: 'blur(15px)',
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: h,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // ─── SPOTLIGHT HOVER EFFECT ───────────────
  const spotlightCards = document.querySelectorAll('.project-card, .skill-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ─── 3D TILT EFFECT ─────────────────────────
  const tiltCards = document.querySelectorAll('.project-card, .skill-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.5
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.7
      });
    });
  });

  // ─── MAGNETIC BUTTONS ───────────────────────
  const magnets = document.querySelectorAll('.nav-links a, .contact-link');
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  // ─── NAV SMOOTH SCROLL LINKS ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) lenis.scrollTo(target);
    });
  });
});
