import React, { useEffect, useRef, useState } from 'react';
import './styling/Dashboard.css';

type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
};

type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  summary?: string;
  bullets?: string[];
  tools?: string[];
  current?: boolean;
};

const projects: Project[] = [
  {
    id: 'p1',
    title: 'AP Invoice Automation',
    description:
      'Azure Durable Functions pipeline integrated with Azure AI Foundry that eliminated 1,500 manual entry hours annually across four business divisions.',
    tech: ['Azure Durable Functions', 'AI Foundry', 'React', '.NET', 'Terraform'],
    link: 'https://github.com/Jack1065?tab=repositories',
  },
  {
    id: 'p2',
    title: 'BOM Extraction Tool',
    description:
      'Bill of Materials extraction for wire-harness engineering drawings using Azure Content Understanding, cross-referenced against Epicor ERP.',
    tech: ['Azure Content Understanding', 'FastAPI', 'React', 'Epicor ERP'],
    link: 'https://github.com/Jack1065?tab=repositories',
  },
  {
    id: 'p3',
    title: 'Biomarker Classification',
    description:
      'ResNet-34 deep-learning model classifying Glioblastoma biomarkers in MRI imaging with a reproducible training pipeline.',
    tech: ['Python', 'TensorFlow', 'Keras'],
    link: 'https://github.com/Jack1065?tab=repositories',
  },
];

const education = [
  {
    school: 'University of Wisconsin–Whitewater',
    degree: 'B.S. in Computer Science',
    minor: 'Web Application Development',
    location: 'Whitewater, WI',
    date: 'May 2025',
    notes: "Dean's List (2021–2025) · Glenn R. Davis Scholarship · GPA 3.75",
  },
];

const skillCategories: { label: string; items: string[] }[] = [
  { label: 'Languages', items: ['Python', 'C#', 'JavaScript', 'TypeScript', 'Java', 'R', 'SQL'] },
  { label: 'Frontend', items: ['React', 'Redux', 'Vue.js', 'Bootstrap', 'Tailwind CSS'] },
  { label: 'Backend & APIs', items: ['Node.js', 'Express.js', '.NET Core', 'EF Core', 'Django', 'Laravel', 'FastAPI'] },
  { label: 'AI & ML', items: ['Azure AI Foundry', 'Azure OpenAI', 'Document Intelligence', 'OpenAI API', 'RAG Pipelines', 'TensorFlow', 'PyTorch', 'Pandas'] },
  { label: 'Cloud & Infra', items: ['Azure', 'Durable Functions', 'Service Bus', 'Container Registry', 'Azure VNet', 'Docker', 'Terraform', 'Bicep'] },
  { label: 'Data & Analytics', items: ['Cosmos DB', 'Snowflake', 'PostgreSQL', 'MSSQL', 'MongoDB', 'Power BI', 'Tableau', 'Qlik'] },
  { label: 'Enterprise Tools', items: ['Epicor ERP', 'Power Automate', 'Logic Apps', 'Postman', 'Jira', 'Jenkins', 'GitHub Actions'] },
];

const experience: ExperienceItem[] = [
  {
    id: 'e-ica',
    role: 'AI Software Engineer',
    company: 'ICA Holdings',
    location: 'Tucson, AZ',
    period: 'Jan 2026 — Present',
    current: true,
    summary:
      'I design and ship AI-powered software solutions across a hybrid Azure architecture — including agentic pipelines, document-processing systems, and full-stack applications integrated with Epicor ERP.',
    tools: [
      'Azure AI Foundry',
      'Azure Content Understanding',
      'Azure Function Apps',
      'Azure API Management',
      'Azure Virtual Network',
      'Container Apps',
      'AI Search',
    ],
  },
  {
    id: 'e-clinisys',
    role: 'Software Development Intern',
    company: 'Clinisys',
    location: 'Tucson, AZ',
    period: 'May 2025 — Aug 2025',
    bullets: [
      'Delivered full-stack features and backend services for enterprise LIMS and LMS platforms used by national healthcare providers, improving clinical workflow efficiency.',
      'Optimized Power BI reporting pipelines, cutting dashboard load times by 30% across all platforms.',
      'Expanded .NET Core unit-test coverage by 20%, reducing regression risk ahead of production releases.',
      'Built React, Redux, and TypeScript components to pixel-accurate Figma specs across clinical modules.',
    ],
  },
  {
    id: 'e-rootriver',
    role: 'Software Engineer',
    company: 'Root River Co-Work',
    location: 'Racine, WI',
    period: 'May 2023 — Aug 2024',
    bullets: [
      'Designed and deployed scalable .NET data-processing API services via Azure DevOps CI/CD for reliable ingestion, transformation, and delivery of client data.',
      'Built a GPT-3.5 Turbo customer-feedback summarization tool with the OpenAI API to surface actionable insights from unstructured feedback.',
      'Optimized a React/TypeScript frontend, reducing bundle size by 30% and improving page load speed by 35%.',
      'Led migration to a new payment-provider API, reducing transaction failures and improving reliability.',
    ],
  },
];

const myPic = require('../MyPic.png');

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
];

export const Dashboard: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || window.pageYOffset) > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal-on-scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const els = mainRef.current?.querySelectorAll('.reveal') ?? [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Active section highlight for nav
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site">
      <div className="site-glow" aria-hidden="true" />

      {/* ── Header ───────────────────────────────────────────── */}
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-container header-inner">
          <a href="#about" className="brand">
            <span className="brand-mark"><img src={myPic} alt="Jack Kurtz" /></span>
            <span className="brand-text">
              <span className="brand-name">Jack Kurtz</span>
              <span className="brand-role">AI Engineer</span>
            </span>
          </a>
          <nav className="site-nav">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`nav-link ${activeSection === n.id ? 'is-active' : ''}`}
              >
                {n.label}
              </a>
            ))}
            <a className="nav-cta" href="mailto:jkurtz354@gmail.com">
              Get in touch
            </a>
          </nav>
        </div>
      </header>

      <main ref={mainRef} className="site-container site-main">
        {/* ── Hero / About ───────────────────────────────────── */}
        <section id="about" className="hero">
          <div className="hero-photo">
            <div className="photo-frame">
              <img src={myPic} alt="Jack Kurtz" />
            </div>
          </div>
          <p className="eyebrow">Hi, my name is</p>
          <h1 className="hero-name">Jack Kurtz.</h1>
          <h2 className="hero-tagline">I build AI automation on Azure.</h2>
          <p className="hero-desc">
            AI Engineer in Tucson, AZ, focused on architecting durable cloud pipelines,
            document-intelligence systems, and full-stack applications that turn manual
            workflows into measurable hours saved.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">View my work</a>
            <a
              className="btn btn-ghost"
              href="https://github.com/Jack1065"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn btn-ghost"
              href="https://www.linkedin.com/in/jack-kurtz-b51a44240"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </section>

        {/* ── Experience ─────────────────────────────────────── */}
        <section id="experience" className="section reveal">
          <div className="section-head">
            <span className="section-index">01</span>
            <h2 className="section-title">Experience</h2>
            <span className="section-rule" />
          </div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.id} className="timeline-item">
                <span className="timeline-dot" aria-hidden="true" />
                <div className="exp-card">
                  <div className="exp-top">
                    <div>
                      <h3 className="exp-role">
                        {e.role}
                        <span className="exp-company"> · {e.company}</span>
                        {e.current && <span className="badge-current">Current</span>}
                      </h3>
                      {e.location && <p className="exp-loc">{e.location}</p>}
                    </div>
                    <span className="exp-period">{e.period}</span>
                  </div>
                  {e.summary && <p className="exp-summary">{e.summary}</p>}
                  {e.bullets && e.bullets.length > 0 && (
                    <ul className="exp-bullets">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {e.tools && e.tools.length > 0 && (
                    <ul className="exp-tools">
                      {e.tools.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Projects ───────────────────────────────────────── */}
        <section id="projects" className="section reveal">
          <div className="section-head">
            <span className="section-index">02</span>
            <h2 className="section-title">Selected Projects</h2>
            <span className="section-rule" />
          </div>
          <div className="project-grid">
            {projects.map((p) => (
              <div key={p.id} className="project-card">
                <div className="project-card-head">
                  <span className="project-folder" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                    </svg>
                  </span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>
                <ul className="project-tech">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ─────────────────────────────────────────── */}
        <section id="skills" className="section reveal">
          <div className="section-head">
            <span className="section-index">03</span>
            <h2 className="section-title">Technical Skills</h2>
            <span className="section-rule" />
          </div>
          <div className="skills-grid">
            {skillCategories.map((cat) => (
              <div key={cat.label} className="skill-group">
                <h3 className="skill-label">{cat.label}</h3>
                <ul className="skill-pills">
                  {cat.items.map((s) => (
                    <li key={s} className="skill-pill">{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Education ──────────────────────────────────────── */}
        <section id="education" className="section reveal">
          <div className="section-head">
            <span className="section-index">04</span>
            <h2 className="section-title">Education</h2>
            <span className="section-rule" />
          </div>
          {education.map((ed) => (
            <div key={ed.school} className="edu-card">
              <div className="edu-top">
                <div>
                  <h3 className="edu-school">{ed.school}</h3>
                  <p className="edu-degree">
                    {ed.degree}
                    {ed.minor ? ` · Minor in ${ed.minor}` : ''}
                  </p>
                  <p className="edu-loc">{ed.location}</p>
                </div>
                <span className="edu-date">{ed.date}</span>
              </div>
              {ed.notes && <p className="edu-notes">{ed.notes}</p>}
            </div>
          ))}
        </section>

        {/* ── Contact ────────────────────────────────────────── */}
        <section id="contact" className="contact reveal">
          <p className="eyebrow">What's next?</p>
          <h2 className="contact-title">Let's build something.</h2>
          <p className="contact-desc">
            I'm always open to discussing AI engineering, cloud architecture, or interesting
            problems worth solving. My inbox is open.
          </p>
          <a className="btn btn-primary btn-lg" href="mailto:jkurtz354@gmail.com">
            Say hello
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-container footer-inner">
          <span>© {new Date().getFullYear()} Jack Kurtz</span>
          <div className="footer-links">
            <a href="https://github.com/Jack1065" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/jack-kurtz-b51a44240" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:jkurtz354@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
