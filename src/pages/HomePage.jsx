import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import allProjects from "../data/projects.json";

const MAX_RECENT = 3;

function getRecentProjects(projects, max = MAX_RECENT) {
  const withDate = projects
    .map((p) => ({ ...p, sortDate: p.date ? new Date(p.date) : new Date(0) }))
    .sort((a, b) => b.sortDate - a.sortDate);
  return withDate.slice(0, max).map(({ sortDate, ...p }) => p);
}

export default function HomePage() {
  const { t } = useLanguage();
  const recentProjects = getRecentProjects(allProjects);

  return (
    <>
      <header className="section-dark relative overflow-hidden min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(175,122,109,0.12),transparent)]" />
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 animate-fade-in">
          <div className="flex-shrink-0 relative w-48 h-48 md:w-64 md:h-64">
            <img
              src="/media/photo_identité.png"
              alt="Klervi Choblet"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 w-full border-b-2 border-rose" aria-hidden />
            <div
              className="absolute bottom-0 left-0 w-2 border-l-2 border-rose bg-transparent"
              style={{ height: "45%" }}
              aria-hidden
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-cream tracking-tight leading-tight">
              Klervi Choblet
              <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl glow-text">
                {t.hero.subtitle}
              </span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl md:text-2xl text-cream/85 max-w-2xl md:max-w-none leading-relaxed">
              {t.hero.tagline}
            </p>
            <Link
              to="/projets"
              className="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-xl bg-rose hover:bg-rose-dark text-cream font-semibold transition-all duration-300 shadow-glow-rose"
            >
              {t.hero.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-cream py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-dark tracking-tight">
              {t.section.recentProjects}
            </h2>
            <p className="mt-4 text-lg text-text-muted-light max-w-xl mx-auto">
              {t.section.recentIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {recentProjects.map((project, i) => (
              <div
                key={project.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/projets"
              className="inline-flex items-center gap-2 text-rose hover:text-rose-dark font-semibold text-lg border-b border-rose pb-1 transition-colors"
            >
              {t.section.viewAllProjects}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
