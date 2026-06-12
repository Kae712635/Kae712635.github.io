// src/components/ProjectFilter.jsx
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { CATEGORY_KEYS } from "../translations";

const ProjectFilter = ({ activeFilter, setFilter }) => {
  const { tCategory } = useLanguage();

  return (
    <div className="flex flex-wrap justify-center gap-2 py-6">
      {CATEGORY_KEYS.map((filterKey) => (
        <button
          key={filterKey}
          type="button"
          className={`filter-btn ${activeFilter === filterKey ? "active" : ""}`}
          onClick={() => setFilter(filterKey)}
        >
          {tCategory(filterKey)}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
