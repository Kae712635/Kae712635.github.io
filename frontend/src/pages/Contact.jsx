// src/pages/Contact.jsx
import React from 'react';
import { Button } from "flowbite-react";

const Contact = () => {
  return (
    <>
      <section className="bg-dark-secondary py-16 px-8 text-center md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-text-light md:text-5xl lg:text-6xl border-b-2 border-secondary-accent pb-2 inline-block">
            Entrons en contact
          </h2>
          <p className="text-xl leading-relaxed text-gray-300 md:text-2xl">
            Vous avez un projet à discuter ? Écrivez-moi à {" "}
            <a
              href="mailto:klervi.choblet@gmail.com"
              className="font-medium text-primary-accent underline underline-offset-4 hover:text-secondary-accent"
            >
              klervi.choblet@gmail.com
            </a>{" "}
            ou utilisez le formulaire ci-dessous pour me parler de vos objectifs.
          </p>
        </div>
      </section>
      
      <section className="bg-dark-bg py-16 px-8">
        <div className="max-w-6xl mx-auto lg:flex justify-center items-start lg:space-x-12">
          
          {/* Image (partie gauche) */}
          <div className="lg:w-1/2 hidden lg:block">
            <img 
              src="https://lunevedy.com/ui/assets/img/800x900-typing.jpg" 
              alt="Personne en train de taper sur un ordinateur" 
              className="w-full h-auto rounded-xl shadow-2xl" 
            />
          </div>
           
           {/* Formulaire (partie droite) */}
           <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="bg-dark-secondary rounded-xl p-8 shadow-2xl border border-gray-800">
                <form id="email-form" name="email-form" method="post" action="https://formspree/n/nnnnn">
                  
                  <div className="mb-4">
                    <label htmlFor="full_name" className="block mb-2 text-text-light font-medium">Nom Complet</label>
                    <input 
                      type="text" 
                      name="full_name" 
                      id="full_name" 
                      className="w-full p-3 bg-dark-bg border border-gray-700 rounded-lg text-text-light focus:ring-primary-accent focus:border-primary-accent" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email_address" className="block mb-2 text-text-light font-medium">Email</label>
                    <input 
                      type="email" 
                      name="email_address" 
                      id="email_address" 
                      className="w-full p-3 bg-dark-bg border border-gray-700 rounded-lg text-text-light focus:ring-primary-accent focus:border-primary-accent" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="form_message" className="block mb-2 text-text-light font-medium">Votre Message</label>
                    <textarea 
                      rows="4" 
                      name="form_message" 
                      id="form_message" 
                      className="w-full p-3 bg-dark-bg border border-gray-700 rounded-lg text-text-light focus:ring-primary-accent focus:border-primary-accent" 
                      required
                    ></textarea>
                  </div>
                  
                  <div className="form-footer">
                    <Button 
                      id="btn-submit" 
                      className="w-full bg-primary-accent text-dark-bg border border-primary-accent transition-all duration-300 hover:bg-secondary-accent hover:border-secondary-accent hover:shadow-lg hover:shadow-secondary-accent/50"
                      type="submit" 
                      aria-label="Envoyer le message"
                      style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}
                    >
                      <span>Envoyer</span><i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Contact;