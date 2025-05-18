import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/cms';
import Container from '../components/Container';
import SEO from '../components/SEO';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';

// FAQ Category component
const FAQCategory = ({ title, faqs, isOpen, onToggle }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <svg
          className={`w-6 h-6 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      )}
    </div>
  );
};

// FAQ Item component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left px-6 py-4 hover:bg-gray-50"
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const { isLoading } = useTranslationLoader(['faq']);
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState({});
  
  // SEO metadata for different languages
  const seoTitles = {
    en: "eSIM FAQ - Answers to Common Questions About Travel eSIMs | KudoSIM",
    sq: "Pyetje të Shpeshta për eSIM - Përgjigje për Pyetjet e Zakonshme për eSIM Udhëtimi | KudoSIM",
    fr: "FAQ eSIM - Réponses aux Questions Courantes sur les eSIM de Voyage | KudoSIM",
    de: "eSIM FAQ - Antworten auf Häufige Fragen zu Reise-eSIMs | KudoSIM",
    tr: "eSIM SSS - Seyahat eSIM'leri Hakkında Sık Sorulan Soruların Yanıtları | KudoSIM",
    pl: "FAQ eSIM - Odpowiedzi na Często Zadawane Pytania o Karty eSIM do Podróży | KudoSIM"
  };

  const seoDescriptions = {
    en: "Find answers to frequently asked questions about KudoSIM travel eSIMs. Learn about activation, troubleshooting, international coverage, data plans, and device compatibility.",
    sq: "Gjeni përgjigje për pyetjet e bëra shpesh rreth eSIM-ve të udhëtimit KudoSIM. Mësoni për aktivizimin, zgjidhjen e problemeve, mbulimin ndërkombëtar, planet e të dhënave dhe përputhshmërinë e pajisjeve.",
    fr: "Trouvez des réponses aux questions fréquemment posées sur les eSIM de voyage KudoSIM. Informez-vous sur l'activation, le dépannage, la couverture internationale, les forfaits de données et la compatibilité des appareils.",
    de: "Finden Sie Antworten auf häufig gestellte Fragen zu KudoSIM Reise-eSIMs. Erfahren Sie mehr über Aktivierung, Fehlerbehebung, internationale Abdeckung, Datentarife und Gerätekompatibilität.",
    tr: "KudoSIM seyahat eSIM'leri hakkında sıkça sorulan soruların yanıtlarını bulun. Aktivasyon, sorun giderme, uluslararası kapsama, veri planları ve cihaz uyumluluğu hakkında bilgi edinin.",
    pl: "Znajdź odpowiedzi na często zadawane pytania dotyczące kart eSIM do podróży KudoSIM. Dowiedz się więcej o aktywacji, rozwiązywaniu problemów, zasięgu międzynarodowym, planach danych i kompatybilności urządzeń."
  };
  
  // Load FAQs from database
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cms_faqs')
          .select('*')
          .order('category')
          .order('order');
          
        if (error) throw error;
        
        // Group FAQs by category
        const groupedFaqs = {};
        data.forEach(faq => {
          const category = faq.category;
          if (!groupedFaqs[category]) {
            groupedFaqs[category] = [];
          }
          
          // Get translated content based on current language
          const question = faq.translations?.[i18n.language]?.question || faq.question;
          const answer = faq.translations?.[i18n.language]?.answer || faq.answer;
          
          groupedFaqs[category].push({
            id: faq.id,
            question,
            answer
          });
        });
        
        setFaqs(groupedFaqs);
        
        // Initialize all categories as open
        const initialOpenState = {};
        Object.keys(groupedFaqs).forEach(category => {
          initialOpenState[category] = true;
        });
        setOpenCategories(initialOpenState);
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFAQs();
  }, [i18n.language]);
  
  // Filter FAQs based on search term
  const filteredFaqs = React.useMemo(() => {
    if (!searchTerm) return faqs;
    
    const filtered = {};
    Object.entries(faqs).forEach(([category, categoryFaqs]) => {
      const matchingFaqs = categoryFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingFaqs.length > 0) {
        filtered[category] = matchingFaqs;
      }
    });
    
    return filtered;
  }, [faqs, searchTerm]);
  
  // Toggle category open/closed state
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Prepare schema markup for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Object.values(faqs).flat().map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  if (isLoading || loading) {
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
        schema={faqSchema}
      />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-gradient-to-b from-[#690d89]/10 to-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {i18n.language === 'en' ? "Frequently Asked Questions About Travel eSIMs" : 
               i18n.language === 'sq' ? "Pyetjet më të Shpeshta Rreth eSIM-ve të Udhëtimit" :
               i18n.language === 'fr' ? "Questions Fréquemment Posées sur les eSIM de Voyage" :
               i18n.language === 'de' ? "Häufig Gestellte Fragen zu Reise-eSIMs" :
               i18n.language === 'tr' ? "Seyahat eSIM'leri Hakkında Sıkça Sorulan Sorular" :
               i18n.language === 'pl' ? "Często Zadawane Pytania o Karty eSIM do Podróży" :
               "Frequently Asked Questions About Travel eSIMs"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {i18n.language === 'en' ? "Find answers to common questions about KudoSIM eSIM services, activation, and international coverage" : 
               i18n.language === 'sq' ? "Gjeni përgjigje për pyetjet e zakonshme rreth shërbimeve eSIM të KudoSIM, aktivizimit dhe mbulimit ndërkombëtar" :
               i18n.language === 'fr' ? "Trouvez des réponses aux questions courantes sur les services eSIM de KudoSIM, l'activation et la couverture internationale" :
               i18n.language === 'de' ? "Finden Sie Antworten auf häufige Fragen zu KudoSIM eSIM-Diensten, Aktivierung und internationaler Abdeckung" :
               i18n.language === 'tr' ? "KudoSIM eSIM hizmetleri, aktivasyon ve uluslararası kapsama hakkında sık sorulan soruların cevaplarını bulun" :
               i18n.language === 'pl' ? "Znajdź odpowiedzi na często zadawane pytania dotyczące usług eSIM KudoSIM, aktywacji i zasięgu międzynarodowego" :
               "Find answers to common questions about KudoSIM eSIM services, activation, and international coverage"}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder={i18n.language === 'en' ? "Search for eSIM questions..." : 
                               i18n.language === 'sq' ? "Kërko për pyetje rreth eSIM..." :
                               i18n.language === 'fr' ? "Rechercher des questions sur l'eSIM..." :
                               i18n.language === 'de' ? "Nach eSIM-Fragen suchen..." :
                               i18n.language === 'tr' ? "eSIM sorularını ara..." :
                               i18n.language === 'pl' ? "Szukaj pytań o eSIM..." :
                               "Search for eSIM questions..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#690d89]/20 focus:border-[#690d89] focus:ring-4 focus:ring-[#690d89]/20 transition-all duration-300"
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#690d89]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </Container>
      </div>

      {/* FAQ Content */}
      <div className="py-12">
        <Container>
          {Object.keys(filteredFaqs).length > 0 ? (
            Object.entries(filteredFaqs).map(([category, categoryFaqs]) => (
              <FAQCategory
                key={category}
                title={category}
                faqs={categoryFaqs}
                isOpen={openCategories[category]}
                onToggle={() => toggleCategory(category)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <svg 
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                {i18n.language === 'en' ? "No eSIM questions found" : 
                 i18n.language === 'sq' ? "Nuk u gjetën pyetje për eSIM" :
                 i18n.language === 'fr' ? "Aucune question sur l'eSIM trouvée" :
                 i18n.language === 'de' ? "Keine eSIM-Fragen gefunden" :
                 i18n.language === 'tr' ? "eSIM sorusu bulunamadı" :
                 i18n.language === 'pl' ? "Nie znaleziono pytań o eSIM" :
                 "No eSIM questions found"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {i18n.language === 'en' ? "Try adjusting your search terms or browse our categories" : 
                 i18n.language === 'sq' ? "Provoni të rregulloni termat e kërkimit ose shfletoni kategoritë tona" :
                 i18n.language === 'fr' ? "Essayez d'ajuster vos termes de recherche ou parcourez nos catégories" :
                 i18n.language === 'de' ? "Versuchen Sie, Ihre Suchbegriffe anzupassen oder durchsuchen Sie unsere Kategorien" :
                 i18n.language === 'tr' ? "Arama terimlerinizi ayarlamayı deneyin veya kategorilerimize göz atın" :
                 i18n.language === 'pl' ? "Spróbuj dostosować wyszukiwane hasła lub przeglądaj nasze kategorie" :
                 "Try adjusting your search terms or browse our categories"}
              </p>
            </div>
          )}
        </Container>
      </div>

      {/* Popular eSIM Topics Section */}
      <div className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {i18n.language === 'en' ? "Popular eSIM Topics" : 
             i18n.language === 'sq' ? "Temat e Popullarizuara të eSIM" :
             i18n.language === 'fr' ? "Sujets eSIM Populaires" :
             i18n.language === 'de' ? "Beliebte eSIM-Themen" :
             i18n.language === 'tr' ? "Popüler eSIM Konuları" :
             i18n.language === 'pl' ? "Popularne Tematy eSIM" :
             "Popular eSIM Topics"}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-[#690d89]/10 rounded-lg flex items-center justify-center text-[#690d89] mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? "eSIM Activation" : 
                 i18n.language === 'sq' ? "Aktivizimi i eSIM" :
                 i18n.language === 'fr' ? "Activation de l'eSIM" :
                 i18n.language === 'de' ? "eSIM-Aktivierung" :
                 i18n.language === 'tr' ? "eSIM Aktivasyonu" :
                 i18n.language === 'pl' ? "Aktywacja eSIM" :
                 "eSIM Activation"}
              </h3>
              <p className="text-gray-600 mb-4">
                {i18n.language === 'en' ? "Learn how to activate your travel eSIM and get connected quickly in any destination." : 
                 i18n.language === 'sq' ? "Mësoni si të aktivizoni eSIM-in tuaj të udhëtimit dhe të lidheni shpejt në çdo destinacion." :
                 i18n.language === 'fr' ? "Apprenez à activer votre eSIM de voyage et à vous connecter rapidement dans n'importe quelle destination." :
                 i18n.language === 'de' ? "Erfahren Sie, wie Sie Ihre Reise-eSIM aktivieren und schnell an jedem Reiseziel verbunden werden." :
                 i18n.language === 'tr' ? "Seyahat eSIM'inizi nasıl etkinleştireceğinizi ve herhangi bir destinasyonda hızlı bir şekilde bağlanacağınızı öğrenin." :
                 i18n.language === 'pl' ? "Dowiedz się, jak aktywować kartę eSIM do podróży i szybko połączyć się w dowolnym miejscu docelowym." :
                 "Learn how to activate your travel eSIM and get connected quickly in any destination."}
              </p>
              <a 
                href="#activation"
                className="inline-flex items-center text-[#690d89] hover:text-[#8B5CF6]"
              >
                {i18n.language === 'en' ? "View activation guides" : 
                 i18n.language === 'sq' ? "Shiko udhëzimet e aktivizimit" :
                 i18n.language === 'fr' ? "Voir les guides d'activation" :
                 i18n.language === 'de' ? "Aktivierungsanleitungen anzeigen" :
                 i18n.language === 'tr' ? "Aktivasyon kılavuzlarını görüntüle" :
                 i18n.language === 'pl' ? "Zobacz przewodniki aktywacji" :
                 "View activation guides"}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-[#690d89]/10 rounded-lg flex items-center justify-center text-[#690d89] mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? "International Coverage" : 
                 i18n.language === 'sq' ? "Mbulimi Ndërkombëtar" :
                 i18n.language === 'fr' ? "Couverture Internationale" :
                 i18n.language === 'de' ? "Internationale Abdeckung" :
                 i18n.language === 'tr' ? "Uluslararası Kapsama" :
                 i18n.language === 'pl' ? "Zasięg Międzynarodowy" :
                 "International Coverage"}
              </h3>
              <p className="text-gray-600 mb-4">
                {i18n.language === 'en' ? "Check which countries and regions are covered by our travel eSIM data plans." : 
                 i18n.language === 'sq' ? "Kontrolloni cilat vende dhe rajone mbulohen nga planet tona të të dhënave eSIM të udhëtimit." :
                 i18n.language === 'fr' ? "Vérifiez quels pays et régions sont couverts par nos forfaits de données eSIM de voyage." :
                 i18n.language === 'de' ? "Überprüfen Sie, welche Länder und Regionen von unseren Reise-eSIM-Datentarifen abgedeckt werden." :
                 i18n.language === 'tr' ? "Seyahat eSIM veri planlarımızın hangi ülkeleri ve bölgeleri kapsadığını kontrol edin." :
                 i18n.language === 'pl' ? "Sprawdź, które kraje i regiony są objęte naszymi planami danych eSIM do podróży." :
                 "Check which countries and regions are covered by our travel eSIM data plans."}
              </p>
              <a 
                href="#coverage"
                className="inline-flex items-center text-[#690d89] hover:text-[#8B5CF6]"
              >
                {i18n.language === 'en' ? "View coverage map" : 
                 i18n.language === 'sq' ? "Shiko hartën e mbulimit" :
                 i18n.language === 'fr' ? "Voir la carte de couverture" :
                 i18n.language === 'de' ? "Abdeckungskarte anzeigen" :
                 i18n.language === 'tr' ? "Kapsama haritasını görüntüle" :
                 i18n.language === 'pl' ? "Zobacz mapę zasięgu" :
                 "View coverage map"}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-[#690d89]/10 rounded-lg flex items-center justify-center text-[#690d89] mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? "eSIM Troubleshooting" : 
                 i18n.language === 'sq' ? "Zgjidhja e Problemeve të eSIM" :
                 i18n.language === 'fr' ? "Dépannage eSIM" :
                 i18n.language === 'de' ? "eSIM-Fehlerbehebung" :
                 i18n.language === 'tr' ? "eSIM Sorun Giderme" :
                 i18n.language === 'pl' ? "Rozwiązywanie Problemów z eSIM" :
                 "eSIM Troubleshooting"}
              </h3>
              <p className="text-gray-600 mb-4">
                {i18n.language === 'en' ? "Solutions for common issues with travel eSIM activation and connectivity while abroad." : 
                 i18n.language === 'sq' ? "Zgjidhje për problemet e zakonshme me aktivizimin dhe lidhjen e eSIM-it të udhëtimit gjatë qëndrimit jashtë vendit." :
                 i18n.language === 'fr' ? "Solutions pour les problèmes courants d'activation et de connectivité eSIM de voyage à l'étranger." :
                 i18n.language === 'de' ? "Lösungen für häufige Probleme mit der Aktivierung und Konnektivität von Reise-eSIMs im Ausland." :
                 i18n.language === 'tr' ? "Yurtdışındayken seyahat eSIM aktivasyonu ve bağlantısıyla ilgili yaygın sorunlara çözümler." :
                 i18n.language === 'pl' ? "Rozwiązania typowych problemów z aktywacją i łącznością kart eSIM do podróży za granicą." :
                 "Solutions for common issues with travel eSIM activation and connectivity while abroad."}
              </p>
              <a 
                href="#troubleshooting"
                className="inline-flex items-center text-[#690d89] hover:text-[#8B5CF6]"
              >
                {i18n.language === 'en' ? "View troubleshooting guides" : 
                 i18n.language === 'sq' ? "Shiko udhëzimet e zgjidhjes së problemeve" :
                 i18n.language === 'fr' ? "Voir les guides de dépannage" :
                 i18n.language === 'de' ? "Fehlerbehebungsanleitungen anzeigen" :
                 i18n.language === 'tr' ? "Sorun giderme kılavuzlarını görüntüle" :
                 i18n.language === 'pl' ? "Zobacz poradniki rozwiązywania problemów" :
                 "View troubleshooting guides"}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Help Center CTA */}
      <div className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {i18n.language === 'en' ? "Need More Help With Your Travel eSIM?" : 
               i18n.language === 'sq' ? "Keni Nevojë për Më Shumë Ndihmë me eSIM-in Tuaj të Udhëtimit?" :
               i18n.language === 'fr' ? "Besoin de Plus d'Aide Avec Votre eSIM de Voyage ?" :
               i18n.language === 'de' ? "Benötigen Sie Weitere Hilfe Mit Ihrer Reise-eSIM?" :
               i18n.language === 'tr' ? "Seyahat eSIM'iniz İçin Daha Fazla Yardıma mı İhtiyacınız Var?" :
               i18n.language === 'pl' ? "Potrzebujesz Więcej Pomocy z Kartą eSIM do Podróży?" :
               "Need More Help With Your Travel eSIM?"}
            </h2>
            <p className="text-gray-600 mb-8">
              {i18n.language === 'en' ? "If you can't find the answer you're looking for, our global support team is available 24/7 to assist with your travel connectivity needs." : 
               i18n.language === 'sq' ? "Nëse nuk mund të gjeni përgjigjen që po kërkoni, ekipi ynë global i mbështetjes është i disponueshëm 24/7 për t'ju ndihmuar me nevojat tuaja të lidhjes gjatë udhëtimit." :
               i18n.language === 'fr' ? "Si vous ne trouvez pas la réponse que vous cherchez, notre équipe de support mondiale est disponible 24/7 pour vous aider avec vos besoins de connectivité en voyage." :
               i18n.language === 'de' ? "Wenn Sie die gesuchte Antwort nicht finden können, steht Ihnen unser globales Support-Team rund um die Uhr zur Verfügung, um Ihnen bei Ihren Reisekonnektivitätsbedürfnissen zu helfen." :
               i18n.language === 'tr' ? "Aradığınız cevabı bulamıyorsanız, küresel destek ekibimiz seyahat bağlantı ihtiyaçlarınıza yardımcı olmak için 7/24 hizmetinizdedir." :
               i18n.language === 'pl' ? "Jeśli nie możesz znaleźć odpowiedzi, której szukasz, nasz globalny zespół wsparcia jest dostępny 24/7, aby pomóc Ci w potrzebach związanych z łącznością podczas podróży." :
               "If you can't find the answer you're looking for, our global support team is available 24/7 to assist with your travel connectivity needs."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#690d89] text-white rounded-lg font-medium hover:bg-[#8B5CF6] transition-colors duration-300"
              >
                {i18n.language === 'en' ? "Contact eSIM Support" : 
                 i18n.language === 'sq' ? "Kontakto Mbështetjen e eSIM" :
                 i18n.language === 'fr' ? "Contacter le Support eSIM" :
                 i18n.language === 'de' ? "eSIM-Support kontaktieren" :
                 i18n.language === 'tr' ? "eSIM Desteğine Ulaşın" :
                 i18n.language === 'pl' ? "Skontaktuj się z Pomocą eSIM" :
                 "Contact eSIM Support"}
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#690d89] border border-[#690d89] rounded-lg font-medium hover:bg-[#690d89]/5 transition-colors duration-300"
              >
                {i18n.language === 'en' ? "Visit eSIM Help Center" : 
                 i18n.language === 'sq' ? "Vizito Qendrën e Ndihmës për eSIM" :
                 i18n.language === 'fr' ? "Visiter le Centre d'Aide eSIM" :
                 i18n.language === 'de' ? "eSIM-Hilfecenter besuchen" :
                 i18n.language === 'tr' ? "eSIM Yardım Merkezini Ziyaret Edin" :
                 i18n.language === 'pl' ? "Odwiedź Centrum Pomocy eSIM" :
                 "Visit eSIM Help Center"}
              </a>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}