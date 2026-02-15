import { useMemo, useState } from 'react';
import projects from '../../data/projects.json';
import { useLanguage } from '../../context/LanguageContext';

const ProjectList = () => {
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('catalogue');
    const [activeFilter, setActiveFilter] = useState('Tout');

    const filterOptions = language === 'fr'
        ? ['Tout', 'Frontend', 'Backend', 'Réseau', 'Systèmes']
        : ['All', 'Frontend', 'Backend', 'Network', 'Systems'];

    const filteredAndGroupedProjects = useMemo(() => {
        const groups = {};
        projects.forEach(project => {
            const projectCats = Array.isArray(project.category) ? project.category : [project.category];
            const matchesFilter = activeFilter === 'Tout' || activeFilter === 'All' ||
                projectCats.some(cat => cat.includes(activeFilter));

            if (matchesFilter) {
                const primaryCat = projectCats[0];
                if (!groups[primaryCat]) groups[primaryCat] = [];
                groups[primaryCat].push(project);
            }
        });
        return groups;
    }, [activeFilter, language]);

    const categories = Object.keys(filteredAndGroupedProjects).sort();

    const sectionTitleStyle = { fontSize: '3.5rem', margin: '10px 0 0', fontFamily: 'serif', fontStyle: 'italic', color: '#4b3f72' };
    const containerStyle = { maxWidth: '1200px', margin: '0 auto' };

    return (
        <div style={{
            padding: '120px 40px 80px',
            backgroundColor: '#fdfbff',
            minHeight: '100vh',
            fontFamily: '"Inter", sans-serif',
            color: '#2d2438'
        }}>
            <header style={containerStyle}>
                <nav style={{ display: 'flex', gap: '40px', borderBottom: '1px solid #e2d5f0', paddingBottom: '20px', marginBottom: '60px' }}>
                    {[
                        { id: 'catalogue', label: language === 'fr' ? 'Catalogue' : 'Catalog' },
                        { id: 'parcours', label: language === 'fr' ? 'Mon Parcours' : 'My Journey' },
                        { id: 'contact', label: language === 'fr' ? 'Contact' : 'Contact' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: activeTab === tab.id ? '800' : '400',
                                color: activeTab === tab.id ? '#4b3f72' : '#b4a7d6',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div style={{ position: 'absolute', bottom: '-21px', left: 0, width: '100%', height: '4px', backgroundColor: '#4b3f72' }} />
                            )}
                        </button>
                    ))}
                </nav>

                {activeTab === 'catalogue' && (
                    <div>
                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#674ea7' }}>
                                {language === 'fr' ? 'Rayon Projets' : 'Project Department'}
                            </p>
                            <h1 style={sectionTitleStyle}>{language === 'fr' ? 'Le Grand Catalogue' : 'The Grand Catalog'}</h1>
                        </div>

                        <nav style={{ display: 'flex', gap: '20px', marginBottom: '60px', flexWrap: 'wrap' }}>
                            {filterOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => setActiveFilter(option)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        border: activeFilter === option ? '1px solid #674ea7' : '1px solid #e2d5f0',
                                        backgroundColor: activeFilter === option ? '#674ea7' : 'transparent',
                                        color: activeFilter === option ? '#fff' : '#b4a7d6',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </nav>

                        {categories.map(category => (
                            <section key={category} style={{ marginBottom: '100px' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#4b3f72', marginBottom: '30px' }}>
                                    {category} <span style={{ color: '#b4a7d6', fontWeight: '400' }}>({filteredAndGroupedProjects[category].length})</span>
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2px', backgroundColor: '#eee5f8', border: '1px solid #eee5f8' }}>
                                    {filteredAndGroupedProjects[category].map(project => (
                                        <ProjectCard key={project.id} project={project} language={language} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {activeTab === 'parcours' && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#674ea7' }}>
                            {language === 'fr' ? 'Archives Personnelles' : 'Personal Archives'}
                        </p>
                        <h1 style={sectionTitleStyle}>{language === 'fr' ? 'Klervi Choblet' : 'Klervi Choblet'}</h1>

                        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', lineHeight: '1.8' }}>
                            <div>
                                <h3 style={{ fontFamily: 'serif', fontSize: '2rem', color: '#4b3f72' }}>Bio</h3>
                                <p style={{ color: '#5e546d', textAlign: 'justify' }}>
                                    {language === 'fr'
                                        ? "Étudiante en quatrième    année à l'EPITA (cycle ingénieur), je m'investis dans l'amélioration des conditions de vie via des logiciels adaptés. Mon parcours est marqué par une curiosité technique polyvalente et un semestre d'études en Irlande."
                                        : "Fourth-year student at EPITA (engineering cycle), I am dedicated to improving living conditions through adapted software. My background is marked by versatile technical curiosity and a semester of study in Ireland."
                                    }
                                </p>
                                <h4 style={{ color: '#4b3f72', marginTop: '20px' }}>{language === 'fr' ? 'Langages de Programmation' : 'Programming Languages'}</h4>
                                <ul style={{ color: '#5e546d', columns: 2 }}>
                                    <li>HTML / JavaScript / React</li>
                                    <li>Python / Java / OCaml</li>
                                    <li>C / C# / C++</li>
                                    <li>SQL / Kotlin</li>
                                </ul>
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'serif', fontSize: '2rem', color: '#4b3f72' }}>Formations & Expériences</h3>
                                <div style={{ borderLeft: '2px solid #e2d5f0', paddingLeft: '20px' }}>
                                    <p><strong>2024 — Aujourd'hui</strong><br />EPITA - Cycle Ingénieur Informatique</p>
                                    <p><strong>2024 — 2025</strong><br />Membre du BDE d'EPITA Rennes (Organisation d'évènements)</p>
                                    <p><strong>2022 — 2024</strong><br />EPITA - Classes Préparatoires (Semestre en Irlande)</p>
                                    <p><strong>2023</strong><br />Employée polyvalente - AUB Santé (Classification & Inventaire)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#674ea7' }}>
                            {language === 'fr' ? 'Registre des Visiteurs' : 'Guest Registry'}
                        </p>
                        <h1 style={sectionTitleStyle}>{language === 'fr' ? 'Me Contacter' : 'Get in Touch'}</h1>

                        <div style={{ marginTop: '60px', padding: '60px', backgroundColor: '#fff', border: '1px solid #e2d5f0', display: 'inline-block', minWidth: '450px' }}>
                            <p style={{ fontSize: '1.2rem', color: '#4b3f72', marginBottom: '10px' }}>
                                Klervi Choblet
                            </p>
                            <div style={{ marginBottom: '20px', color: '#4b3f72' }}>
                                <strong>📧 klervi.choblet+portfolio@gmail.com</strong>
                            </div>
                            <a href="mailto:klervi.choblet+portfolio@gmail.com" style={{
                                display: 'block',
                                padding: '15px 30px',
                                backgroundColor: '#4b3f72',
                                color: '#fff',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}>
                                {language === 'fr' ? 'Envoyer un message' : 'Send a message'}
                            </a>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
};

const ProjectCard = ({ project, language }) => {
    const [isHover, setIsHover] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
                backgroundColor: isHover ? '#4b3f72' : '#ffffff',
                color: isHover ? '#ffffff' : '#2d2438',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s ease',
                minHeight: '380px',
                cursor: 'pointer'
            }}
        >
            <span style={{ fontSize: '0.75rem', color: isHover ? '#d5a6bd' : '#8e7cc3', marginBottom: '20px', fontWeight: 'bold' }}>
                REF. {project.id.toUpperCase()}
            </span>
            <h3 style={{ fontSize: '1.7rem', margin: '0 0 15px 0', fontFamily: 'serif', color: isHover ? '#fff' : '#4b3f72' }}>
                {project.title}
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: isHover ? '#e2d5f0' : '#5e546d', flexGrow: 1, marginBottom: '30px' }}>
                {project.description[language] || project.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' }}>
                {project.tech?.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.65rem', border: isHover ? '1px solid #b4a7d6' : '1px solid #e2d5f0', padding: '4px 10px', textTransform: 'uppercase' }}>{t}</span>
                ))}
            </div>
            {(project.project_url || project.link) && (
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: isHover ? '#d5a6bd' : '#674ea7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {language === 'fr' ? 'Consulter les archives' : 'Open archives'} <span>→</span>
                </div>
            )}
        </div>
    );
};

export default ProjectList;