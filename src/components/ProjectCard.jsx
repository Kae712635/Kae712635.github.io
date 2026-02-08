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
        className={`project-card group ${
          isSystemCategory
            ? "hover:border-dark/50 hover:shadow-lg hover:shadow-dark/15"
            : "hover:border-rose/50"
        }`}
      >
        {imagePath && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              src={imagePath}
              alt={`${t.card.projectPreview} ${title}`}
              loading="lazy"
            />
          </div>
        )}

        <span
          className={`inline-block mb-3 px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wide ${
            isSystemCategory
              ? "bg-dark/10 text-dark border border-dark/25"
              : "bg-rose/15 text-rose border border-rose/30"
          }`}
        >
          {categoryLabel}
        </span>

        <h3 className="text-xl font-bold tracking-tight text-dark group-hover:text-rose transition-colors duration-300">
          {title}
        </h3>

        <p className="font-normal text-text-muted-light mt-2 min-h-[3rem] leading-relaxed">
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
            className="bg-cream rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-rose/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <h3 id="modal-title" className="text-xl font-bold text-dark mb-4">
                {title}
              </h3>
              <div className="text-text-muted-light leading-relaxed whitespace-pre-line">
                {details}
              </div>
            </div>
            <div className="p-4 border-t border-rose/20 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-rose hover:bg-rose-dark text-cream font-semibold transition-colors"
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
