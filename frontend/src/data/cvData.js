export const cvData = {
  profile: {
    name: "Klervi Choblet",
    title: {
      fr: "Ingénieure Software & Développeuse Fullstack",
      en: "Software Engineer & Fullstack Developer"
    },
    email: "klervi.choblet+portfolio@gmail.com",
    github: "https://github.com/Kae712635/",
    location: "France",
    summary: {
      fr: "Ingénieure logicielle passionnée par la conception de systèmes complexes, l'optimisation algorithmique et les interfaces web & 3D immersives. Alliant rigueur technique et sensibilité créative.",
      en: "Software engineer passionate about complex systems design, algorithmic optimization, and immersive web & 3D interfaces. Combining technical rigor with creative design."
    }
  },
  experiences: [
    {
      id: "exp-1",
      role: {
        fr: "Ingénieure Software / Développeuse Fullstack",
        en: "Software Engineer / Fullstack Developer"
      },
      company: "Projets & Ingénierie",
      period: "2023 - Présent",
      category: "Expériences professionnelles",
      description: {
        fr: "Développement d'applications web réactives, de systèmes bas niveau en C/C++ et d'expériences 3D interactives en WebGL/Three.js.",
        en: "Development of reactive web applications, low-level C/C++ systems, and interactive 3D WebGL/Three.js experiences."
      },
      highlights: {
        fr: ["Architecture microservices et APIs RESTful", "Rendu 3D temps réel et shaders WebGL", "Gestion de la mémoire et optimisation système"],
        en: ["Microservices architecture and RESTful APIs", "Real-time 3D rendering and WebGL shaders", "Memory management and system optimization"]
      }
    },
    {
      id: "exp-2",
      role: {
        fr: "Projets d'Ingénierie & Recherche EPITA",
        en: "EPITA Engineering & Research Projects"
      },
      company: "EPITA",
      period: "2022 - 2024",
      category: "Expériences professionnelles",
      description: {
        fr: "Réimplémentation de composants noyaux (malloc, POSIX shell), client BitTorrent P2P et moteurs de rendu 3D OpenGL/CUDA.",
        en: "Reimplementation of kernel components (malloc, POSIX shell), P2P BitTorrent client, and OpenGL/CUDA 3D engines."
      },
      highlights: {
        fr: ["Projets système intensifs en C & C++", "Traitements d'images & calcul distribué GPU", "Tests unitaires et intégration continue"],
        en: ["Intensive system projects in C & C++", "Image processing & GPU distributed computing", "Unit testing and CI/CD"]
      }
    }
  ],
  education: [
    {
      id: "edu-1",
      title: {
        fr: "Diplôme d'Ingénieur en Informatique",
        en: "Master's Degree in Computer Science & Engineering"
      },
      school: "EPITA",
      period: "2021 - 2024",
      category: "Formations",
      details: {
        fr: "Spécialisation Systèmes, Génie Logiciel & Algorithmique.",
        en: "Specialization in Systems, Software Engineering & Algorithmic Design."
      }
    },
    {
      id: "edu-2",
      title: {
        fr: "Classes Préparatoires aux Grandes Écoles",
        en: "Intensive Mathematics & Physics Preparatory Classes"
      },
      school: "EPITA Prep",
      period: "2021 - 2023",
      category: "Formations",
      details: {
        fr: "Formation fondamentale en mathématiques, physique et informatique de base.",
        en: "Fundamental training in mathematics, physics, and computer science basics."
      }
    }
  ],
  skills: [
    {
      categoryName: { fr: "Langages Systems & Core", en: "Systems & Core Languages" },
      items: ["C", "C++", "Python", "Java", "C#", "Assembleur x86", "Shell / Bash"]
    },
    {
      categoryName: { fr: "Développement Web & 3D", en: "Web & 3D Development" },
      items: ["React.js", "Three.js / WebGL", "Node.js", "Tailwind CSS", "HTML5 / CSS3", "Vite / Next.js"]
    },
    {
      categoryName: { fr: "Bases de données & DevOps", en: "Databases & DevOps" },
      items: ["PostgreSQL", "SQLite", "Docker", "Git / GitHub", "Linux / UNIX", "APIs REST / WebSockets"]
    }
  ],
  languages: [
    { 
      id: "lang-fr",
      name: { fr: "Français", en: "French" }, 
      level: { fr: "Langue maternelle", en: "Native" },
      description: { fr: "Langue maternelle — Expression écrite et orale irréprochable.", en: "Native language — Flawless written and verbal communication." }
    },
    { 
      id: "lang-en",
      name: { fr: "Anglais", en: "English" }, 
      level: { fr: "Courant / Professionnel (C1)", en: "Fluent / Professional (C1)" },
      description: { fr: "Niveau C1 / Professionnel — Rédaction technique, documentation et travail en équipe internationale.", en: "C1 / Professional level — Technical writing, documentation, and international teamwork." }
    }
  ],
  interests: [
    {
      id: "int-1",
      name: { fr: "Graphisme 3D & Shaders", en: "3D Graphics & Shaders" },
      description: { fr: "Exploration des techniques de rendu procédural, shaders GLSL et animations temps réel.", en: "Exploration of procedural rendering techniques, GLSL shaders, and real-time animations." }
    },
    {
      id: "int-2",
      name: { fr: "Accessibilité & Ergonomie", en: "Accessibility & Ergonomics" },
      description: { fr: "Conception d'interfaces web inclusives et accessibles à tous les profils d'utilisateurs (normes WCAG).", en: "Design of inclusive, accessible web interfaces for all user profiles (WCAG standards)." }
    },
    {
      id: "int-3",
      name: { fr: "Veille Technologique & Open Source", en: "Tech Watch & Open Source" },
      description: { fr: "Contributions open-source, exploration des nouvelles architectures web et des moteurs graphiques.", en: "Open-source contributions, exploration of modern web architectures and graphic engines." }
    }
  ]
};

export default cvData;
