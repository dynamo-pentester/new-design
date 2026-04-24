import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

function MagneticLink({ children, href, className }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPos({
      x: (clientX - (left + width / 2)) * 0.28,
      y: (clientY - (top + height / 2)) * 0.28,
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 0.1 }}
    >
      {children}
    </motion.a>
  );
}

export default function Contact() {
  const containerRef = useRef(null);
  const lenis = useLenis();

  useGSAP(() => {
    gsap.from('.contact-title', {
      opacity: 0,
      y: 70,
      filter: 'blur(14px)',
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-title',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
    gsap.from('.contact-sub', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      delay: 0.2,
      scrollTrigger: {
        trigger: '.contact-inner',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
    gsap.from('.contact-links, .contact-email', {
      opacity: 0,
      y: 18,
      duration: 0.8,
      delay: 0.35,
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.contact-inner',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <>
      <section id="contact" ref={containerRef}>
        <div className="container contact-inner">
          <h2 className="contact-title">
            Let's build<br />something secure.
          </h2>
          <p className="contact-sub">
            Available for challenging roles in systems engineering and offensive security.
          </p>

          <div className="contact-links">
            <MagneticLink href="https://github.com/dynamo-pentester" className="contact-link">
              GitHub
            </MagneticLink>
            <MagneticLink href="https://linkedin.com/in/rishikesh-r-196b5a290" className="contact-link">
              LinkedIn
            </MagneticLink>
            <MagneticLink href="/Rishikesh-R.pdf" className="contact-link">
              Resume
            </MagneticLink>
          </div>

          <a href="mailto:rishikesh091105@gmail.com" className="contact-email">
            rishikesh091105@gmail.com
          </a>
        </div>
      </section>

      <footer className="footer">
        <span style={{
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontSize: '0.65rem',
        }}>
          Rishikesh R
        </span>

        <span style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          opacity: 0.5,
        }}>
          Designed with precision. © {new Date().getFullYear()}
        </span>

        <button
          onClick={() => lenis?.scrollTo(0)}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.5,
            transition: 'opacity 0.3s',
            padding: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}
        >
          ↑ Top
        </button>
      </footer>
    </>
  );
}