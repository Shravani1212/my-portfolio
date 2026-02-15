import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
Chart.register(...registerables);

// IMPORTANT: Add your EmailJS keys here
const EMAILJS_PUBLIC_KEY = '9K1HD5IEzGJW8WxRx'; // This is your Public Key
const EMAILJS_SERVICE_ID = 'service_5ehurrn';
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_phugmw9';
const EMAILJS_RECRUITER_TEMPLATE_ID = 'template_phugmw9'; // Please create a separate template for this and update the ID
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_GOES_HERE';

// --- Icon Components ---

const Icon = ({ name, className }) => {
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
        star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
        'git-fork': <><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" /><path d="M12 12v3" /></>,
        'git-commit-vertical': <><path d="M12 3v6"/><circle cx="12" cy="12" r="3"/><path d="M12 15v6"/></>
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name]}
        </svg>
    );
};

// --- Main App Component ---

export default function App() {
    const [emailJsLoaded, setEmailJsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
        script.async = true;
        script.onload = () => {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
            setEmailJsLoaded(true);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div className="bg-slate-900 text-slate-300">
            <StyleInjector />
            <Header />
            <main className="container mx-auto px-6 sm:px-10 md:px-20 ">
                <Hero />
                <About />
                <AiInsights />
                <TechnicalShowcase />
                <Experience />
                <Projects />
                <GitHubActivity />
                <Certifications />
                <Contact emailJsLoaded={emailJsLoaded} />
            </main>
            <Footer />
            <Chatbot />
            <RecruiterModal emailJsLoaded={emailJsLoaded} />
        </div>
    );
}

// --- Component Definitions ---

function StyleInjector() {
    return (
        <style>{`
            :root {
                --bg-color: #020617;
                --text-primary: #e2e8f0;
                --text-secondary: #94a3b8;
                --accent-color: #22d3ee;
                --accent-light: rgba(34, 211, 238, 0.1);
                --accent-dark: #0891b2;
                --card-bg: #0f172a;
            }
            body { 
                font-family: 'Poppins', sans-serif; 
                background-color: var(--bg-color); 
                background-image: linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0.9) 70%, var(--bg-color) 100%);
                color: var(--text-primary); 
            }
            .font-mono { font-family: 'Roboto Mono', monospace; }
            .glass-effect { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid #1e293b; }
            .card-hover:hover { transform: translateY(-8px); box-shadow: 0 0 30px rgba(34, 211, 238, 0.15); }
            ::-webkit-scrollbar { width: 10px; }
            ::-webkit-scrollbar-track { background: #0f172a; }
            ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; border: 2px solid #0f172a; }
            ::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
            .loader { border: 2px solid #334155; border-top: 2px solid var(--accent-color); border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; display: inline-block; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .typing-indicator span { height: 8px; width: 8px; background-color: var(--text-secondary); border-radius: 50%; display: inline-block; animation: bounce 1.3s infinite; }
            .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
            .gradient-text { background: linear-gradient(to right, #67e8f9, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}</style>
    );
}

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const STAGGER_CONTAINER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect' : ''}`;

    return (
        <motion.header id="header" className={navClass} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#hero" className="block w-10 h-10 overflow-hidden rounded-full">
                    <img src="/ks-avatar.jpg" alt="Shravani" className="w-full h-full object-cover" />
                </a>
                <div className="hidden md:flex space-x-8 items-center text-[var(--text-secondary)] font-medium">
                    <a href="#about" className="hover:text-[var(--accent-color)] transition duration-300">About</a>
                    <a href="#projects" className="hover:text-[var(--accent-color)] transition duration-300">Projects</a>
                    <a href="#github" className="hover:text-[var(--accent-color)] transition duration-300">GitHub</a>
                    <a href="#contact" className="hover:text-[var(--accent-color)] transition duration-300">Contact</a>
                    <a href="Resume (1).pdf" target="_blank" rel="noopener noreferrer" className="border-2 border-[var(--accent-color)] text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)] hover:text-white transition duration-300">Resume</a>
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[var(--accent-color)] focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </nav>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden glass-effect">
                        <a href="#about" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-sm text-slate-300 hover:bg-slate-700">About</a>
                        <a href="#projects" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-sm text-slate-300 hover:bg-slate-700">Projects</a>
                        <a href="#github" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-sm text-slate-300 hover:bg-slate-700">GitHub</a>
                        <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-sm text-slate-300 hover:bg-slate-700">Contact</a>
                        <a href="Resume (1).pdf" target="_blank" rel="noopener noreferrer" className="block py-3 px-6 text-sm text-slate-300 hover:bg-slate-700">Resume</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

function Section({ children, id }) {
    return (
        <motion.section id={id} className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={STAGGER_CONTAINER_VARIANTS}>
            {children}
        </motion.section>
    );
}

function Hero() {
    const GITHUB_USERNAME = 'Shravani1212';

    const titleVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };
    const letterVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
           <Section id="hero">
                   <div className="min-h-screen flex flex-col md:flex-row items-center">
                       <div className="w-full md:w-7/12 p-4 md:p-8">
                            <motion.p className="text-[var(--accent-color)] font-mono mb-4 text-lg" variants={FADE_IN_VARIANTS}>Hi, my name is</motion.p>
                            <motion.h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[var(--text-primary)]" variants={titleVariants}>
                                {"Kasthuri Shravani.".split("").map((char, index) => <motion.span key={index} variants={letterVariants} className="inline-block">{char}</motion.span>)}
                            </motion.h1>
                            <motion.h2 className="text-4xl sm:text-6xl md:text-5xl font-extrabold text-slate-500 mt-2" variants={FADE_IN_VARIANTS}>I build things for the web.</motion.h2>
                            <motion.p className="text-[var(--text-secondary)] mt-6 max-w-xl leading-relaxed" variants={FADE_IN_VARIANTS}>
                                I'm a Java Full Stack Developer specializing in building scalable, high-performance web applications. With 3 years of experience, I am passionate about solving complex technical challenges and leveraging modern technologies to create innovative solutions.
                            </motion.p>
                            <motion.div className="mt-10 flex flex-wrap gap-4" variants={FADE_IN_VARIANTS}>
                                <motion.a href="#projects" className="bg-[var(--accent-color)] text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-[var(--accent-dark)] hover:text-white transition duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>View My Work</motion.a>
                                <motion.a href="#contact" className="border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-8 rounded-lg hover:bg-[var(--accent-color)] hover:text-slate-900 transition duration-300" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>Contact Me</motion.a>
                            </motion.div>
                            <motion.div className="mt-12 flex space-x-6" variants={FADE_IN_VARIANTS}>
                                <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[var(--accent-color)] transition-colors duration-300">
                                    <Icon name="github" className="w-7 h-7" />
                                </a>
                                <a href="https://www.linkedin.com/in/shravani-kasthuri/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[var(--accent-color)] transition-colors duration-300">
                                    <Icon name="linkedin" className="w-7 h-7" />
                                </a>
                            </motion.div>
                       </div>
                       <div className="w-full md:w-5/12 p-4 md:p-8 flex justify-center">
                           <div className="w-full max-w-sm h-64 md:h-96 rounded-lg overflow-hidden shadow-xl" style={{ backgroundImage: "url('/ks-avatar.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
                       </div>
                   </div>
           </Section>
    );
}

function About() {
    return (
        <Section id="about">
            <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-12 flex items-center">
                About Me <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>
            <div className="grid md:grid-cols-5 gap-12 items-center">
                <motion.div variants={FADE_IN_VARIANTS} className="md:col-span-3 text-[var(--text-secondary)] space-y-4 leading-relaxed">
                    <p>Hello! I'm Shravani, a Java Full Stack Developer with over 2 years of experience. This video provides a brief introduction to my technical journey and passion for building scalable applications.</p>
                    <p>My work at the Centre for Good Governance involves creating robust backend systems with Spring Boot and dynamic frontends with React. I've been central to developing key features for the APSEC election management system, focusing on complex logic and data processing. I thrive on continuous learning and aim to deepen my expertise in microservices and cloud technologies.</p>
                </motion.div>
                <motion.div variants={FADE_IN_VARIANTS} className="md:col-span-2">
                    <motion.div className="w-full h-auto rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700" whileHover={{ scale: 1.03, rotate: 1, boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)' }}>
                        <video controls poster="https://img.freepik.com/free-photo/young-indian-woman-developer-works-laptop-office_158595-8278.jpg?w=900" className="w-full h-full object-cover">
                            <source src="WhatsApp Video 2025-07-31 at 9.54.15 PM.mp4" type="video/mp4" /> Your browser does not support the video tag.
                        </video>
                    </motion.div>
                </motion.div>
            </div>
        </Section>
    );
}

const RESUME_CONTEXT = `KASTHURI SHRAVANI - JAVA FULL STACK DEVELOPER CONTACT: Phone: (+91) 9182456681, Email: kasthurishravani1212@gmail.com, Location: Hyderabad, INDIA, LinkedIn: https://www.linkedin.com/in/shravani-kasthuri/, GitHub: https://github.com/Shravani1212 PROFILE SUMMARY: A dedicated Java Full Stack Developer with over 2 years of experience in building scalable web applications using Spring Boot, React.js, JSP, and PostgreSQL. At the Center for Good Governance, worked on dynamic projects like the APSEC election management system, implementing reservation handling, result processing, and multilingual form generation. Key achievements include optimizing backend services using GitHub Copilot (reducing development time by 20%) and leveraging ChatGPT for debugging and refactoring legacy code. Passionate about solving technical challenges, improving application performance, and collaborating with cross-functional teams. Career goal is to deepen expertise in microservices architecture and cloud technologies to build innovative, high-performance solutions. WORK EXPERIENCE: - Java Full Stack Developer at Centre for Good Governance (CGG) (March 2023 - Present) - Skilled and detail-oriented Java Fullstack Developer with hands-on experience in designing, developing, and maintaining enterprise-level web applications using Java (Spring Boot, Hibernate) on the backend and JSP, JSTL, HTML, CSS, JavaScript, and jQuery on the frontend. - Proficient in building scalable REST APIs, integrating databases (MySQL/PostgreSQL), and ensuring responsive UI/UX designs. - Strong knowledge of MVC architecture, backend logic, and frontend templating. - Experienced in version control (Git), build tools (Maven/Gradle), and deployment on Apache Tomcat or cloud platforms. - Adept at working in Agile/Scrum environments. EDUCATION: - B.Tech/B.E. - Electronics/Telecommunication from Rajiv Gandhi University of Knowledge Technologies (RGUKT- Basar), 2023. Grade: 8.3/10. 12th Grade: 90-94.9% (2019). 10th Grade: 95-99.9% (2017). KEY SKILLS: - Frontend: HTML, CSS, JavaScript, React.Js, Bootstrap, JSP - Backend: Java, Spring Boot, Spring MVC, Spring Data JPA, Python - Databases: SQL, PostgreSQL, MySQL, SQLite - Tools: Git, Maven/Gradle, Apache Tomcat, Figma. CERTIFICATIONS: - Programming In Java By NPTEL (Elite + Gold, Top 5%) - WordPress Theme Development With Bootstrap - Python Programming (Coursera) - Cybersecurity Fundamentals (IBM) - Microsoft Excel`;

function AiInsights() {
    const [isLoading, setIsLoading] = useState(false);
    const [insight, setInsight] = useState('');
    const [activeTopic, setActiveTopic] = useState('');

    const getAIInsight = async (topic) => {
        setIsLoading(true);
        setActiveTopic(topic);
        setInsight('');
        
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_GOES_HERE') {
            setInsight("Error: Please add your Gemini API Key to the App.jsx file.");
            setIsLoading(false);
            return;
        }

        let userPrompt = '';
        if (topic === 'skills') {
            userPrompt = "Summarize Kasthuri Shravani's key technical skills into 3 bullet points, highlighting her full-stack capabilities.";
        } else if (topic === 'achievements') {
            userPrompt = "Highlight Kasthuri Shravani's top 2 most impressive achievements from her work experience in a short paragraph.";
        }

        const systemPrompt = `You are an AI assistant for a portfolio website. Your task is to generate a concise summary based on the provided resume context and a user prompt. Be professional and focus only on the information given. Here is the resume context: ${RESUME_CONTEXT}`;
        
               const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`; 
               const payload = { 
            contents: [{ parts: [{ text: userPrompt }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                temperature: 0.7,
            }
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            if (!response.ok) {
                 const errorData = await response.json().catch(() => null);
                 const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
                 throw new Error(errorMessage);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text.trim();
            
            if (!text) {
                setInsight("Sorry, I couldn't generate a response this time.");
                setIsLoading(false);
                return;
            }
            
            let charIndex = 0;
            const interval = setInterval(() => {
                setInsight(text.slice(0, charIndex + 1));
                charIndex++;
                if (charIndex === text.length) {
                    clearInterval(interval);
                    setIsLoading(false);
                }
            }, 20);

        } catch (error) {
            setInsight(`Error: ${error.message}. Please try again.`);
            setIsLoading(false);
        }
    };
    
    return(
        <Section id="ai-insights">
             <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-4 flex items-center">
                Recruiter AI Assistant <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>
            <motion.p variants={FADE_IN_VARIANTS} className="text-[var(--text-secondary)] mb-8 max-w-3xl">This is an advanced feature to demonstrate my AI integration skills. Click a button below to have a Generative AI analyze my resume and provide a tailored summary for you in real-time.</motion.p>
            <motion.div variants={FADE_IN_VARIANTS} className="flex flex-wrap gap-4 mb-8">
                <motion.button onClick={() => getAIInsight('skills')} disabled={isLoading} className="bg-slate-800 text-[var(--accent-color)] font-bold py-2 px-6 rounded-lg disabled:opacity-50 flex items-center gap-2 border border-slate-700" whileHover={{ scale: 1.05, backgroundColor: '#1e293b' }} whileTap={{ scale: 0.95 }}>
                   {isLoading && activeTopic === 'skills' && <span className="loader"></span>} Summarize Key Skills
                </motion.button>
                <motion.button onClick={() => getAIInsight('achievements')} disabled={isLoading} className="bg-slate-800 text-[var(--accent-color)] font-bold py-2 px-6 rounded-lg disabled:opacity-50 flex items-center gap-2 border border-slate-700" whileHover={{ scale: 1.05, backgroundColor: '#1e293b' }} whileTap={{ scale: 0.95 }}>
                    {isLoading && activeTopic === 'achievements' && <span className="loader"></span>} Highlight Achievements
                </motion.button>
            </motion.div>
            <AnimatePresence>
            { (isLoading || insight) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0}} className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-slate-800 min-h-[100px]">
                    <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{insight}</p>
                </motion.div>
            )}
            </AnimatePresence>
        </Section>
    );
}


function TechnicalShowcase() {
    const skillsChartRef = useRef(null);
    const techStackChartRef = useRef(null);

    useEffect(() => {
        let skillsChart, techStackChart;
        const accentColor = '#22d3ee';
        const accentColorTransparent = 'rgba(34, 211, 238, 0.3)';
        const textColor = '#94a3b8';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = "'Poppins', sans-serif";

        if (skillsChartRef.current) {
            const ctx = skillsChartRef.current.getContext('2d');
            skillsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Java', 'Spring Boot', 'React.js', 'SQL', 'Python', 'DevOps Tools'],
                    datasets: [{ label: 'Proficiency', data: [9, 9, 8, 8, 7, 7], backgroundColor: accentColorTransparent, borderColor: accentColor, borderWidth: 1, borderRadius: 4 }]
                },
                options: {
                    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#020617'} },
                    scales: { x: { beginAtZero: true, max: 10, grid: { color: '#1e293b' } }, y: { grid: { display: false } } }
                }
            });
        }
        
        if (techStackChartRef.current) {
            const ctx = techStackChartRef.current.getContext('2d');
            techStackChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Backend (Java/Spring)', 'Frontend (React/JSP)', 'Database (SQL)', 'Other'],
                    datasets: [{ data: [50, 30, 15, 5], backgroundColor: ['#22d3ee', '#0ea5e9', '#38bdf8', '#7dd3fc'], borderColor: '#0f172a', borderWidth: 4, }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '60%',
                    plugins: { legend: { position: 'bottom', labels: { color: textColor } }, tooltip: { backgroundColor: '#020617' } }
                }
            });
        }
        
        return () => {
            if (skillsChart) skillsChart.destroy();
            if (techStackChart) techStackChart.destroy();
        };
    }, []);

    return (
        <Section id="dashboard">
            <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-12 flex items-center">
                Technical Dashboard
                <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12">
                <motion.div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-slate-800" variants={FADE_IN_VARIANTS}>
                    <h3 className="text-xl font-bold mb-4 text-slate-300">Core Technology Proficiency</h3>
                    <div className="relative h-80"><canvas ref={skillsChartRef}></canvas></div>
                </motion.div>
                <motion.div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-slate-800" variants={FADE_IN_VARIANTS}>
                    <h3 className="text-xl font-bold mb-4 text-slate-300">Project Technology Distribution</h3>
                    <div className="relative h-80"><canvas ref={techStackChartRef}></canvas></div>
                </motion.div>
            </div>
        </Section>
    );
}

function Experience() {
    return (
        <Section id="experience">
            <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-12 flex items-center">
                Where I've Worked
                <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>
            <motion.div variants={FADE_IN_VARIANTS} className="relative border-l-2 border-slate-700 ml-4 md:ml-0">
                <div className="mb-10 ml-10">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-[var(--accent-color)] rounded-full -left-4 ring-8 ring-slate-900">
                         <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                    </span>
                    <h3 className="text-xl font-semibold text-slate-200">Java Full Stack Developer <span className="text-[var(--accent-color)]">@ Centre for Good Governance (CGG)</span></h3>
                    <time className="block mb-3 text-sm font-normal leading-none text-slate-500 font-mono">March 2023 - Present</time>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
                        <li>Design, develop, and maintain enterprise-level web applications using Java, Spring Boot, and Hibernate.</li>
                        <li>Build and integrate scalable REST APIs with MySQL/PostgreSQL databases.</li>
                        <li>Worked on APSEC election management system, implementing reservation handling, result processing, and multilingual form generation.</li>
                        <li>Utilized GitHub Copilot to optimize backend services, reducing development time by 20%.</li>
                    </ul>
                </div>
            </motion.div>
        </Section>
    );
}

function Projects() {
    const projectData = [
        { 
            title: 'APSEC Election Management System', 
            description: 'A comprehensive system for managing state election processes. I developed backend logic for reservations, result processing, and dynamic forms.', 
            tags: ['Java', 'Spring Boot', 'JSP', 'JavaScript','PostgreSQL','MSSQL'], 
            img: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop' 
        },
        { 
            title: 'TGSEC', 
            description: 'A comprehensive system for managing state election processes. I developed backend logic for reservations, result processing, and dynamic forms for Telangana.', 
            tags: ['Java', 'Struts', 'JavaScript','JSP','PostgreSQL','MSSQL'], 
            img: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop' 
        },
        { 
            title: 'Budget Analyzer Application', 
            description: 'A tool for analyzing and visualizing budget data, helping users track expenses and manage finances with interactive charts and reports.', 
            tags: ['Java', 'React', 'Chart.js'], 
            img: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop' 
        },
        { 
            title: 'AI-Powered Mini Chatbot', 
            description: 'Developed multiple chatbots, including the one on this site, using LLM APIs to provide intelligent, context-aware responses.', 
            tags: ['JavaScript', 'Gemini API'], 
            img: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1974&auto=format&fit=crop' 
        }
    ];

    return (
        <Section id="projects">
            <motion.h2 
                variants={FADE_IN_VARIANTS} 
                className="text-3xl font-bold text-slate-200 mb-12 flex items-center"
            >
                Projects 
                <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>
            <motion.div 
                variants={STAGGER_CONTAINER_VARIANTS} 
                className="grid md:grid-cols-2 gap-8"
            >
                {projectData.map((proj) => (
                    <motion.div 
                        key={proj.title} 
                        className="group bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-lg border border-slate-800 card-hover transition-all duration-300" 
                        variants={FADE_IN_VARIANTS}
                    >
                        <div className="overflow-hidden h-56">
                            <img 
                                src={proj.img} 
                                alt={proj.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-200 mb-2">{proj.title}</h3>
                            <p className="text-[var(--text-secondary)] mb-4 text-sm leading-relaxed">{proj.description}</p>
                            <div className="flex flex-wrap pt-2">
                                {proj.tags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="bg-cyan-900/50 text-[var(--accent-color)] text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </Section>
    );
}


function GitHubActivity() {
    const GITHUB_USERNAME = 'Shravani1212';
    
    return (
        <Section id="github">
            <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-12 flex items-center">
                GitHub Contributions
                <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>

            <motion.div variants={FADE_IN_VARIANTS} className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-xl shadow-lg border border-slate-800 card-hover transition-all duration-300">
                 <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
                    <img
                        src={`https://ghchart.rshah.org/40c463/${GITHUB_USERNAME}`}
                        alt={`${GITHUB_USERNAME}'s GitHub Contribution Graph`}
                        className="w-full"
                    />
                 </a>
            </motion.div>
        </Section>
    );
}

function Certifications() {
    const certs = [
        { title: "Programming in Java", issuer: "NPTEL", detail: "Elite + Gold (Top 5%)", icon: "code" },
        { title: "WordPress Development", issuer: "Bootstrap", detail: "Theme Specialization", icon: "html" },
        { title: "Python Programming", issuer: "Coursera", detail: "Data Structures", icon: "code-xml" },
        { title: "Cybersecurity Fundamentals", issuer: "NxtWave", detail: "Core Concepts", icon: "database" },
        { title: "Langchain4J", issuer: "CodeSignal", detail: "Core Concepts", icon: "database" }
    
    ];

    return (
        <Section id="certifications">
            <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-12 flex items-center">
                Certifications
                <span className="h-px bg-slate-700 flex-grow ml-6"></span>
            </motion.h2>
            <motion.div variants={STAGGER_CONTAINER_VARIANTS} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certs.map((cert) => (
                    <motion.div key={cert.title} className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-slate-800 flex items-center card-hover transition-all duration-300" variants={FADE_IN_VARIANTS}>
                        <div className="bg-slate-800 p-4 rounded-full mr-6">
                           <Icon name={cert.icon} className="w-8 h-8 text-[var(--accent-color)]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200">{cert.title}</h3>
                            <p className="text-[var(--text-secondary)] text-sm">{cert.issuer}</p>
                             {cert.detail && <p className="text-[var(--accent-color)] text-xs font-semibold mt-1">{cert.detail}</p>}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </Section>
    );
}

function Contact({ emailJsLoaded }) {
    const form = useRef();
    const [status, setStatus] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        
        if (!emailJsLoaded || !window.emailjs) {
            setStatus({ text: 'Email service is not ready. Please wait a moment.', type: 'error' });
            return;
        }

        setIsSubmitting(true); 
        setStatus({ text: '', type: '' });
        
        window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, form.current)
            .then(() => {
                setStatus({ text: "Thank you! I'll get back to you soon.", type: 'success' });
                form.current.reset();
            }, (error) => setStatus({ text: `Failed to send message. Error: ${error.text}`, type: 'error' }))
            .finally(() => {
                setIsSubmitting(false);
                setTimeout(() => setStatus({ text: '', type: '' }), 6000);
            });
    };

    return (
        <Section id="contact">
            <div className="text-center">
                <motion.h2 variants={FADE_IN_VARIANTS} className="text-3xl font-bold text-slate-200 mb-4">
                    What's Next?
                </motion.h2>
                <motion.h3 variants={FADE_IN_VARIANTS} className="text-4xl sm:text-5xl font-bold text-slate-200 mb-4 gradient-text">Get In Touch</motion.h3>
                <motion.p variants={FADE_IN_VARIANTS} className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
                    My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </motion.p>
                <motion.form ref={form} onSubmit={sendEmail} className="max-w-xl mx-auto" variants={FADE_IN_VARIANTS}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="from_name" placeholder="Your Name" required className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow" />
                        <input type="email" name="from_email" placeholder="Your Email" required className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow" />
                    </div>
                    <textarea name="message" placeholder="Your Message" rows="5" required className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow mb-4"></textarea>
                    <motion.button type="submit" disabled={isSubmitting || !emailJsLoaded} className="bg-[var(--accent-color)] text-slate-900 font-bold py-3 px-10 rounded-lg hover:bg-[var(--accent-dark)] hover:text-white transition duration-300 w-full md:w-auto disabled:opacity-50 shadow-lg hover:shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                        {isSubmitting ? <span className="loader mr-2"></span> : null}
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                </motion.form>
                 {status.text && <div className={`mt-6 p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>{status.text}</div>}
            </div>
        </Section>
    );
}

function Footer() {
    const GITHUB_USERNAME = 'Shravani1212';
    return (
        <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-800">
             <div className="flex justify-center space-x-6 mb-4">
                <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[var(--accent-color)] transition-colors duration-300">
                    <Icon name="github" className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/shravani-kasthuri/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[var(--accent-color)] transition-colors duration-300">
                    <Icon name="linkedin" className="w-6 h-6" />
                </a>
            </div>
            <p className="font-mono text-xs">Designed & Built by Kasthuri Shravani</p>
        </footer>
    );
}

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi there! Ask me anything about my skills or experience.' }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        if (chatMessagesRef.current) chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }, [messages, isTyping]);
    
       const getAIResponse = async (userMessage) => {
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_GOES_HERE') {
            return "Error: The Gemini API Key has not been set up by the developer.";
        }
        const systemPrompt = `You are "Ask Shravani AI", a friendly and professional chatbot for Kasthuri Shravani's portfolio website. Your purpose is to answer questions from potential recruiters based ONLY on the provided resume context. Be concise and direct. If a question is outside the scope of the resume, politely decline and state that you can only answer questions about Shravani's professional background. Do not invent information. If the answer isn't in the context, say "That information is not specified in the resume, but you can reach out to Shravani directly for more details." Answer as if you are an assistant representing her. Use "Shravani has..." or "Her experience includes..." Here is the resume context: ${RESUME_CONTEXT}`;
        
       // Replace your current apiUrl line with this:
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = { contents: [{ parts: [{ text: userMessage }] }], systemInstruction: { parts: [{ text: systemPrompt }] }, };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
                throw new Error(errorMessage);
            }
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "I'm sorry, I couldn't generate a response.";
        } catch (error) {
            console.error(error);
            return `There was an issue connecting to the AI service: ${error.message}`;
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
        <div className="fixed bottom-5 right-5 z-50">
            <motion.button onClick={() => setIsOpen(!isOpen)} className="bg-[var(--accent-color)] text-slate-900 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </motion.button>
            <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col border border-slate-700">
                    <div className="p-4 bg-slate-900/50 rounded-t-xl border-b border-slate-700">
                        <h3 className="font-bold text-slate-200">Ask Shravani AI</h3>
                        <p className="text-xs text-slate-400">Nice to chat with you</p>
                    </div>
                    <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                <div className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === 'user' ? 'bg-[var(--accent-color)] text-slate-900' : 'bg-slate-700 text-slate-200'}`}>{msg.text}</div>
                            </div>
                        ))}
                        {isTyping && <div className="flex"><div className="p-3 rounded-lg max-w-xs text-sm bg-slate-700"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-b-xl border-t border-slate-700">
                        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm text-slate-300" />
                            <button type="submit" className="bg-[var(--accent-color)] text-slate-900 p-2 rounded-full hover:bg-[var(--accent-dark)] transition-colors">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

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
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, []);

    const hideModal = () => setIsOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        if (!emailJsLoaded || !window.emailjs) {
            setStatus({ text: 'Email service is not ready. Please try again later.', type: 'error' });
            return;
        }

        setIsSubmitting(true); 
        setStatus({ text: '', type: '' });
        
        window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_RECRUITER_TEMPLATE_ID, form.current)
            .then(() => {
                setIsSubmitting(false);
                setStatus({ text: "Thank you! Download will start shortly.", type: 'success' });
                const link = document.createElement('a');
                link.href = 'Resume (1).pdf';
                link.download = 'Resume-Kasthuri-Shravani.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => {
                    hideModal();
                    form.current.reset();
                    setStatus({ text: '', type: '' });
                }, 4000);
            }, (error) => {
                setIsSubmitting(false);
                setStatus({ text: `Failed to send notification. Error: ${error.text}`, type: 'error' });
            });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={hideModal}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[var(--card-bg)] p-8 rounded-xl shadow-2xl max-w-md w-full relative border border-slate-700" onClick={e => e.stopPropagation()}>
                        <button onClick={hideModal} className="absolute top-4 right-4 text-slate-500 hover:text-[var(--accent-color)]"><Icon name="x" className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-200 mb-2">Download Resume</h2>
                        <p className="text-slate-400 mb-6">Enter your details to get a PDF copy of my resume. I'll be notified of your interest.</p>
                        <form ref={form} onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="recruiter-name" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                <input type="text" id="recruiter-name" name="recruiter_name" required className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="recruiter-email" className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                <input type="email" id="recruiter-email" name="recruiter_email" required className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                            </div>
                            <button type="submit" disabled={isSubmitting || !emailJsLoaded} className="w-full bg-[var(--accent-color)] text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-[var(--accent-dark)] hover:text-white transition duration-300 flex items-center justify-center disabled:opacity-50">
                                {isSubmitting && <span className="loader mr-2"></span>} Download & Notify Me
                            </button>
                        </form>
                        {status.text && <div className={`mt-4 p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>{status.text}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

