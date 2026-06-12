import React from "react";
import { useLanguage } from "../context/LanguageContext";

const ProjectCard = ({ project, onClick }) => {
  const { language } = useLanguage();

  const getLocalized = (field) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[language] || field.en || "";
  };

  const title = project.title;
  const description = getLocalized(project.description);
  const categories = Array.isArray(project.category) ? project.category : [project.category];
  const image = project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600";
  
  // Format date elegantly (e.g. "Mar 2025")
  const formattedDate = project.date ? new Date(project.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' }) : "";

  return (
    <div 
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer hover:-translate-y-1 bg-[#15100C] border border-[#3B2A1E] backdrop-blur-md"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Voir les détails du projet ${title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/11]">
        <div className="absolute inset-0 overflow-hidden bg-black/60">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#15100C] via-transparent to-transparent opacity-90" />
        </div>
        
        {/* Badges Overlay */}
        <div className="absolute -bottom-3.5 left-6 flex gap-2 z-10">
          {categories.map((cat, idx) => {
            let emoji = '✨';
            if (cat.toLowerCase().includes('web')) emoji = '🎮'; // For Game site in Mockup
            else if (cat.toLowerCase().includes('intelligence')) emoji = '🧠';
            else if (cat.toLowerCase().includes('logiciel')) emoji = '⚙️';
            else if (cat.toLowerCase().includes('infrastructure')) emoji = '☁️';
            
            return (
              <span key={idx} className="bg-[#2B2019] text-[#D4B886] text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#5A4638] shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
                {cat} <span className="text-[12px]">{emoji}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10 flex flex-col flex-grow bg-gradient-to-b from-[#15100C] to-[#0A0705]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl md:text-2xl font-cinzel text-[#FDF5E6] uppercase tracking-wide group-hover:text-[#D4B886] transition-colors duration-300 pr-4 leading-snug">
            {title}
          </h3>
          {formattedDate && (
            <span className="text-[10px] md:text-[11px] text-[#A39281] tracking-widest font-medium uppercase mt-1.5 shrink-0 whitespace-nowrap">
              {formattedDate.toUpperCase()}
            </span>
          )}
        </div>

        <p className="text-[13px] md:text-[14px] text-[#C8B8A6] leading-relaxed mb-6 line-clamp-3 font-serif">
          {description}
        </p>

        <div className="mt-auto">
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-[#D4B886]/80 group-hover:text-[#D4B886] flex items-center transition-colors uppercase tracking-widest">
              {language === 'fr' ? 'Découvrir' : 'Explore'}
              <svg className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            
            {/* Quick Links inside Card (stops propagation to not trigger modal) */}
            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors" aria-label="Demo">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
