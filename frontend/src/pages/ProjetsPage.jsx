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
    } catch (e) {
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
    <section className="relative min-h-screen overflow-hidden bg-[#1e1d1b]">
      {/* Subtle Dark Background Texture */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 pt-28 pb-16 px-6 md:px-12 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <header className="text-center mb-12 w-full max-w-4xl mx-auto flex flex-col items-center justify-center" id="hero">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#8A897C] text-xs sm:text-sm tracking-[0.25em] font-cinzel mb-3 block uppercase font-medium text-center"
          >
            {language === 'fr' ? 'Catalogue · Archive Numérique' : 'Catalog · Digital Archive'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-[#EEE2DF] tracking-wide mb-4 uppercase leading-tight text-center"
          >
            {language === 'fr' ? (
              <>
                Ingénieure Logicielle
                <span className="block text-[#415D43] mt-1 font-semibold text-2xl sm:text-4xl md:text-5xl">
                  & Développeuse Fullstack
                </span>
              </>
            ) : (
              <>
                Software Engineer
                <span className="block text-[#415D43] mt-1 font-semibold text-2xl sm:text-4xl md:text-5xl">
                  & Fullstack Developer
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-[#8A897C] font-serif leading-relaxed text-center max-w-2xl mx-auto px-4"
            style={{ width: '100%', wordBreak: 'normal', whiteSpace: 'normal' }}
          >
            {getTranslation('heroTagline', language === 'fr' 
              ? "Conception de systèmes robustes, d'architectures modernes et d'expériences 3D immersives." 
              : 'Building robust systems, modern architectures, and immersive 3D experiences.')}
          </motion.p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center items-center mb-12 relative z-20 w-full">
          <div className="bg-[#1e1d1b]/90 border border-[#8A897C]/30 rounded-full p-1.5 backdrop-blur-md flex gap-2 shadow-lg">
            {[
              { id: 'projets', label: getTranslation('navProjects', language === 'fr' ? 'Projets' : 'Projects'), icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
              { id: 'apropos', label: getTranslation('navAbout', language === 'fr' ? 'À propos / CV' : 'About / Resume'), icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
              { id: 'contact', label: getTranslation('navContact', 'Contact'), icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-cinzel tracking-widest transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? tab.id === 'contact'
                        ? 'bg-[#B36A5E] text-white font-bold shadow-sm border border-[#B36A5E]'
                        : 'bg-[#415D43] text-white shadow-sm border border-[#415D43]'
                    : tab.id === 'contact'
                        ? 'text-[#B36A5E] border border-[#B36A5E]/40 hover:bg-[#B36A5E]/10'
                        : 'text-[#8A897C] hover:text-[#EEE2DF] border border-transparent hover:border-[#8A897C]/30'
                }`}
              >
                <span className="flex items-center justify-center">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROJETS TAB */}
        {activeTab === 'projets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
                      className="px-6 py-2 rounded-full border border-[#8A897C]/40 text-[#EEE2DF] bg-transparent hover:bg-[#8A897C]/10 transition-colors font-cinzel tracking-wider text-sm uppercase"
                    >
                      {getTranslation('exploreFurther', language === 'fr' ? 'Explorer davantage' : 'Explore further')}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* CV / À PROPOS TAB */}
        {activeTab === 'apropos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pb-24 w-full"
          >
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cinzel text-[#EEE2DF] tracking-wide mb-4 uppercase">
                {language === 'fr' ? 'À PROPOS & CV' : 'ABOUT & RESUME'}
              </h2>
              <div className="w-16 h-[2px] bg-[#415D43] mx-auto"></div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-48 h-48 rounded-full border-4 border-[#415D43] overflow-hidden mb-8 shadow-[0_0_30px_rgba(65,93,67,0.3)]">
                  <img src="/media/photo_identité.png" alt="Klervi Choblet" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <p className="text-lg text-[#EEE2DF]/90 font-serif leading-relaxed mb-6">
                  {language === 'fr' 
                    ? "Ingénieure logicielle passionnée par la conception de systèmes complexes, l'optimisation algorithmique et les interfaces immersives. Je combine une rigueur mathématique avec une créativité technique pour donner vie à des architectures robustes et des expériences visuelles saisissantes."
                    : "Software engineer passionate about designing complex systems, algorithmic optimization, and immersive interfaces. I combine mathematical rigor with technical creativity to bring robust architectures and striking visual experiences to life."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowCvModal(true)}
                    className="px-6 py-3 bg-[#415D43] hover:bg-[#2E4330] text-white rounded-full font-cinzel tracking-widest uppercase text-xs font-bold transition-all shadow-md"
                  >
                    {getTranslation('viewResumeOnePage', language === 'fr' ? 'Consulter le CV' : 'View Resume')}
                  </button>
                  <a 
                    href={CV_PATH}
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-[#8A897C] text-[#EEE2DF] hover:bg-[#8A897C]/15 rounded-full font-cinzel tracking-widest uppercase text-xs transition-all flex items-center gap-2 justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    {getTranslation('downloadPdf', language === 'fr' ? 'Télécharger PDF' : 'Download PDF')}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {skillCategories.map((cat, i) => (
                  <div key={i} className="bg-[#15100C]/80 border border-[#8A897C]/20 p-6 rounded-xl backdrop-blur-sm hover:border-[#415D43] transition-colors">
                    <h3 className="text-[#EEE2DF] font-cinzel text-lg mb-4 flex items-center gap-2 font-bold">
                      <span className="w-4 h-[1px] bg-[#415D43]"></span>
                      {cat.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map(skill => (
                        <span key={skill} className="bg-[#2c2b28] text-[#EEE2DF] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#8A897C]/30 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <motion.div
            id="contact-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pb-24 scroll-mt-32 w-full"
          >
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cinzel text-[#EEE2DF] tracking-wide mb-4 uppercase">
                {getTranslation('contactTitle', language === 'fr' ? 'ME CONTACTER' : 'CONTACT ME')}
              </h2>
              <div className="w-16 h-[2px] bg-[#B36A5E] mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-[#8A897C] font-serif leading-relaxed max-w-2xl mx-auto">
                {getTranslation('contactSub', language === 'fr' 
                  ? `Vous avez un projet ou une opportunité à me proposer ? Écrivez-moi directement via ce formulaire ou à ${CONTACT_EMAIL}`
                  : `Have a project or opportunity to discuss? Send me a message via this form or email ${CONTACT_EMAIL}`)}
              </p>
            </header>

            <div className="max-w-2xl mx-auto bg-[#15100C]/95 border border-[#8A897C]/30 rounded-xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
              {contactSuccess ? (
                <div className="text-center py-8 bg-[#415D43]/20 border border-[#415D43] rounded-xl p-6">
                  <h3 className="text-xl font-cinzel text-[#D4AF37] mb-2 font-bold">
                    {getTranslation('contactSuccessTitle', language === 'fr' ? "Message Prêt à l'Envoi !" : "Message Ready to Send!")}
                  </h3>
                  <p className="text-sm text-[#EEE2DF]">
                    {getTranslation('contactSuccessSub', language === 'fr'
                      ? "Votre client de messagerie s'est ouvert. Vous pouvez également m'écrire directement à :"
                      : "Your email application has opened. You can also write directly to:")}
                  </p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block mt-3 text-sm font-bold text-[#D4AF37] underline">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email_address" className="block text-xs font-cinzel text-[#EEE2DF] mb-2 tracking-widest uppercase font-bold">
                      {getTranslation('contactEmailLabel', language === 'fr' ? 'Votre Adresse Email' : 'Your Email Address')}
                    </label>
                    <input
                      type="email"
                      id="email_address"
                      name="email_address"
                      required
                      placeholder="votre.email@exemple.com"
                      className="w-full bg-[#2c2b28] border border-[#8A897C]/30 text-[#EEE2DF] rounded-lg px-4 py-3 focus:outline-none focus:border-[#415D43] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject_line" className="block text-xs font-cinzel text-[#EEE2DF] mb-2 tracking-widest uppercase font-bold">
                      {getTranslation('contactSubjectLabel', language === 'fr' ? 'Objet du Message' : 'Subject')}
                    </label>
                    <input
                      type="text"
                      id="subject_line"
                      name="subject_line"
                      required
                      placeholder={language === 'fr' ? "Opportunité, Projet, Collaboration..." : "Opportunity, Project, Collaboration..."}
                      className="w-full bg-[#2c2b28] border border-[#8A897C]/30 text-[#EEE2DF] rounded-lg px-4 py-3 focus:outline-none focus:border-[#415D43] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="form_message" className="block text-xs font-cinzel text-[#EEE2DF] mb-2 tracking-widest uppercase font-bold">
                      {getTranslation('contactMessageLabel', language === 'fr' ? 'Votre Message' : 'Your Message')}
                    </label>
                    <textarea
                      id="form_message"
                      name="form_message"
                      rows="5"
                      required
                      placeholder={language === 'fr' ? "Rédigez votre message ici..." : "Type your message here..."}
                      className="w-full bg-[#2c2b28] border border-[#8A897C]/30 text-[#EEE2DF] rounded-lg px-4 py-3 focus:outline-none focus:border-[#415D43] transition-colors text-sm resize-y"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#415D43] hover:bg-[#2E4330] text-white font-cinzel font-bold tracking-widest uppercase py-4 rounded-lg transition-all shadow-lg flex justify-center items-center gap-3"
                  >
                    <span>{getTranslation('contactSendBtn', language === 'fr' ? 'Envoyer le Message' : 'Send Message')}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* SINGLE PAGE CV MODAL */}
      {showCvModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1e1d1b] border border-[#8A897C]/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl text-[#EEE2DF]">
            <button
              onClick={() => setShowCvModal(false)}
              className="absolute top-4 right-4 text-[#8A897C] hover:text-white text-xl font-bold"
              aria-label="Fermer"
            >
              ✕
            </button>

            <div className="border border-[#8A897C]/30 p-6 rounded-xl bg-[#15100c]">
              <div className="border-b border-[#8A897C]/30 pb-4 mb-6 text-center">
                <h2 className="text-3xl font-cinzel font-bold text-[#EEE2DF]">KLERVI CHOBLET</h2>
                <p className="text-sm font-cinzel text-[#415D43] font-bold mt-1">{cvData.profile.title[language] || cvData.profile.title.fr}</p>
                <p className="text-xs text-[#8A897C] mt-1">{cvData.profile.email} • {cvData.profile.github}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h3 className="font-cinzel text-[#415D43] font-bold border-b border-[#8A897C]/20 pb-1 mb-3 uppercase">
                    {language === 'fr' ? 'Expériences Professionnelles' : 'Work Experiences'}
                  </h3>
                  {cvData.experiences.map((exp) => (
                    <div key={exp.id} className="mb-3">
                      <div className="font-bold text-[#EEE2DF]">{typeof exp.role === 'object' ? (exp.role[language] || exp.role.fr) : exp.role}</div>
                      <div className="text-[#8A897C] text-[10px]">{exp.company} | {exp.period}</div>
                      <div className="text-[#EEE2DF]/70 text-[11px] mt-1">{typeof exp.description === 'object' ? (exp.description[language] || exp.description.fr) : exp.description}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-cinzel text-[#415D43] font-bold border-b border-[#8A897C]/20 pb-1 mb-3 uppercase">
                    {language === 'fr' ? 'Formations & Diplômes' : 'Education & Degrees'}
                  </h3>
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                      <div className="font-bold text-[#EEE2DF]">{typeof edu.title === 'object' ? (edu.title[language] || edu.title.fr) : edu.title}</div>
                      <div className="text-[#8A897C] text-[10px]">{edu.school} | {edu.period}</div>
                    </div>
                  ))}

                  <h3 className="font-cinzel text-[#415D43] font-bold border-b border-[#8A897C]/20 pb-1 mb-3 mt-4 uppercase">
                    {language === 'fr' ? 'Compétences & Langues' : 'Skills & Languages'}
                  </h3>
                  {cvData.skills.map((s, i) => (
                    <div key={i} className="mb-2">
                      <div className="font-semibold text-[#EEE2DF] text-[11px]">{typeof s.categoryName === 'object' ? (s.categoryName[language] || s.categoryName.fr) : s.categoryName}</div>
                      <div className="text-[#8A897C] text-[10px]">{s.items.join(' • ')}</div>
                    </div>
                  ))}
                  <div className="mt-2">
                    <div className="font-semibold text-[#EEE2DF] text-[11px]">{language === 'fr' ? 'Langues' : 'Languages'}</div>
                    <div className="text-[#8A897C] text-[10px]">
                      {cvData.languages.map(l => `${typeof l.name === 'object' ? (l.name[language] || l.name.fr) : l.name} (${typeof l.level === 'object' ? (l.level[language] || l.level.fr) : l.level})`).join(' • ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#8A897C]/30 flex justify-between items-center flex-wrap gap-4">
                <span className="text-[11px] text-[#8A897C] font-cinzel">
                  {getTranslation('cvSyntheticTitle', language === 'fr' ? 'CV Synthétique 1 Page · Klervi Choblet' : '1-Page Synthetic Resume · Klervi Choblet')}
                </span>
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-[#415D43] hover:bg-[#2E4330] text-white font-cinzel font-bold text-xs uppercase transition-colors shadow-md"
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
    </section>
  );
}