import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageLoader() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline();
    tl.to(el, {
      yPercent: -100,
      duration: 1.2,
      delay: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        el.style.display = 'none';
      },
    });

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font)',
          fontSize: '0.6rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        Rishikesh R
      </span>
    </div>
  );
}
