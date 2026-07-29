import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../../components/Footer';
import { motion } from 'framer-motion';

export default function SecurityPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-8 font-mono">
      <header className="w-full max-w-4xl flex items-center gap-2 py-8 mt-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
          <path d="M6 8h.01"></path><path d="M10 8h.01"></path><path d="M14 8h.01"></path><path d="M18 8h.01"></path>
          <path d="M6 12h.01"></path><path d="M10 12h.01"></path><path d="M14 12h.01"></path><path d="M18 12h.01"></path>
          <path d="M7 16h10"></path>
        </svg>
        <span className="text-3xl font-bold text-muted-foreground tracking-tight">typesprint</span>
        <span className="text-3xl font-bold text-primary ml-2">Security Policy</span>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-base leading-relaxed">
          <p className="mb-12">
            We take the security and integrity of TypeSprint very seriously. If you have found a vulnerability, please report it ASAP so we can quickly remediate the issue.
          </p>

          <p className="mb-4">Table of Contents</p>
          <ul className="list-disc pl-8 mb-12 space-y-1">
            <li><a href="#how-to-disclose" className="hover:text-primary transition-colors underline decoration-border underline-offset-4">How to Disclose a Vulnerability</a></li>
            <li><a href="#submission-guidelines" className="hover:text-primary transition-colors underline decoration-border underline-offset-4">Submission Guidelines</a></li>
          </ul>

          <h2 id="how-to-disclose" className="text-2xl font-bold text-primary mt-16 mb-6">How to Disclose a Vulnerability</h2>
          <p className="mb-6">
            For vulnerabilities that impact the confidentiality, integrity, and availability of TypeSprint services, please send your disclosure via <a href="mailto:shikharnegi01@gmail.com" className="text-foreground hover:text-primary transition-colors underline decoration-border underline-offset-4">email</a>. 
            Include as much detail as possible to ensure reproducibility. At a minimum, vulnerability disclosures should include:
          </p>
          <ul className="list-disc pl-8 mb-12 space-y-1">
            <li>Vulnerability Description</li>
            <li>Proof of Concept</li>
            <li>Impact</li>
            <li>Screenshots or Proof</li>
          </ul>

          <h2 id="submission-guidelines" className="text-2xl font-bold text-primary mt-16 mb-6">Submission Guidelines</h2>
          <p className="mb-12">
            Do not engage in activities that might cause a denial of service condition, create significant strains on critical resources, or negatively impact users of the site outside of test accounts.
          </p>
        </motion.div>
      </main>

      <div className="w-full max-w-7xl mt-auto">
        <Footer />
      </div>
    </div>
  );
}
