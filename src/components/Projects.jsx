import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

/*
 * TAB_H — height in px of the peek strip shown above each back card.
 * Must match the fc-tab height (54px) so the geometry lines up.
 */
const TAB_H = 54;

/* ─────────────────────────────────────────────────────────────────
   PROJECT DATA
──────────────────────────────────────────────────────────────── */
const projects = [
  {
    num: '01',
    title: 'SENTINEL-X',
    desc: 'Cross-platform kernel-level rootkit detection system using Linux LKM and Windows KMDF. Detects SSDT hooks, DKOM process hiding, and CR0 manipulation with blockchain-anchored forensic audit trails.',
    label: 'Kernel Engineering · Security',
    tags: ['C', 'Linux LKM', 'KMDF', 'Python', 'Solidity', 'Web3.py'],
    img: '/assets/project_sentinel.png',
    link: null,
    storyboard:
      'Starting from a real-world rootkit incident, SENTINEL-X was designed to catch kernel-level threats — SSDT hooks, DKOM hiding, CR0 manipulation — before any userspace tool could see them. Every detection is cryptographically anchored to an immutable blockchain trail.',
    technology:
      'Linux Kernel Modules + Windows KMDF with real-time hook detection pipelines and an Ethereum-backed forensic audit layer via Web3.py and Solidity smart contracts.',
    services: ['Kernel Development', 'Threat Detection', 'Blockchain Forensics'],
  },
  {
    num: '02',
    title: 'SecureSplit',
    desc: 'Two-share visual cryptography system with zero-knowledge storage. XOR-splits images into local noise shares and remote IPFS key shares, ensuring neither alone reveals the original data.',
    label: 'Cryptography · Distributed Storage',
    tags: ['Python', 'FastAPI', 'IPFS', 'Pinata', 'Cryptography'],
    img: '/assets/project_securesplit.png',
    link: 'https://github.com/dynamo-pentester/SecureSplit',
    storyboard:
      'The challenge: can you store sensitive data where no single node holds the secret? SecureSplit answers it with visual cryptography — XOR-splitting images across a local noise share and a remote IPFS key share, achieving zero-knowledge by architecture.',
    technology:
      'Python cryptographic primitives + FastAPI backend with IPFS/Pinata distributed storage, share reconstruction logic, and a zero-knowledge verification layer.',
    services: ['Cryptographic Systems', 'Distributed Storage', 'API Engineering'],
  },
  {
    num: '03',
    title: 'MatCare',
    desc: 'Real-time IoT maternal health platform ingesting vitals from ESP32 sensors. Integrates Random Forest health-state prediction and Ethereum blockchain patient identity registration.',
    label: 'IoT · Applied ML · Blockchain',
    tags: ['Flask', 'PostgreSQL', 'ESP32', 'Scikit-Learn', 'Solidity'],
    img: '/assets/project_matcare.png',
    link: 'https://github.com/dynamo-pentester/Matcare',
    storyboard:
      'From firmware on a $5 ESP32 to a Random Forest inference engine to an Ethereum identity layer — MatCare was built end-to-end to bring tamper-proof maternal health monitoring to resource-constrained environments where data integrity matters most.',
    technology:
      'ESP32 sensor firmware → Flask ingestion API → Scikit-Learn Random Forest inference → PostgreSQL storage → Solidity patient identity smart contracts on Ethereum.',
    services: ['IoT Architecture', 'Machine Learning', 'Smart Contracts'],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   PROJECT DETAIL OVERLAY — Tattoo Digital style
   ─ Full-screen hero image
   ─ Scrollable body: large desc + 3-col grid (Storyboard / Tech / Services)
   ─ VIEW SOURCE links directly to GitHub (opens in new tab)
   ═══════════════════════════════════════════════════════════════════ */
function ProjectOverlay({ project, onClose }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const words = project.desc.split(' ');

  return (
    <motion.div
      className="po-overlay"
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ── Close button ── */}
      <button className="po-close" onClick={onClose} aria-label="Close project">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── HERO — full viewport, image fills it ── */}
      <div className="po-hero">
        <img src={project.img} alt={project.title} className="po-hero-img" />
        <div className="po-hero-gradient" />

        {/* Bottom-left: label + massive italic title */}
        <motion.div
          className="po-hero-meta"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="po-hero-label">{project.label}</span>
          <h2 className="po-hero-title">{project.title}</h2>
        </motion.div>

        {/*
          Bottom-right: VIEW SOURCE → GitHub (white pill, Tattoo Digital style)
          Private projects show a muted "RESEARCH · PRIVATE" badge instead.
        */}
        <motion.div
          className="po-hero-cta-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="po-view-btn"
            >
              VIEW SOURCE
            </a>
          ) : (
            <span className="po-view-btn po-view-btn--private">
              RESEARCH · PRIVATE
            </span>
          )}
        </motion.div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="po-body" ref={bodyRef}>

        {/* Large description — word-by-word fade-in */}
        <motion.div
          className="po-desc-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ root: bodyRef, once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          <p className="po-desc">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="po-desc-word"
                initial={{ opacity: 0.12 }}
                whileInView={{ opacity: 1 }}
                viewport={{ root: bodyRef, once: true, margin: '-80px' }}
                transition={{ delay: i * 0.022, duration: 0.45, ease: 'easeOut' }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </p>
        </motion.div>

        {/* 3-column metadata grid */}
        <div className="po-grid">

          {/* / Storyboard */}
          <motion.div
            className="po-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: bodyRef, once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="po-col-label">/ Storyboard</span>
            <p className="po-col-text">{project.storyboard}</p>
          </motion.div>

          {/* / Technology */}
          <motion.div
            className="po-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: bodyRef, once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="po-col-label">/ Technology</span>
            <p className="po-col-text" style={{ marginBottom: '1.5rem' }}>
              {project.technology}
            </p>
            <div className="po-tags">
              {project.tags.map((t, i) => (
                <span key={i} className="po-tag">{t}</span>
              ))}
            </div>
          </motion.div>

          {/* / Services */}
          <motion.div
            className="po-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: bodyRef, once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="po-col-label">/ Services</span>
            <ul className="po-services">
              {project.services.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </motion.div>
        </div>

        <div style={{ height: '8rem' }} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROJECTS SECTION — Pinned file-folder stack
   ═══════════════════════════════════════════════════════════════════ */
export default function Projects() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeProject, setActiveProject] = useState(null);

  /* Lenis ↔ ScrollTrigger bridge + open/close helpers */
  const lenis = useLenis(() => { ScrollTrigger.update(); });

  const openProject = useCallback((project) => {
    lenis?.stop();
    setActiveProject(project);
  }, [lenis]);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    /* Brief delay so Framer exit animation starts before scroll resumes */
    setTimeout(() => lenis?.start(), 80);
  }, [lenis]);

  /* ── GSAP ──────────────────────────────────────────────────────── */
  useGSAP(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const N = cards.length;
    const peelCount = N - 1;

    /* ─── Initial depth state for cards that start BEHIND ───────── *
     *  They're darker and slightly scaled down until they come front  */
    cards.forEach((card, idx) => {
      if (idx === 0) return; // front card is already styled correctly
      gsap.set(card, {
        scale: 0.97 - idx * 0.01,
        filter: `brightness(${0.65 - idx * 0.12})`,
      });
      /* Hide title text until the card becomes front */
      const lines = card.querySelectorAll('.fc-title-line');
      if (lines.length) gsap.set(lines, { yPercent: 108 });
      const label = card.querySelector('.fc-label');
      const cta = card.querySelector('.fc-cta');
      if (label) gsap.set(label, { opacity: 0 });
      if (cta) gsap.set(cta, { opacity: 0 });
    });

    /* ─── Build the peel timeline ───────────────────────────────── *
     *                                                               *
     *  ONE timeline → ONE ScrollTrigger (the correct GSAP pattern  *
     *  when multiple sections above are also pinned).               *
     *                                                               *
     *  DIRECTION: cards fall DOWNWARD out of the section.           *
     *  The section has overflow:hidden, which clips them.           */
    const tl = gsap.timeline();

    for (let i = 0; i < peelCount; i++) {
      const thisCard = cards[i];
      const nextCard = cards[i + 1];
      const nextLines = nextCard.querySelectorAll('.fc-title-line');
      const nextLabel = nextCard.querySelector('.fc-label');
      const nextCta = nextCard.querySelector('.fc-cta');

      /* A — Active card falls DOWNWARD and fades out */
      tl.to(thisCard, {
        /*
         * +ve y → moves DOWN. We push it by the full section height
         * so it always clears the viewport regardless of screen size.
         */
        y: () => sectionRef.current.offsetHeight * 1.05,
        opacity: 0,
        ease: 'power3.inOut',
        duration: 0.7,
      }, i);

      /* B — Next card rises to the front (un-darken, un-shrink) */
      tl.to(nextCard, {
        scale: 1,
        filter: 'brightness(1)',
        ease: 'power2.out',
        duration: 0.7,
      }, i);

      /* C — Title lines slide up into view */
      if (nextLines.length) {
        tl.to(nextLines, {
          yPercent: 0,
          stagger: 0.05,
          ease: 'power3.out',
          duration: 0.38,
        }, i + 0.34);
      }

      /* D — Label + CTA fade in */
      const nextMeta = [nextLabel, nextCta].filter(Boolean);
      if (nextMeta.length) {
        tl.to(nextMeta, {
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out',
          duration: 0.32,
        }, i + 0.54);
      }
    }

    /* One ScrollTrigger drives the entire timeline */
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${peelCount * window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.9,         /* feels weighty but still responsive */
      animation: tl,          /* ← key: single timeline, no conflicts */
      invalidateOnRefresh: true,
    });

  }, { scope: sectionRef });

  /* ── RENDER ───────────────────────────────────────────────────── */
  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',    /* clips cards as they fall downward */
          position: 'relative',
          background: 'var(--bg)',
        }}
      >
        {/* Section header */}
        <div className="catalogue-header" style={{ flexShrink: 0, paddingBottom: '1.5rem' }}>
          <div className="container">
            <span className="section-label">Selected Work</span>
            <h2 className="catalogue-h2">Projects that<br />push boundaries.</h2>
          </div>
        </div>

        {/*
         * FC-STACK — the card area
         * ─────────────────────────────────────────────────────────
         * TOP-PEEK GEOMETRY:
         *
         *   idx 0  SENTINEL-X (front, z=N):
         *          top = (N-1)×TAB_H = 108px   ← starts BELOW the peek strips
         *
         *   idx 1  SecureSplit (mid, z=N-1):
         *          top = (N-2)×TAB_H = 54px    ← one peek strip visible above it
         *
         *   idx 2  MatCare (back, z=1):
         *          top = 0                     ← tallest, peek strip at very top
         *
         * The top 0-108px strip of fc-stack shows cards 1 & 2 peeking.
         * Card 0 (front, highest z) starts at 108px so it never covers the peek.
         *
         * When card 0 scrolls DOWNWARD, it exits below the section floor.
         * Card 1 becomes the new front, repeat.
         */}
        <div
          className="fc-stack"
          style={{ flex: 1, position: 'relative', overflow: 'visible' }}
        >
          {projects.map((p, idx) => {
            const N = projects.length;
            const topOffset = (N - 1 - idx) * TAB_H; // 108 / 54 / 0

            return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className="fc-card"
                style={{
                  position: 'absolute',
                  top: topOffset,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: N - idx,  /* front = highest z */
                  borderRadius: '18px 18px 0 0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  willChange: 'transform, opacity, filter',
                  transformOrigin: 'center center',
                }}
                onClick={() => openProject(p)}
              >
                {/* ── Full-bleed project image ── */}
                <img
                  src={p.img}
                  alt={p.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    zIndex: 0,
                  }}
                />

                {/* ── Gradient darkens toward bottom for legibility ── */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(8,8,8,0.06) 0%, rgba(8,8,8,0.22) 40%, rgba(8,8,8,0.9) 100%)',
                  zIndex: 1,
                }} />

                {/*
                 * ── TOP STRIP — the part that PEEKS when card is behind ──
                 * Shows: num | title  (left)   label (right)
                 * Height = TAB_H (54px), sits at the very top of the card.
                 * When this card is behind the front card, only this strip
                 * is visible (card above starts at a lower top offset).
                 */}
                <div
                  className="fc-tab"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: TAB_H,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2.2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(8,8,8,0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    zIndex: 5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '0.82rem',
                      color: 'var(--gold)',
                      opacity: 0.75,
                      lineHeight: 1,
                      letterSpacing: '0.02em',
                    }}>
                      {p.num}
                    </span>
                    <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.12)' }} />
                    <span style={{
                      fontFamily: 'var(--font)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      opacity: 0.65,
                    }}>
                      {p.title}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font)',
                    fontSize: '0.56rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    opacity: 0.4,
                  }}>
                    {p.label}
                  </span>
                </div>

                {/*
                 * ── CARD CONTENT — bottom-left: number (deco) + label + title + CTA ──
                 * Positioned near the bottom so it's only visible when this
                 * card is the front card (its full height is revealed).
                 */}
                <div style={{
                  position: 'absolute',
                  bottom: '2.8rem',
                  left: '2.5rem',
                  right: '2.5rem',
                  zIndex: 6,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '2rem',
                }}>
                  {/* Decorative large italic number */}
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(4.5rem, 8vw, 7.5rem)',
                    fontWeight: 300,
                    color: 'rgba(200,169,110,0.18)',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    flexShrink: 0,
                    userSelect: 'none',
                    marginBottom: '-0.1em',
                  }}>
                    {p.num}
                  </span>

                  {/* Label + animated title lines + CTA button */}
                  <div style={{ flex: 1 }}>
                    <span
                      className="fc-label"
                      style={{
                        fontFamily: 'var(--font)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontWeight: 500,
                      }}
                    >
                      {p.label}
                    </span>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      fontSize: 'clamp(2rem, 4vw, 4rem)',
                      color: '#fff',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.06,
                      marginBottom: '1.4rem',
                    }}>
                      {p.title.split(' ').map((word, wi) => (
                        <span
                          key={wi}
                          style={{ display: 'block', overflow: 'hidden', lineHeight: 1.1 }}
                        >
                          <span className="fc-title-line" style={{ display: 'block', willChange: 'transform' }}>
                            {word}
                          </span>
                        </span>
                      ))}
                    </h3>

                    {/* "View Project" pill button */}
                    <button
                      className="fc-cta"
                      onClick={(e) => { e.stopPropagation(); openProject(p); }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontFamily: 'var(--font)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        background: 'rgba(8,8,8,0.45)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: '0.6rem 1.4rem',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s, color 0.3s, background 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(200,169,110,0.35)';
                        e.currentTarget.style.color = 'var(--gold)';
                        const arrow = e.currentTarget.querySelector('.fc-cta-arrow');
                        if (arrow) arrow.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                        const arrow = e.currentTarget.querySelector('.fc-cta-arrow');
                        if (arrow) arrow.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>View Project</span>
                      <span
                        className="fc-cta-arrow"
                        style={{ transition: 'transform 0.3s', display: 'inline-block' }}
                      >
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Overlay — fixed, lives outside the pinned section so it escapes overflow:hidden */}
      <AnimatePresence>
        {activeProject && (
          <ProjectOverlay
            project={activeProject}
            onClose={closeProject}
          />
        )}
      </AnimatePresence>
    </>
  );
}