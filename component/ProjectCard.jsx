// src/components/ProjectCard.jsx

const ProjectCard = ({ project }) => {
  const { title, category, tech, description, github_url, project_url } = project;
  
  // Utilisation de l'Accent Primaire pour le titre dans le thème sombre
  const categoryColor = category === 'Systèmes' ? 'text-magenta' : 'text-cyan';

  return (
    <div className="project-card glow-border">
      <span className={`category-tag ${categoryColor}`}>{category}</span>
      <h3 className="project-title">{title}</h3>
      <p>{description}</p>
      
      <div className="tech-tags">
        {tech.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>

      <div className="actions">
        {github_url && (
          <a href={github_url} target="_blank" className="btn-action">
            Code Source <i className="fab fa-github"></i>
          </a>
        )}
        {project_url && (
          <a href={project_url} target="_blank" className="btn-action primary">
            Voir Démo <i className="fas fa-external-link-alt"></i>
          </a>
        )}
      </div>
    </div>
  );
};