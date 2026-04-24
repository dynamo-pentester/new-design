import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    num: '01',
    title: "Philosophy",
    text: "Security is not a product, but a process. I believe in defense in depth and proactive threat modeling at every layer of the stack.",
  },
  {
    num: '02',
    title: "Architecture",
    text: "Resilient systems start with zero-trust principles. Every component must verify, never assume. Trust is earned, never inherited.",
  },
  {
    num: '03',
    title: "Offensive Mindset",
    text: "To build secure pipelines, you must understand how to break them. Adopt the adversary's perspective before they do.",
  },
  {
    num: '04',
    title: "Scalability",
    text: "Security protocols must scale horizontally without bottlenecking performance or developer velocity. Friction breeds bypass.",
  },
];

export default function Carousel() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth <= 768;

    // Header animations
    gsap.from('.blueprint-header h2', {
      opacity: 0,
      y: 60,
      filter: 'blur(14px)',
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.blueprint-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from('.blueprint-header .section-label', {
      opacity: 0,
      x: -18,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.blueprint-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Horizontal scroll
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll('.principles-card');
    
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      return trackWidth - viewportWidth;
    };

    const scrollTween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current.querySelector('.blueprint-horizontal-wrap'),
        start: 'top top',
        end: () => '+=' + (track.scrollWidth * (isMobile ? 1.5 : 1)),
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Coverflow effect — fade in
    cards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: isMobile ? 0.4 : 0.15, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: isMobile ? 'left 90%' : 'left 100%',
            end: isMobile ? 'left 20%' : 'left 40%',
            scrub: true,
          },
        }
      );
      // Fade out
      gsap.to(card, {
        opacity: isMobile ? 0.4 : 0.15,
        scale: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: 'left 0%',
          end: 'right 0%',
          scrub: true,
        },
      });
    });

  }, { scope: containerRef });


  return (
    <section id="principles" ref={containerRef} style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ paddingTop: '12rem' }}>
        <div className="blueprint-header">
          <span className="section-label">Core Principles</span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
            fontWeight: 300,
            color: 'var(--text-light)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}>
            The Blueprint.
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginTop: '1rem',
            letterSpacing: '0.04em',
          }}>
            Scroll to explore →
          </p>
        </div>
      </div>

      <div className="blueprint-horizontal-wrap" style={{ marginTop: '4rem' }}>
        <div
          className="horizontal-track"
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '2.5vw',
            alignItems: 'center',
            paddingLeft: '5vw',
            paddingRight: '45vw',
            willChange: 'transform',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="principles-card"
              style={{ willChange: 'transform, opacity' }}
            >
              <div>
                <div className="principles-card-num">{item.num}</div>
                <h3 className="principles-card-title">{item.title}</h3>
              </div>
              <p className="principles-card-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}