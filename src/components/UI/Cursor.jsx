import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring — laggy spring
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 280, mass: 0.4 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 280, mass: 0.4 });

  // Inner dot — snappy
  const dotX = useSpring(mouseX, { damping: 45, stiffness: 700, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 45, stiffness: 700, mass: 0.1 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleOver = (e) => {
      const el = e.target;
      const isInteractive =
        el.tagName === 'A' ||
        el.tagName === 'BUTTON' ||
        el.closest('a') ||
        el.closest('button') ||
        el.classList.contains('project-card') ||
        el.classList.contains('skill-card');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.body.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseover', handleOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer gold ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1px solid rgba(200, 169, 110, 0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        animate={{
          scale: isHovered ? 2.2 : 1,
          backgroundColor: isHovered ? 'rgba(200,169,110,0.06)' : 'transparent',
          borderColor: isHovered ? 'rgba(200,169,110,0.8)' : 'rgba(200,169,110,0.5)',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      />

      {/* Gold dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'var(--gold)',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}