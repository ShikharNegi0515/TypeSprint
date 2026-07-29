import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../../components/Footer';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
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
        <span className="text-3xl font-bold text-primary ml-2">Privacy Policy</span>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-base leading-relaxed">
          <div className="mb-12">
            <p>Effective date: July 30, 2026</p>
            <p>Last updated: July 30, 2026</p>
          </div>

          <p className="mb-4">
            Thanks for trusting TypeSprint ('TypeSprint', 'we', 'us', 'our') with your personal information! We take our responsibility to you very seriously, and so this Privacy Statement describes how we handle your data.
          </p>
          <p className="mb-4">
            This Privacy Statement applies to all websites we own and operate and to all services we provide (collectively, the 'Services'). So...PLEASE READ THIS PRIVACY STATEMENT CAREFULLY. By using the Services, you are expressly and voluntarily accepting the terms and conditions of this Privacy Statement and our Terms of Service, which include allowing us to process information about you.
          </p>
          <p className="mb-12">
            Under this Privacy Statement, we are the data controller responsible for processing your personal information. Our contact information appears at the end of this Privacy Statement.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">What data do we collect?</h2>
          <p className="mb-2">TypeSprint collects the following data:</p>
          <ul className="list-disc pl-8 mb-4 space-y-1">
            <li>Email</li>
            <li>Username</li>
            <li>Discord id and discord avatar id (if you provide it)</li>
            <li>Information about each typing test</li>
            <li>Your currently active settings</li>
            <li>How many typing tests you've started and completed</li>
            <li>How long you've been typing on the website</li>
          </ul>
          <p className="mb-2">TypeSprint does NOT collect:</p>
          <ul className="list-disc pl-8 mb-4 space-y-1">
            <li>custom texts (they are stored in your browser's local storage)</li>
          </ul>
          <p className="mb-12">
            If you believe a certain data type is missing from the lists above, feel free to contact us and we will answer any questions and update the privacy policy.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">How do we collect your data?</h2>
          <p className="mb-2">You directly provide most of the data we collect. We collect data and process data when you:</p>
          <ul className="list-disc pl-8 mb-12 space-y-1">
            <li>Create an account</li>
            <li>Complete a typing test</li>
            <li>Change settings on the website</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">How will we use your data?</h2>
          <p className="mb-2">TypeSprint collects your data so that we can:</p>
          <ul className="list-disc pl-8 mb-4 space-y-1">
            <li>Allow you to view result history of previous tests you completed</li>
            <li>Save results from tests you take and show you statistics based on them</li>
            <li>Remember your settings</li>
            <li>Display leaderboards</li>
          </ul>
          <p className="mb-12">
            If you are found to be cheating or exploiting the website, we may store hashed versions of your username, email and/or discord id to prevent you from creating new accounts.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">How do we store your data?</h2>
          <p className="mb-12">TypeSprint securely stores your data using PostgreSQL.</p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">What are your data protection rights?</h2>
          <p className="mb-2">TypeSprint would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul className="list-disc pl-8 mb-12 space-y-3">
            <li><strong>The right to access</strong> – You have the right to request TypeSprint for copies of your personal data. We may limit the number of times this request can be made to depending on the size of the request.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that TypeSprint correct any information you believe is inaccurate. You also have the right to request TypeSprint to complete the information you believe is incomplete.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that TypeSprint erase your personal data, under certain conditions. (Hashed data mentioned in the "How will we use your data?" section will not be deleted, as it is essential in preventing the exploitation of the website)</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that TypeSprint restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to object to processing</strong> – You have the right to object to TypeSprint processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability</strong> – You have the right to request that TypeSprint transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Analytics</h2>
          <p className="mb-12">
            Like most websites, we use Analytics tools which collect information that your browser sends whenever you visit the website. This data may include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and time spent on each page. THIS DATA DOES NOT CONTAIN ANY PERSONALLY IDENTIFIABLE INFORMATION. We use this information for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Advertisements</h2>
          <p className="mb-12">TypeSprint does not currently serve advertisements.</p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">What are cookies?</h2>
          <p className="mb-12">
            Cookies are text files placed on your computer to collect standard Internet log information and visitor behavior information. When you visit our websites, we may collect information from you automatically through cookies or similar technology.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">How do we use cookies?</h2>
          <p className="mb-2">TypeSprint uses cookies in a range of ways to improve your experience on our website, including:</p>
          <ul className="list-disc pl-8 mb-12 space-y-1">
            <li>Keeping you signed in</li>
            <li>Remembering your active settings</li>
            <li>Remembering your active tags</li>
            <li>Traffic analysis</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">What types of cookies do we use?</h2>
          <p className="mb-12">
            There are a number of different types of cookies; however, our website uses functionality cookies. TypeSprint uses these cookies so we recognize you on our website and remember your previously selected settings.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">How to manage your cookies</h2>
          <p className="mb-12">
            You can set your browser not to accept cookies, and the above website tells you how to remove cookies from your browser. However, in a few cases, some of our website features may behave unexpectedly or fail to function as a result.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Privacy policies of other websites</h2>
          <p className="mb-12">
            TypeSprint contains links to other external websites. Our privacy policy only applies to our website, so if you click on a link to another website, you should read their privacy policy.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Changes to our privacy policy</h2>
          <p className="mb-12">
            TypeSprint keeps its privacy policy under regular review and places any updates on this web page. The TypeSprint privacy policy may be subject to change at any given time without notice.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">How to contact us</h2>
          <p className="mb-2">
            If you have any questions about TypeSprint's privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us.
          </p>
          <p className="mb-12">Email: shikharnegi01@gmail.com</p>
        </motion.div>
      </main>

      <div className="w-full max-w-7xl mt-auto">
        <Footer />
      </div>
    </div>
  );
}
