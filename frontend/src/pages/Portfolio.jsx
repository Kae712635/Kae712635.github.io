// src/pages/Portfolio.jsx
import React, { useState, useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectFilter from '../components/ProjectFilter';
import allProjects from '../data/projects.json'; 
// Assurez-vous que FontAwesome est bien importé dans votre ProjectCard.jsx
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("Tout");
  
  const filteredProjects = useMemo(() => {
    if (activeFilter === "Tout") return allProjects;

    const targetCategories = activeFilter === "Systèmes"
      ? ["Systèmes", "Réseau"]
      : [activeFilter];

    return allProjects.filter((project) => {
      const categories = Array.isArray(project.category) ? project.category : [project.category];
      return categories.some((c) => targetCategories.includes(c));
    });
  }, [activeFilter]);
  
  return (
    <>
      {/* HEADER PAGE PORTFOLIO : Section de titre claire et structurée */}
      <section className="bg-light-secondary py-16 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-text-dark md:text-5xl lg:text-6xl border-b-2 border-primary-accent pb-2 inline-block">
            Portfolio : Toutes mes Réalisations
          </h2>
          <p className="text-xl leading-relaxed text-text-muted-light md:text-2xl mt-4">
            Découvrez ma polyvalence en ingénierie logicielle, du bas niveau (C) aux applications modernes (React).
          </p>
        </div>
      </section>

      {/* FILTRES : Barres de navigation claires pour le tri */}
      <section className="bg-light-bg px-8 md:px-20 sticky top-0 z-10">
         <ProjectFilter activeFilter={activeFilter} setFilter={setActiveFilter} />
      </section>

      {/* GRILLE DES PROJETS : Le conteneur critique pour la mise en page */}
      <section
        className="pb-16 pt-8 mx-auto grid grid-cols-1 gap-10 px-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-light-bg max-w-7xl" 
      >
        {filteredProjects.map((project) => (
          // IMPORTANT: ProjectCard est ici le seul élément direct de la grille.
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {filteredProjects.length === 0 && (
          <p className="text-center text-text-muted-light col-span-full py-10">
            Aucun projet trouvé pour cette catégorie. Veuillez ajuster les filtres.
          </p>
        )}
      </section>
    </>
  );
};

export default Portfolio;