import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        setScrolled(aboutEl.getBoundingClientRect().top < 100);
      } else {
        setScrolled(window.scrollY > 50);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(id);
    if (target && lenis) lenis.scrollTo(target);
    else if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    ['#about', 'About'],
    ['#projects', 'Work'],
    ['#skills', 'Skills'],
    ['#contact', 'Contact'],
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`} id="nav">
        {/* Left — logo */}
        <div className="nav-logo-wrap">
          <div className="nav-logo">Rishikesh R</div>
        </div>

        {/* Center — Desktop Links */}
        <div className="nav-links desktop-only">
          {navLinks.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); scrollTo(href); }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right — Actions */}
        <div className="nav-actions">
          <a href="/Rishikesh-R.pdf" target="_blank" rel="noreferrer" className="nav-resume desktop-only">
            Résumé ↗
          </a>

          {/* Hamburger button */}
          <button 
            className={`nav-hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-links">
              {navLinks.map(([href, label], i) => (
                <motion.a
                  key={href}
                  href={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                >
                  <span className="mobile-link-num">0{i+1}</span>
                  <span className="mobile-link-text">{label}</span>
                </motion.a>
              ))}
              <motion.a
                href="/Rishikesh-R.pdf"
                target="_blank"
                rel="noreferrer"
                className="mobile-menu-resume"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
              >
                Résumé ↗
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}