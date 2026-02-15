// src/components/ProjectCard.jsx
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const ProjectCard = ({ project }) => {
  const { t, tCategory } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const {
    title,
    category,
    tech,
    description,
    details,
    project_url,
    image_src,
    image,
    course,
    personal_project,
    school,
  } = project;

  // Support both image_src and image properties
  const imagePath = image_src || (image ? `/assets/img/${image}` : null);

  const categories = Array.isArray(category) ? category : [category];
  const categoryLabel = categories.map(tCategory).join(" • ");
  const isSystemCategory = categories.some((c) =>
    ["Systèmes", "Réseau", "Backend"].includes(c)
  );
  const hasDetails = details && details.trim().length > 0;

  return (
    <>
      <div
        className={`project-card group ${isSystemCategory
          ? "hover:border-dark/50 hover:shadow-lg hover:shadow-dark/15"
          : "hover:border-rose/50"
          }`}
      >
        {imagePath && (
          <div className="mb-6 overflow-hidden border-b border-bronze/10">
            <img
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              src={imagePath}
              alt={`${t.card.projectPreview} ${title}`}
              loading="lazy"
            />
          </div>
        )}

        <span
          className={`inline-block mb-4 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] border-y border-bronze/30 ${isSystemCategory
            ? "text-ink/80 bg-paper"
            : "text-gold-dark bg-paper"
            }`}
        >
          {categoryLabel}
        </span>

        <h3 className="text-2xl font-display font-normal text-ink group-hover:text-gold transition-colors duration-500 uppercase tracking-widest border-b border-transparent group-hover:border-gold/30 pb-2 inline-block">
          {title}
        </h3>

        <p className="font-serif text-ink/70 mt-4 min-h-[3rem] leading-relaxed italic text-sm">
          {description}
        </p>

        {course && (
          <p className="text-xs italic text-text-muted-light mt-2 mb-2">
            📚 {course}
          </p>
        )}

        {personal_project && (
          <p className="text-xs italic text-text-muted-light mt-2 mb-2">
            💡 {personal_project}
          </p>
        )}

        {school && (
          <p className="text-xs italic text-text-muted-light mt-2 mb-2">
            🏫 {school}
          </p>
        )}

        <div className="flex flex-wrap mt-4 mb-4">
          {tech.map((techItem) => (
            <span
              key={techItem}
              className={isSystemCategory ? "tech-tag tech-dark" : "tech-tag"}
            >
              {techItem}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {hasDetails && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-action"
            >
              {t.card.learnMore}
              <svg
                className="w-4 h-4 ml-1.5 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
          {project_url && (
            project_url.includes("portfolio/") ? (
              <a
                href={project_url}
                className="btn-action"
              >
                {t.card.demoLive}
                <svg
                  className="w-4 h-4 ml-1.5 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ) : (
              <a
                href={project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action"
              >
                {t.card.demoLive}
                <svg
                  className="w-4 h-4 ml-1.5 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )
          )}
        </div>
      </div>

      {modalOpen && hasDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-paper shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border-2 border-gold relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner Border Effect for Modal */}
            <div className="absolute inset-1 border border-bronze/20 pointer-events-none"></div>

            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <h3 id="modal-title" className="text-3xl font-display text-ink mb-6 border-b border-bronze/20 pb-4">
                {title}
              </h3>
              <div className="text-ink/80 leading-relaxed whitespace-pre-line font-serif text-lg">
                {details}
              </div>
            </div>
            <div className="p-6 border-t border-bronze/20 flex justify-end bg-paper">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-gold hover:bg-bronze text-white font-bold uppercase tracking-widest transition-colors duration-300"
              >
                {t.card.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
