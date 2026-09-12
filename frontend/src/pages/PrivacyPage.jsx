import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  const sections = [
    {
      id: "editor",
      title: getTranslation("legalEditorTitle", "1. Éditeur du Site"),
      icon: "👤",
      content: [
        getTranslation("legalEditorText", "Ce site web personnel et portfolio professionnel est édité et administré par Klervi Choblet, étudiante-ingénieure et développeuse logicielle."),
        getTranslation("legalEditorContact", "Contact : klervi.choblet@gmail.com — Localisation : Paris & Île-de-France, France."),
        getTranslation("legalDirector", "Directrice de la publication : Klervi Choblet.")
      ]
    },
    {
      id: "hosting",
      title: getTranslation("legalHostingTitle", "2. Hébergement & Déploiement"),
      icon: "🌐",
      content: [
        getTranslation("legalHostingText", "Le site est hébergé et distribué par la société Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com) et versionné via GitHub Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, USA — github.com).")
      ]
    },
    {
      id: "ip",
      title: getTranslation("legalIpTitle", "3. Propriété Intellectuelle & Droits d'Auteur"),
      icon: "⚖️",
      content: [
        getTranslation("legalIpText", "L'ensemble des contenus, projets, codes sources, architectures, modélisations 3D, textes et éléments visuels créés par l'éditrice sont protégés par les dispositions du Code de la Propriété Intellectuelle et constituent des œuvres de l'esprit. Sauf mention expresse contraire, toute reproduction, adaptation ou diffusion sans accord préalable écrit est formellement interdite."),
        getTranslation("legalIpThirdParty", "Les marques, frameworks et bibliothèques open source tiers utilisés (Three.js, React, Tailwind CSS, etc.) demeurent la propriété exclusive de leurs auteurs respectifs sous leurs licences libres respectives (notamment MIT et Apache 2.0).")
      ]
    },
    {
      id: "rgpd",
      title: getTranslation("legalRgpdTitle", "4. Données Personnelles (RGPD & CNIL)"),
      icon: "🔒",
      content: [
        getTranslation("legalRgpdController", "Responsable du traitement : Klervi Choblet. Le site ne collecte aucune donnée personnelle à des fins commerciales, publicitaires ou de profilage. Aucune base de données de traçage n'est reliée au site."),
        getTranslation("legalRgpdForm", "Formulaire de contact : L'envoi de messages via le formulaire s'effectue directement via le protocole 'mailto:' de votre client de messagerie. Les données transmises (adresse email, objet, contenu du message) sont exclusivement destinées à répondre aux prises de contact professionnelles."),
        getTranslation("legalRgpdRetention", "Durée de conservation : Les échanges par courriel sont conservés le temps du traitement de la demande et archivés pour une durée maximale de 3 ans."),
        getTranslation("legalRgpdRights", "Droits des personnes : Conformément au RGPD (Règlement UE 2016/679) et à la Loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement et de limitation de vos données. Vous pouvez exercer ce droit par simple email à klervi.choblet@gmail.com. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (cnil.fr).")
      ]
    },
    {
      id: "cookies",
      title: getTranslation("legalCookiesTitle", "5. Cookies & Stockage Local (Directive ePrivacy)"),
      icon: "🍪",
      content: [
        getTranslation("legalCookiesText", "Ce site n'utilise aucun cookie traceur, publicitaire ou de mesure d'audience statistique tiers (site exempt de bandeau cookie préalable selon les lignes directrices de la CNIL). Seul un stockage local technique ('localStorage') strictement nécessaire au confort d'utilisation est employé sur votre terminal pour mémoriser : la langue d'affichage ('portfolio_lang'), vos préférences d'accessibilité WCAG ('a11y_*') et le statut de la fenêtre d'accueil.")
      ]
    },
    {
      id: "a11y",
      title: getTranslation("legalA11ySectionTitle", "6. Accessibilité Numérique (WCAG 2.2 AA / RGAA)"),
      icon: "♿",
      content: [
        getTranslation("legalA11ySectionText", "Ce portfolio applique les recommandations d'accessibilité numérique : version alternative 2D complète (sans Three.js 3D), contrastes renforcés (> 7:1), typographie sans-serif haute lisibilité, réduction de mouvement, arrêt des animations Three.js et navigation clavier complète (touches 0-4, tabulation, raccourci d'évitement).")
      ]
    },
    {
      id: "law",
      title: getTranslation("legalLawTitle", "7. Droit Applicable & Juridiction"),
      icon: "🏛️",
      content: [
        getTranslation("legalLawText", "Le présent site et ses mentions légales sont régis par le droit français. En cas de litige, les tribunaux français compétents seront seuls compétents.")
      ]
    }
  ];

  return (
    <main
      id="main-content"
      tabIndex="-1"
      className="min-h-screen bg-[#2B0F14] text-[#F5EBDD] pt-24 pb-16 px-4 sm:px-6 lg:px-12 flex flex-col items-center relative overflow-hidden focus:outline-none"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#A6303B]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="max-w-4xl w-full bg-[#1E0A0E] border border-[#D4A24E]/30 rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md relative z-10">
        {/* Navigation Breadcrumb */}
        <nav
          aria-label={language === "fr" ? "Navigation de retour" : "Back navigation"}
          className="flex justify-center gap-3 mb-8 flex-wrap"
        >
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#D8C6B6] hover:text-[#F5EBDD] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#D4A24E]/30 hover:border-[#D4A24E] cursor-pointer"
          >
            ← {getTranslation("legalBackLibrary", "Bibliothèque 3D")}
          </button>
          <button
            onClick={() => navigate("/projets")}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#D4A24E] hover:text-[#F5EBDD] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#D4A24E]/30 hover:border-[#D4A24E] cursor-pointer"
          >
            {getTranslation("legalBackCatalog", "Catalogue 2D")} →
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#A6303B] hover:text-[#F5EBDD] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#A6303B]/40 hover:border-[#A6303B] cursor-pointer"
          >
            {getTranslation("legalBackContact", "Contact")} ✉️
          </button>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-cinzel font-bold text-[#F5EBDD] tracking-wide mb-3 uppercase">
            {getTranslation("legalNoticeTitle", "Mentions Légales & Confidentialité")}
          </h1>
          <div className="w-20 h-[2px] bg-[#D4A24E] mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-xs sm:text-sm text-[#D8C6B6] max-w-2xl mx-auto font-sans leading-relaxed">
            {getTranslation(
              "legalNoticeSubtitle",
              "Informations réglementaires, hébergement, protection des données personnelles (RGPD) et conditions d'utilisation."
            )}
          </p>
        </div>

        {/* Legal Sections */}
        <div className="space-y-6">
          {sections.map((sec) => (
            <section
              key={sec.id}
              className="bg-[#140E10]/90 border border-[#D4A24E]/25 rounded-xl p-5 sm:p-7 shadow-sm transition-all hover:border-[#D4A24E]/50"
              aria-labelledby={`sec-title-${sec.id}`}
            >
              <h2
                id={`sec-title-${sec.id}`}
                className="text-lg sm:text-xl font-cinzel font-bold text-[#D4A24E] mb-3 flex items-center gap-2.5"
              >
                <span aria-hidden="true">{sec.icon}</span>
                <span>{sec.title}</span>
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#F5EBDD]/90 leading-relaxed font-sans">
                {sec.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Direct Contact & CNIL Links Callout */}
        <div className="mt-8 p-5 rounded-xl bg-[#2B0F14]/70 border border-[#A6303B]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-[#D8C6B6]">
            <span>{language === "fr" ? "Dernière mise à jour : Mars 2026 · " : "Last updated: March 2026 · "}</span>
            <span className="text-[#F5EBDD] font-bold">Klervi Choblet</span>
          </div>
          <div className="flex gap-4">
            <a
              href="mailto:klervi.choblet@gmail.com"
              className="text-[#D4A24E] hover:underline font-cinzel tracking-wider uppercase font-bold"
            >
              {language === "fr" ? "Contacter l'éditrice" : "Contact Publisher"}
            </a>
            <span className="text-[#D4A24E]/40" aria-hidden="true">|</span>
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D8C6B6] hover:text-[#F5EBDD] hover:underline font-cinzel tracking-wider uppercase"
            >
              CNIL.fr ↗
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
