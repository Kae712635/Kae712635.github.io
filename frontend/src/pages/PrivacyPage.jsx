import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-dark/95 text-cream pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-rose mb-8">
          {t.privacy.title}
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.general}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.generalText}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.ipr}
          </h2>
          <p className="text-cream/90 leading-relaxed mb-4">
            {t.privacy.iprText}
          </p>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.mustNot}
          </p>
          <ul className="list-disc list-inside text-cream/90 space-y-2 mt-2">
            <li>{t.privacy.iprPoint1}</li>
            <li>{t.privacy.iprPoint2}</li>
            <li>{t.privacy.iprPoint3}</li>
            <li>{t.privacy.iprPoint4}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.userComments}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.userCommentsText}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.license}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.licenseText}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.indemnification}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.indemnificationText}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.liability}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.liabilityText}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.warranties}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.warrantiesText}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.thirdParty}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.thirdPartyText}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-rose mb-4">
            {t.privacy.disclaimer}
          </h2>
          <p className="text-cream/90 leading-relaxed">
            {t.privacy.disclaimerText}
          </p>
        </section>
      </div>
    </div>
  );
}
