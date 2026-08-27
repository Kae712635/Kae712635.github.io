import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function CVConfirmModal({ isOpen, onClose }) {
  const { language } = useLanguage();

  if (typeof document === 'undefined') return null;

  const isEn = language === 'en';
  const cvPath = isEn ? '/documents/CV_Klervi_Choblet_EN.pdf' : '/documents/CV_Klervi_Choblet_FR.pdf';
  const cvFilename = isEn ? 'CV_Klervi_Choblet_EN.pdf' : 'CV_Klervi_Choblet_FR.pdf';
  const langLabel = isEn ? 'English' : 'Français';

  const handleOpenNewTab = (e) => {
    e?.stopPropagation();
    window.open(cvPath, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleDownload = (e) => {
    e?.stopPropagation();
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = cvFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cv-confirm-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            style={{
              width: '100%',
              maxWidth: '440px',
              minWidth: '280px',
              boxSizing: 'border-box'
            }}
            className="bg-[#140E10] border border-[#D4A24E]/60 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,162,78,0.25)] text-[#F5EBDD] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#D8C6B6] hover:text-[#D4A24E] text-xl font-bold p-1 cursor-pointer transition-colors"
              aria-label={isEn ? "Close" : "Fermer"}
            >
              ✕
            </button>

            {/* Icon Header Badge */}
            <div className="w-12 h-12 rounded-xl bg-[#D4A24E]/20 border border-[#D4A24E]/50 flex items-center justify-center text-[#FFD700] mb-4 shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>

            <h3 id="cv-confirm-title" className="text-lg sm:text-xl font-cinzel font-bold text-[#F5EBDD] mb-2 tracking-wide">
              {isEn ? "Klervi Choblet's Resume" : "CV de Klervi Choblet"}
            </h3>

            <p className="text-xs sm:text-sm text-[#D8C6B6] font-sans leading-relaxed mb-6">
              {isEn ? (
                <>
                  You are about to access the resume in <strong className="text-[#FFD700] font-semibold">{langLabel}</strong> (PDF format). How would you like to proceed?
                </>
              ) : (
                <>
                  Vous vous apprêtez à accéder au CV en version <strong className="text-[#FFD700] font-semibold">{langLabel}</strong> (format PDF). Comment souhaitez-vous procéder ?
                </>
              )}
            </p>

            <div className="flex flex-col gap-3">
              {/* Action 1: Open in new tab */}
              <button
                onClick={handleOpenNewTab}
                className="w-full py-3 px-4 rounded-xl bg-[#D4A24E]/20 hover:bg-[#D4A24E]/30 border border-[#D4A24E] text-[#FFD700] hover:text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span className="whitespace-nowrap">{isEn ? "Open in New Tab" : "Ouvrir dans un nouvel onglet"}</span>
              </button>

              {/* Action 2: Download PDF file */}
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-[#A6303B] hover:bg-[#801F29] border border-[#A6303B] text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="whitespace-nowrap">{isEn ? "Download PDF File" : "Télécharger le fichier PDF"}</span>
              </button>

              {/* Action 3: Cancel */}
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-transparent hover:border-[#D4A24E]/30 text-[#D8C6B6] hover:text-[#F5EBDD] font-cinzel text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                {isEn ? "Cancel" : "Annuler"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
