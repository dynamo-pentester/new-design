import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dot grid array
const dots = Array.from({ length: 36 });

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth <= 768;

    // ── Initial load: fade in hero ──
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1.8,
      ease: 'power2.inOut',
    });

    // Animate brackets and dots in
    gsap.from('.hero-bracket, .hero-dots', {
      opacity: 0,
      duration: 1.2,
      delay: 0.5,
      ease: 'power2.out',
    });

    // ── Pinned scroll: signature cinematic reveal ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=160%',
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      },
    });

    // Fade out scroll indicator
    tl.to('.hero-scroll-indicator', {
      opacity: 0,
      y: 15,
      duration: 0.2,
    });

    // Signature: swoops from large/below to center
    tl.fromTo(
      '.hero-signature',
      { 
        opacity: 0, 
        scale: isMobile ? 2.2 : 3.5, 
        y: isMobile ? 120 : 220, 
        rotate: -6, 
        filter: 'blur(8px)' 
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
      },
      0.1
    );

    // Split words slide outward
    tl.to('.hero-left-word', {
      x: isMobile ? '-15vw' : '-8vw',
      opacity: 0.5,
      duration: 0.8,
    }, 0.5);

    tl.to('.hero-right-word', {
      x: isMobile ? '15vw' : '8vw',
      opacity: 0.5,
      duration: 0.8,
    }, 0.5);

    // Parallax scale on BG
    tl.to('.hero-bg', {
      scale: 1.1,
      duration: 1,
      ease: 'none',
    }, 0);

  }, { scope: containerRef });

  return (
    <section id="hero" ref={containerRef}>
      {/* Background image */}
      <div
        className="hero-bg"
        style={{
          backgroundImage: 'url(/assets/hero-section.png)',
        }}
      />

      {/* Decorative corner brackets */}
      <div className="hero-bracket tl desktop-only" />
      <div className="hero-bracket tr desktop-only" />
      <div className="hero-bracket bl desktop-only" />
      <div className="hero-bracket br desktop-only" />

      {/* Dot grid — top left */}
      <div className="hero-dots desktop-only" style={{
        position: 'absolute',
        top: '8rem',
        left: '5vw',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        zIndex: 2,
        opacity: 0.25,
      }}>
        {dots.map((_, i) => (
          <div key={i} style={{
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: 'var(--gold)',
          }} />
        ))}
      </div>

      {/* Flag progress bar — bottom left */}
      <div className="hero-flag desktop-only" style={{
        position: 'absolute',
        bottom: '6rem',
        left: '5vw',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        <div style={{
          width: '160px',
          height: '1px',
          background: 'linear-gradient(to right, #FF9933, rgba(255,255,255,0.3), #138808)',
          opacity: 0.6,
        }} />
        <div style={{
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: 'var(--text-muted)',
          border: '1px solid rgba(255,255,255,0.25)',
          marginLeft: '20px',
          marginTop: '-2px',
        }} />
      </div>


      {/* Split identity text */}
      <div className="hero-identity" style={{ zIndex: 2 }}>
        {/* LEFT: BL4CK */}

        {/* CENTER spacer for signature */}
        <div style={{ flex: 1 }} />

        {/* RIGHT: H34R7 */}
      </div>

      {/* Signature */}
      <div className="hero-signature-wrap">
        <img
          src="/assets/signature.png"
          alt="Rishikesh R — Signature"
          className="hero-signature"
          style={{ opacity: 0 }} // GSAP controls opacity
        />
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}