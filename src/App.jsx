import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
Chart.register(...registerables);

// --- Configuration ---
const EMAILJS_PUBLIC_KEY = '9K1HD5IEzGJW8WxRx';
const EMAILJS_SERVICE_ID = 'service_5ehurrn';
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_phugmw9';
const EMAILJS_RECRUITER_TEMPLATE_ID = 'template_phugmw9';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_GOES_HERE';

const PERSONAL_INFO = {
    name: "Kasthuri Shravani",
    tagline: "JAVA FULL STACK DEVELOPER • DISTRIBUTED MICROSERVICES • AI-ASSISTED ENGINEERING",
    location: "Hyderabad, India",
    phone: "+91-9182456681",
    email: "kasthurishravani1212@gmail.com",
    linkedin: "https://www.linkedin.com/in/shravani-kasthuri/",
    linkedinHandle: "shravani-kasthuri",
    github: "https://github.com/Shravani1212",
    githubHandle: "Shravani1212",
    resumePdf: "Resume (1).pdf"
};

const RESUME_CONTEXT = `
KASTHURI SHRAVANI
JAVA FULL STACK DEVELOPER • DISTRIBUTED MICROSERVICES • AI-ASSISTED ENGINEERING
Hyderabad, India • +91-9182456681 • kasthurishravani1212@gmail.com • linkedin.com/in/shravani-kasthuri • github.com/Shravani1212

PROFESSIONAL SUMMARY:
Full Stack Developer with 3+ years of experience, primarily focused on backend architecture and high-availability distributed systems. Specialized in building scalable microservices using Java, Spring Boot, Kafka, and PostgreSQL, complemented by React frontends. Proven track record of improving database performance—reducing API latency by 30% through query optimization, execution plan tuning (EXPLAIN ANALYZE), and Redis caching. Actively leverages modern AI developer tools (Antigravity, OpenAI Codex, Copilot, Cursor, Claude) to accelerate migrations, refactoring, and feature delivery.

TECHNICAL SKILLS:
- Core Backend & Design: Java, Spring Boot, Spring Cloud, Netflix Eureka, RESTful APIs, Microservices Architecture, Multithreading, Memory Management, OOP, React.js, TypeScript, JavaScript
- Streaming & Caching: Apache Kafka (Event Streaming, Async Decoupling, Consumer Groups), Redis (Distributed Caching, Latency Tuning)
- Databases & SQL Tuning: PostgreSQL, MS SQL; Dual-Database Synchronization, Complex JOINs, Subqueries, CTEs, Window Functions (ROW_NUMBER, RANK), Query Optimization, EXPLAIN ANALYZE, B-Tree Indexing, ACID & Isolation Levels
- AI-Assisted Tech & DevOps: AI Agents, Antigravity, OpenAI Codex, Copilot, Cursor, Claude (Prompt Optimization, Context Windows; Spring AI / LangChain4j foundations), Docker, Jenkins CI/CD, Git, JUnit

PROFESSIONAL EXPERIENCE:
Java Full Stack Developer — Centre for Good Governance (CGG), Hyderabad, India (Mar 2023 – Present)
- High-Availability Microservices: Architected and scaled Spring Boot microservices serving 10M+ users with 99.9% availability across mission-critical civic and governance platforms.
- Statewide Data Mapping & Sorting: Engineered core data-mapping engines and sorting procedures processing complete state voter datasets, resolving critical high-volume bottlenecks during live operational scenarios.
- Database Optimization (30% Latency Cut): Profiled query bottlenecks using PostgreSQL EXPLAIN ANALYZE; refactored queries with CTEs and window functions, tuned composite indexes, and implemented Redis caching to strip 30% off API response times.
- AI-Accelerated Engineering: Built the complete CURE 1 payment microservice within 3 days using Antigravity and Codex; migrated TSEC legacy Struts to modern Spring Boot/React in 1 week using Claude, Cursor, and Copilot for rapid query optimization and automated refactoring.
- Secure Transactions & DevOps: Enforced strict ACID transactional guarantees and custom AES-256-GCM encryption filters on payment channels; cut deployment overhead by 40% via automated Docker & Jenkins pipelines.

KEY ENGINEERING PROJECTS:
1. Andhra Pradesh State Election Management System (APSEC)
   Tech: Java, Spring Boot, PostgreSQL & MS SQL, React.js
   Details: Architected voter data mapping, dual-database synchronization between PostgreSQL and MS SQL, and automated Electoral Roll (ER) print generation microservices handling statewide records under strict SLAs. Authored optimized SQL sorting procedures, cross-database sync routines, and aggregation queries using window functions (ROW_NUMBER(), RANK()) and CTEs; actively resolved live election-day concurrency issues.
2. Telangana State Election Commission (TSEC)
   Tech: Spring Boot, React.js, AI Agents, RESTful APIs, PostgreSQL
   Details: Modernized legacy Struts monolith into modular Spring Boot/React microservices in 7 days via AI coding agents, refactoring SQL queries for rapid statewide voter mapping and ER print generation. Optimized high-volume data streams between backend services and UI, delivering real-time electoral roll status and administrative dashboards.
3. Common Utility Payment Platform (CURE 1)
   Tech: Spring Cloud, Eureka, Kafka, Redis, Antigravity, Codex
   Details: Architected and delivered complete containerized microservices from scratch within 3 days leveraging AI tools (Antigravity, Codex) for rapid scaffolding, schema mapping, and API contracts. Integrated third-party government payment APIs with idempotent request handling, custom AES-256-GCM encryption filters, and strict ACID transaction isolation under peak traffic.

EDUCATION:
- B.Tech in Electronics & Communication Engineering — RGUKT (IIIT Basar) (2019 – 2023), Grade: 8.3/10
- Pre-University Course (MPC) — RGUKT (IIIT Basar) (2017 – 2019), Distinction (90%+)

CERTIFICATIONS:
- Programming in Java By NPTEL (Elite + Gold, Top 5%)
- LangChain4J & AI Foundations (CodeSignal)
- Python Programming (Coursera)
- Cybersecurity Fundamentals (IBM / NxtWave)
`;

// --- Icon System ---
const Icon = ({ name, className = "w-5 h-5" }) => {
    const icons = {
        code: <><path d="M10 9.5 8 12l2 2.5" /><path d="m14 9.5 2 2.5-2 2.5" /><path d="M9 4 4 9l5 5" /><path d="m15 4 5 5-5 5" /></>,
        atom: <><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.88-4.52-4.52-9.86-6.53-11.88-4.5-2.04 2.03-.02 7.36 4.5 11.88 4.52 4.52 9.86 6.53 11.88 4.5Z" /><path d="M3.8 3.8c-2.04 2.03-.02 7.36 4.5 11.88 4.52 4.52 9.86 6.53 11.88 4.5 2.04-2.03-.02-7.36-4.5-11.88-4.52-4.52-9.86-6.53-11.88-4.5Z" /></>,
        database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></>,
        html: <><path d="m18 16 4-14" /><path d="m6 16-4-14" /><path d="M14.5 4H9.5L8 12h8l-1.5 8" /></>,
        'code-xml': <><path d="m18 16 4-14" /><path d="m6 16-4-14" /><path d="m14.5 4-5 16" /><path d="m9.5 4 5 16" /></>,
        github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>,
        x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
        award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
        linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></>,
        server: <><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></>,
        zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
        layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
        cpu: <><rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></>,
        shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />,
        sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></>,
        phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
        mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
        mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
        terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></>,
        gradCap: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
        check: <polyline points="20 6 9 17 4 12" />,
        arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
        download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>,
        externalLink: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></>,
        activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name] || icons.code}
        </svg>
    );
};

// --- Main App ---
export default function App() {
    const [emailJsLoaded, setEmailJsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
        script.async = true;
        script.onload = () => {
            if (window.emailjs) {
                window.emailjs.init(EMAILJS_PUBLIC_KEY);
                setEmailJsLoaded(true);
            }
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="bg-[#030712] text-slate-200 selection:bg-cyan-500 selection:text-slate-900 font-sans min-h-screen">
            <StyleInjector />
            <Header />
            <main className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
                <Hero />
                <ImpactStats />
                <About />
                <SkillsMatrix />
                <TechnicalShowcase />
                <Experience />
                <Projects />
                <Education />
                <Certifications />
                <AiInsights />
                <GitHubActivity />
                <Contact emailJsLoaded={emailJsLoaded} />
            </main>
            <Footer />
            <Chatbot />
            <RecruiterModal emailJsLoaded={emailJsLoaded} />
        </div>
    );
}

// --- Styles & CSS Injections ---
function StyleInjector() {
    return (
        <style>{`
            :root {
                --bg-color: #030712;
                --text-primary: #f1f5f9;
                --text-secondary: #94a3b8;
                --accent-color: #22d3ee;
                --accent-dark: #0891b2;
                --card-bg: rgba(15, 23, 42, 0.7);
                --card-border: rgba(30, 41, 59, 0.8);
            }
            body { 
                font-family: 'Inter', 'Poppins', sans-serif; 
                background-color: var(--bg-color); 
                background-image: 
                    radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.12) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.08) 0px, transparent 50%),
                    radial-gradient(at 50% 50%, rgba(2, 6, 23, 1) 0px, #030712 100%);
                color: var(--text-primary); 
                overflow-x: hidden;
            }
            .font-mono { font-family: 'Fira Code', 'Roboto Mono', monospace; }
            .glass-header { 
                background: rgba(3, 7, 18, 0.82); 
                backdrop-filter: blur(16px); 
                -webkit-backdrop-filter: blur(16px); 
                border-bottom: 1px solid rgba(30, 41, 59, 0.7); 
            }
            .glass-card {
                background: rgba(15, 23, 42, 0.65);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(51, 65, 85, 0.5);
            }
            .glass-card:hover {
                border-color: rgba(34, 211, 238, 0.4);
                box-shadow: 0 10px 30px -10px rgba(34, 211, 238, 0.15);
            }
            .gradient-border {
                position: relative;
                border-radius: 1rem;
                background: linear-gradient(135deg, rgba(34, 211, 238, 0.4), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
                padding: 1px;
            }
            .gradient-text { 
                background: linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #38bdf8 100%); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent; 
            }
            .gradient-text-alt { 
                background: linear-gradient(135deg, #f8fafc 30%, #94a3b8 100%); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent; 
            }
            .code-pill {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid rgba(51, 65, 85, 0.6);
            }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #030712; }
            ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #0891b2; }
            .loader { 
                border: 2px solid #334155; 
                border-top: 2px solid #22d3ee; 
                border-radius: 50%; 
                width: 16px; 
                height: 16px; 
                animation: spin 0.8s linear infinite; 
                display: inline-block; 
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .typing-indicator span { 
                height: 6px; 
                width: 6px; 
                background-color: #22d3ee; 
                border-radius: 50%; 
                display: inline-block; 
                animation: bounce 1.2s infinite ease-in-out; 
            }
            .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        `}</style>
    );
}

const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const STAGGER_CONTAINER_VARIANTS = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

function Section({ children, id, className = "" }) {
    return (
        <motion.section 
            id={id} 
            className={`py-20 md:py-28 ${className}`} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.15 }} 
            variants={STAGGER_CONTAINER_VARIANTS}
        >
            {children}
        </motion.section>
    );
}

// --- Header ---
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Experience", href: "#experience" },
        { name: "Projects", href: "#projects" },
        { name: "Education", href: "#education" },
        { name: "Contact", href: "#contact" }
    ];

    return (
        <motion.header 
            id="header" 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-header shadow-lg shadow-black/40' : 'bg-transparent'}`}
            initial={{ y: -80 }} 
            animate={{ y: 0 }} 
            transition={{ duration: 0.4 }}
        >
            <nav className="container mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
                <a href="#hero" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-500/50 group-hover:ring-cyan-400 transition-all">
                        <img src="/ks-avatar.jpg" alt={PERSONAL_INFO.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
                    </div>
                    <div className="hidden sm:block">
                        <span className="font-bold text-slate-100 text-sm tracking-wide block group-hover:text-cyan-300 transition-colors">
                            {PERSONAL_INFO.name}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400/80 block">
                            Full Stack • Microservices
                        </span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-300">
                    {navItems.map((item) => (
                        <a 
                            key={item.name} 
                            href={item.href} 
                            className="hover:text-cyan-400 transition-colors duration-200"
                        >
                            {item.name}
                        </a>
                    ))}
                    <a 
                        href={PERSONAL_INFO.resumePdf} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 border border-cyan-500/60 text-cyan-300 px-4 py-1.5 rounded-lg hover:bg-cyan-500 hover:text-slate-950 transition-all font-mono text-xs shadow-sm hover:shadow-cyan-500/30"
                    >
                        <Icon name="download" className="w-3.5 h-3.5" />
                        Resume
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="lg:hidden text-cyan-400 p-2 rounded-lg hover:bg-slate-800/60 focus:outline-none"
                    aria-label="Toggle Navigation Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="lg:hidden glass-header border-t border-slate-800 px-6 py-4 space-y-3"
                    >
                        {navItems.map((item) => (
                            <a 
                                key={item.name} 
                                href={item.href} 
                                onClick={() => setIsMenuOpen(false)} 
                                className="block py-2 text-slate-200 hover:text-cyan-400 transition-colors text-sm font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                        <a 
                            href={PERSONAL_INFO.resumePdf} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block w-full text-center py-2.5 mt-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-sm"
                        >
                            View Resume PDF
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

// --- Hero Section ---
function Hero() {
    return (
        <Section id="hero" className="pt-28 md:pt-36 pb-16">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8 min-h-[75vh]">
                <div className="w-full lg:w-7/12">
                    {/* Live status badge */}
                    <motion.div variants={FADE_IN_VARIANTS} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-cyan-950/60 border border-cyan-800/70 text-cyan-300 mb-6 backdrop-blur">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>OPEN TO FULL-TIME ROLES • HYDERABAD, INDIA</span>
                    </motion.div>

                    <motion.p className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-2" variants={FADE_IN_VARIANTS}>
                        Hi, my name is
                    </motion.p>
                    
                    <motion.h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight" variants={FADE_IN_VARIANTS}>
                        {PERSONAL_INFO.name}
                    </motion.h1>
                    
                    <motion.div className="mt-3 mb-6" variants={FADE_IN_VARIANTS}>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
                            JAVA FULL STACK DEVELOPER
                        </h2>
                        <p className="text-sm sm:text-base font-mono text-slate-400 mt-1 tracking-wide">
                            DISTRIBUTED MICROSERVICES • HIGH-AVAILABILITY • AI-ASSISTED ENGINEERING
                        </p>
                    </motion.div>

                    <motion.p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light" variants={FADE_IN_VARIANTS}>
                        Full Stack Developer with <span className="text-cyan-300 font-semibold">3+ years of experience</span> primarily focused on backend architecture and high-availability distributed systems. Specialized in building scalable microservices using <span className="text-white font-medium">Java, Spring Boot, Kafka, and PostgreSQL</span>, complemented by React frontends. Proven track record reducing API latency by <span className="text-emerald-400 font-semibold">30%</span> through deep query optimization, execution plan tuning (<span className="font-mono text-xs text-cyan-300">EXPLAIN ANALYZE</span>), and Redis caching. Actively leverages modern AI developer tools to accelerate migrations, refactoring, and delivery.
                    </motion.p>

                    {/* Quick Contact & Action Buttons */}
                    <motion.div className="mt-8 flex flex-wrap gap-4 items-center" variants={FADE_IN_VARIANTS}>
                        <motion.a 
                            href="#projects" 
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-7 py-3 rounded-xl transition duration-200 shadow-lg shadow-cyan-500/25 flex items-center gap-2 text-sm"
                            whileHover={{ scale: 1.03 }} 
                            whileTap={{ scale: 0.97 }}
                        >
                            <span>Explore Engineering Work</span>
                            <Icon name="arrowRight" className="w-4 h-4" />
                        </motion.a>
                        <motion.a 
                            href="#contact" 
                            className="border border-slate-700 hover:border-cyan-500/60 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 font-medium px-6 py-3 rounded-xl transition duration-200 text-sm flex items-center gap-2"
                            whileHover={{ scale: 1.03 }} 
                            whileTap={{ scale: 0.97 }}
                        >
                            <Icon name="mail" className="w-4 h-4 text-cyan-400" />
                            <span>Get In Touch</span>
                        </motion.a>
                        <motion.a 
                            href={PERSONAL_INFO.resumePdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="border border-slate-700 hover:border-slate-600 bg-slate-900/40 text-slate-400 hover:text-white px-5 py-3 rounded-xl transition duration-200 text-sm font-mono flex items-center gap-2"
                            whileHover={{ scale: 1.03 }} 
                            whileTap={{ scale: 0.97 }}
                        >
                            <Icon name="download" className="w-4 h-4" />
                            <span>Resume PDF</span>
                        </motion.a>
                    </motion.div>

                    {/* Contact Badges */}
                    <motion.div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-400 font-mono" variants={FADE_IN_VARIANTS}>
                        <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                            <Icon name="mail" className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{PERSONAL_INFO.email}</span>
                        </a>
                        <a href={`tel:${PERSONAL_INFO.phone}`} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                            <Icon name="phone" className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{PERSONAL_INFO.phone}</span>
                        </a>
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <Icon name="mapPin" className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{PERSONAL_INFO.location}</span>
                        </span>
                        <div className="flex items-center gap-3 ml-auto">
                            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors p-1" title="GitHub Profile">
                                <Icon name="github" className="w-4 h-4" />
                            </a>
                            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors p-1" title="LinkedIn Profile">
                                <Icon name="linkedin" className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Avatar Card */}
                <motion.div className="w-full lg:w-5/12 flex justify-center" variants={FADE_IN_VARIANTS}>
                    <div className="relative w-72 sm:w-80 md:w-96">
                        {/* Ambient glow behind avatar */}
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-3 shadow-2xl overflow-hidden">
                            <div className="h-80 sm:h-96 w-full rounded-xl overflow-hidden relative group">
                                <img 
                                    src="/ks-avatar.jpg" 
                                    alt={PERSONAL_INFO.name} 
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/70">
                                        <p className="text-xs font-mono text-cyan-300 flex items-center justify-between">
                                            <span>Current Tech Stack</span>
                                            <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-400">Production</span>
                                        </p>
                                        <p className="text-xs font-semibold text-slate-200 mt-1">
                                            Java 17 • Spring Boot • Kafka • Redis • PostgreSQL
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

// --- Impact Stats Banner ---
function ImpactStats() {
    const stats = [
        {
            value: "10M+",
            label: "Civic Users Served",
            desc: "Scaled Spring Boot microservices with 99.9% availability across state governance platforms.",
            icon: "server",
            accent: "from-cyan-500 to-blue-500"
        },
        {
            value: "-30%",
            label: "API Latency Cut",
            desc: "Optimized queries via EXPLAIN ANALYZE, CTEs, window functions, and Redis caching.",
            icon: "zap",
            accent: "from-emerald-400 to-cyan-500"
        },
        {
            value: "3 Days",
            label: "Zero-to-Prod Delivery",
            desc: "Built containerized CURE 1 payment microservices using Antigravity and OpenAI Codex.",
            icon: "sparkles",
            accent: "from-purple-400 to-pink-500"
        },
        {
            value: "-40%",
            label: "Deployment Overhead",
            desc: "Automated Docker & Jenkins CI/CD pipelines enforcing strict SLAs and ACID transactional security.",
            icon: "shield",
            accent: "from-amber-400 to-cyan-500"
        }
    ];

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 mb-12"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={STAGGER_CONTAINER_VARIANTS}
        >
            {stats.map((stat, idx) => (
                <motion.div 
                    key={idx} 
                    className="glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 group hover:-translate-y-1"
                    variants={FADE_IN_VARIANTS}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent font-mono`}>
                            {stat.value}
                        </span>
                        <div className="p-2.5 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700/60 group-hover:border-cyan-500/50 transition-colors">
                            <Icon name={stat.icon} className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase font-mono">{stat.label}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{stat.desc}</p>
                </motion.div>
            ))}
        </motion.div>
    );
}

// --- About Section ---
function About() {
    return (
        <Section id="about">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-10">
                <span className="font-mono text-cyan-400 text-sm font-semibold">01.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">About Me</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10 items-center">
                <motion.div variants={FADE_IN_VARIANTS} className="lg:col-span-7 space-y-4 text-slate-300 text-base leading-relaxed font-light">
                    <p>
                        Hello! I'm <span className="text-white font-semibold">Kasthuri Shravani</span>, a Full Stack Developer with over <span className="text-cyan-300 font-semibold">3 years of experience</span> based in Hyderabad, India. My core passion lies in distributed backend architecture, high-availability microservices, and database performance tuning.
                    </p>
                    <p>
                        At the <span className="text-cyan-300 font-medium">Centre for Good Governance (CGG)</span>, I architect and scale mission-critical civic and state election systems serving over <span className="text-white font-semibold">10 Million citizens</span> with 99.9% uptime. I take pride in resolving high-concurrency bottlenecks—whether by profiling complex SQL queries using <span className="font-mono text-cyan-300 text-xs px-1.5 py-0.5 bg-slate-800 rounded">EXPLAIN ANALYZE</span>, implementing <span className="text-white font-medium">Redis distributed caching</span> to cut API latency by 30%, or orchestrating dual-database synchronization between PostgreSQL and MS SQL.
                    </p>
                    <p>
                        Beyond traditional engineering, I actively pioneer <span className="text-cyan-300 font-medium">AI-assisted software engineering workflows</span>. Leveraging advanced AI developer agents like <span className="text-white font-medium">Antigravity, OpenAI Codex, Claude, Cursor, and Copilot</span>, I built the complete CURE 1 payment microservice within 3 days and modernized a legacy Struts monolith into modular Spring Boot/React microservices in just 1 week.
                    </p>

                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                        <div className="flex items-center gap-2">
                            <Icon name="check" className="w-4 h-4 text-cyan-400" />
                            <span>10M+ Users High-Availability Systems</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="check" className="w-4 h-4 text-cyan-400" />
                            <span>Kafka Event-Driven Decoupling</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="check" className="w-4 h-4 text-cyan-400" />
                            <span>PostgreSQL & MS SQL Dual Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="check" className="w-4 h-4 text-cyan-400" />
                            <span>AI Agent-Accelerated Delivery</span>
                        </div>
                    </div>
                </motion.div>

                {/* Video Intro / Media Card */}
                <motion.div variants={FADE_IN_VARIANTS} className="lg:col-span-5">
                    <div className="glass-card rounded-2xl overflow-hidden p-3 border border-slate-700/80 shadow-2xl">
                        <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
                            <video 
                                controls 
                                poster="/ks-avatar2.jpg" 
                                className="w-full h-full object-cover"
                            >
                                <source src="WhatsApp Video 2025-07-31 at 9.54.15 PM.mp4" type="video/mp4" /> 
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="p-3 text-center">
                            <p className="text-xs font-mono text-cyan-400 font-medium">Video Introduction & Technical Overview</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Quick walkthrough of engineering background & problem-solving approach</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

// --- Technical Skills Matrix (4 Pillars) ---
function SkillsMatrix() {
    const pillars = [
        {
            category: "Core Backend & Design",
            icon: "server",
            skills: [
                "Java", "Spring Boot", "Spring Cloud", "Netflix Eureka", "RESTful APIs",
                "Microservices Architecture", "Multithreading", "Memory Management",
                "OOP Principles", "React.js", "TypeScript", "JavaScript"
            ],
            highlight: "Scalable Microservices & Resilient OOP Architectures"
        },
        {
            category: "Streaming & Caching",
            icon: "zap",
            skills: [
                "Apache Kafka", "Event Streaming", "Async Decoupling", 
                "Consumer Groups", "Redis", "Distributed Caching", 
                "Latency Tuning", "In-Memory Stores"
            ],
            highlight: "Sub-millisecond data retrieval & high-throughput streaming"
        },
        {
            category: "Databases & SQL Tuning",
            icon: "database",
            skills: [
                "PostgreSQL", "MS SQL", "Dual-Database Sync", "Complex JOINs",
                "Subqueries", "CTEs", "Window Functions (ROW_NUMBER, RANK)",
                "Query Optimization", "EXPLAIN ANALYZE", "B-Tree Indexing", "ACID & Isolation"
            ],
            highlight: "Query profiling, index optimization & cross-DB consistency"
        },
        {
            category: "AI-Assisted Tech & DevOps",
            icon: "cpu",
            skills: [
                "AI Agents", "Antigravity", "OpenAI Codex", "GitHub Copilot",
                "Cursor", "Claude", "Prompt Optimization", "Context Windows",
                "Spring AI / LangChain4j", "Docker", "Jenkins CI/CD", "Git", "JUnit"
            ],
            highlight: "Accelerated development cycles via modern AI workflows"
        }
    ];

    return (
        <Section id="skills">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">02.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Technical Skills & Architecture Matrix</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-10 leading-relaxed font-light">
                Categorized by engineering domains with proven hands-on delivery across distributed enterprise platforms and high-volume public civic portals.
            </motion.p>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={STAGGER_CONTAINER_VARIANTS}
            >
                {pillars.map((pillar, idx) => (
                    <motion.div 
                        key={idx} 
                        className="glass-card rounded-2xl p-6 border border-slate-800 transition-all duration-300 hover:border-cyan-500/40 relative group"
                        variants={FADE_IN_VARIANTS}
                    >
                        <div className="flex items-center gap-3.5 mb-4">
                            <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 group-hover:scale-105 transition-transform">
                                <Icon name={pillar.icon} className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                                    {pillar.category}
                                </h3>
                                <p className="text-[11px] font-mono text-cyan-400/80">
                                    {pillar.highlight}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {pillar.skills.map((skill, sIdx) => (
                                <span 
                                    key={sIdx}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/70 hover:border-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </Section>
    );
}

// --- Technical Showcase & Performance Telemetry ---
function TechnicalShowcase() {
    const latencyChartRef = useRef(null);
    const techStackChartRef = useRef(null);

    useEffect(() => {
        let latencyChart, techStackChart;
        const textColor = '#94a3b8';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = "'Fira Code', 'Poppins', sans-serif";

        // Chart 1: Latency Optimization (Before vs After)
        if (latencyChartRef.current) {
            const ctx = latencyChartRef.current.getContext('2d');
            if (ctx) {
                latencyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Baseline (Unindexed)', 'Execution Plan Tuning', 'CTEs & Window Functions', 'Redis Distributed Cache'],
                    datasets: [
                        {
                            label: 'API Query Response Time (ms)',
                            data: [420, 290, 240, 168],
                            backgroundColor: [
                                'rgba(239, 68, 68, 0.4)',
                                'rgba(245, 158, 11, 0.5)',
                                'rgba(14, 165, 233, 0.6)',
                                'rgba(34, 211, 238, 0.85)'
                            ],
                            borderColor: [
                                '#ef4444',
                                '#f59e0b',
                                '#0ea5e9',
                                '#22d3ee'
                            ],
                            borderWidth: 1.5,
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#030712',
                            titleColor: '#22d3ee',
                            bodyColor: '#e2e8f0',
                            borderColor: '#334155',
                            borderWidth: 1,
                            padding: 10,
                            callbacks: {
                                label: (context) => ` Latency: ${context.parsed.x} ms (-${Math.round((1 - context.parsed.x / 420) * 100)}% cut)`
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 460,
                            grid: { color: 'rgba(51, 65, 85, 0.25)' },
                            title: { display: true, text: 'Response Latency (ms) — Lower is better', color: '#64748b' }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { font: { size: 11 } }
                        }
                    }
                }
            });
            }
        }

        // Chart 2: Architectural Focus Distribution
        if (techStackChartRef.current) {
            const ctx = techStackChartRef.current.getContext('2d');
            if (ctx) {
                techStackChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [
                        'Backend Microservices (Java/Spring)',
                        'SQL Tuning & Dual-DB Sync',
                        'Streaming & Caching (Kafka/Redis)',
                        'React Frontend & UI',
                        'AI Agents & DevOps Automation'
                    ],
                    datasets: [{
                        data: [40, 25, 15, 10, 10],
                        backgroundColor: [
                            '#22d3ee',
                            '#0284c7',
                            '#38bdf8',
                            '#818cf8',
                            '#a855f7'
                        ],
                        borderColor: '#030712',
                        borderWidth: 3,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                font: { size: 11 },
                                boxWidth: 12,
                                padding: 12
                            }
                        },
                        tooltip: {
                            backgroundColor: '#030712',
                            borderColor: '#334155',
                            borderWidth: 1
                        }
                    }
                }
            });
            }
        }

        return () => {
            if (latencyChart) latencyChart.destroy();
            if (techStackChart) techStackChart.destroy();
        };
    }, []);

    return (
        <Section id="dashboard">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">03.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Engineering Benchmarks & Telemetry</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-10 leading-relaxed font-light">
                Empirical metrics from real-world query optimization, caching strategies, and distributed architecture workloads.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Latency Tuning Chart */}
                <motion.div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between" variants={FADE_IN_VARIANTS}>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                <Icon name="zap" className="w-4 h-4 text-cyan-400" />
                                Database Latency Cut (-30% to -60%)
                            </h3>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">Verified</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            Step-by-step impact profiling with PostgreSQL <span className="font-mono text-cyan-300">EXPLAIN ANALYZE</span>, CTEs, Window Functions (<span className="font-mono text-xs">ROW_NUMBER()</span>), and Redis caching.
                        </p>
                    </div>
                    <div className="relative h-72">
                        <canvas ref={latencyChartRef}></canvas>
                    </div>
                </motion.div>

                {/* Tech Focus Distribution Chart */}
                <motion.div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between" variants={FADE_IN_VARIANTS}>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                <Icon name="layers" className="w-4 h-4 text-cyan-400" />
                                Architecture Focus & Time Allocation
                            </h3>
                            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">Production</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            Heavy emphasis on backend reliability, multi-database consistency, asynchronous streaming, and rapid AI engineering.
                        </p>
                    </div>
                    <div className="relative h-72">
                        <canvas ref={techStackChartRef}></canvas>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

// --- Professional Experience Section ---
function Experience() {
    return (
        <Section id="experience">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">04.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Professional Experience</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-10 leading-relaxed font-light">
                Enterprise civic engineering handling statewide data pipelines and mission-critical SLAs.
            </motion.p>

            <motion.div variants={FADE_IN_VARIANTS} className="relative border-l-2 border-slate-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12">
                <div className="relative">
                    {/* Timeline Node */}
                    <span className="absolute -left-[35px] md:-left-[43px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/20">
                        <Icon name="server" className="w-4 h-4" />
                    </span>

                    <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Java Full Stack Developer
                                </h3>
                                <p className="text-sm font-mono text-cyan-400 mt-0.5">
                                    Centre for Good Governance (CGG) • Hyderabad, India
                                </p>
                            </div>
                            <span className="inline-block px-3 py-1 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                                Mar 2023 – Present
                            </span>
                        </div>

                        <div className="mt-6 space-y-4 text-sm text-slate-300 leading-relaxed font-light">
                            <div className="flex items-start gap-3">
                                <span className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 mt-1 flex-shrink-0">
                                    <Icon name="check" className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                    <strong className="text-white font-semibold">High-Availability Microservices:</strong> Architected and scaled Spring Boot microservices serving <span className="text-cyan-300 font-medium">10M+ users with 99.9% availability</span> across mission-critical civic and governance platforms.
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 mt-1 flex-shrink-0">
                                    <Icon name="check" className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                    <strong className="text-white font-semibold">Statewide Data Mapping & Sorting:</strong> Engineered core data-mapping engines and sorting procedures processing complete state voter datasets, resolving critical high-volume bottlenecks during live operational scenarios.
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 mt-1 flex-shrink-0">
                                    <Icon name="check" className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                    <strong className="text-white font-semibold">Database Optimization (30% Latency Cut):</strong> Profiled query bottlenecks using PostgreSQL <span className="font-mono text-cyan-300 text-xs px-1 py-0.5 bg-slate-900 rounded">EXPLAIN ANALYZE</span>; refactored queries with CTEs and window functions, tuned composite indexes, and implemented Redis caching to strip 30% off API response times.
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 mt-1 flex-shrink-0">
                                    <Icon name="check" className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                    <strong className="text-white font-semibold">AI-Accelerated Engineering:</strong> Built the complete CURE 1 payment microservice within <span className="text-cyan-300 font-medium">3 days</span> using Antigravity and Codex; migrated TSEC legacy Struts to modern Spring Boot/React in <span className="text-cyan-300 font-medium">1 week</span> using Claude, Cursor, and Copilot for rapid query optimization and automated refactoring.
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 mt-1 flex-shrink-0">
                                    <Icon name="check" className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                    <strong className="text-white font-semibold">Secure Transactions & DevOps:</strong> Enforced strict ACID transactional guarantees and custom <span className="font-mono text-cyan-300 text-xs px-1 py-0.5 bg-slate-900 rounded">AES-256-GCM</span> encryption filters on payment channels; cut deployment overhead by <span className="text-emerald-400 font-medium">40%</span> via automated Docker & Jenkins CI/CD pipelines.
                                </div>
                            </div>
                        </div>

                        {/* Tech tags */}
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                            {["Java", "Spring Boot", "Spring Cloud", "Kafka", "Redis", "PostgreSQL", "MS SQL", "React.js", "Docker", "Jenkins", "Antigravity", "Codex"].map((tech) => (
                                <span key={tech} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900/80 text-cyan-400 border border-slate-700/60">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Section>
    );
}

// --- Key Engineering Projects Section ---
function Projects() {
    const projects = [
        {
            title: "Andhra Pradesh State Election Management System (APSEC)",
            category: "Mission-Critical Governance System",
            tech: ["Java", "Spring Boot", "PostgreSQL & MS SQL", "React.js", "Dual-DB Sync", "Window Functions"],
            summary: "Architected voter data mapping, dual-database synchronization between PostgreSQL and MS SQL, and automated Electoral Roll (ER) print generation microservices handling statewide records under strict SLAs.",
            deepDive: "Authored optimized SQL sorting procedures, cross-database sync routines, and aggregation queries using window functions (ROW_NUMBER(), RANK()) and CTEs; actively resolved live election-day concurrency issues.",
            stats: [
                { label: "Scale", value: "Statewide Records" },
                { label: "Sync Engine", value: "PostgreSQL ↔ MS SQL" },
                { label: "Performance", value: "High-Volume SLAs" }
            ],
            image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Telangana State Election Commission (TSEC)",
            category: "Monolith-to-Microservices Migration",
            tech: ["Spring Boot", "React.js", "AI Agents", "RESTful APIs", "PostgreSQL", "Legacy Refactoring"],
            summary: "Modernized legacy Struts monolith into modular Spring Boot/React microservices in 7 days via AI coding agents, refactoring SQL queries for rapid statewide voter mapping and ER print generation.",
            deepDive: "Optimized high-volume data streams between backend services and UI, delivering real-time electoral roll status and administrative dashboards with seamless operational continuity.",
            stats: [
                { label: "Turnaround", value: "7 Days Migration" },
                { label: "Architecture", value: "Struts → Spring Boot" },
                { label: "Tooling", value: "Claude, Cursor, Copilot" }
            ],
            image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Common Utility Payment Platform (CURE 1)",
            category: "Distributed Payment Infrastructure",
            tech: ["Spring Cloud", "Eureka", "Kafka", "Redis", "Antigravity", "Codex", "AES-256-GCM"],
            summary: "Architected and delivered complete containerized microservices from scratch within 3 days leveraging modern AI tools (Antigravity, Codex) for rapid scaffolding, schema mapping, and API contracts.",
            deepDive: "Integrated third-party government payment APIs with idempotent request handling, custom AES-256-GCM encryption filters, and strict ACID transaction isolation under peak traffic.",
            stats: [
                { label: "Speed", value: "3 Days Scaffold to Prod" },
                { label: "Security", value: "AES-256-GCM + ACID" },
                { label: "Event Bus", value: "Apache Kafka" }
            ],
            image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    return (
        <Section id="projects">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">05.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Key Engineering Projects</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-12 leading-relaxed font-light">
                Production distributed systems architected for state governments, payment processing, and high-concurrency public utilities.
            </motion.p>

            <div className="space-y-12">
                {projects.map((project, idx) => (
                    <motion.div 
                        key={idx} 
                        className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all duration-300"
                        variants={FADE_IN_VARIANTS}
                    >
                        <div className="grid lg:grid-cols-12">
                            {/* Image & Banner */}
                            <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
                                <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 backdrop-blur">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Details Content */}
                            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                        {project.title}
                                    </h3>
                                    
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4 font-light">
                                        {project.summary}
                                    </p>
                                    
                                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            <span className="text-cyan-400 font-mono font-semibold mr-1">Engineering Highlights:</span>
                                            {project.deepDive}
                                        </p>
                                    </div>

                                    {/* Stat metrics */}
                                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 mb-5">
                                        {project.stats.map((s, sIdx) => (
                                            <div key={sIdx} className="text-center sm:text-left">
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">{s.label}</p>
                                                <p className="text-xs sm:text-sm font-semibold text-cyan-300 mt-0.5">{s.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stack pills */}
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((t) => (
                                        <span key={t} className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}

// --- Education Section ---
function Education() {
    const educationList = [
        {
            degree: "B.Tech in Electronics & Communication Engineering",
            institution: "Rajiv Gandhi University of Knowledge Technologies (RGUKT - IIIT Basar)",
            period: "2019 – 2023",
            grade: "CGPA: 8.3 / 10",
            details: "Core focus on digital system design, computer architecture, algorithms, multithreading, and software engineering. Actively led technical symposiums and backend development initiatives."
        },
        {
            degree: "Pre-University Course (MPC - Mathematics, Physics, Chemistry)",
            institution: "Rajiv Gandhi University of Knowledge Technologies (RGUKT - IIIT Basar)",
            period: "2017 – 2019",
            grade: "Academic Distinction (Top Percentile)",
            details: "Intensive foundational coursework in advanced mathematics, discrete probability, and analytical problem-solving."
        }
    ];

    return (
        <Section id="education">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">06.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Education</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-10 leading-relaxed font-light">
                Academic foundation in engineering principles, computing architecture, and mathematical modeling from IIIT Basar.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
                {educationList.map((edu, idx) => (
                    <motion.div 
                        key={idx}
                        className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                        variants={FADE_IN_VARIANTS}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                                    <Icon name="gradCap" className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                                    {edu.period}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mt-3">{edu.degree}</h3>
                            <p className="text-sm font-mono text-cyan-400/90 mt-1">{edu.institution}</p>
                            <p className="text-xs font-semibold text-emerald-400 mt-2">{edu.grade}</p>
                            <p className="text-xs text-slate-400 mt-3 leading-relaxed font-light">{edu.details}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}

// --- Certifications Section ---
function Certifications() {
    const certs = [
        { title: "Programming in Java", issuer: "NPTEL", detail: "Elite + Gold (Top 5% Nationwide)", icon: "code" },
        { title: "LangChain4J & AI Engineering", issuer: "CodeSignal", detail: "LLM Orchestration & Tool Calling", icon: "cpu" },
        { title: "Python Programming & Data Structures", issuer: "Coursera", detail: "Algorithms & Scripting", icon: "code-xml" },
        { title: "Cybersecurity Fundamentals", issuer: "IBM / NxtWave", detail: "Enterprise Cryptography & Defense", icon: "shield" }
    ];

    return (
        <Section id="certifications">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">07.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Certifications & Honors</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-10 leading-relaxed font-light">
                Recognized credentials in core language proficiencies, AI frameworks, and distributed architecture.
            </motion.p>

            <motion.div variants={STAGGER_CONTAINER_VARIANTS} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {certs.map((cert) => (
                    <motion.div 
                        key={cert.title} 
                        className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1" 
                        variants={FADE_IN_VARIANTS}
                    >
                        <div>
                            <div className="bg-slate-800 p-3 rounded-xl w-fit text-cyan-400 mb-4 border border-slate-700/60">
                                <Icon name={cert.icon} className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white text-sm">{cert.title}</h3>
                            <p className="text-slate-400 text-xs mt-1">{cert.issuer}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80">
                            <span className="text-[11px] font-mono text-cyan-300 font-semibold">{cert.detail}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </Section>
    );
}

// --- Recruiter AI Assistant (Dynamic Insights) ---
const CURATED_INSIGHTS = {
    skills: "• High-Availability Microservices: Architected and scaled Spring Boot microservices serving 10M+ users with 99.9% uptime across mission-critical civic and governance platforms.\n• Streaming & Caching: Engineered resilient asynchronous event streams with Apache Kafka (consumer groups, topic partitioning) and sub-millisecond Redis distributed caching.\n• Dual-Database Engineering: Deep expertise maintaining consistency between PostgreSQL and MS SQL Server alongside modern, responsive React.js and TypeScript frontends.",
    latency: "• Query Profiling: Diagnosed query bottlenecks using PostgreSQL EXPLAIN ANALYZE, pinpointing sequential scans, unindexed joins, and suboptimal nested subqueries.\n• Execution Plan Tuning: Refactored queries with Common Table Expressions (CTEs), Window Functions (ROW_NUMBER(), RANK()), and targeted B-Tree composite indexes.\n• Redis Distributed Cache: Implemented TTL-based distributed caching on frequently queried election datasets, resulting in a sustained 30% reduction in API response times under production SLAs.",
    ai: "• Rapid Microservice Delivery: Architected and deployed the containerized CURE 1 payment microservice in 3 days using Antigravity and OpenAI Codex for rapid scaffolding, schema mapping, and API contracts.\n• 7-Day Monolith Modernization: Migrated a complex legacy Struts monolith to modular Spring Boot & React for TSEC in 1 week leveraging Claude, Cursor, and Copilot for query optimization.\n• Developer Velocity: Actively leverages agentic AI workflows for automated refactoring, SQL optimization, and test scaffolding with strict ACID guarantees.",
    apsec: "• Statewide Data Processing: Architected voter data mapping and automated Electoral Roll (ER) print generation microservices handling state-level records under strict SLAs.\n• Dual-Database Synchronization: Engineered real-time sync routines ensuring ACID-compliant consistency between PostgreSQL and MS SQL Server.\n• Concurrency Resolution: Authored optimized SQL sorting procedures and window function queries that successfully handled peak live election-day traffic without failure."
};

function AiInsights() {
    const [isLoading, setIsLoading] = useState(false);
    const [insight, setInsight] = useState('');
    const [activeTopic, setActiveTopic] = useState('');

    const topics = [
        { id: 'skills', label: 'Summarize Full Stack & Microservices', prompt: "Summarize Kasthuri Shravani's core microservices, Kafka, Redis, and Spring Boot capabilities in 3 crisp bullet points with metrics." },
        { id: 'latency', label: 'Explain 30% Database Latency Cut', prompt: "Detail how Kasthuri Shravani achieved the 30% API latency cut using PostgreSQL EXPLAIN ANALYZE, CTEs, window functions, and Redis." },
        { id: 'ai', label: 'How she uses AI Developer Agents', prompt: "Explain how Kasthuri Shravani uses modern AI tools like Antigravity, OpenAI Codex, Claude, Cursor, and Copilot to deliver projects like CURE 1 in 3 days." },
        { id: 'apsec', label: 'APSEC & Dual-DB Synchronization', prompt: "Summarize the APSEC election management project, focusing on voter data mapping and dual-database sync between PostgreSQL and MS SQL." }
    ];

    const streamText = (text) => {
        let charIndex = 0;
        const interval = setInterval(() => {
            setInsight(text.slice(0, charIndex + 1));
            charIndex++;
            if (charIndex >= text.length) {
                clearInterval(interval);
                setIsLoading(false);
            }
        }, 12);
    };

    const getAIInsight = async (topicObj) => {
        setIsLoading(true);
        setActiveTopic(topicObj.id);
        setInsight('');
        
        const fallbackText = CURATED_INSIGHTS[topicObj.id] || CURATED_INSIGHTS.skills;

        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_GOES_HERE') {
            streamText(fallbackText);
            return;
        }

        const systemPrompt = `You are an AI assistant for Kasthuri Shravani's developer portfolio. Your task is to provide concise, technical, and accurate answers highlighting her skills in Java, Spring Boot, Kafka, Redis, PostgreSQL, MS SQL, AI-assisted development (Antigravity, Codex), and her projects at CGG. Here is her verified resume context: ${RESUME_CONTEXT}`;
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`; 
        const payload = { 
            contents: [{ parts: [{ text: topicObj.prompt }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.5 }
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            if (!response.ok) {
                throw new Error(`API error ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            
            if (!text) {
                streamText(fallbackText);
                return;
            }
            
            streamText(text);
        } catch (error) {
            streamText(fallbackText);
        }
    };
    
    return (
        <Section id="ai-insights">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">08.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
                    Recruiter AI Assistant
                    <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">Gemini 2.5 Flash</span>
                </h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-8 leading-relaxed font-light">
                Demonstrating live GenAI synthesis. Click any query to evaluate Shravani's architecture background in real time.
            </motion.p>

            <motion.div variants={FADE_IN_VARIANTS} className="flex flex-wrap gap-3 mb-6">
                {topics.map((t) => (
                    <motion.button 
                        key={t.id}
                        onClick={() => getAIInsight(t)} 
                        disabled={isLoading} 
                        className={`text-xs font-mono font-medium py-2.5 px-4 rounded-xl border transition-all flex items-center gap-2 ${activeTopic === t.id ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/20' : 'bg-slate-900/80 text-slate-300 border-slate-700/70 hover:border-cyan-400 hover:text-white'}`}
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading && activeTopic === t.id && <span className="loader"></span>}
                        <span>{t.label}</span>
                    </motion.button>
                ))}
            </motion.div>

            <AnimatePresence>
                {(isLoading || insight) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0 }} 
                        className="glass-card p-6 rounded-2xl border border-cyan-800/40 bg-slate-950/90 shadow-2xl min-h-[100px]"
                    >
                        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-cyan-400 border-b border-slate-800/80 pb-2">
                            <Icon name="sparkles" className="w-3.5 h-3.5" />
                            <span>Generated AI Briefing</span>
                        </div>
                        <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-light font-mono">
                            {insight}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </Section>
    );
}

// --- GitHub Activity Section ---
function GitHubActivity() {
    return (
        <Section id="github">
            <motion.div variants={FADE_IN_VARIANTS} className="flex items-center gap-4 mb-4">
                <span className="font-mono text-cyan-400 text-sm font-semibold">09.</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">GitHub Contributions & Activity</h2>
                <div className="h-px bg-slate-800 flex-grow max-w-md"></div>
            </motion.div>
            <motion.p variants={FADE_IN_VARIANTS} className="text-slate-400 text-sm max-w-3xl mb-8 leading-relaxed font-light">
                Continuous delivery, refactoring exercises, and open source exploration.
            </motion.p>

            <motion.div variants={FADE_IN_VARIANTS} className="glass-card p-5 sm:p-7 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                        src={`https://ghchart.rshah.org/22d3ee/${PERSONAL_INFO.githubHandle}`}
                        alt={`${PERSONAL_INFO.githubHandle}'s GitHub Contribution Graph`}
                        className="w-full rounded-lg"
                    />
                </a>
                <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-2">
                        <Icon name="github" className="w-4 h-4 text-cyan-400" />
                        <span>github.com/{PERSONAL_INFO.githubHandle}</span>
                    </span>
                    <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Visit GitHub Profile</span>
                        <Icon name="externalLink" className="w-3.5 h-3.5" />
                    </a>
                </div>
            </motion.div>
        </Section>
    );
}

// --- Contact Section ---
function Contact({ emailJsLoaded }) {
    const form = useRef();
    const [status, setStatus] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        
        if (!emailJsLoaded || !window.emailjs) {
            setStatus({ text: 'Email service initializing. Please try again in a few seconds.', type: 'error' });
            return;
        }

        setIsSubmitting(true); 
        setStatus({ text: '', type: '' });
        
        window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, form.current)
            .then(() => {
                setStatus({ text: "Thank you! Your message has been sent successfully. I'll get back to you shortly.", type: 'success' });
                form.current.reset();
            }, (error) => setStatus({ text: `Failed to send message: ${error.text || 'Unknown error'}. You can also email me directly at ${PERSONAL_INFO.email}`, type: 'error' }))
            .finally(() => {
                setIsSubmitting(false);
                setTimeout(() => setStatus({ text: '', type: '' }), 8000);
            });
    };

    return (
        <Section id="contact" className="pb-24">
            <div className="max-w-4xl mx-auto">
                <motion.div variants={FADE_IN_VARIANTS} className="text-center mb-12">
                    <span className="font-mono text-cyan-400 text-sm font-semibold tracking-wider uppercase">07. What's Next?</span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4 gradient-text">
                        Let's Build Something High-Scale
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
                        Whether you are hiring for a Senior / Full Stack Java role, need high-availability microservices architecture, or want to discuss query performance tuning—my inbox is always open.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Contact Direct Cards */}
                    <motion.div variants={FADE_IN_VARIANTS} className="md:col-span-2 space-y-4">
                        <div className="glass-card p-5 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                                    <Icon name="mail" className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-mono text-slate-400">Direct Email</span>
                            </div>
                            <a href={`mailto:${PERSONAL_INFO.email}`} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors block break-all">
                                {PERSONAL_INFO.email}
                            </a>
                        </div>

                        <div className="glass-card p-5 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                                    <Icon name="phone" className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-mono text-slate-400">Phone & WhatsApp</span>
                            </div>
                            <a href={`tel:${PERSONAL_INFO.phone}`} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors block">
                                {PERSONAL_INFO.phone}
                            </a>
                        </div>

                        <div className="glass-card p-5 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                                    <Icon name="mapPin" className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-mono text-slate-400">Location</span>
                            </div>
                            <p className="text-sm font-semibold text-white">
                                {PERSONAL_INFO.location}
                            </p>
                            <span className="text-xs text-slate-400 mt-0.5 block">Open to Relocation / Hybrid / Remote</span>
                        </div>

                        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                                    <Icon name="linkedin" className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-mono text-slate-400 block">LinkedIn</span>
                                    <span className="text-xs font-semibold text-white">in/{PERSONAL_INFO.linkedinHandle}</span>
                                </div>
                            </div>
                            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                                <Icon name="externalLink" className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div variants={FADE_IN_VARIANTS} className="md:col-span-3">
                        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
                            <form ref={form} onSubmit={sendEmail} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-slate-400 mb-1.5">Your Name</label>
                                        <input 
                                            type="text" 
                                            name="from_name" 
                                            placeholder="John Doe" 
                                            required 
                                            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-slate-400 mb-1.5">Your Email</label>
                                        <input 
                                            type="email" 
                                            name="from_email" 
                                            placeholder="john@example.com" 
                                            required 
                                            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-colors" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Subject / Opportunity</label>
                                    <input 
                                        type="text" 
                                        name="subject" 
                                        placeholder="Senior Java Developer Opportunity" 
                                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Message</label>
                                    <textarea 
                                        name="message" 
                                        placeholder="Hi Shravani, I saw your background in distributed microservices and database tuning..." 
                                        rows="4" 
                                        required 
                                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                                    ></textarea>
                                </div>
                                <motion.button 
                                    type="submit" 
                                    disabled={isSubmitting || !emailJsLoaded} 
                                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.01 }} 
                                    whileTap={{ scale: 0.99 }}
                                >
                                    {isSubmitting && <span className="loader mr-2"></span>}
                                    <span>{isSubmitting ? 'Sending Transmission...' : 'Send Message'}</span>
                                </motion.button>
                            </form>
                            {status.text && (
                                <div className={`mt-4 p-3 rounded-xl text-xs font-mono ${status.type === 'success' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800' : 'bg-red-950/70 text-red-300 border border-red-800'}`}>
                                    {status.text}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}

// --- Footer ---
function Footer() {
    return (
        <footer className="text-center py-10 text-slate-500 text-xs border-t border-slate-800/80 bg-slate-950/60 font-mono">
            <div className="flex justify-center space-x-6 mb-4">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors p-1" title="GitHub">
                    <Icon name="github" className="w-5 h-5" />
                </a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors p-1" title="LinkedIn">
                    <Icon name="linkedin" className="w-5 h-5" />
                </a>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-400 hover:text-cyan-400 transition-colors p-1" title="Email">
                    <Icon name="mail" className="w-5 h-5" />
                </a>
            </div>
            <p className="text-slate-400">
                Architected & Engineered by <span className="text-cyan-400 font-semibold">{PERSONAL_INFO.name}</span>
            </p>
            <p className="text-slate-600 text-[11px] mt-1">
                Java Full Stack • Distributed Microservices • AI-Assisted Engineering
            </p>
        </footer>
    );
}

// --- Chatbot (Ask Shravani AI) ---
function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: `Hi! I'm Shravani's AI portfolio agent. Ask me about her 3+ years experience with Spring Boot microservices, Kafka, the 30% database latency cut, CURE 1, or her work at Centre for Good Governance!` 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages, isTyping]);
    
    const getLocalSmartResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('latency') || q.includes('database') || q.includes('sql') || q.includes('explain') || q.includes('postgres') || q.includes('30%') || q.includes('optimization') || q.includes('cte')) {
            return "Shravani reduced API latency by 30% at Centre for Good Governance by profiling query bottlenecks with PostgreSQL EXPLAIN ANALYZE, refactoring complex queries using CTEs and Window Functions (ROW_NUMBER(), RANK()), tuning composite B-Tree indexes, and implementing Redis distributed caching for hot electoral roll datasets.";
        }
        if (q.includes('cure') || q.includes('payment') || q.includes('aes') || q.includes('encryption')) {
            return "For the CURE 1 Common Utility Payment Platform, Shravani architected and delivered complete containerized microservices in just 3 days using Antigravity and OpenAI Codex. The system features custom AES-256-GCM encryption filters, idempotent request handling, and strict ACID transaction isolation under peak traffic.";
        }
        if (q.includes('tsec') || q.includes('struts') || q.includes('moderniz') || q.includes('migration')) {
            return "For the Telangana State Election Commission (TSEC), Shravani modernized a legacy Struts monolith into modular Spring Boot and React microservices in 7 days using AI coding agents (Claude, Cursor, Copilot), refactoring complex SQL queries and streamlining high-volume data streams between backend services and UI dashboards.";
        }
        if (q.includes('apsec') || q.includes('election') || q.includes('voter') || q.includes('dual')) {
            return "On the APSEC Election Management System, Shravani architected statewide voter data mapping, dual-database synchronization between PostgreSQL and MS SQL Server, and automated Electoral Roll print generation microservices with strict SLAs and live election-day concurrency management.";
        }
        if (q.includes('kafka') || q.includes('redis') || q.includes('stream') || q.includes('cache')) {
            return "Shravani leverages Apache Kafka for event streaming, asynchronous decoupling, and consumer group management across distributed microservices. She pairs this with Redis distributed caching to eliminate redundant database hits and achieve sub-millisecond data retrieval.";
        }
        if (q.includes('ai') || q.includes('agent') || q.includes('antigravity') || q.includes('codex') || q.includes('copilot') || q.includes('cursor') || q.includes('claude')) {
            return "Shravani actively pioneers modern AI-assisted software engineering using Antigravity, OpenAI Codex, Claude, Cursor, and GitHub Copilot. Key deliverables include building the CURE 1 payment microservice in 3 days and modernizing legacy Struts to Spring Boot/React in 1 week.";
        }
        if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('iiit') || q.includes('basar') || q.includes('btech') || q.includes('university')) {
            return "Shravani holds a B.Tech in Electronics & Communication Engineering from Rajiv Gandhi University of Knowledge Technologies (RGUKT - IIIT Basar) (2019–2023, CGPA 8.3/10) and completed her Pre-University Course (MPC) with academic distinction from RGUKT (2017–2019).";
        }
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach') || q.includes('call') || q.includes('location')) {
            return "You can reach Shravani directly at kasthurishravani1212@gmail.com or +91-9182456681. She is located in Hyderabad, India and open to Full Stack Developer and Backend Microservices roles.";
        }
        if (q.includes('skills') || q.includes('stack') || q.includes('tech') || q.includes('languages') || q.includes('tools')) {
            return "Shravani's core technical stack includes Java, Spring Boot, Spring Cloud, Netflix Eureka, Apache Kafka, Redis, PostgreSQL, MS SQL Server, React.js, TypeScript, Docker, Jenkins CI/CD, Git, and AI developer tools like Antigravity and Codex.";
        }
        if (q.includes('cgg') || q.includes('centre for good governance') || q.includes('work') || q.includes('experience')) {
            return "At the Centre for Good Governance (CGG) since March 2023, Shravani serves as a Java Full Stack Developer architecting Spring Boot microservices serving 10M+ users with 99.9% availability, statewide voter data mapping, and dual-database sync between PostgreSQL and MS SQL.";
        }
        return "Kasthuri Shravani is a Java Full Stack Developer with 3+ years of experience specializing in high-availability distributed microservices, Apache Kafka, Redis, and database query optimization at Centre for Good Governance. Feel free to ask about her projects (APSEC, TSEC, CURE 1), technical stack, or 30% API latency cut!";
    };

    const getAIResponse = async (userMessage) => {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_GOES_HERE') {
            return getLocalSmartResponse(userMessage);
        }
        const systemPrompt = `You are "Ask Shravani AI", an intelligent, highly professional AI assistant for Kasthuri Shravani's developer portfolio. Answer recruiter and engineering questions based STRICTLY on her resume and background:
- 3+ years of experience in Java Full Stack development, backend architecture, and high-availability distributed systems.
- Core skills: Java, Spring Boot, Spring Cloud, Netflix Eureka, Kafka, Redis, PostgreSQL, MS SQL, React.js, Docker, Jenkins.
- Experience at Centre for Good Governance (CGG) from March 2023 – Present:
  * Scaled Spring Boot microservices serving 10M+ users with 99.9% uptime.
  * Profiled query bottlenecks with PostgreSQL EXPLAIN ANALYZE, refactored with CTEs and window functions, tuned indexes, and implemented Redis caching to cut API latency by 30%.
  * Built CURE 1 payment microservice in 3 days with Antigravity & OpenAI Codex (AES-256-GCM encryption, ACID guarantees).
  * Migrated TSEC legacy Struts to Spring Boot/React in 1 week using Claude, Cursor, Copilot.
  * APSEC voter data mapping & dual-database sync (PostgreSQL <-> MS SQL).
- Education: B.Tech in ECE from RGUKT (IIIT Basar) (2019-2023, CGPA 8.3/10), PUC (MPC) from RGUKT (2017-2019).
- Contact: Hyderabad, +91-9182456681, kasthurishravani1212@gmail.com, linkedin.com/in/shravani-kasthuri.
Keep answers concise, technical, and welcoming. If asked something unknown, politely offer to connect with Shravani directly. Here is the full resume context: ${RESUME_CONTEXT}`;
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const payload = { 
            contents: [{ parts: [{ text: userMessage }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] } 
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                return getLocalSmartResponse(userMessage);
            }
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || getLocalSmartResponse(userMessage);
        } catch (error) {
            return getLocalSmartResponse(userMessage);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);
        const aiResponse = await getAIResponse(userMessage);
        setMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <motion.button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/40 relative group"
                whileHover={{ scale: 1.08 }} 
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle AI Assistant"
            >
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse"></span>
                {isOpen ? (
                    <Icon name="x" className="w-6 h-6" />
                ) : (
                    <Icon name="cpu" className="w-6 h-6" />
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 20, scale: 0.95 }} 
                        className="absolute bottom-16 right-0 w-84 sm:w-96 h-[500px] glass-header bg-slate-950/95 rounded-2xl shadow-2xl flex flex-col border border-cyan-800/40 overflow-hidden"
                    >
                        {/* Chat Header */}
                        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                                    <Icon name="cpu" className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Ask Shravani AI</h3>
                                    <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Trained on Verified Resume & Projects
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                                <Icon name="x" className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat Message List */}
                        <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-sm' : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-sm font-light'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="p-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700/60">
                                        <div className="typing-indicator flex items-center gap-1">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="p-3 bg-slate-900/90 border-t border-slate-800">
                            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder="Ask about microservices, Kafka, Redis..." 
                                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400 text-xs text-slate-200 placeholder-slate-500" 
                                />
                                <button 
                                    type="submit" 
                                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-xl transition-colors font-bold disabled:opacity-50"
                                    disabled={!input.trim()}
                                >
                                    <Icon name="arrowRight" className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Recruiter Download Modal ---
function RecruiterModal({ emailJsLoaded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useRef();

    useEffect(() => {
        const hasSeenModal = sessionStorage.getItem('hasSeenRecruiterModal');
        if (!hasSeenModal) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenRecruiterModal', 'true');
            }, 18000);
            return () => clearTimeout(timer);
        }
    }, []);

    const hideModal = () => setIsOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        setIsSubmitting(true); 
        setStatus({ text: '', type: '' });

        const triggerDownload = () => {
            const link = document.createElement('a');
            link.href = PERSONAL_INFO.resumePdf;
            link.download = `Resume-${PERSONAL_INFO.name.replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        if (emailJsLoaded && window.emailjs) {
            window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_RECRUITER_TEMPLATE_ID, form.current)
                .then(() => {
                    setStatus({ text: "Thank you! Downloading resume PDF now...", type: 'success' });
                    triggerDownload();
                    setTimeout(() => {
                        hideModal();
                        setStatus({ text: '', type: '' });
                    }, 3500);
                })
                .catch(() => {
                    // Fallback to instant download anyway so recruiter is not blocked!
                    triggerDownload();
                    hideModal();
                })
                .finally(() => setIsSubmitting(false));
        } else {
            // Directly trigger download if email service isn't ready
            triggerDownload();
            setIsSubmitting(false);
            hideModal();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
                    onClick={hideModal}
                >
                    <motion.div 
                        initial={{ scale: 0.92, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.92, opacity: 0 }} 
                        className="glass-card bg-slate-950 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full relative border border-slate-700" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={hideModal} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
                            <Icon name="x" className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-2">
                            <Icon name="download" className="w-4 h-4" />
                            <span>Quick Resume Access</span>
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Download Resume PDF</h2>
                        <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                            Looking to review Kasthuri Shravani's full technical qualifications for your team? Enter your details to start the download instantly.
                        </p>
                        
                        <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="recruiter-name" className="block text-xs font-mono text-slate-400 mb-1">Your Name / Organization</label>
                                <input 
                                    type="text" 
                                    id="recruiter-name" 
                                    name="recruiter_name" 
                                    placeholder="e.g. Google / Microsoft / Recruiter"
                                    required 
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400" 
                                />
                            </div>
                            <div>
                                <label htmlFor="recruiter-email" className="block text-xs font-mono text-slate-400 mb-1">Your Work Email</label>
                                <input 
                                    type="email" 
                                    id="recruiter-email" 
                                    name="recruiter_email" 
                                    placeholder="recruiter@company.com"
                                    required 
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                            >
                                {isSubmitting && <span className="loader mr-2"></span>}
                                <span>Download PDF & Notify</span>
                            </button>
                        </form>
                        {status.text && (
                            <div className={`mt-4 p-3 rounded-xl text-xs font-mono ${status.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                                {status.text}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
