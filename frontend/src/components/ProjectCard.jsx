import React from "react";
import { useLanguage } from "../context/LanguageContext";

const getTechIcon = (tech) => {
  const t = tech.toLowerCase();
  if (t.includes('react')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 mr-1 text-[#61DAFB]">
        <circle cx="12" cy="12" r="2"></circle><ellipse cx="12" cy="12" rx="10" ry="4"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"></ellipse>
      </svg>
    );
  }
  if (t.includes('python')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1 text-[#3776AB]">
        <path d="M14.25 2c-.67 0-1.32.06-1.92.17-.61.12-1.12.3-1.5.54-.38.25-.63.55-.75.92-.12.37-.18.81-.18 1.34V7.5H15v1.5H9.75v3h4.5c.83 0 1.54.2 2.13.59.59.39.98.9 1.18 1.51.2.62.3 1.32.3 2.11 0 .79-.1 1.49-.3 2.11-.2.61-.59 1.12-1.18 1.51-.59.39-1.3.59-2.13.59h-3.37v-2.5c0-.62-.1-1.17-.3-1.63-.2-.46-.48-.83-.84-1.11-.36-.28-.8-.48-1.3-.6-.5-.12-1.06-.18-1.69-.18H4.88c-.62 0-1.18.06-1.68.18-.5.12-.94.32-1.3.6-.36.28-.64.65-.84 1.11-.2.46-.3 1.01-.3 1.63v2.5H4.5v-1.5h5.25v-3H5.25c-.83 0-1.54-.2-2.13-.59C2.53 17.56 2.14 17.05 1.94 16.44 1.74 15.82 1.64 15.12 1.64 14.33c0-.79.1-1.49.3-2.11.2-.61.59-1.12 1.18-1.51.59-.39 1.3-.59 2.13-.59h3.37v2.5c0 .62.1 1.17.3 1.63.2.46.48.83.84 1.11.36.28.8.48 1.3.6.5.12 1.06.18 1.69.18h1.87c.62 0 1.18-.06 1.68-.18.5-.12.94-.32 1.3-.6.36-.28.64-.65.84-1.11.2-.46.3-1.01.3-1.63V4.97c0-.53-.06-.97-.18-1.34-.12-.37-.37-.67-.75-.92-.38-.24-.89-.42-1.5-.54-.6-.11-1.25-.17-1.92-.17z" />
      </svg>
    );
  }
  if (t.includes('c++') || t === 'c') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1 text-[#00599C]">
        <path d="M11.66 16.63c-2.42 0-4.38-1.89-4.38-4.22 0-2.33 1.96-4.22 4.38-4.22 1.69 0 3.12.94 3.86 2.36h2.24c-1.02-2.67-3.66-4.57-6.73-4.57-3.97 0-7.18 3.2-7.18 7.15s3.21 7.15 7.18 7.15c3.07 0 5.71-1.9 6.73-4.57h-2.24c-.74 1.42-2.17 2.36-3.86 2.36z"/>
      </svg>
    );
  }
  // Generic Code Icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1 text-[#D4B886]">
      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
};

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
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:-translate-y-1 bg-[#F5EFED] border border-[#8A897C]/20"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Voir les détails du projet ${title}`}
    >
      {/* Thumbnail — ratio fixe 4/3 uniforme */}
      <div className="relative w-full aspect-[4/3]">
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
        
        {/* Badges catégories */}
        <div className="absolute -bottom-3.5 left-4 flex flex-wrap gap-1.5 z-10 max-w-[90%]">
          {categories.map((cat, idx) => (
            <span key={`cat-${idx}`} className="bg-[#415D43] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shrink-0">
              {cat}
            </span>
          ))}
          {project.tech && project.tech.slice(0, 3).map((tech, idx) => (
              <span key={`tech-${idx}`} className="bg-[#EEE2DF] text-[#353535] text-[8px] font-medium tracking-wider px-2 py-1 rounded border border-[#8A897C]/30 flex items-center shrink-0">
                {getTechIcon(tech)}
                {tech}
              </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-8 md:px-6 md:pb-6 md:pt-10 flex flex-col flex-grow bg-[#F5EFED]">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg md:text-xl font-cinzel text-[#353535] uppercase tracking-wide group-hover:text-[#415D43] transition-colors duration-200 pr-4 leading-snug">
            {title}
          </h3>

          {formattedDate && (
            <span className="text-[10px] text-[#8A897C] tracking-widest font-medium uppercase mt-1 shrink-0 whitespace-nowrap">
              {formattedDate.toUpperCase()}
            </span>
          )}
        </div>

        <p className="text-[13px] md:text-[14px] text-[#353535]/80 leading-relaxed mb-6 line-clamp-3 font-serif">
          {description}
        </p>

        <div className="mt-auto">
          <div className="pt-4 border-t border-[#8A897C]/20 flex items-center justify-between">
            <span className="text-xs font-medium text-[#415D43] group-hover:text-[#2E4330] flex items-center transition-colors uppercase tracking-widest">
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
