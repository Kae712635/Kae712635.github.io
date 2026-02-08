import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import ProjectFilter from "../components/ProjectFilter";
import allProjects from "../data/projects.json";

export default function ProjetsPage() {
  const { t } = useLanguage();
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
    <section className="bg-cream py-16 md:py-24 px-6 min-h-[60vh]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-dark tracking-tight">
            {t.section.projectsTitle}
          </h2>
          <p className="mt-4 text-lg text-text-muted-light max-w-xl mx-auto">
            {t.section.projectsIntro}
          </p>
        </div>

        <ProjectFilter activeFilter={activeFilter} setFilter={setActiveFilter} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredProjects.map((project, i) => (
            <div
              key={project.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-text-muted-light py-12">
            {t.section.noProjects}
          </p>
        )}
      </div>
    </section>
  );
}
