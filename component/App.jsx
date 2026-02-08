// src/App.jsx
import React, { useState, useMemo } from 'react';
import ProjectCard from './components/ProjectCard';
import ProjectFilter from './components/ProjectFilter';
import allProjects from './data/projects.json'; // Importer vos données

function App() {
  const [activeFilter, setActiveFilter] = useState("Tout");
  
  // Utiliser useMemo pour filtrer les projets
  const filteredProjects = useMemo(() => {
    if (activeFilter === "Tout") {
      return allProjects;
    }
    return allProjects.filter(project => project.category.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="portfolio-container">
      <header className="hero-section">
        <h1>Klervi Choblet <span className="glow-text">Développeur Full-Stack & Systèmes</span></h1>
        <h2>Je construis des expériences de la mémoire vive au Cloud.</h2>
      </header>

      <section className="projects-section">
        <ProjectFilter activeFilter={activeFilter} setFilter={setActiveFilter} />
        
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Footer avec liens LinkedIn/GitHub */}
      {/* ... */}
    </div>
  );
}

export default App;