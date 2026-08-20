import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProjects } from '../../hooks/useProjects';
import cvData from '../../data/cvData';

export default function TextAlternative3D({ onSelectProject }) {
  const { language } = useLanguage();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [activeBay, setActiveBay] = useState('bay-2'); // default to projects

  const getLocalized = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field.fr || field.en || "";
  };

  const handleGoToProjects = () => {
    if (onSelectProject) onSelectProject();
    navigate('/projets');
  };

  return (
    <div className="space-y-4 text-[#EEE2DF] mt-4 border-t border-[#8A897C]/25 pt-4">
      {/* Banner */}
      <div className="bg-[#415D43]/20 border border-[#415D43]/60 p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="font-cinzel text-sm font-bold text-[#D4AF37]">
            {language === 'fr' ? 'Version Texte Complète (Sans 3D)' : 'Complete Text Version (No 3D)'}
          </h4>
          <p className="text-xs text-[#D0C7C4] mt-0.5 font-sans">
            {language === 'fr' 
              ? 'Accédez au contenu complet des 4 travées de la bibliothèque sans manipulation 3D.'
              : 'Browse all 4 bays of the library directly without requiring 3D graphics.'}
          </p>
        </div>
        <button
          onClick={handleGoToProjects}
          className="px-3 py-1.5 bg-[#415D43] hover:bg-[#2E4330] text-white text-xs font-cinzel font-bold rounded-lg transition-colors cursor-pointer"
        >
          {language === 'fr' ? 'Ouvrir en page 2D ↗' : 'Open in 2D Page ↗'}
        </button>
      </div>

      {/* Bay Tabs / Selectors */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Travées de la bibliothèque">
        {[
          { id: 'bay-1', icon: '🏛️', label: language === 'fr' ? '1. Expériences' : '1. Experiences' },
          { id: 'bay-2', icon: '🚀', label: language === 'fr' ? '2. Projets' : '2. Projects' },
          { id: 'bay-3', icon: '⚙️', label: language === 'fr' ? '3. Compétences' : '3. Skills' },
          { id: 'bay-4', icon: '🎓', label: language === 'fr' ? '4. Formations' : '4. Education' },
        ].map(bay => (
          <button
            key={bay.id}
            role="tab"
            aria-selected={activeBay === bay.id}
            aria-controls={`panel-${bay.id}`}
            id={`tab-${bay.id}`}
            onClick={() => setActiveBay(bay.id)}
            className={`px-3 py-2 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeBay === bay.id
                ? 'bg-[#D4AF37] text-[#14110f] shadow'
                : 'bg-[#14110f] text-[#D0C7C4] border border-[#8A897C]/30 hover:text-[#EEE2DF] hover:border-[#D4AF37]/50'
            }`}
          >
            <span aria-hidden="true">{bay.icon}</span>
            <span>{bay.label}</span>
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="bg-[#14110f] p-4 rounded-xl border border-[#8A897C]/30 max-h-[42vh] overflow-y-auto custom-scrollbar font-sans">
        {/* Travée 1: Expériences */}
        {activeBay === 'bay-1' && (
          <div id="panel-bay-1" role="tabpanel" aria-labelledby="tab-bay-1" className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              {language === 'fr' ? 'Travée 1 : Parcours & Expériences Professionnelles' : 'Bay 1: Professional Experience'}
            </h5>
            {cvData.experiences.map((exp) => (
              <article key={exp.id} className="p-3 bg-[#1c1a17] border border-[#8A897C]/20 rounded-lg">
                <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                  <h6 className="font-bold text-xs text-[#EEE2DF] font-sans">{getLocalized(exp.role)}</h6>
                  <span className="text-[11px] text-[#D4AF37] font-mono">{exp.company} • {exp.period}</span>
                </div>
                <p className="text-xs text-[#D0C7C4] mb-2 leading-relaxed">{getLocalized(exp.description)}</p>
                {exp.highlights && (
                  <ul className="list-disc list-inside text-[11px] text-[#D0C7C4]/90 space-y-0.5">
                    {(exp.highlights[language] || exp.highlights.fr || []).map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Travée 2: Projets */}
        {activeBay === 'bay-2' && (
          <div id="panel-bay-2" role="tabpanel" aria-labelledby="tab-bay-2" className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              {language === 'fr' ? 'Travée 2 : 5 Projets Phares' : 'Bay 2: 5 Core Projects'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((p) => (
                <article key={p.id} className="p-3 bg-[#1c1a17] border border-[#8A897C]/20 rounded-lg flex flex-col justify-between">
                  <div>
                    <h6 className="font-bold text-xs text-[#EEE2DF] mb-0.5 font-sans">{p.title}</h6>
                    <p className="text-[10px] text-[#D4AF37] mb-1.5">{Array.isArray(p.category) ? p.category.join(', ') : p.category}</p>
                    <p className="text-xs text-[#D0C7C4] leading-relaxed mb-2 line-clamp-3">{getLocalized(p.description)}</p>
                    {p.tech && (
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {p.tech.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-[#415D43]/20 border border-[#415D43]/40 text-[#EEE2DF] px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-[#8A897C]/20 flex gap-3 text-xs">
                    {p.project_url && (
                      <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#415D43] hover:underline">
                        {language === 'fr' ? 'Démo ↗' : 'Live ↗'}
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-[#D0C7C4] hover:text-[#EEE2DF] hover:underline">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Travée 3: Compétences */}
        {activeBay === 'bay-3' && (
          <div id="panel-bay-3" role="tabpanel" aria-labelledby="tab-bay-3" className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              {language === 'fr' ? 'Travée 3 : Compétences Techniques & Langues' : 'Bay 3: Technical Skills & Languages'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cvData.skills.map((s, idx) => (
                <div key={idx} className="p-3 bg-[#1c1a17] border border-[#8A897C]/20 rounded-lg">
                  <h6 className="font-bold text-[11px] text-[#D4AF37] uppercase tracking-wider mb-1.5 font-cinzel">
                    {getLocalized(s.categoryName)}
                  </h6>
                  <ul className="text-xs text-[#D0C7C4] space-y-0.5">
                    {s.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-[#415D43] rounded-full shrink-0" aria-hidden="true"></span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travée 4: Formations */}
        {activeBay === 'bay-4' && (
          <div id="panel-bay-4" role="tabpanel" aria-labelledby="tab-bay-4" className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              {language === 'fr' ? "Travée 4 : Diplômes & Centres d'Intérêt" : "Bay 4: Education & Interests"}
            </h5>
            <div className="space-y-2.5">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="p-3 bg-[#1c1a17] border border-[#8A897C]/20 rounded-lg">
                  <h6 className="font-bold text-xs text-[#EEE2DF] font-sans">{getLocalized(edu.title)}</h6>
                  <p className="text-[11px] text-[#D4AF37] mb-1 font-mono">{edu.school} • {edu.period}</p>
                  <p className="text-xs text-[#D0C7C4]">{getLocalized(edu.details)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

