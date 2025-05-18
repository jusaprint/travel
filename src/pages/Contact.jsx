import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Container from '../components/Container';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import SEO from '../components/SEO';

// Contact method card component
const ContactMethodCard = ({ title, description, icon, actionText, actionLink }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="w-12 h-12 bg-[#690d89]/10 rounded-lg flex items-center justify-center text-[#690d89] mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <a 
      href={actionLink} 
      className="inline-flex items-center text-[#690d89] hover:text-[#8B5CF6]"
    >
      {actionText}
      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  </div>
);

// FAQ item component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <svg 
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { isLoading } = useTranslationLoader(['contact']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // SEO metadata for different languages
  const seoTitles = {
    en: "Contact KudoSIM - 24/7 Global eSIM Support & Customer Service",
    sq: "Kontaktoni KudoSIM - Mbështetje Globale 24/7 për Shërbimet eSIM",
    fr: "Contactez KudoSIM - Support eSIM Global 24/7 & Service Client",
    de: "Kontakt KudoSIM - 24/7 Globaler eSIM-Support & Kundenservice",
    tr: "KudoSIM ile İletişim - 7/24 Küresel eSIM Desteği ve Müşteri Hizmetleri",
    pl: "Kontakt z KudoSIM - Całodobowa Globalna Obsługa Klienta i Wsparcie eSIM"
  };

  const seoDescriptions = {
    en: "Get instant help with your travel eSIM from KudoSIM's 24/7 customer support team. Contact us via live chat, email, or phone for immediate assistance in multiple languages.",
    sq: "Merrni ndihmë të menjëhershme me eSIM-in tuaj të udhëtimit nga ekipi i mbështetjes së klientit 24/7 të KudoSIM. Na kontaktoni përmes chat-it live, email-it ose telefonit për ndihmë të menjëhershme në shumë gjuhë.",
    fr: "Obtenez une aide instantanée pour votre eSIM de voyage auprès de l'équipe d'assistance clientèle 24/7 de KudoSIM. Contactez-nous par chat en direct, e-mail ou téléphone pour une assistance immédiate en plusieurs langues.",
    de: "Erhalten Sie sofortige Hilfe mit Ihrer Reise-eSIM vom 24/7-Kundensupport-Team von KudoSIM. Kontaktieren Sie uns über Live-Chat, E-Mail oder Telefon für sofortige Unterstützung in mehreren Sprachen.",
    tr: "KudoSIM'in 7/24 müşteri destek ekibinden seyahat eSIM'iniz için anında yardım alın. Birden fazla dilde anında yardım için canlı sohbet, e-posta veya telefon yoluyla bizimle iletişime geçin.",
    pl: "Uzyskaj natychmiastową pomoc dotyczącą Twojej podróżniczej karty eSIM od zespołu obsługi klienta KudoSIM dostępnego 24/7. Skontaktuj się z nami przez czat na żywo, e-mail lub telefon, aby uzyskać natychmiastową pomoc w wielu językach."
  };

  // Prepare schema markup for SEO
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": seoTitles[i18n.language] || seoTitles.en,
    "description": seoDescriptions[i18n.language] || seoDescriptions.en,
    "url": "https://kudosim.com/contact",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-KUDOSIM",
      "contactType": "customer service",
      "availableLanguage": ["English", "German", "French", "Albanian", "Turkish", "Polish"],
      "email": "support@kudosim.com"
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    // Simulate form submission
    try {
      // In a real app, you would send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage({
        type: 'success',
        text: i18n.language === 'en' ? 'Your message has been sent! We will get back to you soon.' : 
              i18n.language === 'sq' ? 'Mesazhi juaj u dërgua! Ne do t\'ju kontaktojmë së shpejti.' :
              i18n.language === 'fr' ? 'Votre message a été envoyé ! Nous vous répondrons bientôt.' :
              i18n.language === 'de' ? 'Ihre Nachricht wurde gesendet! Wir werden uns bald bei Ihnen melden.' :
              i18n.language === 'tr' ? 'Mesajınız gönderildi! En kısa sürede size geri döneceğiz.' :
              i18n.language === 'pl' ? 'Twoja wiadomość została wysłana! Wkrótce się z Tobą skontaktujemy.' :
              'Your message has been sent! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: i18n.language === 'en' ? 'There was an error sending your message. Please try again.' : 
              i18n.language === 'sq' ? 'Ndodhi një gabim gjatë dërgimit të mesazhit tuaj. Ju lutemi provoni përsëri.' :
              i18n.language === 'fr' ? 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.' :
              i18n.language === 'de' ? 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.' :
              i18n.language === 'tr' ? 'Mesajınızı gönderirken bir hata oluştu. Lütfen tekrar deneyin.' :
              i18n.language === 'pl' ? 'Wystąpił błąd podczas wysyłania wiadomości. Proszę spróbować ponownie.' :
              'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={seoTitles[i18n.language] || seoTitles.en}
        description={seoDescriptions[i18n.language] || seoDescriptions.en}
        schema={contactSchema}
      />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-gradient-to-b from-[#690d89]/10 to-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {i18n.language === 'en' ? "Contact Our eSIM Support Team" : 
               i18n.language === 'sq' ? "Kontaktoni Ekipin Tonë të Mbështetjes eSIM" :
               i18n.language === 'fr' ? "Contactez Notre Équipe de Support eSIM" :
               i18n.language === 'de' ? "Kontaktieren Sie Unser eSIM-Support-Team" :
               i18n.language === 'tr' ? "eSIM Destek Ekibimizle İletişime Geçin" :
               i18n.language === 'pl' ? "Skontaktuj się z Naszym Zespołem Wsparcia eSIM" :
               "Contact Our eSIM Support Team"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {i18n.language === 'en' ? "We're here to help with your travel connectivity needs" : 
               i18n.language === 'sq' ? "Jemi këtu për t'ju ndihmuar me nevojat tuaja të lidhjes gjatë udhëtimit" :
               i18n.language === 'fr' ? "Nous sommes là pour vous aider avec vos besoins de connectivité en voyage" :
               i18n.language === 'de' ? "Wir sind hier, um Ihnen bei Ihren Reisekonnektivitätsbedürfnissen zu helfen" :
               i18n.language === 'tr' ? "Seyahat bağlantı ihtiyaçlarınızda size yardımcı olmak için buradayız" :
               i18n.language === 'pl' ? "Jesteśmy tutaj, aby pomóc w potrzebach związanych z łącznością podczas podróży" :
               "We're here to help with your travel connectivity needs"}
            </p>
            <p className="text-gray-600">
              {i18n.language === 'en' ? "Our global support team is available 24/7 to assist you with any questions about your travel eSIM" : 
               i18n.language === 'sq' ? "Ekipi ynë global i mbështetjes është në dispozicion 24/7 për t'ju ndihmuar me çdo pyetje rreth eSIM-it tuaj të udhëtimit" :
               i18n.language === 'fr' ? "Notre équipe de support mondiale est disponible 24/7 pour vous aider avec toutes vos questions concernant votre eSIM de voyage" :
               i18n.language === 'de' ? "Unser globales Support-Team steht Ihnen rund um die Uhr zur Verfügung, um Ihnen bei Fragen zu Ihrer Reise-eSIM zu helfen" :
               i18n.language === 'tr' ? "Küresel destek ekibimiz, seyahat eSIM'iniz hakkında herhangi bir sorunuz olduğunda size yardımcı olmak için 7/24 hizmetinizdedir" :
               i18n.language === 'pl' ? "Nasz globalny zespół wsparcia jest dostępny 24/7, aby pomóc Ci w przypadku jakichkolwiek pytań dotyczących Twojej karty eSIM do podróży" :
               "Our global support team is available 24/7 to assist you with any questions about your travel eSIM"}
            </p>
          </div>
        </Container>
      </div>

      {/* Contact Methods Section */}
      <div className="py-12">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <ContactMethodCard 
              title={i18n.language === 'en' ? "24/7 Live Chat Support" : 
                     i18n.language === 'sq' ? "Mbështetje Chat-i 24/7" :
                     i18n.language === 'fr' ? "Support Chat en Direct 24/7" :
                     i18n.language === 'de' ? "24/7 Live-Chat-Support" :
                     i18n.language === 'tr' ? "7/24 Canlı Sohbet Desteği" :
                     i18n.language === 'pl' ? "Całodobowy Czat na Żywo" :
                     "24/7 Live Chat Support"}
              description={i18n.language === 'en' ? "Get instant help from our travel eSIM experts through our live chat service, available in multiple languages." : 
                          i18n.language === 'sq' ? "Merrni ndihmë të menjëhershme nga ekspertët tanë të eSIM-it të udhëtimit përmes shërbimit tonë të chat-it të drejtpërdrejtë, në dispozicion në shumë gjuhë." :
                          i18n.language === 'fr' ? "Obtenez une aide instantanée de nos experts eSIM de voyage via notre service de chat en direct, disponible en plusieurs langues." :
                          i18n.language === 'de' ? "Erhalten Sie sofortige Hilfe von unseren Reise-eSIM-Experten über unseren Live-Chat-Service, der in mehreren Sprachen verfügbar ist." :
                          i18n.language === 'tr' ? "Canlı sohbet hizmetimiz aracılığıyla seyahat eSIM uzmanlarımızdan birden fazla dilde anında yardım alın." :
                          i18n.language === 'pl' ? "Uzyskaj natychmiastową pomoc od naszych ekspertów ds. kart eSIM do podróży za pośrednictwem naszego czatu na żywo, dostępnego w wielu językach." :
                          "Get instant help from our travel eSIM experts through our live chat service, available in multiple languages."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              actionText={i18n.language === 'en' ? "Start Live Chat" : 
                          i18n.language === 'sq' ? "Fillo Chat-in Live" :
                          i18n.language === 'fr' ? "Démarrer le Chat en Direct" :
                          i18n.language === 'de' ? "Live-Chat starten" :
                          i18n.language === 'tr' ? "Canlı Sohbeti Başlat" :
                          i18n.language === 'pl' ? "Rozpocznij Czat na Żywo" :
                          "Start Live Chat"}
              actionLink="#"
            />
            <ContactMethodCard 
              title={i18n.language === 'en' ? "Email Customer Service" : 
                     i18n.language === 'sq' ? "Shërbimi i Klientit me Email" :
                     i18n.language === 'fr' ? "Service Client par Email" :
                     i18n.language === 'de' ? "E-Mail-Kundenservice" :
                     i18n.language === 'tr' ? "E-posta Müşteri Hizmetleri" :
                     i18n.language === 'pl' ? "Obsługa Klienta E-mail" :
                     "Email Customer Service"}
              description={i18n.language === 'en' ? "Send us an email about your travel connectivity needs and we'll respond within 2 hours, 24/7." : 
                          i18n.language === 'sq' ? "Na dërgoni një email për nevojat tuaja të lidhjes gjatë udhëtimit dhe ne do t'ju përgjigjemi brenda 2 orëve, 24/7." :
                          i18n.language === 'fr' ? "Envoyez-nous un email concernant vos besoins de connectivité en voyage et nous vous répondrons dans les 2 heures, 24/7." :
                          i18n.language === 'de' ? "Senden Sie uns eine E-Mail zu Ihren Reisekonnektivitätsbedürfnissen und wir werden innerhalb von 2 Stunden antworten, 24/7." :
                          i18n.language === 'tr' ? "Seyahat bağlantı ihtiyaçlarınızla ilgili bize bir e-posta gönderin, 7/24 2 saat içinde yanıt vereceğiz." :
                          i18n.language === 'pl' ? "Wyślij nam e-mail dotyczący potrzeb związanych z łącznością podczas podróży, a odpowiemy w ciągu 2 godzin, 24/7." :
                          "Send us an email about your travel connectivity needs and we'll respond within 2 hours, 24/7."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              actionText={i18n.language === 'en' ? "Email Support Team" : 
                          i18n.language === 'sq' ? "Emailo Ekipin e Mbështetjes" :
                          i18n.language === 'fr' ? "Envoyer un Email à l'Équipe de Support" :
                          i18n.language === 'de' ? "Support-Team per E-Mail kontaktieren" :
                          i18n.language === 'tr' ? "Destek Ekibine E-posta Gönder" :
                          i18n.language === 'pl' ? "Wyślij E-mail do Zespołu Wsparcia" :
                          "Email Support Team"}
              actionLink="mailto:support@kudosim.com"
            />
            <ContactMethodCard 
              title={i18n.language === 'en' ? "International Phone Support" : 
                     i18n.language === 'sq' ? "Mbështetje Telefonike Ndërkombëtare" :
                     i18n.language === 'fr' ? "Support Téléphonique International" :
                     i18n.language === 'de' ? "Internationaler Telefonsupport" :
                     i18n.language === 'tr' ? "Uluslararası Telefon Desteği" :
                     i18n.language === 'pl' ? "Międzynarodowe Wsparcie Telefoniczne" :
                     "International Phone Support"}
              description={i18n.language === 'en' ? "Call our global support line for immediate assistance with your travel eSIM connectivity issues." : 
                          i18n.language === 'sq' ? "Telefononi linjën tonë globale të mbështetjes për ndihmë të menjëhershme me problemet e lidhjes së eSIM-it tuaj të udhëtimit." :
                          i18n.language === 'fr' ? "Appelez notre ligne d'assistance mondiale pour une aide immédiate concernant vos problèmes de connectivité eSIM de voyage." :
                          i18n.language === 'de' ? "Rufen Sie unsere globale Support-Hotline an, um sofortige Hilfe bei Problemen mit der Konnektivität Ihrer Reise-eSIM zu erhalten." :
                          i18n.language === 'tr' ? "Seyahat eSIM bağlantı sorunlarınızla ilgili anında yardım için küresel destek hattımızı arayın." :
                          i18n.language === 'pl' ? "Zadzwoń na naszą globalną linię wsparcia, aby uzyskać natychmiastową pomoc w przypadku problemów z łącznością karty eSIM do podróży." :
                          "Call our global support line for immediate assistance with your travel eSIM connectivity issues."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              actionText={i18n.language === 'en' ? "Call Support Line" : 
                          i18n.language === 'sq' ? "Telefono Linjën e Mbështetjes" :
                          i18n.language === 'fr' ? "Appeler la Ligne d'Assistance" :
                          i18n.language === 'de' ? "Support-Hotline anrufen" :
                          i18n.language === 'tr' ? "Destek Hattını Ara" :
                          i18n.language === 'pl' ? "Zadzwoń na Linię Wsparcia" :
                          "Call Support Line"}
              actionLink="tel:+18005551234"
            />
          </div>
        </Container>
      </div>

      {/* Contact Form Section */}
      <div className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {i18n.language === 'en' ? "Contact Us About Travel eSIM Services" : 
                   i18n.language === 'sq' ? "Na Kontaktoni për Shërbimet eSIM të Udhëtimit" :
                   i18n.language === 'fr' ? "Contactez-Nous à Propos des Services eSIM de Voyage" :
                   i18n.language === 'de' ? "Kontaktieren Sie Uns zu Reise-eSIM-Diensten" :
                   i18n.language === 'tr' ? "Seyahat eSIM Hizmetleri Hakkında Bizimle İletişime Geçin" :
                   i18n.language === 'pl' ? "Skontaktuj się z Nami w Sprawie Usług eSIM dla Podróżnych" :
                   "Contact Us About Travel eSIM Services"}
                </h2>
                
                {submitMessage && (
                  <div className={`mb-6 p-4 rounded-md ${
                    submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {submitMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {i18n.language === 'en' ? "Your Name" : 
                         i18n.language === 'sq' ? "Emri Juaj" :
                         i18n.language === 'fr' ? "Votre Nom" :
                         i18n.language === 'de' ? "Ihr Name" :
                         i18n.language === 'tr' ? "Adınız" :
                         i18n.language === 'pl' ? "Twoje Imię" :
                         "Your Name"}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {i18n.language === 'en' ? "Email Address" : 
                         i18n.language === 'sq' ? "Adresa e Emailit" :
                         i18n.language === 'fr' ? "Adresse Email" :
                         i18n.language === 'de' ? "E-Mail-Adresse" :
                         i18n.language === 'tr' ? "E-posta Adresi" :
                         i18n.language === 'pl' ? "Adres Email" :
                         "Email Address"}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {i18n.language === 'en' ? "Subject" : 
                       i18n.language === 'sq' ? "Subjekti" :
                       i18n.language === 'fr' ? "Sujet" :
                       i18n.language === 'de' ? "Betreff" :
                       i18n.language === 'tr' ? "Konu" :
                       i18n.language === 'pl' ? "Temat" :
                       "Subject"}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {i18n.language === 'en' ? "Message" : 
                       i18n.language === 'sq' ? "Mesazhi" :
                       i18n.language === 'fr' ? "Message" :
                       i18n.language === 'de' ? "Nachricht" :
                       i18n.language === 'tr' ? "Mesaj" :
                       i18n.language === 'pl' ? "Wiadomość" :
                       "Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-[#690d89] text-white rounded-lg font-medium hover:bg-[#8B5CF6] transition-colors duration-300 flex justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {i18n.language === 'en' ? "Sending..." : 
                           i18n.language === 'sq' ? "Duke dërguar..." :
                           i18n.language === 'fr' ? "Envoi en cours..." :
                           i18n.language === 'de' ? "Wird gesendet..." :
                           i18n.language === 'tr' ? "Gönderiliyor..." :
                           i18n.language === 'pl' ? "Wysyłanie..." :
                           "Sending..."}
                        </>
                      ) : (
                        i18n.language === 'en' ? "Send Message" : 
                        i18n.language === 'sq' ? "Dërgo Mesazhin" :
                        i18n.language === 'fr' ? "Envoyer le Message" :
                        i18n.language === 'de' ? "Nachricht senden" :
                        i18n.language === 'tr' ? "Mesaj Gönder" :
                        i18n.language === 'pl' ? "Wyślij Wiadomość" :
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {i18n.language === 'en' ? "Frequently Asked Questions About eSIM Support" : 
               i18n.language === 'sq' ? "Pyetjet më të Shpeshta Rreth Mbështetjes së eSIM" :
               i18n.language === 'fr' ? "Questions Fréquemment Posées sur le Support eSIM" :
               i18n.language === 'de' ? "Häufig Gestellte Fragen zum eSIM-Support" :
               i18n.language === 'tr' ? "eSIM Desteği Hakkında Sıkça Sorulan Sorular" :
               i18n.language === 'pl' ? "Często Zadawane Pytania Dotyczące Wsparcia eSIM" :
               "Frequently Asked Questions About eSIM Support"}
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <FAQItem 
                question={i18n.language === 'en' ? "How quickly will I receive a response to my travel eSIM inquiry?" : 
                          i18n.language === 'sq' ? "Sa shpejt do të marr një përgjigje për pyetjen time rreth eSIM-it të udhëtimit?" :
                          i18n.language === 'fr' ? "Dans quel délai vais-je recevoir une réponse à ma demande concernant l'eSIM de voyage ?" :
                          i18n.language === 'de' ? "Wie schnell erhalte ich eine Antwort auf meine Anfrage zur Reise-eSIM?" :
                          i18n.language === 'tr' ? "Seyahat eSIM sorguma ne kadar çabuk yanıt alacağım?" :
                          i18n.language === 'pl' ? "Jak szybko otrzymam odpowiedź na moje zapytanie dotyczące karty eSIM do podróży?" :
                          "How quickly will I receive a response to my travel eSIM inquiry?"}
                answer={i18n.language === 'en' ? "We aim to respond to all travel connectivity inquiries within 2 hours. For urgent matters, we recommend using our live chat for immediate assistance with your eSIM." : 
                        i18n.language === 'sq' ? "Ne synojmë t'u përgjigjemi të gjitha pyetjeve për lidhjen e udhëtimit brenda 2 orëve. Për çështje urgjente, rekomandojmë të përdorni chat-in tonë të drejtpërdrejtë për ndihmë të menjëhershme me eSIM-in tuaj." :
                        i18n.language === 'fr' ? "Nous visons à répondre à toutes les demandes de connectivité de voyage dans un délai de 2 heures. Pour les questions urgentes, nous vous recommandons d'utiliser notre chat en direct pour une assistance immédiate avec votre eSIM." :
                        i18n.language === 'de' ? "Wir bemühen uns, alle Anfragen zur Reisekonnektivität innerhalb von 2 Stunden zu beantworten. Für dringende Angelegenheiten empfehlen wir unseren Live-Chat für sofortige Hilfe mit Ihrer eSIM." :
                        i18n.language === 'tr' ? "Tüm seyahat bağlantı sorgularını 2 saat içinde yanıtlamayı hedefliyoruz. Acil konular için, eSIM'iniz ile ilgili anında yardım için canlı sohbetimizi kullanmanızı öneririz." :
                        i18n.language === 'pl' ? "Staramy się odpowiadać na wszystkie zapytania dotyczące łączności podczas podróży w ciągu 2 godzin. W pilnych sprawach zalecamy korzystanie z naszego czatu na żywo, aby uzyskać natychmiastową pomoc dotyczącą karty eSIM." :
                        "We aim to respond to all travel connectivity inquiries within 2 hours. For urgent matters, we recommend using our live chat for immediate assistance with your eSIM."}
              />
              <FAQItem 
                question={i18n.language === 'en' ? "What information should I include when contacting eSIM customer service?" : 
                          i18n.language === 'sq' ? "Çfarë informacioni duhet të përfshij kur kontaktoj shërbimin e klientit të eSIM?" :
                          i18n.language === 'fr' ? "Quelles informations dois-je inclure lorsque je contacte le service client eSIM ?" :
                          i18n.language === 'de' ? "Welche Informationen sollte ich angeben, wenn ich den eSIM-Kundenservice kontaktiere?" :
                          i18n.language === 'tr' ? "eSIM müşteri hizmetleriyle iletişime geçerken hangi bilgileri belirtmeliyim?" :
                          i18n.language === 'pl' ? "Jakie informacje powinienem podać podczas kontaktu z obsługą klienta eSIM?" :
                          "What information should I include when contacting eSIM customer service?"}
                answer={i18n.language === 'en' ? "To help us assist you faster with your travel connectivity, please include your eSIM ICCID number (found in your account or eSIM email), the device model you're using, your current location, and a detailed description of any connectivity issues you're experiencing." : 
                        i18n.language === 'sq' ? "Për të na ndihmuar t'ju ndihmojmë më shpejt me lidhjen tuaj të udhëtimit, ju lutemi përfshini numrin tuaj ICCID të eSIM (gjetur në llogarinë tuaj ose emailin e eSIM), modelin e pajisjes që po përdorni, vendndodhjen tuaj aktuale dhe një përshkrim të detajuar të çdo problemi të lidhjes që po përjetoni." :
                        i18n.language === 'fr' ? "Pour nous aider à vous assister plus rapidement avec votre connectivité de voyage, veuillez inclure votre numéro ICCID eSIM (trouvé dans votre compte ou email eSIM), le modèle d'appareil que vous utilisez, votre emplacement actuel et une description détaillée de tout problème de connectivité que vous rencontrez." :
                        i18n.language === 'de' ? "Um Ihnen schneller bei Ihrer Reisekonnektivität helfen zu können, geben Sie bitte Ihre eSIM-ICCID-Nummer (zu finden in Ihrem Konto oder in der eSIM-E-Mail), das von Ihnen verwendete Gerätemodell, Ihren aktuellen Standort und eine detaillierte Beschreibung aller Konnektivitätsprobleme an, die Sie haben." :
                        i18n.language === 'tr' ? "Seyahat bağlantınızla ilgili size daha hızlı yardımcı olmamız için lütfen eSIM ICCID numaranızı (hesabınızda veya eSIM e-postanızda bulunur), kullandığınız cihaz modelini, mevcut konumunuzu ve yaşadığınız bağlantı sorunlarının ayrıntılı bir açıklamasını belirtin." :
                        i18n.language === 'pl' ? "Aby pomóc nam szybciej pomóc Ci w łączności podczas podróży, prosimy o podanie numeru ICCID karty eSIM (znajdującego się na koncie lub w wiadomości e-mail dotyczącej eSIM), modelu używanego urządzenia, aktualnej lokalizacji oraz szczegółowego opisu wszelkich problemów z łącznością, których doświadczasz." :
                        "To help us assist you faster with your travel connectivity, please include your eSIM ICCID number (found in your account or eSIM email), the device model you're using, your current location, and a detailed description of any connectivity issues you're experiencing."}
              />
              <FAQItem 
                question={i18n.language === 'en' ? "In which languages is travel eSIM support available?" : 
                          i18n.language === 'sq' ? "Në cilat gjuhë është e disponueshme mbështetja e eSIM-it të udhëtimit?" :
                          i18n.language === 'fr' ? "Dans quelles langues le support eSIM de voyage est-il disponible ?" :
                          i18n.language === 'de' ? "In welchen Sprachen ist der Reise-eSIM-Support verfügbar?" :
                          i18n.language === 'tr' ? "Seyahat eSIM desteği hangi dillerde sunuluyor?" :
                          i18n.language === 'pl' ? "W jakich językach dostępne jest wsparcie dla kart eSIM do podróży?" :
                          "In which languages is travel eSIM support available?"}
                answer={i18n.language === 'en' ? "Our global travel eSIM support team is available in English, German, French, Albanian, Turkish, and Polish. Just let us know your preferred language when contacting our customer service for assistance with your travel connectivity." : 
                        i18n.language === 'sq' ? "Ekipi ynë global i mbështetjes së eSIM-it të udhëtimit është i disponueshëm në anglisht, gjermanisht, frëngjisht, shqip, turqisht dhe polonisht. Thjesht na tregoni gjuhën tuaj të preferuar kur kontaktoni shërbimin tonë të klientit për ndihmë me lidhjen tuaj të udhëtimit." :
                        i18n.language === 'fr' ? "Notre équipe mondiale de support eSIM de voyage est disponible en anglais, allemand, français, albanais, turc et polonais. Indiquez-nous simplement votre langue préférée lorsque vous contactez notre service client pour obtenir de l'aide concernant votre connectivité de voyage." :
                        i18n.language === 'de' ? "Unser globales Reise-eSIM-Support-Team ist in Englisch, Deutsch, Französisch, Albanisch, Türkisch und Polnisch verfügbar. Teilen Sie uns einfach Ihre bevorzugte Sprache mit, wenn Sie unseren Kundenservice für Hilfe bei Ihrer Reisekonnektivität kontaktieren." :
                        i18n.language === 'tr' ? "Küresel seyahat eSIM destek ekibimiz İngilizce, Almanca, Fransızca, Arnavutça, Türkçe ve Lehçe dillerinde hizmet vermektedir. Seyahat bağlantınızla ilgili yardım için müşteri hizmetlerimizle iletişime geçerken tercih ettiğiniz dili belirtmeniz yeterlidir." :
                        i18n.language === 'pl' ? "Nasz globalny zespół wsparcia dla kart eSIM do podróży jest dostępny w języku angielskim, niemieckim, francuskim, albańskim, tureckim i polskim. Wystarczy poinformować nas o preferowanym języku podczas kontaktu z naszą obsługą klienta w celu uzyskania pomocy dotyczącej łączności podczas podróży." :
                        "Our global travel eSIM support team is available in English, German, French, Albanian, Turkish, and Polish. Just let us know your preferred language when contacting our customer service for assistance with your travel connectivity."}
              />
              <FAQItem 
                question={i18n.language === 'en' ? "What are your travel eSIM support hours?" : 
                          i18n.language === 'sq' ? "Cilat janë orët e mbështetjes së eSIM-it të udhëtimit?" :
                          i18n.language === 'fr' ? "Quelles sont les heures de support pour l'eSIM de voyage ?" :
                          i18n.language === 'de' ? "Was sind Ihre Reise-eSIM-Support-Zeiten?" :
                          i18n.language === 'tr' ? "Seyahat eSIM destek saatleriniz nelerdir?" :
                          i18n.language === 'pl' ? "Jakie są godziny wsparcia dla kart eSIM do podróży?" :
                          "What are your travel eSIM support hours?"}
                answer={i18n.language === 'en' ? "Our global travel connectivity support team is available 24 hours a day, 7 days a week, including holidays. We understand that travelers need assistance at all hours, so we're always here to help you stay connected with your eSIM." : 
                        i18n.language === 'sq' ? "Ekipi ynë global i mbështetjes së lidhjes së udhëtimit është i disponueshëm 24 orë në ditë, 7 ditë në javë, përfshirë pushimet. Ne kuptojmë që udhëtarët kanë nevojë për ndihmë në çdo orë, kështu që jemi gjithmonë këtu për t'ju ndihmuar të qëndroni të lidhur me eSIM-in tuaj." :
                        i18n.language === 'fr' ? "Notre équipe mondiale de support de connectivité de voyage est disponible 24 heures sur 24, 7 jours sur 7, y compris les jours fériés. Nous comprenons que les voyageurs ont besoin d'assistance à toute heure, nous sommes donc toujours là pour vous aider à rester connecté avec votre eSIM." :
                        i18n.language === 'de' ? "Unser globales Reisekonnektivitäts-Support-Team ist 24 Stunden am Tag, 7 Tage die Woche, einschließlich Feiertagen, für Sie da. Wir verstehen, dass Reisende zu allen Stunden Hilfe benötigen, daher sind wir immer hier, um Ihnen zu helfen, mit Ihrer eSIM verbunden zu bleiben." :
                        i18n.language === 'tr' ? "Küresel seyahat bağlantı destek ekibimiz tatiller dahil olmak üzere günde 24 saat, haftada 7 gün hizmetinizdedir. Gezginlerin her saatte yardıma ihtiyaç duyduğunu anlıyoruz, bu yüzden eSIM'iniz ile bağlantıda kalmanıza yardımcı olmak için her zaman buradayız." :
                        i18n.language === 'pl' ? "Nasz globalny zespół wsparcia łączności podczas podróży jest dostępny 24 godziny na dobę, 7 dni w tygodniu, w tym w święta. Rozumiemy, że podróżni potrzebują pomocy o każdej porze, dlatego zawsze jesteśmy tutaj, aby pomóc Ci pozostać w kontakcie za pomocą karty eSIM." :
                        "Our global travel connectivity support team is available 24 hours a day, 7 days a week, including holidays. We understand that travelers need assistance at all hours, so we're always here to help you stay connected with your eSIM."}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Global Support Offices */}
      <div className="py-12">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {i18n.language === 'en' ? "Global eSIM Support Offices" : 
             i18n.language === 'sq' ? "Zyrat Globale të Mbështetjes së eSIM" :
             i18n.language === 'fr' ? "Bureaux de Support eSIM Mondiaux" :
             i18n.language === 'de' ? "Globale eSIM-Support-Büros" :
             i18n.language === 'tr' ? "Küresel eSIM Destek Ofisleri" :
             i18n.language === 'pl' ? "Globalne Biura Wsparcia eSIM" :
             "Global eSIM Support Offices"}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">London</h3>
              <p className="text-gray-600 mb-4">123 Tech Square<br />London, EC1V 9BX<br />United Kingdom</p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +44 20 1234 5678
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">New York</h3>
              <p className="text-gray-600 mb-4">456 Digital Avenue<br />New York, NY 10001<br />United States</p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +1 212 987 6543
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Singapore</h3>
              <p className="text-gray-600 mb-4">789 Innovation Road<br />Singapore, 018956<br />Singapore</p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +65 6123 4567
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}