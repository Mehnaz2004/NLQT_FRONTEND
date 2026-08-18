import React from 'react';
import { NellyAnimation } from './NellyAnimation';
import { Database, MessageSquareCode, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-container animate-fade-in">
      <header className="landing-header">
        <div className="logo-section">
          <Database className="logo-icon" size={24} />
          <span className="logo-text">NLQT<span className="accent">.NET</span></span>
        </div>
        <button className="btn-secondary" onClick={onStart}>
          Launch Console
        </button>
      </header>

      <main className="landing-hero">
        <div className="hero-content">
          <div className="badge-wrapper">
            <span className="status-pill">Next-Gen DB Querying</span>
          </div>
          <h1>
            Natural Language to <br />
            <span className="gradient-text glow-text-primary">Structured SQL Queries</span> <br />
            &amp; Real-time Executor
          </h1>
          <p className="subtitle">
            Meet <strong className="nelly-accent">Nelly</strong>, your database search assistant. She helps you perform complex searches on our <strong>Indian Higher Education Database</strong> (colleges, courses, placements, ratings, and exams) without writing a single line of SQL. Just converse naturally.
          </p>

          <div className="cta-group">
            <button className="btn-primary" onClick={onStart}>
              Start Chatting with Nelly
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-backdrop" />
          <NellyAnimation width="380px" height="380px" />
        </div>
      </main>

      <section className="landing-features">
        <div className="section-title">
          <h2>Core Capabilities</h2>
          <p>Supercharge database querying with NLP and built-in execution guardrails</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper cyan">
              <MessageSquareCode size={24} />
            </div>
            <h3>Multi-turn Conversational Bot</h3>
            <p>Nelly maintains conversational state. Refine queries (e.g., "only private ones") or relax filters ("remove city limit") dynamically across turns.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper purple">
              <ShieldCheck size={24} />
            </div>
            <h3>SQL Guardrails &amp; Safety</h3>
            <p>Built-in validator rejects unsafe commands (updates, deletes), enforces read-only operations, blocks SQL injections, and caps results via strict LIMIT clauses.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper green">
              <Zap size={24} />
            </div>
            <h3>Instant Database Execution</h3>
            <p>Converts text, resolves join paths, joins ratings, and runs against PostgreSQL using statement timeouts for sub-second responses.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Nelly NLQT Client. Powered by Gemini &amp; FastAPI.</p>
      </footer>

      {/* Embedded Component Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .landing-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          color: var(--color-primary);
          filter: drop-shadow(0 0 8px var(--color-primary-glow));
        }

        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: -0.03em;
        }

        .logo-text .accent {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .landing-hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
          padding: 4rem 0 6rem;
        }

        @media (max-width: 900px) {
          .landing-hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
            padding: 2rem 0 4rem;
          }
          .hero-visual {
            order: -1;
            margin: 0 auto;
          }
        }

        .hero-content h1 {
          font-size: 3.2rem;
          line-height: 1.15;
          margin: 1rem 0 1.5rem;
          font-weight: 800;
        }

        @media (max-width: 600px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary) 0%, #bd00ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nelly-accent {
          color: var(--color-primary);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }

        .status-pill {
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.2);
          color: var(--color-primary);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .subtitle {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        @media (max-width: 900px) {
          .subtitle {
            margin: 0 auto 2rem;
          }
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .visual-backdrop {
          position: absolute;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(189, 0, 255, 0.08) 0%, rgba(0, 240, 255, 0.02) 60%, transparent 100%);
          filter: blur(40px);
          z-index: 1;
        }

        .landing-features {
          padding: 4rem 0 6rem;
          border-top: 1px solid var(--color-border);
        }

        .section-title {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .section-title h2 {
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
        }

        .section-title p {
          color: var(--color-text-muted);
          font-size: 1.1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 240, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 240, 255, 0.05);
        }

        .feature-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .feature-icon-wrapper.cyan {
          background: rgba(0, 240, 255, 0.1);
          color: var(--color-primary);
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        .feature-icon-wrapper.purple {
          background: rgba(189, 0, 255, 0.1);
          color: var(--color-secondary);
          border: 1px solid rgba(189, 0, 255, 0.2);
        }

        .feature-icon-wrapper.green {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .feature-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
        }

        .feature-card p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .landing-footer {
          border-top: 1px solid var(--color-border);
          padding: 2rem 0;
          text-align: center;
          font-size: 0.9rem;
          color: var(--color-text-dark);
          margin-top: auto;
        }
      `}} />
    </div>
  );
};
