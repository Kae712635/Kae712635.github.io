import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import ProjectFilter from "../components/ProjectFilter";
import allProjects from "../data/projects.json";
import { motion, AnimatePresence } from "framer-motion"; // Suggestion : installe framer-motion pour le "Waouh"

export default function ProjetsPage() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("Tout");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "Tout") return allProjects;
    const targetCategories = activeFilter === "Systèmes" ? ["Systèmes", "Réseau"] : [activeFilter];
    return allProjects.filter((project) => {
      const categories = Array.isArray(project.category) ? project.category : [project.category];
      return categories.some((c) => targetCategories.includes(c));
    });
  }, [activeFilter]);

  return (
    <section className="relative min-h-screen py-20 px-6 overflow-hidden bg-[#0a0502]">
      {/* Background Decoratif - Effet de lueur magique/tech */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-4 rounded-full border border-bronze/30 bg-bronze/10 text-xs font-bold tracking-[0.3em] text-gold mb-6 uppercase backdrop-blur-sm"
          >
            {language === 'fr' ? 'Archive Numérique v2.0' : 'Digital Archive v2.0'}
          </motion.span>

          <h2 className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold via-gold/80 to-bronze tracking-tighter leading-tight uppercase mb-6">
            {language === 'fr' ? 'Le Grand Catalogue' : 'The Grand Catalog'}
          </h2>

          <div className="h-1 w-40 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />

          <p className="mt-8 text-xl text-gold/60 max-w-2xl mx-auto font-serif italic leading-relaxed">
            "{t.section.projectsIntro}"
          </p>
        </header>

        {/* Filtres avec style HUD */}
        <div className="flex justify-center mb-12">
          <ProjectFilter activeFilter={activeFilter} setFilter={setActiveFilter} />
        </div>

        {/* Grille de Projets avec Animation de présence */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative"
              >
                {/* Lueur au survol */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold to-bronze rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500" />

                <div className="relative bg-[#1a120b]/80 border border-gold/20 backdrop-blur-md rounded-lg p-1 transition-all duration-300 group-hover:border-gold/50">
                  <ProjectCard project={project} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gold/40 py-20 text-xl font-serif italic"
          >
            {t.section.noProjects}
          </motion.p>
        )}
      </div>
    </section>
  );
}