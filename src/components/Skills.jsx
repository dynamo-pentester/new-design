import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    title: 'Kernel & Systems',
    desc: 'C/C++, Linux Kernel Modules, kprobes, Netlink, Syscall Internals, Socket Programming',
    icon: '⌘',
  },
  {
    title: 'Offensive Security',
    desc: 'VAPT, OWASP Top 10, Network Pentesting, Digital Forensics, Log & Traffic Analysis',
    icon: '⚡',
  },
  {
    title: 'Backend & Data',
    desc: 'Python, FastAPI, Flask, REST APIs, PostgreSQL, MongoDB',
    icon: '⛃',
  },
  {
    title: 'Security Tools',
    desc: 'Burp Suite, Metasploit, Nmap, Wireshark, SQLmap, Volatility',
    icon: '⚙',
  },
  {
    title: 'Infrastructure',
    desc: 'Linux (Ubuntu, Kali), Docker, Git/GitHub, VMware, Windows',
    icon: '☁',
  },
  {
    title: 'Core CS',
    desc: 'Operating Systems, Computer Networks, DSA, OOP, Cryptography',
    icon: '△',
  },
];

function TiltCard({ skill, index }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="skill-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <span className="skill-card-icon">{skill.icon}</span>
      <h3>{skill.title}</h3>
      <p>{skill.desc}</p>

      {/* Gold shimmer on top edge */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.25), transparent)',
      }} />
    </motion.div>
  );
}

export default function Skills() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.skills-header h2', {
      opacity: 0,
      y: 50,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.skills-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <section id="skills" ref={containerRef}>
      <div className="container">
        <div className="skills-header">
          <span className="section-label">Expertise</span>
          <h2>Technical<br />proficiency.</h2>
        </div>
        <div className="skills-grid">
          {skills.map((s, idx) => (
            <TiltCard skill={s} key={idx} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}