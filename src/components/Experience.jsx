import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.exp-header h2', {
      opacity: 0,
      y: 50,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.exp-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    const items = containerRef.current.querySelectorAll('.timeline-item');
    gsap.from(items, {
      opacity: 0,
      x: -25,
      stagger: 0.18,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <section id="experience" ref={containerRef}>
      <div className="container">
        <div className="exp-header">
          <span className="section-label">Experience</span>
          <h2>Professional<br />journey.</h2>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-date">July 2025 — Aug 2025</span>
            <h3 className="timeline-role">Software Development Intern</h3>
            <p className="timeline-company">Alcatel-Lucent Enterprise (ALE India)</p>
            <p className="timeline-desc">
              Built a FastAPI-based log analysis platform to ingest, parse, and visualize AOS switch datasets. Enabled efficient analysis across 10K+ entries with automated pipelines for extraction, regex parsing, and Plotly-based telemetry dashboards.
            </p>
          </div>

          <div className="timeline-item">
            <span className="timeline-date">Oct 2023 — May 2027</span>
            <h3 className="timeline-role">B.E. Computer Science & Engineering</h3>
            <p className="timeline-company">Ramco Institute of Technology</p>
            <p className="timeline-desc">
              CGPA: 7.91 — Focused on systems programming, cybersecurity, and kernel-level development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Row components ────────────────────────────────────────────

function CredRow({ name, meta, index }) {
  return (
    <div
      className="cred-row"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '1rem 0',
        borderBottom: '1px solid var(--border)',
        gap: '2rem',
        opacity: 0,
      }}
    >
      <span style={{
        fontFamily: 'var(--font)',
        fontSize: '0.875rem',
        color: 'var(--text-light)',
        fontWeight: 400,
        lineHeight: 1.4,
      }}>
        {name}
      </span>
      <span style={{
        fontFamily: 'var(--font)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        opacity: 0.65,
      }}>
        {meta}
      </span>
    </div>
  );
}

export function Credentials() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Header columns
    const cols = containerRef.current.querySelectorAll('.credentials-col h3');
    gsap.from(cols, {
      opacity: 0,
      y: 35,
      filter: 'blur(8px)',
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.credentials-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Rows stagger in
    const rows = containerRef.current.querySelectorAll('.cred-row');
    gsap.to(rows, {
      opacity: 1,
      y: 0,
      stagger: 0.055,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.credentials-grid',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // Subtle hover — shift name right
    rows.forEach(row => {
      const name = row.querySelector('span:first-child');
      row.addEventListener('mouseenter', () => {
        gsap.to(name, { x: 6, color: 'var(--gold)', duration: 0.25, ease: 'power2.out' });
      });
      row.addEventListener('mouseleave', () => {
        gsap.to(name, { x: 0, color: 'var(--text-light)', duration: 0.3, ease: 'power2.out' });
      });
    });
  }, { scope: containerRef });

  const certs = [
    ['Junior Cybersecurity Analyst', 'Cisco'],
    ['Certified AppSec Practitioner (CAP)', 'The SecOps Group'],
    ['Certified Network Security Practitioner', 'The SecOps Group'],
    ['Ubuntu Linux Professional', 'Canonical'],
    ['Security Essentials (MSEP)', 'Microsoft'],
    ['Software Engineer Professional', 'HackerRank'],
  ];

  const achievements = [
    ['IndiaSkills Southern Regionals 2026', 'Medallion of Excellence'],
    ['Apoorv CTF 2026', 'Rank 44 Worldwide'],
    ['TryHackMe', 'Top 5% Global Ranking'],
  ];

  return (
    <section id="credentials" ref={containerRef}>
      <div className="container">
        <div className="credentials-grid">

          {/* Certifications */}
          <div className="credentials-col">
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: 'var(--text-light)',
              marginBottom: '2.5rem',
              letterSpacing: '-0.01em',
            }}>
              Certifications
            </h3>
            {certs.map(([name, org], i) => (
              <CredRow key={i} name={name} meta={org} index={i} />
            ))}
          </div>

          {/* Achievements */}
          <div className="credentials-col">
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: 'var(--text-light)',
              marginBottom: '2.5rem',
              letterSpacing: '-0.01em',
            }}>
              Achievements
            </h3>
            {achievements.map(([name, detail], i) => (
              <CredRow key={i} name={name} meta={detail} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}