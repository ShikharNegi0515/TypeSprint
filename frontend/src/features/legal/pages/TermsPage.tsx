import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../../components/Footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
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
        <span className="text-3xl font-bold text-primary ml-2">Terms of Service</span>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-base leading-relaxed">
          <p className="mb-12">These terms of service were last updated on June 19, 2022.</p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Agreement</h2>
          <p className="mb-8">
            By accessing this Website, accessible from typesprint.com, you are agreeing to be bound by these Website Terms of Service and agree that you are responsible for the agreement in accordance with any applicable local laws. <span className="uppercase font-bold">IF YOU DO NOT AGREE TO ALL THE TERMS AND CONDITIONS OF THIS AGREEMENT, YOU ARE NOT PERMITTED TO ACCESS OR USE OUR SERVICES.</span>
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Limitations</h2>
          <p className="mb-4">
            You are responsible for your account's security and all activities on your account. You must not, in the use of this site, violate any applicable laws, including, without limitation, copyright laws, or any other laws regarding the security of your personal data, or otherwise misuse this site.
          </p>
          <p className="mb-4">
            TypeSprint reserves the right to remove or disable any account or any other content on this site at any time for any reason, without prior notice to you, if we believe that you have violated this agreement.
          </p>
          <p className="mb-2">You agree that you will not upload, post, host, or transmit any content that:</p>
          <ul className="list-disc pl-8 mb-4 space-y-1">
            <li>is unlawful or promotes unlawful activities;</li>
            <li>is or contains sexually obscene content;</li>
            <li>is libelous, defamatory, or fraudulent;</li>
            <li>is discriminatory or abusive toward any individual or group;</li>
            <li>is degrading to others on the basis of gender, race, class, ethnicity, national origin, religion, sexual preference, orientation, or identity, disability, or other classification;</li>
            <li>violates any person's right to privacy or publicity, or otherwise solicits, collects, or publishes data, including personal information and login information, about other Users without consent or for unlawful purposes;</li>
            <li>contains or installs any active malware or exploits/uses our platform for exploit delivery; or infringes on any proprietary right of any party.</li>
          </ul>

          <p className="mb-2">While using the Services, you agree that you will not:</p>
          <ul className="list-disc pl-8 mb-4 space-y-1">
            <li>harass, abuse, threaten, or incite violence towards any individual or group, including other Users and TypeSprint contributors;</li>
            <li>use our servers for any form of excessive automated bulk activity (e.g., spamming);</li>
            <li>attempt to disrupt or tamper with our servers in ways that could a) harm our Website or Services or b) place undue burden on our servers;</li>
            <li>access the Services in ways that exceed your authorization;</li>
            <li>falsely impersonate any person or entity, misrepresent your identity or the site's purpose, or falsely associate yourself with TypeSprint;</li>
            <li>violate the privacy of any third party, such as by posting another person's personal information without their consent;</li>
            <li>access or attempt to access any service on the Services by any means other than as permitted in this Agreement;</li>
            <li>facilitate or encourage any violations of this Agreement or interfere with the operation, appearance, security, or functionality of the Services; or</li>
            <li>use the Services in any manner that is harmful to minors.</li>
          </ul>
          <p className="mb-12">
            Without limiting the foregoing, you will not transmit or post any content anywhere on the Services that violates any laws. TypeSprint absolutely does not tolerate engaging in activity that significantly harms our Users. We will resolve disputes in favor of protecting our Users as a whole.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Privacy Policy</h2>
          <p className="mb-12">
            If you use our Services, you must abide by our Privacy Policy. You acknowledge that you have read our Privacy Policy and understand that it sets forth how we collect, use, and store your information. If you do not agree with our Privacy Statement, then you must stop using the Services immediately. Any person, entity, or service collecting data from the Services must comply with our Privacy Statement. Misuse of any User's Personal Information is prohibited. If you collect any Personal Information from a User, you agree that you will only use the Personal Information you gather for the purpose for which the User has authorized it. You agree that you will reasonably secure any Personal Information you have gathered from the Services, and you will respond promptly to complaints, removal requests, and 'do not contact' requests from us or Users.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Limitations on Automated Use</h2>
          <p className="mb-2">You shouldn't use bots or access our Services in malicious or prohibited ways. While accessing or using the Services, you may not:</p>
          <ul className="list-disc pl-8 mb-12 space-y-1">
            <li>use bots, hacks, or cheats while using our site;</li>
            <li>create manual requests to TypeSprint servers;</li>
            <li>tamper with or use non-public areas of the Services, or the computer or delivery systems of TypeSprint and/or its service providers;</li>
            <li>probe, scan, or test any system or network (particularly for vulnerabilities), or otherwise attempt to breach or circumvent any security or authentication measures;</li>
            <li>scrape the Services, scrape Content from the Services, or use automated means, including spiders, robots, crawlers, data mining tools, or the like to download data from the Services or otherwise access the Services;</li>
            <li>employ misleading email or IP addresses or forged headers or otherwise manipulated identifiers in order to disguise the origin of any content transmitted to or through the Services;</li>
            <li>use the Services to send altered, deceptive, or false source-identifying information; or</li>
            <li>interfere with, or disrupt or attempt to interfere with or disrupt, the access of any User, host, or network, including, without limitation, by sending a virus to, spamming, or overloading the Services.</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Links</h2>
          <p className="mb-12">TypeSprint is not responsible for the contents of any linked sites. The use of any linked website is at the user's own risk.</p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Changes</h2>
          <p className="mb-12">TypeSprint may revise these Terms of Service for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms of Service.</p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Disclaimer</h2>
          <p className="mb-12 uppercase text-xs leading-relaxed opacity-80">
            EXCLUDING THE EXPLICITLY STATED WARRANTIES WITHIN THESE TERMS, WE ONLY OFFER OUR SERVICES ON AN 'AS-IS' BASIS. YOUR ACCESS TO AND USE OF THE SERVICES OR ANY CONTENT IS AT YOUR OWN RISK. YOU UNDERSTAND AND AGREE THAT THE SERVICES AND CONTENT ARE PROVIDED TO YOU ON AN 'AS IS,' 'WITH ALL FAULTS,' AND 'AS AVAILABLE' BASIS. WITHOUT LIMITING THE FOREGOING, TO THE FULL EXTENT PERMITTED BY LAW, TYPESPRINT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. TO THE EXTENT SUCH DISCLAIMER CONFLICTS WITH APPLICABLE LAW, THE SCOPE AND DURATION OF ANY APPLICABLE WARRANTY WILL BE THE MINIMUM PERMITTED UNDER SUCH LAW. TYPESPRINT MAKES NO REPRESENTATIONS, WARRANTIES, OR GUARANTEES AS TO THE RELIABILITY, TIMELINESS, QUALITY, SUITABILITY, AVAILABILITY, ACCURACY, OR COMPLETENESS OF ANY KIND WITH RESPECT TO THE SERVICES, INCLUDING ANY REPRESENTATION OR WARRANTY THAT THE USE OF THE SERVICES WILL (A) BE TIMELY, UNINTERRUPTED, OR ERROR-FREE, OR OPERATE IN COMBINATION WITH ANY OTHER HARDWARE, SOFTWARE, SYSTEM, OR DATA, (B) MEET YOUR REQUIREMENTS OR EXPECTATIONS, (C) BE FREE FROM ERRORS OR THAT DEFECTS WILL BE CORRECTED, OR (D) BE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. TYPESPRINT ALSO MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND WITH RESPECT TO CONTENT; USER CONTENT IS PROVIDED BY AND IS SOLELY THE RESPONSIBILITY OF THE RESPECTIVE USER PROVIDING THAT CONTENT. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM TYPESPRINT OR THROUGH THE SERVICES, WILL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN. TYPESPRINT DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY USER CONTENT ON THE SERVICES OR ANY HYPERLINKED WEBSITE OR THIRD-PARTY SERVICE, AND TYPESPRINT WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR TRANSACTIONS BETWEEN YOU AND THIRD PARTIES. IF APPLICABLE LAW DOES NOT ALLOW THE EXCLUSION OF SOME OR ALL OF THE ABOVE IMPLIED OR STATUTORY WARRANTIES TO APPLY TO YOU, THE ABOVE EXCLUSIONS WILL APPLY TO YOU TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Contact</h2>
          <p className="mb-2">If you have any questions about TypeSprint's terms, please do not hesitate to contact us.</p>
          <p className="mb-12">Email: shikharnegi01@gmail.com</p>
        </motion.div>
      </main>

      <div className="w-full max-w-7xl mt-auto">
        <Footer />
      </div>
    </div>
  );
}
