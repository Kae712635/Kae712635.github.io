import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { useProjects } from "../hooks/useProjects";

export default function ProjetsPage() {
  const { t, language } = useLanguage();
  const { projects: allProjects, loading } = useProjects();
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);

  // Extraire les catégories uniques pour les filtres
  const categories = useMemo(() => {
    const cats = new Set();
    allProjects.forEach(p => {
      const pCats = Array.isArray(p.category) ? p.category : [p.category];
      pCats.forEach(c => cats.add(c));
    });
    return ["Tout", ...Array.from(cats).sort()];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    let result = activeFilter === "Tout" 
      ? [...allProjects] 
      : allProjects.filter(p => {
          const pCats = Array.isArray(p.category) ? p.category : [p.category];
          return pCats.includes(activeFilter);
        });

    // Tri par date décroissante (plus récent en premier) si disponible
    return result.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [activeFilter, allProjects]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + 9);

  const handleFilterChange = (cat) => {
    setActiveFilter(cat);
    setVisibleCount(9); // Reset pagination
  };

  return (
    <section className="relative min-h-screen py-24 px-6 md:px-12 overflow-hidden bg-black bg-[url('/img/projets/background.png')] bg-cover bg-center bg-fixed">
      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-[#0c0a09]/60 backdrop-blur-[1px]"></div>
      
      {/* Bouton de retour vers la Bibliothèque 3D */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#7A614A] bg-[#3B2A1E]/80 text-[#E0C89F] hover:bg-[#5A4638] hover:text-[#FDF5E6] hover:scale-105 transition-all duration-300 font-bold tracking-widest uppercase text-sm backdrop-blur-md shadow-[0_0_15px_rgba(122,97,74,0.3)]"
        >
          <span className="text-xl">🏛️</span>
          {language === 'fr' ? 'Bibliothèque 3D' : '3D Library'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Élégant */}
        <header className="text-center mb-16 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1.5 px-6 rounded-full border border-[#7A614A] bg-[#3B2A1E]/80 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#E0C89F] mb-6 uppercase shadow-lg backdrop-blur-sm"
          >
            {language === 'fr' ? 'Archive Numérique v2.0' : 'Digital Archive v2.0'}
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-cinzel text-[#FDF5E6] tracking-wide mb-6 drop-shadow-2xl uppercase"
          >
            {language === 'fr' ? 'LE CATALOGUE' : 'THE CATALOG'}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#C8B8A6] font-serif leading-relaxed max-w-2xl mx-auto"
          >
            {t?.section?.projectsIntro || "Une sélection méticuleuse de travaux d'ingénierie, d'explorations algorithmiques et de conceptions d'interfaces."}
          </motion.p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-20">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 border backdrop-blur-sm ${
                activeFilter === cat 
                  ? 'bg-[#5A4638] border-[#8C745C] text-[#FDF5E6] shadow-lg' 
                  : 'bg-black/60 border-white/20 text-[#D0C0B0] hover:bg-[#3F2B20]/80 hover:text-white hover:border-[#8C745C]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Grid de Projects Cards */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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

            {filteredProjects.length === 0 && (
              <div className="text-center text-white/40 py-20 font-serif italic text-lg">
                {t?.section?.noProjects || "Aucun projet trouvé dans cette catégorie."}
              </div>
            )}

            {/* Pagination / Load More */}
            {hasMore && (
              <div className="mt-16 text-center">
                <button 
                  onClick={handleLoadMore}
                  className="btn-premium"
                >
                  {language === 'fr' ? 'Charger plus de projets' : 'Load more projects'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Details */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}