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
    <div className="min-h-screen bg-[#15100c] text-[#EEE2DF] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#415D43]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-[#1e1d1b] border border-[#8A897C]/30 rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#8A897C] hover:text-[#EEE2DF] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#8A897C]/30"
            >
              ← {language === 'fr' ? 'Bibliothèque 3D' : '3D Library'}
            </button>
            <button 
              onClick={() => navigate('/projets')}
              className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#415D43] hover:text-[#EEE2DF] transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#415D43]/40"
            >
              {language === 'fr' ? 'Catalogue 2D' : '2D Catalog'} →
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-[#EEE2DF] tracking-wide mb-3 uppercase">
            {language === 'fr' ? 'ME CONTACTER' : 'CONTACT ME'}
          </h1>
          <div className="w-16 h-[2px] bg-[#415D43] mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-[#8A897C] max-w-md mx-auto font-serif">
            {language === 'fr' 
              ? `Envoyez-moi un message direct. Il sera acheminé à ${CONTACT_EMAIL}.`
              : `Send me a direct message. It will be sent to ${CONTACT_EMAIL}.`}
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-12 bg-[#415D43]/20 border border-[#415D43] rounded-xl p-6">
            <h3 className="text-xl font-cinzel text-[#D4AF37] mb-2 font-bold">
              {language === 'fr' ? "Message Prêt à l'Envoi !" : "Message Ready to Send!"}
            </h3>
            <p className="text-sm text-[#EEE2DF]">
              {language === 'fr'
                ? "Votre client de messagerie s'est ouvert. Si ce n'est pas le cas, vous pouvez aussi m'écrire directement à :"
                : "Your email app has opened. You can also write directly to:"}
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block mt-3 text-sm font-bold text-[#D4AF37] underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email_address" className="block text-xs font-cinzel text-[#EEE2DF] mb-2 tracking-widest uppercase font-bold">
                {language === 'fr' ? 'Votre Adresse Email' : 'Your Email Address'}
              </label>
              <input
                type="email"
                id="email_address"
                name="email_address"
                required
                placeholder="votre.email@exemple.com"
                className="w-full bg-[#15100c] border border-[#8A897C]/30 text-[#EEE2DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#415D43] transition-all text-sm"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject_line" className="block text-xs font-cinzel text-[#EEE2DF] mb-2 tracking-widest uppercase font-bold">
                {language === 'fr' ? 'Objet du Message' : 'Subject'}
              </label>
              <input
                type="text"
                id="subject_line"
                name="subject_line"
                required
                placeholder={language === 'fr' ? "Opportunité, Projet, Collaboration..." : "Opportunity, Project, Collaboration..."}
                className="w-full bg-[#15100c] border border-[#8A897C]/30 text-[#EEE2DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#415D43] transition-all text-sm"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="form_message" className="block text-xs font-cinzel text-[#EEE2DF] mb-2 tracking-widest uppercase font-bold">
                {language === 'fr' ? 'Votre Message' : 'Your Message'}
              </label>
              <textarea
                id="form_message"
                name="form_message"
                rows="6"
                required
                placeholder={language === 'fr' ? "Rédigez votre message ici..." : "Type your message here..."}
                className="w-full bg-[#15100c] border border-[#8A897C]/30 text-[#EEE2DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#415D43] transition-all text-sm resize-y"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#415D43] hover:bg-[#2E4330] border border-[#415D43] text-white font-cinzel font-bold tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_5px_20px_rgba(65,93,67,0.4)] flex justify-center items-center gap-3"
            >
              <span>{language === 'fr' ? 'Envoyer le Message' : 'Send Message'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
