export const cvData = {
  profile: {
    name: "Klervi Choblet",
    title: {
      fr: "À la recherche d'un stage en traitement d'images médicales",
      en: "Seeking an Internship in Medical Image Processing"
    },
    email: "klervi.choblet@gmail.com",
    phone: "06 50 36 49 29",
    location: "Paris, France",
    website: "klervi-choblet.vercel.app",
    linkedin: "in/klervi-choblet",
    summary: {
      fr: "Étudiante en 5ème année d'école d'ingénieurs à l'EPITA, spécialisée en développement logiciel et informatique graphique. Alliant une forte expertise technique à un excellent esprit d'équipe, je recherche activement un stage de fin d'études en traitement d'images médicales.",
      en: "5th-year EPITA engineering student specializing in software development and computer graphics. Combining strong technical expertise with teamwork skills, I am actively seeking an internship in medical image processing."
    }
  },
  projects: [
    {
      id: "pfee-bloc",
      title: {
        fr: "Reconstruction 3D d'un Bloc Opératoire",
        en: "3D Reconstruction of an Operating Room"
      },
      subtitle: {
        fr: "Projet de fin d'études - EPITA",
        en: "Final Year - EPITA Project"
      },
      period: "2026 - 2027 (En cours)",
      tech: "Swift (iOS), 3D Gaussian Splatting, SfM, Pipeline GPU",
      highlights: {
        fr: [
          "Capture guidée iOS : Développement d'une application Swift pour la capture guidée et la calibration de caméra.",
          "Reconstruction 3D : Création d'un pipeline de modélisation volumétrique via Gaussian Splatting & SfM.",
          "Formation médicale : Réduction des artefacts métalliques pour fournir un outil immersif aux chirurgiens."
        ],
        en: [
          "iOS Guided Capture: Developed a Swift app for guided capture and camera calibration.",
          "3D Reconstruction: Built a volumetric modeling pipeline via Gaussian Splatting & SfM.",
          "Medical Training: Reduced metallic artifacts to provide an immersive tool for surgeons."
        ]
      }
    },
    {
      id: "neuro-alzheimer",
      title: {
        fr: "NeuroVolumetry – Aide au diagnostic d'Alzheimer",
        en: "NeuroVolumetry – Alzheimer's Diagnostic Aid"
      },
      subtitle: {
        fr: "Projet EPITA",
        en: "EPITA Project"
      },
      period: "Mai 2026",
      tech: "Python (FastAPI), React, Atlas HarP, Redis, PostgreSQL",
      highlights: {
        fr: [
          "Morphométrie cérébrale : Traitement d'IRM pour le recalage spatial et la segmentation fine de l'hippocampe.",
          "Biomarqueurs cliniques : Calcul de données volumétriques pour détecter l'atrophie précoce.",
          "Architecture : Backend FastAPI avec workers Redis et visualiseur React."
        ],
        en: [
          "Brain Morphometry: Ingested MRIs for spatial registration and hippocampal segmentation.",
          "Clinical Biomarkers: Calculated volumetric data to detect early atrophy.",
          "Distributed Architecture: Built a FastAPI backend with async Redis workers and a React viewer."
        ]
      }
    },
    {
      id: "howea-cv",
      title: {
        fr: "Howea – Plateforme de Stimulation Cognitive",
        en: "Howea – Cognitive Stimulation Platform"
      },
      subtitle: {
        fr: "Projet Web & Santé",
        en: "Web & Health Project"
      },
      period: "2026",
      tech: "React 19, Supabase, WCAG 2.1 AA, Vite, Vercel",
      highlights: {
        fr: [
          "Jeux inclusifs : Conception d'exercices cognitifs adaptatifs (mémoire, puzzles, multijoueur).",
          "Accessibilité universelle : Implémentation des profils WCAG 2.1 AA et d'une navigation 100% clavier.",
          "Multijoueur temps réel : Intégration de salons multijoueurs utilisant Supabase Realtime."
        ],
        en: [
          "Inclusive Games: Designed adaptive cognitive exercises (memory, puzzles, multiplayer).",
          "Universal Accessibility: Implemented WCAG 2.1 AA profiles and full keyboard navigation.",
          "Real-Time Multiplayer: Integrated multiplayer lobbies using Supabase Realtime."
        ]
      }
    }
  ],
  experiences: [
    {
      id: "exp-primpromo",
      role: {
        fr: "Stagiaire Ingénieure Logiciel",
        en: "Software Engineering Intern"
      },
      company: "Primpromo by Open Groupe (Tours)",
      location: "Tours",
      period: {
        fr: "Septembre 2025 - Janvier 2026",
        en: "September 2025 - January 2026"
      },
      category: "Expériences professionnelles",
      description: {
        fr: "Migration de 6 applications monolithiques vers Spring Boot et Angular, optimisation des temps de réponse et automatisation CI/CD via GitLab CI.",
        en: "Migration of 6 monolithic apps to Spring Boot & Angular, response time optimization, and CI/CD automation via GitLab CI."
      },
      highlights: {
        fr: [
          "Architecture : Migration de 6 applications monolithiques vers Spring Boot et Angular.",
          "Performances : Réduction des temps de réponse (optimisation des requêtes et du cache).",
          "CI/CD : Automatisation des tests et réduction du temps de déploiement via GitLab CI."
        ],
        en: [
          "Architecture Redesign: Migrated 6 monolithic apps to a modern Spring Boot/Angular stack.",
          "Performance Optimization: Boosted response times via optimized backend queries and caching.",
          "Automation & CI/CD: Leveraged GitLab CI/CD to reduce deployment time and automate testing."
        ]
      }
    },
    {
      id: "exp-bde",
      role: {
        fr: "Membre du Bureau des Élèves (BDE)",
        en: "Student Union Board Member"
      },
      company: "BDE EPITA Rennes",
      location: "Rennes",
      period: {
        fr: "Septembre 2024 - Juillet 2025",
        en: "September 2024 - July 2025"
      },
      category: "Expériences associatives",
      description: {
        fr: "Organisation logistique d'événements majeurs (soirées, e-sport 30-120 participants), coordination d'équipes et animation du campus.",
        en: "Logistics of major events (parties, e-sports for 30-120 attendees), team coordination, and campus life engagement."
      },
      highlights: {
        fr: [
          "Événementiel : Gestion logistique d'événements de 30 à 120 participants (soirées, e-sport).",
          "Gestion de projet : Coordination des équipes pour la réalisation du calendrier associatif.",
          "Engagement : Animation du campus et accueil des étudiants pour renforcer la cohésion."
        ],
        en: [
          "Event Management: Managed logistics for events (parties, e-sports) hosting 30-120 attendees.",
          "Project Management: Coordinated teams to deliver the association's calendar on deadline.",
          "Student Engagement: Led campus activities and welcomed new students to build school cohesion."
        ]
      }
    },
    {
      id: "exp-animatrice",
      role: {
        fr: "Animatrice de Centre de Loisirs",
        en: "Summer Camp Counselor"
      },
      company: "ALSH (Mont-Près-Chambord)",
      location: "Mont-Près-Chambord",
      period: {
        fr: "Août 2023",
        en: "August 2023"
      },
      category: "Expériences d'animation",
      description: {
        fr: "Encadrement et sécurité de groupes de 8 à 12 enfants, conception de 10 activités thématiques par semaine et gestion complète d'une nuitée.",
        en: "Safety and supervision of 8-12 children, design of 10 themed activities per week, and management of an overnight stay."
      },
      highlights: {
        fr: [
          "Gestion de groupe : Garantie de la sécurité et du bien-être quotidien de groupes de 8 à 12 enfants.",
          "Planification d'activités : Conception et animation de 10 activités à thème et grands jeux par semaine.",
          "Logistique : Gestion des repas, des routines et du budget pour 1 nuitée."
        ],
        en: [
          "Group Management: Ensured the daily safety and well-being of 8 to 12 children.",
          "Activity Planning: Designed and led 10 themed activities and games per week.",
          "Logistics: Managed meals, routines, and budget for 1 overnight stay."
        ]
      }
    },
    {
      id: "exp-aub-sante",
      role: {
        fr: "Employée Polyvalente",
        en: "Operations & Administrative Assistant"
      },
      company: "AUB Santé (35)",
      location: "Bretagne",
      period: {
        fr: "Juillet 2023 - Août 2023",
        en: "July 2023 - August 2023"
      },
      category: "Expériences en entreprise",
      description: {
        fr: "Gestion d'inventaire et suivi des stocks du centre, tri et numérisation des notes de frais pour la comptabilité, archivage de dossiers confidentiels.",
        en: "Inventory tracking and supply management, sorting and digitizing expense receipts for accounting, confidential document archiving."
      },
      highlights: {
        fr: [
          "Gestion d'inventaire : Recensement et suivi des stocks pour assurer la disponibilité des ressources nécessaires.",
          "Traitement comptable : Tri, vérification et numérisation des notes de frais pour la préparation de la comptabilité.",
          "Gestion documentaire : Archivage, classement et tri de dossiers confidentiels dans le respect des procédures."
        ],
        en: [
          "Inventory management: Stock counting and tracking ensuring resource availability for center operations.",
          "Accounting processing: Sorting, verifying, and digitizing fuel expense notes for accounting preparation.",
          "Document archiving: Archiving, filing, and sorting confidential files in strict adherence to internal procedures."
        ]
      }
    },
    {
      id: "exp-detour-loire",
      role: {
        fr: "Employée Polyvalente",
        en: "Customer Service & Technical Logistics Assistant"
      },
      company: "Détour de Loire (41)",
      location: "Blois",
      period: {
        fr: "Août 2022",
        en: "August 2022"
      },
      category: "Expériences en entreprise",
      description: {
        fr: "Entretien quotidien et révision technique d'un parc de vélos (VTC, électriques), accueil d'une clientèle internationale et gestion des réservations.",
        en: "Daily maintenance and overhaul of bicycles (hybrids, e-bikes), welcoming international clientele, and managing reservations."
      },
      highlights: {
        fr: [
          "Gestion de flotte & maintenance : Entretien quotidien et révision technique d'un parc de vélos (VTC, électriques).",
          "Relation client & logistique : Accueil d'une clientèle internationale, gestion des réservations et départs/retours.",
          "Conseil & itinérance : Orientation des touristes sur les parcours « La Loire à Vélo »."
        ],
        en: [
          "Fleet maintenance: Daily maintenance and technical inspections of hybrid and electric bicycles.",
          "Client relations & logistics: International customer service, booking management, and departure/return optimization.",
          "Route advising: Assisting and guiding tourists along the 'La Loire à Vélo' trail."
        ]
      }
    },
    {
      id: "exp-salou",
      role: {
        fr: "Ouvrière Agricole",
        en: "Agricultural Worker"
      },
      company: "SCEA Salou Plouescat (29)",
      location: "Finistère",
      period: {
        fr: "Août 2021",
        en: "August 2021"
      },
      category: "Expériences de terrain",
      description: {
        fr: "Récolte quotidienne de tomates avec contrôle qualité rigoureux (calibre et maturité), taille de précision (effeuillage) et détection des maladies.",
        en: "Daily tomato harvesting with quality control (size and ripeness), precision pruning (leaf thinning), and crop protection."
      },
      highlights: {
        fr: [
          "Récolte & tri sélectif : Collecte quotidienne de tomates (cerises, grappes, anciennes) avec contrôle qualité rigoureux.",
          "Maintenance végétale (Effeuillage) : Taille et coupe de précision des feuilles pour optimiser l'ensoleillement et la croissance.",
          "Protection des cultures : Identification des maladies et application de traitements phytosanitaires ciblés."
        ],
        en: [
          "Selective harvest: Daily tomato harvest with quality control based on size, color, and ripeness.",
          "Plant maintenance: Precision pruning and leaf thinning optimizing sun exposure and cluster growth.",
          "Crop health: Disease identification and application of targeted phytosanitary treatments."
        ]
      }
    }
  ],
  education: [
    {
      id: "edu-epita",
      title: {
        fr: "Cycle Préparatoire et Cycle Ingénieur, EPITA – Inclut un semestre à l'international au Dorset College Dublin",
        en: "Preparatory and Engineering Cycles, EPITA – Includes International Semester at Dorset College Dublin"
      },
      school: "EPITA",
      period: "2022 - Présent",
      category: "Formations Universitaires"
    },
    {
      id: "edu-bafa",
      title: {
        fr: "BAFA – Formation théorique (07/22), pratique (08/23), approfondissement (06/24)",
        en: "BAFA – Theoretical (07/22), practical (08/23), advanced (06/24)"
      },
      school: "Formation Animation Jeunesse",
      period: "2022 - 2024",
      category: "Diplômes & Certifications"
    },
    {
      id: "edu-bac",
      title: {
        fr: "Baccalauréat Général - Mention Bien, Notre Dame des Aydes, Blois",
        en: "French Baccalauréat - With Honors (Mention Bien), Notre Dame des Aydes, Blois"
      },
      school: "Notre Dame des Aydes, Blois",
      period: "2022",
      category: "Diplômes d'État"
    }
  ],
  skills: [
    {
      categoryName: { fr: "Compétences Techniques", en: "Technical Skills" },
      items: ["HTML/CSS", "JavaScript", "ReactJS", "Swift", "C", "C#", "C++", "Python", "OpenGL", "Spring Boot", "SQL"]
    },
    {
      categoryName: { fr: "Savoir-être", en: "Soft Skills" },
      items: [
        "Organisation",
        "Communication",
        "Rigueur",
        "Apprentissage rapide",
        "Résolution de problèmes"
      ]
    }
  ],
  languages: [
    { 
      id: "lang-fr",
      name: { fr: "Français", en: "French" }, 
      level: { fr: "Natif", en: "Native" }
    },
    { 
      id: "lang-en",
      name: { fr: "Anglais", en: "English" }, 
      level: { fr: "B2", en: "B2" }
    },
    { 
      id: "lang-es",
      name: { fr: "Espagnol", en: "Spanish" }, 
      level: { fr: "A2", en: "A2" }
    }
  ]
};

export default cvData;
