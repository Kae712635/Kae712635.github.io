/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette portfolio
        dark: "#241623",           // Fond sombre (hero, footer)
        cream: "#FBF5F3",          // Clair (texte sur fond sombre, cartes)
        rose: "#AF7A6D",           // Accent principal (boutons, liens)
        forest: "#33673B",         // Vert forêt (tags systèmes, secondaire)
        sage: "#7FB069",           // Vert sauge (hover, fraîcheur)
        // Aliases pour cohérence
        "light-bg": "#FBF5F3",
        "light-secondary": "#F5EFED",
        "primary-accent": "#AF7A6D",
        "secondary-accent": "#33673B",
        "text-dark": "#241623",
        "text-muted-light": "#6B5B56",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "card": "0 4px 20px rgba(36, 22, 35, 0.08)",
        "card-hover": "0 12px 32px rgba(36, 22, 35, 0.12), 0 0 0 1px rgba(175, 122, 109, 0.2)",
        "glow-rose": "0 0 30px rgba(175, 122, 109, 0.35)",
        "glow-sage": "0 0 24px rgba(127, 176, 105, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
