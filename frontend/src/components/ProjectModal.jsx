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
    return typeof field === "string" ? field : field[language] || field.fr || field.en || "";
  };

  const title = project.title;
  const description = getLocalized(project.description);
  const detailedDesc = getLocalized(project.detailed_description);
  const architecture = getLocalized(project.architecture);
  const challenges = project.challenges || [];
  const image = project.image ? (typeof project.image === 'string' ? project.image : project.image[0]) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
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
          className="bg-[#2B0F14] border border-[#D4A24E]/30 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col relative shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-[#F5EBDD] hover:bg-[#A6303B] transition-colors border border-white/10 backdrop-blur-md cursor-pointer"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 1L1 13M1 1l12 12" />
            </svg>
          </button>

          <div className="overflow-y-auto w-full custom-scrollbar">
            {/* Header / Cover Image */}
            {image && (
              <div className="relative w-full h-64 md:h-80 lg:h-96 shrink-0 border-b border-white/10 bg-black">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B0F14] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech && project.tech.map(t => (
                      <span key={t} className="bg-[#140E10]/95 backdrop-blur-md border border-[#D4A24E]/45 text-[#D8C6B6] font-mono text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 id="modal-title" className="text-3xl md:text-5xl font-cinzel font-bold text-[#F5EBDD] mb-2">{title}</h2>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="p-8 md:p-12 text-[#F5EBDD]/90 space-y-10">
              <section>
                <h3 className="text-xl font-cinzel font-bold text-[#F5EBDD] mb-4 flex items-center gap-3">
                  <span className="w-6 h-[2px] bg-[#D4A24E]"></span>
                  {language === 'fr' ? 'Vue d\'ensemble' : 'Overview'}
                </h3>
                <p className="text-[15px] leading-relaxed mb-4 text-[#D8C6B6] font-sans">{description}</p>
                {detailedDesc && <p className="text-[15px] leading-relaxed text-[#F5EBDD] font-sans">{detailedDesc}</p>}
              </section>

              {architecture && (
                <section>
                  <h3 className="text-xl font-cinzel font-bold text-[#F5EBDD] mb-4 flex items-center gap-3">
                    <span className="w-6 h-[2px] bg-[#D4A24E]"></span>
                    {language === 'fr' ? 'Architecture' : 'Architecture'}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#F5EBDD] bg-[#140E10] p-6 rounded-xl border border-[#D4A24E]/25 font-mono">
                    {architecture}
                  </p>
                </section>
              )}

              {project.video && (
                <section>
                  <h3 className="text-xl font-cinzel font-bold text-[#F5EBDD] mb-4 flex items-center gap-3">
                    <span className="w-6 h-[2px] bg-[#D4A24E]"></span>
                    {language === 'fr' ? 'Démonstration Vidéo' : 'Video Demonstration'}
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-[#D4A24E]/25 bg-black shadow-2xl relative">
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
                  <h3 className="text-xl font-cinzel font-bold text-[#F5EBDD] mb-4 flex items-center gap-3">
                    <span className="w-6 h-[2px] bg-[#3C6E71]"></span>
                    {language === 'fr' ? 'Défis & Solutions' : 'Challenges & Solutions'}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {challenges.map((c, i) => (
                      <li key={i} className="flex items-start p-4 rounded-xl bg-[#140E10] border border-[#D4A24E]/20">
                        <svg className="w-5 h-5 text-[#D4A24E] shrink-0 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[13px] leading-relaxed text-[#D8C6B6]">{getLocalized(c)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Action Footer */}
              <div className="pt-6 border-t border-[#D4A24E]/25 flex flex-wrap gap-4 items-center">
                {project.project_url && (
                  <a 
                    href={project.project_url} target="_blank" rel="noopener noreferrer" 
                    className="px-6 py-3 bg-[#A6303B] hover:bg-[#801F29] text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Voir le projet en direct' : 'View Live Project'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {project.github_url && (
                  <a 
                    href={project.github_url} target="_blank" rel="noopener noreferrer" 
                    className="px-6 py-3 border border-[#D4A24E]/50 hover:border-[#D4A24E] hover:text-[#D4A24E] hover:bg-[#D4A24E]/10 text-[#F5EBDD] font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>GitHub</span>
                    <svg className="w-4 h-4 text-[#D4A24E]" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                )}
                {project.document && (
                  <a 
                    href={project.document} target="_blank" rel="noopener noreferrer" 
                    className="px-6 py-3 bg-[#3C6E71] hover:bg-[#2C5356] text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Consulter le Document PDF' : 'View PDF Document'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
