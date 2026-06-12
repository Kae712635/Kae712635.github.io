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
  const [activeTab, setActiveTab] = useState('projets'); // 'projets' | 'apropos' | 'contact'

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

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleFilterChange = (cat) => {
    setActiveFilter(cat);
    setVisibleCount(9); // Reset pagination
  };

  function handleContactSubmit(e) {
    e.preventDefault();
    const CONTACT_EMAIL = "klervi.choblet+portfolio@gmail.com";
    const form = e.target;
    const name = form.full_name?.value || "";
    const email = form.email_address?.value || "";
    const message = form.form_message?.value || "";
    const subject = encodeURIComponent(`Portfolio — message de ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n---\nEnvoyé depuis le catalogue.\nNom: ${name}\nEmail: ${email}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  const skillCategories = [
    {
      title: language === 'fr' ? 'Langages Fondamentaux' : 'Core Languages',
      skills: ['C', 'C++', 'C#', 'Java', 'Python', 'Assembleur', 'Shell']
    },
    {
      title: language === 'fr' ? 'Ingénierie Web' : 'Web Engineering',
      skills: ['React', 'Node.js', 'HTML', 'CSS', 'Tailwind CSS', 'API', 'WebSockets', 'Spring']
    },
    {
      title: language === 'fr' ? 'Intelligence & Données' : 'Intelligence & Data',
      skills: ['Machine Learning', 'Deep Learning', 'Réseaux de Neurones', 'PostgreSQL', 'Supabase', 'Mathématiques']
    },
    {
      title: language === 'fr' ? 'Systèmes & Graphismes' : 'Systems & Graphics',
      skills: ['OpenGL', 'CUDA', 'GPU', 'Architecture Microservices', 'Visualisation 3D', 'ITK', 'VTK']
    }
  ];

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

        {/* Tab Navigation */}
        <div className="flex justify-center items-center mb-16 relative z-20">
          <div className="bg-[#15100C]/80 border border-[#3B2A1E]/80 rounded-full p-1.5 backdrop-blur-md flex gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            {[
              { id: 'projets', label: language === 'fr' ? 'Archives' : 'Archives', icon: '📜' },
              { id: 'apropos', label: language === 'fr' ? "L'Architecte" : 'The Architect', icon: '👤' },
              { id: 'contact', label: language === 'fr' ? 'Correspondance' : 'Correspondence', icon: '✉️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-cinzel tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-[#3B2A1E] text-[#E0C89F] shadow-inner border border-[#7A614A]' 
                    : 'text-[#8C745C] hover:text-[#C8B8A6] border border-transparent'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- PROJETS TAB --- */}
        {activeTab === 'projets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
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
                  className="px-6 py-2 rounded-full border border-[#7A614A] text-[#E0C89F] bg-transparent hover:bg-[#3B2A1E] transition-colors font-cinzel tracking-wider text-sm uppercase"
                >
                  {language === 'fr' ? 'Explorer davantage' : 'Explore further'}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    )}
        {/* --- CV / Présentation TAB --- */}
        {activeTab === 'apropos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pb-24"
          >
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cinzel text-[#FDF5E6] tracking-wide mb-6">
                {language === 'fr' ? 'À PROPOS' : 'ABOUT ME'}
              </h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Bio */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-48 h-48 rounded-full border-4 border-[#3B2A1E] overflow-hidden mb-8 shadow-[0_0_30px_rgba(59,42,30,0.5)]">
                  <img src="/media/photo_identité.png" alt="Klervi Choblet" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <p className="text-lg text-[#C8B8A6] font-serif leading-relaxed mb-6">
                  {language === 'fr' 
                    ? "Ingénieure logicielle passionnée par la conception de systèmes complexes, l'optimisation algorithmique et les interfaces immersives. Je combine une rigueur mathématique avec une créativité technique pour donner vie à des architectures robustes et des expériences visuelles saisissantes."
                    : "Software engineer passionate about designing complex systems, algorithmic optimization, and immersive interfaces. I combine mathematical rigor with technical creativity to bring robust architectures and striking visual experiences to life."}
                </p>
              </div>

              {/* Compétences */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {skillCategories.map((cat, i) => (
                  <div key={i} className="bg-[#15100C]/80 border border-[#3B2A1E]/60 p-6 rounded-xl backdrop-blur-sm hover:border-[#7A614A] transition-colors">
                    <h3 className="text-[#D4B886] font-cinzel text-lg mb-4 flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-[#D4B886]/50"></span>
                      {cat.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map(skill => (
                        <span key={skill} className="bg-[#2B2019] text-[#E0C89F] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#5A4638] shadow-sm">
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

        {/* --- Contact TAB --- */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pb-24"
          >
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cinzel text-[#FDF5E6] tracking-wide mb-6">
                {language === 'fr' ? 'ME CONTACTER' : 'CONTACT ME'}
              </h2>
              <p className="text-lg text-[#C8B8A6] font-serif leading-relaxed max-w-2xl mx-auto">
                {language === 'fr' 
                  ? "Vous avez un projet ou une opportunité à discuter ? Laissez-moi un message via ce formulaire ou écrivez-moi directement à l'adresse indiquée."
                  : "Have a project or opportunity to discuss? Leave me a message via this form or write to me directly at the address below."}
              </p>
            </header>

            <div className="max-w-2xl mx-auto bg-[#15100C]/90 border border-[#3B2A1E]/80 rounded-xl p-8 md:p-12 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-cinzel text-[#D4B886] mb-2 tracking-widest">{language === 'fr' ? 'Nom' : 'Name'}</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      required
                      className="w-full bg-[#2B2019] border border-[#5A4638] text-[#FDF5E6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4B886] focus:ring-1 focus:ring-[#D4B886] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email_address" className="block text-sm font-cinzel text-[#D4B886] mb-2 tracking-widest">Email</label>
                    <input
                      type="email"
                      id="email_address"
                      name="email_address"
                      required
                      className="w-full bg-[#2B2019] border border-[#5A4638] text-[#FDF5E6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4B886] focus:ring-1 focus:ring-[#D4B886] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="form_message" className="block text-sm font-cinzel text-[#D4B886] mb-2 tracking-widest">Message</label>
                  <textarea
                    id="form_message"
                    name="form_message"
                    rows="5"
                    required
                    className="w-full bg-[#2B2019] border border-[#5A4638] text-[#FDF5E6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4B886] focus:ring-1 focus:ring-[#D4B886] transition-colors resize-y"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3B2A1E] hover:bg-[#5A4638] border border-[#7A614A] text-[#E0C89F] font-bold tracking-widest uppercase py-4 rounded-lg transition-all hover:scale-[1.02] shadow-lg flex justify-center items-center gap-3"
                >
                  <span>{language === 'fr' ? 'Envoyer le parchemin' : 'Send the scroll'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </form>
            </div>
          </motion.div>
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