import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const CONTACT_EMAIL = "klervi.choblet+portfolio@gmail.com";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email_address?.value || "";
    const subjectText = form.subject_line?.value || "Contact Portfolio";
    const message = form.form_message?.value || "";

    const subject = encodeURIComponent(`Portfolio — ${subjectText}`);
    const body = encodeURIComponent(
      `Objet: ${subjectText}\nDe: ${email}\n\nMessage:\n${message}\n\n---\nEnvoyé depuis le portfolio de Klervi Choblet`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <main 
      id="main-content" 
      tabIndex="-1" 
      className="min-h-screen bg-[#2B0F14] text-[#F5EBDD] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-center items-center relative overflow-hidden focus:outline-none"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A6303B]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="max-w-2xl w-full bg-[#1E0A0E] border border-[#D4A24E]/30 rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <nav aria-label={language === 'fr' ? "Navigation de retour" : "Back navigation"} className="flex justify-center gap-4 mb-4 flex-wrap">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#D8C6B6] hover:text-[#F5EBDD] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#D4A24E]/30 cursor-pointer"
            >
              ← {language === 'fr' ? 'Bibliothèque 3D' : '3D Library'}
            </button>
            <button 
              onClick={() => navigate('/projets')}
              className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#A6303B] hover:text-[#F5EBDD] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#A6303B]/40 cursor-pointer"
            >
              {language === 'fr' ? 'Catalogue 2D' : '2D Catalog'} →
            </button>
          </nav>

          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-[#F5EBDD] tracking-wide mb-3 uppercase">
            {language === 'fr' ? 'ME CONTACTER' : 'CONTACT ME'}
          </h1>
          <div className="w-16 h-[2px] bg-[#A6303B] mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-sm md:text-base text-[#D8C6B6] max-w-md mx-auto font-sans">
            {language === 'fr' 
              ? `Envoyez-moi un message direct. Il sera acheminé à ${CONTACT_EMAIL}.`
              : `Send me a direct message. It will be sent to ${CONTACT_EMAIL}.`}
          </p>
        </div>

        {submitted ? (
          <div role="status" aria-live="polite" className="text-center py-12 bg-[#3C6E71]/20 border border-[#3C6E71] rounded-xl p-6">
            <h2 className="text-xl font-cinzel text-[#D4A24E] mb-2 font-bold">
              {language === 'fr' ? "Message Prêt à l'Envoi !" : "Message Ready to Send!"}
            </h2>
            <p className="text-sm text-[#F5EBDD]">
              {language === 'fr'
                ? "Votre client de messagerie s'est ouvert. Si ce n'est pas le cas, vous pouvez aussi m'écrire directement à :"
                : "Your email app has opened. You can also write directly to:"}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block mt-3 text-sm font-bold text-[#D4A24E] underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email_address" className="block text-xs font-cinzel text-[#F5EBDD] mb-2 tracking-widest uppercase font-bold">
                {language === 'fr' ? 'Votre Adresse Email' : 'Your Email Address'} <span className="text-[#A6303B]">*</span>
              </label>
              <input
                type="email"
                id="email_address"
                name="email_address"
                required
                aria-required="true"
                placeholder="votre.email@exemple.com"
                className="w-full bg-[#2B0F14] border border-[#D4A24E]/30 text-[#F5EBDD] rounded-xl px-4 py-3 focus:outline-none focus:border-[#A6303B] transition-all text-sm"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject_line" className="block text-xs font-cinzel text-[#F5EBDD] mb-2 tracking-widest uppercase font-bold">
                {language === 'fr' ? 'Objet du Message' : 'Subject'} <span className="text-[#A6303B]">*</span>
              </label>
              <input
                type="text"
                id="subject_line"
                name="subject_line"
                required
                aria-required="true"
                placeholder={language === 'fr' ? "Opportunité, Projet, Collaboration..." : "Opportunity, Project, Collaboration..."}
                className="w-full bg-[#2B0F14] border border-[#D4A24E]/30 text-[#F5EBDD] rounded-xl px-4 py-3 focus:outline-none focus:border-[#A6303B] transition-all text-sm"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="form_message" className="block text-xs font-cinzel text-[#F5EBDD] mb-2 tracking-widest uppercase font-bold">
                {language === 'fr' ? 'Votre Message' : 'Your Message'} <span className="text-[#A6303B]">*</span>
              </label>
              <textarea
                id="form_message"
                name="form_message"
                rows="6"
                required
                aria-required="true"
                placeholder={language === 'fr' ? "Rédigez votre message ici..." : "Type your message here..."}
                className="w-full bg-[#2B0F14] border border-[#D4A24E]/30 text-[#F5EBDD] rounded-xl px-4 py-3 focus:outline-none focus:border-[#A6303B] transition-all text-sm resize-y"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#A6303B] hover:bg-[#801F29] border border-[#A6303B] text-white font-cinzel font-bold tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_5px_20px_rgba(166,48,59,0.4)] flex justify-center items-center gap-3 cursor-pointer"
            >
              <span>{language === 'fr' ? 'Envoyer le Message' : 'Send Message'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
