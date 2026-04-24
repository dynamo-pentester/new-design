import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const aboutText =
  "I'm a security-focused engineer who bridges the gap between offensive testing and secure system internals. I build kernel-level detection systems, design cryptographic protocols, and architect secure backend pipelines — from the syscall table to the blockchain.";

export default function About() {
  const containerRef = useRef(null);
  const words = aboutText.split(' ');

  useGSAP(() => {
    const wordEls = containerRef.current.querySelectorAll('.about-word');

    // Animate section label
    gsap.from('.about-label', {
      opacity: 0,
      x: -20,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Pinned word reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      },
    });

    tl.to(wordEls, {
      opacity: 1,
      stagger: 0.04,
      ease: 'none',
    });

  }, { scope: containerRef });

  return (
    <section
      id="about"
      ref={containerRef}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        maxWidth: '1100px',
        padding: '0 5vw',
        position: 'relative',
        zIndex: 1,
      }}>
        <span
          className="about-label"
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            display: 'block',
            marginBottom: '3rem',
            opacity: 0.8,
          }}
        >
          About
        </span>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1.5rem, 4.2vw, 3.8rem)',
          lineHeight: 1.35,
          letterSpacing: '-0.02em',
          color: '#fff',
        }}>
          {words.map((word, i) => (
            <span
              key={i}
              className="about-word"
              style={{
                display: 'inline-block',
                marginRight: '0.3em',
                opacity: 0.08,
                willChange: 'opacity',
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}