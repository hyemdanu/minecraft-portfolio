import { useEffect, useState } from 'react'

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)

export default function BusinessButton() {
  const [open, setOpen] = useState(false)

  // Esc closes
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <>
      <button
        className="mc-toggle mc-toggle--business"
        onClick={() => setOpen(true)}
        title="Professional view"
        type="button"
      >
        <BriefcaseIcon />
      </button>

      {open && <BusinessPage onClose={() => setOpen(false)} />}
    </>
  )
}

function BusinessPage({ onClose }) {
  return (
    <div className="biz-page">
      <header className="biz-header">
        <div className="biz-name">Edison Ho</div>
        <button className="biz-back" type="button" onClick={onClose}>
          ← Back to site
        </button>
      </header>

      <main className="biz-body">
        <section className="biz-section">
          <div className="biz-contact">
            <a href="mailto:hoedison2003@gmail.com">hoedison2003@gmail.com</a>
            <span> · </span>
            <a href="tel:+19166067800">(916) 606-7800</a>
            <span> · </span>
            <a href="https://www.linkedin.com/in/edison-ho-a3a91228a" target="_blank" rel="noreferrer">LinkedIn</a>
            <span> · </span>
            <a href="https://github.com/hyemdanu" target="_blank" rel="noreferrer">GitHub</a>
            <span> · </span>
            <a href="/Edison_Ho_Resume.pdf" target="_blank" rel="noreferrer">Resume (PDF)</a>
          </div>
        </section>

        <section className="biz-section">
          <h2>Project Experience</h2>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">Lattice Labs</div>
              <div className="biz-row-sub">Lead Full Stack Developer · Sacramento, CA</div>
            </div>
            <div className="biz-row-meta">Oct 2025 – Present</div>
          </div>
          <ul>
            <li>Lead developer for a HIPAA-compliant EHR system for ALEMS Senior Care using React, Spring Boot, Maven, MySQL, and AWS, implementing role-based access controls and data encryption to protect patient health information</li>
            <li>Hardened patient data access and reduced backend query volume by ~90% on the ALEMS senior care platform by implementing JWT authentication, AES encryption, and Argon2 hashing while refactoring N+1 query patterns into batched operations</li>
            <li>Configured and connected AWS RDS MySQL instances to the Spring Boot application, diagnosing and fixing connectivity and authentication errors during deployment</li>
            <li>Coordinated delivery across 8 developers by assigning tasks in Jira, reviewing pull requests, and maintaining clear communication with the client and advisor to ensure on-time feature completion</li>
          </ul>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">Persephone — AI Desktop Companion</div>
              <div className="biz-row-sub">Lead Developer</div>
            </div>
          </div>
          <ul>
            <li>Developed an AI desktop companion in Python simulating emotionally aware conversations through a psychology engine with 9 subsystems, dynamically adjusting tone and behavior based on user interaction patterns</li>
            <li>Fine-tuned a 14B parameter LLM with custom dataset and deployed locally through Ollama, eliminating cloud API dependency and achieving quick response generation with minimal delay</li>
            <li>Led a team of 4 developers to build and integrate a multi-platform system with a 2D avatar, voice TTS, and Discord bot, coordinating frontend, backend, and AI workstreams to deliver a cohesive product</li>
          </ul>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">Car Maintenance &amp; Repair Management Website</div>
              <div className="biz-row-sub">Lead Full Stack Developer</div>
            </div>
          </div>
          <ul>
            <li>Led a team of 8 developers to build a full-stack vehicle management platform using React.js, Spring Boot, and MySQL, handling the majority of development across frontend, backend, and database implementation</li>
            <li>Created all MySQL database tables for vehicles, maintenance records, and user accounts, configured AWS hosting, and established database connections to the Spring Boot application</li>
            <li>Integrated third-party vehicle API and developed REST endpoints to handle CRUD operations for maintenance tracking and service scheduling</li>
          </ul>
        </section>

        <section className="biz-section">
          <h2>Education &amp; Certifications</h2>
          <div className="biz-row">
            <div>
              <div className="biz-row-title">California State University, Sacramento</div>
              <div className="biz-row-sub">B.S. in Computer Science</div>
            </div>
            <div className="biz-row-meta">Graduation: May 2026</div>
          </div>
          <ul>
            <li>CompTIA Security+</li>
            <li>Google Technical Support Fundamentals</li>
          </ul>
        </section>

        <section className="biz-section">
          <h2>Technical Skills</h2>
          <div className="biz-skills">
            <div><strong>IT &amp; Systems:</strong> MySQL, schema design, Windows administration, Linux, Bash / PowerShell, PC hardware, networking fundamentals</div>
            <div><strong>Programming:</strong> Java, JavaScript, Python, C#, HTML, CSS, MySQL, React, Node.js, Spring Boot, Maven, Flask, Expo</div>
            <div><strong>Developer Tools:</strong> Git, GitHub, Jira, IntelliJ, VS Code, Agile / Scrum, SDLC</div>
          </div>
        </section>

        <section className="biz-section">
          <h2>Work Experience</h2>
          <div className="biz-row">
            <div>
              <div className="biz-row-title">Osaka Sushi</div>
              <div className="biz-row-sub">Host / Busboy / Dishwasher · Sacramento, CA</div>
            </div>
            <div className="biz-row-meta">Jun 2017 – Jun 2024</div>
          </div>
          <ul>
            <li>Delivered excellent guest experiences over 7 years by managing table assignments and coordinating take-out orders to ensure customer satisfaction during high-volume shifts</li>
            <li>Maintained efficient dining operations by supporting coworkers and handling multiple responsibilities simultaneously including bussing, dishwashing, and floor organization to keep service running smoothly during peak hours</li>
          </ul>
        </section>

        <section className="biz-section">
          <h2>Goals</h2>
          <p>
            Looking for full-time technical roles starting May 2026 — open to full-stack, backend,
            frontend, IT support, QA, and database roles. Long-term interest in roles across security operations (SOC analyst, incident response), offensive security (penetration testing, red team), and emerging areas like AI/ML security and application security. Open to remote, hybrid, or on-site
            in California.
          </p>
        </section>
      </main>
    </div>
  )
}
