import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
    { id: 'hero', label: 'Intro', num: '00' },
    { id: 'about', label: 'About', num: '01' },
    { id: 'principles', label: 'Principles', num: '02' },
    { id: 'projects', label: 'Work', num: '03' },
    { id: 'skills', label: 'Skills', num: '04' },
    { id: 'experience', label: 'Experience', num: '05' },
    { id: 'credentials', label: 'Credentials', num: '06' },
    { id: 'contact', label: 'Contact', num: '07' },
];

export default function ScrollSpy() {
    const [active, setActive] = useState(SECTIONS[0]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const found = SECTIONS.find((s) => s.id === entry.target.id);
                        if (found) setActive(found);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
        );

        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // Show pill after scrolling past hero
        const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="scrollspy-pill"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <span className="scrollspy-num">{active.num}</span>
                            <span className="scrollspy-divider">/</span>
                            <span className="scrollspy-label">{active.label}</span>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}