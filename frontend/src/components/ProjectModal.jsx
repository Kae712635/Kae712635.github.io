import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const { language } = useLanguage();
  const [showVideoModal, setShowVideoModal] = useState(false);

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
                {detailedDesc && (
                  <div className="space-y-3">
                    {detailedDesc.split('\n').filter(line => line.trim() !== '').map((para, idx) => (
                      <p key={idx} className="text-[14px] leading-relaxed text-[#F5EBDD] font-sans">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
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
                {project.video ? (
                  <button 
                    onClick={() => setShowVideoModal(true)}
                    className="px-6 py-3 bg-[#A6303B] hover:bg-[#801F29] text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md inline-flex items-center gap-2 cursor-pointer border border-[#D4A24E]/40"
                  >
                    <span>{language === 'fr' ? 'Consulter le projet (Vidéo)' : 'View Project (Video)'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                ) : project.project_url ? (
                  <a 
                    href={project.project_url} target="_blank" rel="noopener noreferrer" 
                    className="px-6 py-3 bg-[#A6303B] hover:bg-[#801F29] text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Voir le projet en direct' : 'View Live Project'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : null}
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

        {/* Video Player Modal Popup */}
        {showVideoModal && project.video && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-lg"
            onClick={() => setShowVideoModal(false)}
          >
            <div 
              className="bg-[#180E11] border-2 border-[#D4A24E] w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 px-6 border-b border-[#D4A24E]/30 bg-[#2B0F14]/80">
                <div>
                  <span className="text-[10px] font-cinzel font-bold text-[#D4A24E] uppercase tracking-widest block">
                    {language === 'fr' ? 'Démonstration Vidéo' : 'Video Demonstration'}
                  </span>
                  <h4 className="text-xl font-cinzel font-bold text-[#F5EBDD]">{title}</h4>
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="w-9 h-9 rounded-full bg-[#A6303B] text-white flex items-center justify-center border border-[#D4A24E] hover:bg-[#801F29] transition-colors cursor-pointer"
                  aria-label="Fermer la vidéo"
                >
                  ✕
                </button>
              </div>
              <div className="bg-black flex items-center justify-center">
                <video 
                  src={project.video} 
                  controls 
                  autoPlay 
                  playsInline 
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
