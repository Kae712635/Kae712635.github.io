import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const { language } = useLanguage();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const getLocalized = (field) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[language] || field.en || "";
  };

  const title = project.title;
  const description = getLocalized(project.description);
  const detailedDesc = getLocalized(project.detailed_description);
  const architecture = getLocalized(project.architecture);
  const challenges = project.challenges || [];
  const image = project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-md"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 1L1 13M1 1l12 12" />
            </svg>
          </button>

          <div className="overflow-y-auto w-full custom-scrollbar">
            {/* Header / Cover Image */}
            <div className="relative w-full h-64 md:h-80 lg:h-96 shrink-0 border-b border-white/5 bg-black">
              <img src={image} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech && project.tech.map(t => (
                    <span key={t} className="tech-badge bg-black/40 backdrop-blur-md border-white/10">{t}</span>
                  ))}
                </div>
                <h2 id="modal-title" className="text-3xl md:text-5xl font-display text-white mb-2">{title}</h2>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-12 text-white/80 space-y-12">
              <section>
                <h3 className="text-xl font-display text-white mb-4 flex items-center">
                  <span className="w-6 h-[1px] bg-gold mr-3"></span> {language === 'fr' ? 'Vue d\'ensemble' : 'Overview'}
                </h3>
                <p className="text-[15px] leading-relaxed mb-6 text-white/70">{description}</p>
                {detailedDesc && <p className="text-[15px] leading-relaxed text-white/90">{detailedDesc}</p>}
              </section>

              {architecture && (
                <section>
                  <h3 className="text-xl font-display text-white mb-4 flex items-center">
                    <span className="w-6 h-[1px] bg-gold mr-3"></span> {language === 'fr' ? 'Architecture' : 'Architecture'}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-white/80 bg-white/5 p-6 rounded-lg border border-white/5">
                    {architecture}
                  </p>
                </section>
              )}

              {project.video && (
                <section>
                  <h3 className="text-xl font-display text-white mb-4 flex items-center">
                    <span className="w-6 h-[1px] bg-[#D4B886] mr-3"></span> {language === 'fr' ? 'Démonstration' : 'Demonstration'}
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl relative">
                    <video 
                      src={project.video} 
                      controls
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-auto max-h-[60vh] object-contain bg-black/50" 
                    />
                  </div>
                </section>
              )}

              {challenges && challenges.length > 0 && (
                <section>
                  <h3 className="text-xl font-display text-white mb-4 flex items-center">
                    <span className="w-6 h-[1px] bg-gold mr-3"></span> {language === 'fr' ? 'Défis & Solutions' : 'Challenges & Solutions'}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {challenges.map((c, i) => (
                      <li key={i} className="flex items-start p-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <svg className="w-5 h-5 text-gold shrink-0 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[14px] leading-relaxed text-white/70">{getLocalized(c)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Action Footer */}
              <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4 items-center">
                {project.project_url && (
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="btn-premium-primary">
                    {language === 'fr' ? 'Voir le projet' : 'View Project'}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-premium">
                    GitHub
                  </a>
                )}
                {project.document && (
                  <a href={project.document} target="_blank" rel="noopener noreferrer" className="btn-premium">
                    {language === 'fr' ? 'Voir le document' : 'View Document'}
                    <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
