import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { useProjects } from "../hooks/useProjects";
import cvData from "../data/cvData";

const CV_PATH = "/documents/CV_Klervi_Choblet.pdf";
const CONTACT_EMAIL = "klervi.choblet+portfolio@gmail.com";

export default function ProjetsPage() {
  const { t, language } = useLanguage();
  const { projects: allProjects, loading } = useProjects();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [activeTab, setActiveTab] = useState('projets');
  const [showCvModal, setShowCvModal] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'contact' || location.hash === '#contact') {
      setActiveTab('contact');
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else if (tab === 'apropos') {
      setActiveTab('apropos');
    }
  }, [searchParams, location]);

  const sortedProjects = useMemo(() => {
    return [...allProjects].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [allProjects]);

  const visibleProjects = sortedProjects.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProjects.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email_address?.value || "";
    const subjectLine = form.subject_line?.value || "Message depuis le portfolio";
    const message = form.form_message?.value || "";

    const subject = encodeURIComponent(`Portfolio — ${subjectLine}`);
    const body = encodeURIComponent(
      `Objet: ${subjectLine}\nDe: ${email}\n\nMessage:\n${message}\n\n---\nEnvoyé depuis le catalogue.`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setContactSuccess(true);
  }

  const skillCategories = useMemo(() => [
    {
      title: language === 'fr' ? 'Langages Fondamentaux' : 'Core Languages',
      skills: ['C', 'C++', 'C#', 'Java', 'Python', 'Assembleur', 'Shell']
    },
    {
      title: language === 'fr' ? 'Ingénierie Web' : 'Web Engineering',
      skills: ['React', 'Node.js', 'HTML', 'CSS', 'Tailwind CSS', 'API REST', 'Vite', 'Next.js']
    },
    {
      title: language === 'fr' ? 'Intelligence & Données' : 'Intelligence & Data',
      skills: ['Simulation', 'Automates Cellulaires', 'PostgreSQL', 'SQLite', 'Mathématiques', 'Modélisation']
    },
    {
      title: language === 'fr' ? 'Systèmes & Graphismes' : 'Systems & Graphics',
      skills: ['OpenGL', 'GLSL Shaders', 'Visualisation 3D', 'VTK', 'ITK', 'Sockets Raw', 'Linux/UNIX']
    }
  ], [language]);

  return (
    <main 
      id="main-content" 
      tabIndex="-1" 
      className="relative min-h-screen overflow-hidden bg-[#2B0F14] focus:outline-none"
    >
      {/* Subtle Dark Background Texture */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto relative z-10 pt-28 pb-16 px-6 md:px-12 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <header className="text-center mb-12 w-full max-w-4xl mx-auto flex flex-col items-center justify-center" id="hero">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4A24E] text-xs sm:text-sm tracking-[0.25em] font-cinzel mb-3 block uppercase font-bold text-center"
          >
            {language === 'fr' ? 'Catalogue · Archive Numérique' : 'Catalog · Digital Archive'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-[#F5EBDD] tracking-wide mb-4 uppercase leading-tight text-center"
          >
            {language === 'fr' ? (
              <>
                Ingénieure Logicielle
                <span className="block text-[#A6303B] mt-1 font-semibold text-2xl sm:text-4xl md:text-5xl">
                  & Développeuse Fullstack
                </span>
              </>
            ) : (
              <>
                Software Engineer
                <span className="block text-[#A6303B] mt-1 font-semibold text-2xl sm:text-4xl md:text-5xl">
                  & Fullstack Developer
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-[#D8C6B6] font-sans leading-relaxed text-center max-w-2xl mx-auto px-4"
            style={{ width: '100%', wordBreak: 'normal', whiteSpace: 'normal' }}
          >
            {getTranslation('heroTagline', language === 'fr' 
              ? "Conception de systèmes robustes, d'architectures modernes et d'expériences 3D immersives." 
              : 'Building robust systems, modern architectures, and immersive 3D experiences.')}
          </motion.p>
        </header>

        {/* Tab Navigation */}
        <nav 
          aria-label={language === 'fr' ? "Sections du catalogue" : "Catalog sections"}
          className="flex justify-center items-center mb-12 relative z-20 w-full"
        >
          <div className="bg-[#140E10]/95 border border-[#D4A24E]/30 rounded-full p-1.5 backdrop-blur-md flex gap-2 shadow-2xl">
            {[
              { id: 'projets', label: getTranslation('navProjects', language === 'fr' ? 'Projets' : 'Projects'), icon: <svg className="w-4 h-4 text-[#D4A24E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
              { id: 'apropos', label: getTranslation('navAbout', language === 'fr' ? 'À propos / CV' : 'About / Resume'), icon: <svg className="w-4 h-4 text-[#D4A24E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
              { id: 'contact', label: getTranslation('navContact', 'Contact'), icon: <svg className="w-4 h-4 text-[#D4A24E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={`px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-cinzel tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#A6303B] text-white font-bold shadow-lg border border-[#A6303B]'
                    : 'text-[#D8C6B6] hover:text-[#D4A24E] border border-transparent hover:border-[#D4A24E]/40 hover:bg-[#D4A24E]/10'
                }`}
              >
                <span className="flex items-center justify-center">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* PROJETS TAB */}
        {activeTab === 'projets' && (
          <section 
            aria-label={language === 'fr' ? "Liste des projets phares" : "Featured projects list"}
            className="w-full"
          >
            {loading ? (
              <div className="flex justify-center items-center py-32" role="status">
                <div className="w-8 h-8 border-2 border-[#D4A24E]/30 border-t-[#D4A24E] rounded-full animate-spin"></div>
                <span className="sr-only">Chargement des projets...</span>
              </div>
            ) : (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
                >
                  <AnimatePresence mode='popLayout'>
                    {visibleProjects.map((project, i) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.4, delay: i % 9 * 0.05 }}
                      >
                        <ProjectCard 
                          project={project} 
                          onClick={() => setSelectedProject(project)} 
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {hasMore && (
                  <div className="mt-16 text-center">
                    <button 
                      onClick={handleLoadMore}
                      className="px-8 py-3 rounded-full border border-[#D4A24E]/50 text-[#F5EBDD] bg-[#140E10]/80 hover:bg-[#D4A24E]/15 hover:border-[#D4A24E] hover:text-[#D4A24E] transition-all font-cinzel tracking-wider text-xs uppercase font-bold cursor-pointer shadow-md"
                    >
                      {getTranslation('exploreFurther', language === 'fr' ? 'Explorer davantage' : 'Explore further')}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* CV / À PROPOS TAB */}
        {activeTab === 'apropos' && (
          <section
            aria-labelledby="about-section-heading"
            className="pb-24 w-full"
          >
            <header className="text-center mb-16">
              <h2 id="about-section-heading" className="text-4xl md:text-5xl font-cinzel text-[#F5EBDD] tracking-wide mb-4 uppercase font-bold">
                {language === 'fr' ? 'À PROPOS & CV' : 'ABOUT & RESUME'}
              </h2>
              <div className="w-16 h-[2px] bg-[#D4A24E] mx-auto" aria-hidden="true"></div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-48 h-48 rounded-full border-4 border-[#D4A24E]/80 overflow-hidden mb-8 shadow-[0_0_30px_rgba(212,162,78,0.25)]">
                  <img src="/media/photo_identité.png" alt="Portrait de Klervi Choblet, Ingénieure Software" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <p className="text-lg text-[#D8C6B6] font-sans leading-relaxed mb-6">
                  {language === 'fr' 
                    ? "Ingénieure logicielle passionnée par la conception de systèmes complexes, l'optimisation algorithmique et les interfaces immersives. Je combine une rigueur mathématique avec une créativité technique pour donner vie à des architectures robustes et des expériences visuelles saisissantes."
                    : "Software engineer passionate about designing complex systems, algorithmic optimization, and immersive interfaces. I combine mathematical rigor with technical creativity to bring robust architectures and striking visual experiences to life."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowCvModal(true)}
                    className="px-6 py-3 bg-[#A6303B] hover:bg-[#801F29] text-white rounded-full font-cinzel tracking-widest uppercase text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    {getTranslation('viewResumeOnePage', language === 'fr' ? 'Consulter le CV (1 Page)' : 'View Resume (1 Page)')}
                  </button>
                  <a 
                    href={CV_PATH}
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-[#D4A24E]/50 text-[#F5EBDD] hover:border-[#D4A24E] hover:text-[#D4A24E] hover:bg-[#D4A24E]/10 rounded-full font-cinzel tracking-widest uppercase text-xs transition-all flex items-center gap-2 justify-center"
                  >
                    <svg className="w-4 h-4 text-[#D4A24E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    {getTranslation('downloadPdf', language === 'fr' ? 'Télécharger PDF' : 'Download PDF')}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {skillCategories.map((cat, i) => (
                  <div key={i} className="bg-[#140E10]/95 border border-[#D4A24E]/25 p-6 rounded-xl backdrop-blur-sm hover:border-[#D4A24E]/60 transition-colors shadow-lg">
                    <h3 className="text-[#F5EBDD] font-cinzel text-lg mb-4 flex items-center gap-2 font-bold">
                      <span className="w-4 h-[2px] bg-[#D4A24E]" aria-hidden="true"></span>
                      {cat.title}
                    </h3>
                    <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                      {cat.skills.map(skill => (
                        <li key={skill} className="bg-[#1C1417] text-[#D8C6B6] font-mono text-xs font-medium tracking-wide px-3 py-1.5 rounded-full border border-[#D4A24E]/25 hover:border-[#D4A24E]/60 shadow-sm transition-colors">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <section
            id="contact-section"
            aria-labelledby="contact-heading"
            className="pb-24 scroll-mt-32 w-full"
          >
            <header className="text-center mb-16">
              <h2 id="contact-heading" className="text-4xl md:text-5xl font-cinzel text-[#F5EBDD] tracking-wide mb-4 uppercase font-bold">
                {getTranslation('contactTitle', language === 'fr' ? 'ME CONTACTER' : 'CONTACT ME')}
              </h2>
              <div className="w-16 h-[2px] bg-[#D4A24E] mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-base md:text-lg text-[#D8C6B6] font-sans leading-relaxed max-w-2xl mx-auto">
                {getTranslation('contactSub', language === 'fr' 
                  ? `Vous avez un projet ou une opportunité à me proposer ? Écrivez-moi directement via ce formulaire ou à ${CONTACT_EMAIL}`
                  : `Have a project or opportunity to discuss? Send me a message via this form or email ${CONTACT_EMAIL}`)}
              </p>
            </header>

            <div className="max-w-2xl mx-auto bg-[#140E10]/95 border border-[#D4A24E]/30 rounded-xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
              {contactSuccess ? (
                <div role="status" aria-live="polite" className="text-center py-8 bg-[#3C6E71]/20 border border-[#3C6E71] rounded-xl p-6">
                  <h3 className="text-xl font-cinzel text-[#D4A24E] mb-2 font-bold">
                    {getTranslation('contactSuccessTitle', language === 'fr' ? "Message Prêt à l'Envoi !" : "Message Ready to Send!")}
                  </h3>
                  <p className="text-sm text-[#F5EBDD]">
                    {getTranslation('contactSuccessSub', language === 'fr'
                      ? "Votre client de messagerie s'est ouvert. Vous pouvez également m'écrire directement à :"
                      : "Your email application has opened. You can also write directly to:")}
                  </p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block mt-3 text-sm font-mono font-bold text-[#D4A24E] underline">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email_address" className="block text-xs font-cinzel text-[#F5EBDD] mb-2 tracking-widest uppercase font-bold">
                      {getTranslation('contactEmailLabel', language === 'fr' ? 'Votre Adresse Email' : 'Your Email Address')} <span className="text-[#D4A24E]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email_address"
                      name="email_address"
                      required
                      aria-required="true"
                      placeholder="votre.email@exemple.com"
                      className="w-full bg-[#1C1417] border border-[#D4A24E]/30 text-[#F5EBDD] rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A24E] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject_line" className="block text-xs font-cinzel text-[#F5EBDD] mb-2 tracking-widest uppercase font-bold">
                      {getTranslation('contactSubjectLabel', language === 'fr' ? 'Objet du Message' : 'Subject')} <span className="text-[#D4A24E]">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject_line"
                      name="subject_line"
                      required
                      aria-required="true"
                      placeholder={language === 'fr' ? "Opportunité, Projet, Collaboration..." : "Opportunity, Project, Collaboration..."}
                      className="w-full bg-[#1C1417] border border-[#D4A24E]/30 text-[#F5EBDD] rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A24E] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="form_message" className="block text-xs font-cinzel text-[#F5EBDD] mb-2 tracking-widest uppercase font-bold">
                      {getTranslation('contactMessageLabel', language === 'fr' ? 'Votre Message' : 'Your Message')} <span className="text-[#D4A24E]">*</span>
                    </label>
                    <textarea
                      id="form_message"
                      name="form_message"
                      rows="5"
                      required
                      aria-required="true"
                      placeholder={language === 'fr' ? "Rédigez votre message ici..." : "Type your message here..."}
                      className="w-full bg-[#1C1417] border border-[#D4A24E]/30 text-[#F5EBDD] rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A24E] transition-colors text-sm resize-y"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#A6303B] hover:bg-[#801F29] text-white font-cinzel font-bold tracking-widest uppercase py-4 rounded-lg transition-all shadow-lg flex justify-center items-center gap-3 cursor-pointer"
                  >
                    <span>{getTranslation('contactSendBtn', language === 'fr' ? 'Envoyer le Message' : 'Send Message')}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>

      {/* SINGLE PAGE CV MODAL */}
      {showCvModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cv-modal-title"
        >
          <div className="bg-[#140E10] border border-[#D4A24E]/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl text-[#F5EBDD] custom-scrollbar">
            <button
              onClick={() => setShowCvModal(false)}
              className="absolute top-4 right-4 text-[#D8C6B6] hover:text-[#D4A24E] text-xl font-bold p-2 cursor-pointer transition-colors"
              aria-label="Fermer le CV"
            >
              ✕
            </button>

            <div className="border border-[#D4A24E]/30 p-6 rounded-xl bg-[#1C1417]">
              <div className="border-b border-[#D4A24E]/30 pb-4 mb-6 text-center">
                <h2 id="cv-modal-title" className="text-3xl font-cinzel font-bold text-[#F5EBDD]">KLERVI CHOBLET</h2>
                <p className="text-sm font-cinzel text-[#D4A24E] font-bold mt-1">{cvData.profile.title[language] || cvData.profile.title.fr}</p>
                <p className="text-xs font-mono text-[#D8C6B6] mt-1">{cvData.profile.email} • {cvData.profile.github}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                <div>
                  <h3 className="font-cinzel text-[#D4A24E] font-bold border-b border-[#D4A24E]/20 pb-1 mb-3 uppercase">
                    {language === 'fr' ? 'Expériences Professionnelles' : 'Work Experiences'}
                  </h3>
                  {cvData.experiences.map((exp) => (
                    <div key={exp.id} className="mb-3">
                      <div className="font-bold text-[#F5EBDD]">{typeof exp.role === 'object' ? (exp.role[language] || exp.role.fr) : exp.role}</div>
                      <div className="text-[#D4A24E] font-mono text-[10px]">{exp.company} | {exp.period}</div>
                      <div className="text-[#D8C6B6] text-[11px] mt-1">{typeof exp.description === 'object' ? (exp.description[language] || exp.description.fr) : exp.description}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-cinzel text-[#D4A24E] font-bold border-b border-[#D4A24E]/20 pb-1 mb-3 uppercase">
                    {language === 'fr' ? 'Formations & Diplômes' : 'Education & Degrees'}
                  </h3>
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                      <div className="font-bold text-[#F5EBDD]">{typeof edu.title === 'object' ? (edu.title[language] || edu.title.fr) : edu.title}</div>
                      <div className="text-[#D4A24E] font-mono text-[10px]">{edu.school} | {edu.period}</div>
                    </div>
                  ))}

                  <h3 className="font-cinzel text-[#D4A24E] font-bold border-b border-[#D4A24E]/20 pb-1 mb-3 mt-4 uppercase">
                    {language === 'fr' ? 'Compétences & Langues' : 'Skills & Languages'}
                  </h3>
                  {cvData.skills.map((s, i) => (
                    <div key={i} className="mb-2">
                      <div className="font-semibold text-[#F5EBDD] text-[11px]">{typeof s.categoryName === 'object' ? (s.categoryName[language] || s.categoryName.fr) : s.categoryName}</div>
                      <div className="text-[#D8C6B6] font-mono text-[10px]">{s.items.join(' • ')}</div>
                    </div>
                  ))}
                  <div className="mt-2">
                    <div className="font-semibold text-[#F5EBDD] text-[11px]">{language === 'fr' ? 'Langues' : 'Languages'}</div>
                    <div className="text-[#D8C6B6] font-mono text-[10px]">
                      {cvData.languages.map(l => `${typeof l.name === 'object' ? (l.name[language] || l.name.fr) : l.name} (${typeof l.level === 'object' ? (l.level[language] || l.level.fr) : l.level})`).join(' • ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D4A24E]/30 flex justify-between items-center flex-wrap gap-4">
                <span className="text-[11px] text-[#D8C6B6] font-cinzel">
                  {getTranslation('cvSyntheticTitle', language === 'fr' ? 'CV Synthétique 1 Page · Klervi Choblet' : '1-Page Synthetic Resume · Klervi Choblet')}
                </span>
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-[#A6303B] hover:bg-[#801F29] text-white font-cinzel font-bold text-xs uppercase transition-colors shadow-md"
                >
                  {getTranslation('cvOriginalDownload', language === 'fr' ? 'Télécharger le PDF Original' : 'Download Original PDF')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </main>
  );
}