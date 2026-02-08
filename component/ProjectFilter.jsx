// src/components/ProjectFilter.jsx

const filters = ["Tout", "Frontend", "Backend", "Systèmes", "Réseau", "Mobile"];

const ProjectFilter = ({ activeFilter, setFilter }) => {
  return (
    <div className="filter-container">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${activeFilter === filter ? 'active glow-border' : ''}`}
          onClick={() => setFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

/* CSS pour les filtres (les filtres actifs utilisent le style "glow") */
/*
.filter-btn {
  background-color: transparent;
  color: var(--color-text-light);
  border: 1px solid #333;
  margin: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn.active {
  color: var(--color-primary-accent);
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); 
}
*/