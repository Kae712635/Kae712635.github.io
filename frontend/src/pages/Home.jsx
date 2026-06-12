// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard"; 
import allProjects from '../data/projects.json'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
  const featuredProjects = [
    allProjects.find(p => p.id === 'sys-1'), 
    allProjects.find(p => p.id === 'back-1'), 
    allProjects.find(p => p.id === 'web-1') 
  ].filter(p => p); 

  return (
    <>
      {/* SECTION HERO : Mise en page Split-Screen structurée */}
      <section className="bg-light-secondary py-24 px-8 md:px-20 min-h-[80vh] flex items-center border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto w-full">
          
          {/* COLONNE GAUCHE: Texte et CTA (50% de largeur sur desktop) */}
          <div className="lg:w-1/2 lg:pr-12 mt-8 lg:mt-0 order-2 lg:order-1">
            
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-text-dark md:text-6xl lg:text-7xl">
              Klervi Choblet
            </h1>
            <p className="text-xl leading-relaxed text-text-muted-light md:text-2xl mb-6">
              Je suis une développeuse innovante spécialisée en **Front-end, Back-end et systèmes logiciels**, passionnée par la création d'interfaces fluides et de solutions performantes.
            </p>
            
            {/* Accentuation avec bordure */}
            <div className="mb-8 text-sm font-bold uppercase text-secondary-accent border-b-2 border-secondary-accent pb-2 inline-block">FULL-STACK & SYSTEMS ENGINEER</div>

            <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/portfolio" className="btn-action bg-primary-accent text-light-bg hover:bg-secondary-accent hover:text-text-dark font-bold">
                    Voir mes Projets
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
                <Link to="/contact" className="px-4 py-2 mt-4 text-sm font-medium rounded-lg transition-all duration-300 border border-primary-accent text-text-dark bg-transparent hover:bg-primary-accent hover:text-light-bg mr-3">
                    Me Contacter
                    <FontAwesomeIcon icon={faEnvelope} className="ml-2" />
                </Link>
            </div>
          </div>

          {/* COLONNE DROITE: Image (50% de largeur sur desktop) */}
          <div className="lg:w-1/2 lg:pl-8 order-1 lg:order-2 mb-10 lg:mb-0">
            <img 
              src="/images/klervi-removebg-preview.png" 
              alt="Klervi Choblet" 
              // Assure une structure d'image propre et centrée
              className="mx-auto w-full max-w-xs md:max-w-lg lg:max-w-full rounded-xl shadow-xl shadow-gray-400/50" 
            />
          </div>
        </div>
      </section>

      {/* SECTION PROJETS PHARE : Mise en page en Grille */}
      <section className="bg-light-bg py-16 px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-text-dark md:text-5xl border-b-2 border-primary-accent pb-2 inline-block">
            Projets à Découvrir
          </h2>
          <p className="text-xl leading-relaxed text-text-muted-light mt-4">
            Aperçu de mes réalisations les plus complexes et innovantes.
          </p>
        </div>

        <div className="mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl px-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="text-center mt-12">
             <Link to="/portfolio" className="inline-flex items-center text-primary-accent hover:text-secondary-accent transition-colors font-semibold text-lg border-b border-primary-accent pb-1">
                Voir le Portfolio Complet
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
        </div>
      </section>
    </>
  );
};

export default Home;