import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { useProjects } from "../hooks/useProjects";

const CV_PATH = "/documents/CV_Klervi_Choblet.pdf";

export default function ProjetsPage() {
  const { t, language } = useLanguage();
  const { projects: allProjects, loading } = useProjects();
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [activeTab, setActiveTab] = useState('projets'); // 'projets' | 'apropos' | 'contact'

  // Catégories consolidées pour les filtres (5 max)
  const FILTER_GROUPS = [
    { id: 'Tout', label: language === 'fr' ? 'Tout' : 'All' },
    { id: 'Logiciel', label: 'Logiciel' },
    { id: 'Web', label: 'Web & Fullstack' },
    { id: 'IA & Data', label: 'IA & Data' },
    { id: 'Infrastructure & Systèmes', label: 'Infrastructure' },
  ];

  // Mapping des catégories JSON vers les groupes
  function matchesFilter(project, filterId) {
    if (filterId === 'Tout') return true;
    const pCats = Array.isArray(project.category) ? project.category : [project.category];
    if (filterId === 'Logiciel') return pCats.some(c => c === 'Logiciel' || c === 'Algorithmique');
    if (filterId === 'Web') return pCats.some(c => c.toLowerCase().includes('web') || c.toLowerCase().includes('fullstack') || c.toLowerCase().includes('interface'));
    if (filterId === 'IA & Data') return pCats.some(c => c.toLowerCase().includes('ia') || c.toLowerCase().includes('data') || c.toLowerCase().includes('intelligence') || c.toLowerCase().includes('algorithmi'));
    if (filterId === 'Infrastructure & Systèmes') return pCats.some(c => c.toLowerCase().includes('infra') || c.toLowerCase().includes('syst') || c.toLowerCase().includes('réseau') || c.toLowerCase().includes('bdd'));
    return pCats.includes(filterId);
  }

  const filteredProjects = useMemo(() => {
    let result = allProjects.filter(p => matchesFilter(p, activeFilter));
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
    <section className="relative min-h-screen overflow-hidden bg-[#1e1d1b]">
      {/* Texture sombre subtile */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* STICKY BAR — GitHub / CV / Contact */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1e1d1b]/95 backdrop-blur-lg border-b border-[#EEE2DF]/10 shadow-sm">
        {/* Left: retour 3D */}
        <button
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-2 text-[#8A897C] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-widest uppercase"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          {language === 'fr' ? 'Bibliothèque 3D' : '3D Library'}
        </button>

        {/* Center: identity */}
        <span className="font-cinzel text-[#EEE2DF] text-xs md:text-sm tracking-widest uppercase font-bold">
          Klervi Choblet
        </span>

        {/* Right: links */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Kae712635/"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#8A897C] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-wider uppercase"
            aria-label="GitHub"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </a>
          <span className="text-[#D9CCC8]" aria-hidden>|</span>
          <a
            href={CV_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#8A897C] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-wider uppercase"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            CV
          </a>
          <span className="text-[#D9CCC8]" aria-hidden>|</span>
          <button
            onClick={() => setActiveTab('contact')}
            className="flex items-center gap-1.5 text-[#B36A5E] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-wider uppercase font-bold"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Contact
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-28 pb-16 px-6 md:px-12">
        {/* HERO — Point focal unique */}
        <header className="text-center mb-16 max-w-3xl mx-auto" id="hero">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#8A897C] text-xs md:text-sm tracking-[0.2em] font-cinzel mb-4 block"
          >
            {language === 'fr' ? 'Le Catalogue · Archive Numérique' : 'The Catalog · Digital Archive'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-cinzel font-bold text-[#EEE2DF] tracking-wide mb-4 uppercase leading-tight"
          >
            {language === 'fr' ? 'Ingénieure Logicielle' : 'Software Engineer'}<br/>
            <span className="text-[#415D43] drop-shadow-sm">
              {language === 'fr' ? '& Développeuse' : '& Developer'}
            </span>
            <br />
            <span className="text-[#415D43] drop-shadow-sm">Fullstack</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-4 mt-8 flex-wrap"
          >
            <button
              onClick={() => setActiveTab('projets')}
              className="px-7 py-3 rounded-full bg-[#415D43] text-white font-cinzel font-bold text-sm tracking-widest uppercase hover:bg-[#2E4330] transition-all duration-200 shadow-[0_4px_16px_rgba(65,93,67,0.3)]"
            >
              <span className="relative z-10 text-white group-hover:text-[#F5EFED] transition-colors">
                {language === 'fr' ? 'Voir les projets' : 'View Projects'}
              </span>
            </button>
            <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full border border-[#8A897C]/50 text-[#EEE2DF] font-cinzel tracking-wider text-sm hover:bg-[#8A897C]/10 transition-colors"
            >
              {language === 'fr' ? 'Télécharger le CV' : 'Download Resume'}
            </a>
          </motion.div>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center items-center mb-10 relative z-20">
          <div className="bg-[#1e1d1b]/80 border border-[#8A897C]/30 rounded-full p-1.5 backdrop-blur-md flex gap-2 shadow-sm">
            {[
              { id: 'projets', label: language === 'fr' ? 'Projets' : 'Projects', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
              { id: 'apropos', label: language === 'fr' ? 'À propos / CV' : 'About / Resume', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
              { id: 'contact', label: 'Contact', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-cinzel tracking-widest transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? tab.id === 'contact'
                        ? 'bg-[#B36A5E] text-white font-bold shadow-sm border border-[#B36A5E]'
                        : 'bg-[#415D43] text-white shadow-sm border border-[#415D43]'
                    : tab.id === 'contact'
                        ? 'text-[#B36A5E] border border-[#B36A5E]/40 hover:bg-[#B36A5E]/10'
                        : 'text-[#8A897C] hover:text-[#EEE2DF] border border-transparent hover:border-[#8A897C]/30'
                }`}
              >
                <span className="flex items-center justify-center">{tab.icon}</span>
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
            {/* Filtres consolidés */}
            <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-[#2c2b28]/80 backdrop-blur-md rounded-full shadow-lg border border-[#8A897C]/20 mb-10 w-full md:w-auto mx-auto flex items-center justify-center">
              {FILTER_GROUPS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleFilterChange(id)}
                  className={`px-5 py-1.5 rounded-full text-[13px] font-cinzel tracking-wide transition-all duration-200 ${
                    activeFilter === id 
                      ? 'bg-[#415D43] border-[#415D43] text-white shadow-sm' 
                      : 'text-[#8A897C] hover:text-[#EEE2DF] hover:bg-[#8A897C]/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
                <a 
                  href={CV_PATH}
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 px-8 py-3 bg-[#3B2A1E] hover:bg-[#5A4638] text-[#E0C89F] border border-[#7A614A] rounded-full font-cinzel tracking-widest uppercase text-sm transition-all hover:scale-105 shadow-[0_5px_15px_rgba(0,0,0,0.4)] flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  {language === 'fr' ? 'Télécharger mon CV' : 'Download Resume'}
                </a>
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