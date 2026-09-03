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
          <h2>Work Experience</h2>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">California Franchise Tax Board</div>
              <div className="biz-row-sub">Student Assistant, Enterprise Quality Assurance · Sacramento, CA</div>
            </div>
            <div className="biz-row-meta">Jul 2026 – Present</div>
          </div>
          <ul>
            <li>Conduct system, regression, integration, functional, and end-to-end testing across the SDLC for enterprise case management and audit applications, authoring and executing test scripts</li>
            <li>Validate Secure Audit Logging in Splunk (SIEM), confirming user actions generate expected events with accurate timestamps, user IDs, and field values</li>
            <li>Query Microsoft SQL Server to verify case records reflect the expected results of application transactions</li>
            <li>Perform root cause analysis on failed tests to isolate environment and test-data issues from application defects</li>
            <li>Verify Change Orders, Support Requests, and Information Requests against documentation and master test scripts, logging defects in Azure DevOps with reproduction steps, evidence, and severity</li>
            <li>Participate in weekly status meetings across cross-functional teams and attend defect triage and deployment meetings with developers, analysts, product owners, and vendors</li>
          </ul>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">Osaka Sushi</div>
              <div className="biz-row-sub">Host / Busboy / Dishwasher · Sacramento, CA</div>
            </div>
            <div className="biz-row-meta">Jun 2017 – Jun 2024</div>
          </div>
          <ul>
            <li>Managed seating, take-out orders, and table turnover during high-volume shifts, adapting between roles to keep service running smoothly</li>
          </ul>
        </section>

        <section className="biz-section">
          <h2>Project Experience</h2>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">Lattice Labs</div>
              <div className="biz-row-sub">Lead Full Stack Developer · Sacramento, CA</div>
            </div>
            <div className="biz-row-meta">Oct 2025 – May 2026</div>
          </div>
          <ul>
            <li>Led development of a HIPAA-compliant EHR system for ALEMS Senior Care using React, Spring Boot, MySQL, and AWS</li>
            <li>Secured patient health information across every user role by implementing role-based access control, JWT authentication, AES encryption, and Argon2 hashing to meet HIPAA requirements</li>
            <li>Resolved deployment-blocking connectivity and authentication errors by configuring and debugging AWS RDS MySQL instances against the Spring Boot backend</li>
            <li>Delivered features on schedule across an 8-developer Agile team by running sprints in Jira, reviewing pull requests, and managing client and advisor communication</li>
          </ul>

          <div className="biz-row">
            <div>
              <div className="biz-row-title">Persephone — AI Desktop Companion</div>
              <div className="biz-row-sub">Lead Developer</div>
            </div>
            <div className="biz-row-meta">March 2026</div>
          </div>
          <ul>
            <li>Enabled emotionally adaptive conversations by building a 9-subsystem psychology engine in Python that adjusts tone and behavior to user interaction patterns</li>
            <li>Eliminated cloud API dependency and kept user data on-device by fine-tuning a 14B-parameter LLM on a custom dataset and deploying it locally via Ollama</li>
            <li>Shipped a multi-platform product (2D avatar, voice TTS, Discord bot) by leading 4 developers across frontend, backend, and AI workstreams</li>
          </ul>
        </section>

        <section className="biz-section">
          <h2>Education &amp; Certifications</h2>
          <div className="biz-row">
            <div>
              <div className="biz-row-title">California State University, Sacramento</div>
              <div className="biz-row-sub">B.S. in Computer Science</div>
            </div>
            <div className="biz-row-meta">May 2026</div>
          </div>
          <div className="biz-row">
            <div>
              <div className="biz-row-title">Cosumnes River College</div>
              <div className="biz-row-sub">A.S. in Cybersecurity and Information Assurance</div>
            </div>
            <div className="biz-row-meta">Aug 2026 – Present</div>
          </div>
          <div className="biz-row">
            <div>
              <div className="biz-row-title">CompTIA Security+</div>
            </div>
            <div className="biz-row-meta">March 2026</div>
          </div>
        </section>

        <section className="biz-section">
          <h2>Technical Skills</h2>
          <div className="biz-skills">
            <div><strong>QA &amp; Testing:</strong> System, regression, integration, and end-to-end testing; test scripts; defect tracking; root cause analysis</div>
            <div><strong>Security:</strong> Splunk (SIEM), Secure Audit Logging, RBAC, JWT authentication, AES encryption, Argon2 hashing, HIPAA</div>
            <div><strong>Languages &amp; Frameworks:</strong> Java, Python, JavaScript, React, Spring Boot</div>
            <div><strong>Databases:</strong> Microsoft SQL Server, MySQL, SQL query writing, schema design</div>
            <div><strong>Tools &amp; Platforms:</strong> Azure DevOps, Jira, Git, SharePoint, AWS (RDS), Ollama, Windows, Linux, Bash / PowerShell, Excel</div>
          </div>
        </section>

        <section className="biz-section">
          <h2>Goals</h2>
          <p>
            Long-term interest in roles across security operations (SOC analyst, incident response),
            offensive security (penetration testing, red team), and emerging areas like AI/ML security
            and application security. Also open to full-stack, backend, QA, and database roles.
            Remote, hybrid, or on-site — open to any location.
          </p>
        </section>

      </main>
    </div>
  )
}
