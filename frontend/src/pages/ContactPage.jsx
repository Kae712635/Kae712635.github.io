import { useLanguage } from "../context/LanguageContext";

const CONTACT_EMAIL = "klervi.choblet+portfolio@gmail.com";

export default function ContactPage() {
  const { t } = useLanguage();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name?.value || "";
    const email = form.email_address?.value || "";
    const message = form.form_message?.value || "";
    const subject = encodeURIComponent(`Portfolio — message de ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n---\nEnvoyé depuis le formulaire portfolio.\nNom: ${name}\nEmail: ${email}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <section className="section-dark py-16 px-6 text-center md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-cream md:text-5xl lg:text-6xl border-b-2 border-rose pb-2 inline-block">
            {t.contact.title}
          </h2>
          <p className="text-xl leading-relaxed text-cream/85 md:text-2xl">
            {t.contact.intro}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-rose underline underline-offset-4 hover:text-rose-dark"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-cream rounded-2xl p-8 shadow-card border border-rose/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block mb-2 text-dark font-medium">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  required
                  className="w-full p-3 bg-light-secondary border border-rose/20 rounded-xl text-dark focus:ring-2 focus:ring-rose/30 focus:border-rose"
                />
              </div>
              <div>
                <label htmlFor="email_address" className="block mb-2 text-dark font-medium">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  name="email_address"
                  id="email_address"
                  required
                  className="w-full p-3 bg-light-secondary border border-rose/20 rounded-xl text-dark focus:ring-2 focus:ring-rose/30 focus:border-rose"
                />
              </div>
              <div>
                <label htmlFor="form_message" className="block mb-2 text-dark font-medium">
                  {t.contact.message}
                </label>
                <textarea
                  rows={4}
                  name="form_message"
                  id="form_message"
                  required
                  className="w-full p-3 bg-light-secondary border border-rose/20 rounded-xl text-dark focus:ring-2 focus:ring-rose/30 focus:border-rose resize-y"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose hover:bg-rose-dark text-cream font-semibold transition-all duration-300"
              >
                {t.contact.send}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
