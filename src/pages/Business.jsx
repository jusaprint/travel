import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Container from '../components/Container';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import SEO from '../components/SEO';

// Stat card component
const StatCard = ({ title, value, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="text-[#690d89] font-bold text-3xl mb-2">{value}</div>
    <div className="font-semibold text-gray-900 mb-1">{title}</div>
    <div className="text-sm text-gray-500">{description}</div>
  </div>
);

// Feature card component
const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="w-12 h-12 bg-[#690d89]/10 rounded-lg flex items-center justify-center text-[#690d89] mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function Business() {
  const { t, i18n } = useTranslation();
  const { isLoading } = useTranslationLoader(['business']);

  // Prepare schema markup for SEO
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "KudoSIM Business Program",
    "description": "Join KudoSIM's business program and earn up to 15% commission for every eSIM sale. Help travelers stay connected worldwide while growing your income.",
    "provider": {
      "@type": "Organization",
      "name": "KudoSIM",
      "url": "https://kudosim.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "0",
      "availability": "https://schema.org/InStock"
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  // SEO metadata for different languages
  const seoTitles = {
    en: "KudoSIM Business - Join Our Global eSIM Affiliate Program",
    sq: "KudoSIM Biznes - Bashkohuni me Programin Tonë Global të Partneritetit eSIM",
    fr: "KudoSIM Business - Rejoignez Notre Programme d'Affiliation eSIM Mondial",
    de: "KudoSIM Business - Treten Sie Unserem Globalen eSIM Partnerprogramm Bei",
    tr: "KudoSIM Business - Küresel eSIM İş Ortaklığı Programımıza Katılın",
    pl: "KudoSIM Business - Dołącz do Naszego Globalnego Programu Partnerskiego eSIM"
  };

  const seoDescriptions = {
    en: "Join KudoSIM's travel partner program and earn up to 15% commission on every eSIM sale. Boost your income while helping travelers stay connected worldwide with our mobile connectivity partnership.",
    sq: "Bashkohuni me programin e partneritetit të udhëtimit të KudoSIM dhe fitoni deri në 15% komision për çdo shitje eSIM. Rritni të ardhurat tuaja ndërsa ndihmoni udhëtarët të qëndrojnë të lidhur në mbarë botën me partneritetin tonë të lidhjes mobile.",
    fr: "Rejoignez le programme partenaire voyage de KudoSIM et gagnez jusqu'à 15% de commission sur chaque vente eSIM. Augmentez vos revenus tout en aidant les voyageurs à rester connectés dans le monde entier grâce à notre partenariat de connectivité mobile.",
    de: "Treten Sie dem Reise-Partnerprogramm von KudoSIM bei und verdienen Sie bis zu 15% Provision für jeden eSIM-Verkauf. Steigern Sie Ihr Einkommen, während Sie Reisenden helfen, mit unserer mobilen Konnektivitätspartnerschaft weltweit verbunden zu bleiben.",
    tr: "KudoSIM'in seyahat ortaklık programına katılın ve her eSIM satışında %15'e kadar komisyon kazanın. Mobil bağlantı ortaklığımızla gezginlerin dünya çapında bağlantıda kalmalarına yardımcı olurken gelirinizi artırın.",
    pl: "Dołącz do programu partnerskiego KudoSIM i zarabiaj do 15% prowizji od każdej sprzedaży eSIM. Zwiększ swoje dochody, pomagając podróżnym pozostać w kontakcie na całym świecie dzięki naszemu partnerstwu w zakresie łączności mobilnej."
  };

  return (
    <>
      <SEO 
        title={seoTitles[i18n.language] || seoTitles.en}
        description={seoDescriptions[i18n.language] || seoDescriptions.en}
        schema={businessSchema}
      />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-gradient-to-b from-[#690d89]/10 to-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="block">
                  {i18n.language === 'en' ? "Welcome to" : 
                   i18n.language === 'sq' ? "Mirë se vini në" :
                   i18n.language === 'fr' ? "Bienvenue sur" :
                   i18n.language === 'de' ? "Willkommen bei" :
                   i18n.language === 'tr' ? "Hoş Geldiniz" :
                   i18n.language === 'pl' ? "Witamy w" :
                   "Welcome to"}
                </span>
                <span className="text-[#690d89]">
                  {i18n.language === 'en' ? "KudoPartners!" : 
                   i18n.language === 'sq' ? "KudoPartners!" :
                   i18n.language === 'fr' ? "KudoPartners!" :
                   i18n.language === 'de' ? "KudoPartners!" :
                   i18n.language === 'tr' ? "KudoPartners!" :
                   i18n.language === 'pl' ? "KudoPartners!" :
                   "KudoPartners!"}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {i18n.language === 'en' ? "Join the most rewarding travel partner program with up to 15% commission on every eSIM sale" : 
                 i18n.language === 'sq' ? "Bashkohuni me programin më shpërblyes të partneritetit të udhëtimit me deri në 15% komision për çdo shitje eSIM" :
                 i18n.language === 'fr' ? "Rejoignez le programme partenaire voyage le plus gratifiant avec jusqu'à 15% de commission sur chaque vente eSIM" :
                 i18n.language === 'de' ? "Treten Sie dem lukrativsten Reise-Partnerprogramm mit bis zu 15% Provision für jeden eSIM-Verkauf bei" :
                 i18n.language === 'tr' ? "Her eSIM satışında %15'e kadar komisyonla en ödüllendirici seyahat ortaklık programına katılın" :
                 i18n.language === 'pl' ? "Dołącz do najbardziej opłacalnego programu partnerskiego z prowizją do 15% od każdej sprzedaży eSIM" :
                 "Join the most rewarding travel partner program with up to 15% commission on every eSIM sale"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#join-now" 
                  className="px-6 py-3 bg-[#690d89] text-white rounded-lg font-medium hover:bg-[#8B5CF6] transition-colors duration-300 text-center"
                >
                  {i18n.language === 'en' ? "Join Now" : 
                   i18n.language === 'sq' ? "Bashkohu Tani" :
                   i18n.language === 'fr' ? "Rejoindre Maintenant" :
                   i18n.language === 'de' ? "Jetzt Beitreten" :
                   i18n.language === 'tr' ? "Şimdi Katılın" :
                   i18n.language === 'pl' ? "Dołącz Teraz" :
                   "Join Now"}
                </a>
                <a 
                  href="#learn-more" 
                  className="px-6 py-3 bg-white text-[#690d89] border border-[#690d89] rounded-lg font-medium hover:bg-[#690d89]/5 transition-colors duration-300 text-center"
                >
                  {i18n.language === 'en' ? "Learn More" : 
                   i18n.language === 'sq' ? "Mëso më Shumë" :
                   i18n.language === 'fr' ? "En Savoir Plus" :
                   i18n.language === 'de' ? "Mehr Erfahren" :
                   i18n.language === 'tr' ? "Daha Fazla Bilgi" :
                   i18n.language === 'pl' ? "Dowiedz Się Więcej" :
                   "Learn More"}
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#690d89]/10 rounded-3xl blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Business partners" 
                className="relative rounded-3xl shadow-xl w-full"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Benefits Section */}
      <div className="py-20" id="learn-more">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">
              {i18n.language === 'en' ? "Why Join Our eSIM Affiliate Program?" : 
               i18n.language === 'sq' ? "Pse të Bashkoheni me Programin Tonë të Partneritetit eSIM?" :
               i18n.language === 'fr' ? "Pourquoi Rejoindre Notre Programme d'Affiliation eSIM ?" :
               i18n.language === 'de' ? "Warum Unserem eSIM Partnerprogramm Beitreten?" :
               i18n.language === 'tr' ? "Neden eSIM İş Ortaklığı Programımıza Katılmalısınız?" :
               i18n.language === 'pl' ? "Dlaczego Dołączyć do Naszego Programu Partnerskiego eSIM?" :
               "Why Join Our eSIM Affiliate Program?"}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'en' ? "Discover the benefits of our mobile connectivity partnership program" : 
               i18n.language === 'sq' ? "Zbuloni përfitimet e programit tonë të partneritetit të lidhjes mobile" :
               i18n.language === 'fr' ? "Découvrez les avantages de notre programme de partenariat de connectivité mobile" :
               i18n.language === 'de' ? "Entdecken Sie die Vorteile unseres mobilen Konnektivitätspartnerschaftsprogramms" :
               i18n.language === 'tr' ? "Mobil bağlantı ortaklık programımızın avantajlarını keşfedin" :
               i18n.language === 'pl' ? "Odkryj korzyści z naszego programu partnerskiego łączności mobilnej" :
               "Discover the benefits of our mobile connectivity partnership program"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title={i18n.language === 'en' ? "Generous Commissions" : 
                     i18n.language === 'sq' ? "Komisione Bujare" :
                     i18n.language === 'fr' ? "Commissions Généreuses" :
                     i18n.language === 'de' ? "Großzügige Provisionen" :
                     i18n.language === 'tr' ? "Cömert Komisyonlar" :
                     i18n.language === 'pl' ? "Hojne Prowizje" :
                     "Generous Commissions"}
              description={i18n.language === 'en' ? "Earn up to 15% commission on every eSIM sale. The more you sell, the higher your commission tier becomes!" : 
                          i18n.language === 'sq' ? "Fitoni deri në 15% komision për çdo shitje eSIM. Sa më shumë të shisni, aq më i lartë bëhet niveli juaj i komisionit!" :
                          i18n.language === 'fr' ? "Gagnez jusqu'à 15% de commission sur chaque vente eSIM. Plus vous vendez, plus votre niveau de commission augmente !" :
                          i18n.language === 'de' ? "Verdienen Sie bis zu 15% Provision für jeden eSIM-Verkauf. Je mehr Sie verkaufen, desto höher wird Ihre Provisionsstufe!" :
                          i18n.language === 'tr' ? "Her eSIM satışında %15'e kadar komisyon kazanın. Ne kadar çok satarsanız, komisyon seviyeniz o kadar yükselir!" :
                          i18n.language === 'pl' ? "Zarabiaj do 15% prowizji od każdej sprzedaży eSIM. Im więcej sprzedajesz, tym wyższy staje się Twój poziom prowizji!" :
                          "Earn up to 15% commission on every eSIM sale. The more you sell, the higher your commission tier becomes!"}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard 
              title={i18n.language === 'en' ? "Quick Setup" : 
                     i18n.language === 'sq' ? "Konfigurim i Shpejtë" :
                     i18n.language === 'fr' ? "Configuration Rapide" :
                     i18n.language === 'de' ? "Schnelle Einrichtung" :
                     i18n.language === 'tr' ? "Hızlı Kurulum" :
                     i18n.language === 'pl' ? "Szybka Konfiguracja" :
                     "Quick Setup"}
              description={i18n.language === 'en' ? "Get started in minutes with our easy-to-use travel partner platform. No technical knowledge required!" : 
                          i18n.language === 'sq' ? "Filloni në minuta me platformën tonë të lehtë për t'u përdorur për partnerë udhëtimi. Nuk kërkohen njohuri teknike!" :
                          i18n.language === 'fr' ? "Commencez en quelques minutes avec notre plateforme partenaire voyage facile à utiliser. Aucune connaissance technique requise !" :
                          i18n.language === 'de' ? "Starten Sie in wenigen Minuten mit unserer benutzerfreundlichen Reisepartner-Plattform. Keine technischen Kenntnisse erforderlich!" :
                          i18n.language === 'tr' ? "Kullanımı kolay seyahat ortağı platformumuzla dakikalar içinde başlayın. Teknik bilgi gerekmez!" :
                          i18n.language === 'pl' ? "Rozpocznij w kilka minut dzięki naszej łatwej w użyciu platformie dla partnerów podróży. Nie jest wymagana wiedza techniczna!" :
                          "Get started in minutes with our easy-to-use travel partner platform. No technical knowledge required!"}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <FeatureCard 
              title={i18n.language === 'en' ? "24/7 Support" : 
                     i18n.language === 'sq' ? "Mbështetje 24/7" :
                     i18n.language === 'fr' ? "Support 24/7" :
                     i18n.language === 'de' ? "24/7 Support" :
                     i18n.language === 'tr' ? "7/24 Destek" :
                     i18n.language === 'pl' ? "Wsparcie 24/7" :
                     "24/7 Support"}
              description={i18n.language === 'en' ? "Our dedicated mobile connectivity partnership team is always here to help you succeed." : 
                          i18n.language === 'sq' ? "Ekipi ynë i dedikuar i partneritetit të lidhjes mobile është gjithmonë këtu për t'ju ndihmuar të keni sukses." :
                          i18n.language === 'fr' ? "Notre équipe dédiée au partenariat de connectivité mobile est toujours là pour vous aider à réussir." :
                          i18n.language === 'de' ? "Unser engagiertes Team für mobile Konnektivitätspartnerschaften ist immer für Sie da, um Ihnen zum Erfolg zu verhelfen." :
                          i18n.language === 'tr' ? "Özel mobil bağlantı ortaklığı ekibimiz, başarılı olmanıza yardımcı olmak için her zaman burada." :
                          i18n.language === 'pl' ? "Nasz dedykowany zespół ds. partnerstwa w zakresie łączności mobilnej jest zawsze gotowy pomóc Ci odnieść sukces." :
                          "Our dedicated mobile connectivity partnership team is always here to help you succeed."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
          </div>
        </Container>
      </div>

      {/* Rewards Section */}
      <div className="py-20 bg-gray-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">
              {i18n.language === 'en' ? "Exclusive Benefits for Travel Partners" : 
               i18n.language === 'sq' ? "Përfitime Ekskluzive për Partnerët e Udhëtimit" :
               i18n.language === 'fr' ? "Avantages Exclusifs pour les Partenaires de Voyage" :
               i18n.language === 'de' ? "Exklusive Vorteile für Reisepartner" :
               i18n.language === 'tr' ? "Seyahat Ortakları için Özel Avantajlar" :
               i18n.language === 'pl' ? "Ekskluzywne Korzyści dla Partnerów Podróży" :
               "Exclusive Benefits for Travel Partners"}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'en' ? "Enjoy special rewards and incentives as a KudoSIM affiliate partner" : 
               i18n.language === 'sq' ? "Shijoni shpërblime dhe stimuj të veçantë si partner i afiluar i KudoSIM" :
               i18n.language === 'fr' ? "Profitez de récompenses et d'incitations spéciales en tant que partenaire affilié KudoSIM" :
               i18n.language === 'de' ? "Genießen Sie besondere Belohnungen und Anreize als KudoSIM-Affiliate-Partner" :
               i18n.language === 'tr' ? "KudoSIM iş ortağı olarak özel ödüller ve teşviklerden yararlanın" :
               i18n.language === 'pl' ? "Korzystaj ze specjalnych nagród i zachęt jako partner afiliacyjny KudoSIM" :
               "Enjoy special rewards and incentives as a KudoSIM affiliate partner"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title={i18n.language === 'en' ? "Free Flights" : 
                     i18n.language === 'sq' ? "Fluturime Falas" :
                     i18n.language === 'fr' ? "Vols Gratuits" :
                     i18n.language === 'de' ? "Kostenlose Flüge" :
                     i18n.language === 'tr' ? "Ücretsiz Uçuşlar" :
                     i18n.language === 'pl' ? "Darmowe Loty" :
                     "Free Flights"}
              description={i18n.language === 'en' ? "Score free flights and other cool travel perks as you hit sales milestones in our eSIM affiliate program." : 
                          i18n.language === 'sq' ? "Fitoni fluturime falas dhe përfitime të tjera të bukura udhëtimi ndërsa arrini objektivat e shitjeve në programin tonë të afiluar eSIM." :
                          i18n.language === 'fr' ? "Gagnez des vols gratuits et d'autres avantages de voyage intéressants en atteignant les objectifs de vente dans notre programme d'affiliation eSIM." :
                          i18n.language === 'de' ? "Erhalten Sie kostenlose Flüge und andere tolle Reisevorteile, wenn Sie Verkaufsmeilensteine in unserem eSIM-Partnerprogramm erreichen." :
                          i18n.language === 'tr' ? "eSIM iş ortaklığı programımızda satış hedeflerine ulaştıkça ücretsiz uçuşlar ve diğer harika seyahat avantajları kazanın." :
                          i18n.language === 'pl' ? "Zdobądź darmowe loty i inne atrakcyjne korzyści podróżne, osiągając kamienie milowe sprzedaży w naszym programie partnerskim eSIM." :
                          "Score free flights and other cool travel perks as you hit sales milestones in our eSIM affiliate program."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              }
            />
            <FeatureCard 
              title={i18n.language === 'en' ? "Exclusive Events" : 
                     i18n.language === 'sq' ? "Evente Ekskluzive" :
                     i18n.language === 'fr' ? "Événements Exclusifs" :
                     i18n.language === 'de' ? "Exklusive Events" :
                     i18n.language === 'tr' ? "Özel Etkinlikler" :
                     i18n.language === 'pl' ? "Ekskluzywne Wydarzenia" :
                     "Exclusive Events"}
              description={i18n.language === 'en' ? "Get invited to exclusive travel industry events and network with fellow mobile connectivity partners." : 
                          i18n.language === 'sq' ? "Merrni ftesa për evente ekskluzive të industrisë së udhëtimit dhe rrjetëzohuni me partnerët e tjerë të lidhjes mobile." :
                          i18n.language === 'fr' ? "Soyez invité à des événements exclusifs de l'industrie du voyage et réseautez avec d'autres partenaires de connectivité mobile." :
                          i18n.language === 'de' ? "Werden Sie zu exklusiven Veranstaltungen der Reisebranche eingeladen und vernetzen Sie sich mit anderen Partnern für mobile Konnektivität." :
                          i18n.language === 'tr' ? "Özel seyahat endüstrisi etkinliklerine davet edilin ve diğer mobil bağlantı ortaklarıyla ağ kurun." :
                          i18n.language === 'pl' ? "Otrzymuj zaproszenia na ekskluzywne wydarzenia branży turystycznej i nawiązuj kontakty z innymi partnerami w zakresie łączności mobilnej." :
                          "Get invited to exclusive travel industry events and network with fellow mobile connectivity partners."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <FeatureCard 
              title={i18n.language === 'en' ? "First Access" : 
                     i18n.language === 'sq' ? "Qasje e Parë" :
                     i18n.language === 'fr' ? "Premier Accès" :
                     i18n.language === 'de' ? "Erster Zugriff" :
                     i18n.language === 'tr' ? "İlk Erişim" :
                     i18n.language === 'pl' ? "Pierwszy Dostęp" :
                     "First Access"}
              description={i18n.language === 'en' ? "Be the first to try new eSIM products and travel connectivity features before they're available to the public." : 
                          i18n.language === 'sq' ? "Jini i pari që provoni produkte të reja eSIM dhe veçori të lidhjes së udhëtimit përpara se të jenë të disponueshme për publikun." :
                          i18n.language === 'fr' ? "Soyez le premier à essayer les nouveaux produits eSIM et les fonctionnalités de connectivité de voyage avant qu'ils ne soient disponibles pour le public." :
                          i18n.language === 'de' ? "Seien Sie der Erste, der neue eSIM-Produkte und Reisekonnektivitätsfunktionen testet, bevor sie der Öffentlichkeit zur Verfügung stehen." :
                          i18n.language === 'tr' ? "Halka açılmadan önce yeni eSIM ürünlerini ve seyahat bağlantı özelliklerini ilk deneyen siz olun." :
                          i18n.language === 'pl' ? "Bądź pierwszym, który wypróbuje nowe produkty eSIM i funkcje łączności podróżnej, zanim zostaną udostępnione publicznie." :
                          "Be the first to try new eSIM products and travel connectivity features before they're available to the public."}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />
          </div>
        </Container>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">
              {i18n.language === 'en' ? "Frequently Asked Questions" : 
               i18n.language === 'sq' ? "Pyetjet më të Shpeshta" :
               i18n.language === 'fr' ? "Questions Fréquemment Posées" :
               i18n.language === 'de' ? "Häufig Gestellte Fragen" :
               i18n.language === 'tr' ? "Sıkça Sorulan Sorular" :
               i18n.language === 'pl' ? "Często Zadawane Pytania" :
               "Frequently Asked Questions"}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'en' ? "Everything you need to know about our eSIM affiliate program" : 
               i18n.language === 'sq' ? "Gjithçka që duhet të dini për programin tonë të afiluar eSIM" :
               i18n.language === 'fr' ? "Tout ce que vous devez savoir sur notre programme d'affiliation eSIM" :
               i18n.language === 'de' ? "Alles, was Sie über unser eSIM-Partnerprogramm wissen müssen" :
               i18n.language === 'tr' ? "eSIM iş ortaklığı programımız hakkında bilmeniz gereken her şey" :
               i18n.language === 'pl' ? "Wszystko, co musisz wiedzieć o naszym programie partnerskim eSIM" :
               "Everything you need to know about our eSIM affiliate program"}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {i18n.language === 'en' ? "Who can become a KudoPartner?" : 
                 i18n.language === 'sq' ? "Kush mund të bëhet KudoPartner?" :
                 i18n.language === 'fr' ? "Qui peut devenir KudoPartner ?" :
                 i18n.language === 'de' ? "Wer kann KudoPartner werden?" :
                 i18n.language === 'tr' ? "Kimler KudoPartner olabilir?" :
                 i18n.language === 'pl' ? "Kto może zostać KudoPartnerem?" :
                 "Who can become a KudoPartner?"}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' ? "Any business or individual with an audience interested in travel can join our mobile connectivity partnership. This includes travel bloggers, agencies, content creators, tour operators, hotels, and more." : 
                 i18n.language === 'sq' ? "Çdo biznes ose individ me një audiencë të interesuar për udhëtime mund të bashkohet me partneritetin tonë të lidhjes mobile. Kjo përfshin blogerët e udhëtimit, agjencitë, krijuesit e përmbajtjes, operatorët turistikë, hotelet dhe më shumë." :
                 i18n.language === 'fr' ? "Toute entreprise ou individu ayant une audience intéressée par le voyage peut rejoindre notre partenariat de connectivité mobile. Cela inclut les blogueurs voyage, les agences, les créateurs de contenu, les voyagistes, les hôtels et plus encore." :
                 i18n.language === 'de' ? "Jedes Unternehmen oder jede Person mit einem reiseinteressierten Publikum kann unserer mobilen Konnektivitätspartnerschaft beitreten. Dazu gehören Reiseblogger, Agenturen, Content Creator, Reiseveranstalter, Hotels und mehr." :
                 i18n.language === 'tr' ? "Seyahatle ilgilenen bir kitleye sahip herhangi bir işletme veya birey mobil bağlantı ortaklığımıza katılabilir. Buna seyahat bloggerları, acenteler, içerik oluşturucular, tur operatörleri, oteller ve daha fazlası dahildir." :
                 i18n.language === 'pl' ? "Każda firma lub osoba posiadająca odbiorców zainteresowanych podróżami może dołączyć do naszego partnerstwa w zakresie łączności mobilnej. Dotyczy to blogerów podróżniczych, agencji, twórców treści, operatorów wycieczek, hoteli i innych." :
                 "Any business or individual with an audience interested in travel can join our mobile connectivity partnership. This includes travel bloggers, agencies, content creators, tour operators, hotels, and more."}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {i18n.language === 'en' ? "How do I get paid?" : 
                 i18n.language === 'sq' ? "Si paguhem?" :
                 i18n.language === 'fr' ? "Comment suis-je payé ?" :
                 i18n.language === 'de' ? "Wie werde ich bezahlt?" :
                 i18n.language === 'tr' ? "Nasıl ödeme alırım?" :
                 i18n.language === 'pl' ? "Jak otrzymam płatność?" :
                 "How do I get paid?"}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' ? "We process payments monthly via PayPal or bank transfer. As a travel partner, you'll earn commission for every successful eSIM referral that results in a purchase." : 
                 i18n.language === 'sq' ? "Ne përpunojmë pagesat çdo muaj përmes PayPal ose transfertë bankare. Si partner udhëtimi, do të fitoni komision për çdo referim të suksesshëm eSIM që rezulton në një blerje." :
                 i18n.language === 'fr' ? "Nous traitons les paiements mensuellement via PayPal ou virement bancaire. En tant que partenaire de voyage, vous gagnerez une commission pour chaque parrainage eSIM réussi qui aboutit à un achat." :
                 i18n.language === 'de' ? "Wir verarbeiten Zahlungen monatlich per PayPal oder Banküberweisung. Als Reisepartner erhalten Sie eine Provision für jede erfolgreiche eSIM-Empfehlung, die zu einem Kauf führt." :
                 i18n.language === 'tr' ? "Ödemeleri aylık olarak PayPal veya banka havalesi yoluyla işleme koyarız. Bir seyahat ortağı olarak, satın almayla sonuçlanan her başarılı eSIM yönlendirmesi için komisyon kazanacaksınız." :
                 i18n.language === 'pl' ? "Przetwarzamy płatności miesięcznie za pośrednictwem PayPal lub przelewu bankowego. Jako partner podróży, zarobisz prowizję za każde udane polecenie eSIM, które zakończy się zakupem." :
                 "We process payments monthly via PayPal or bank transfer. As a travel partner, you'll earn commission for every successful eSIM referral that results in a purchase."}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {i18n.language === 'en' ? "What's the commission structure?" : 
                 i18n.language === 'sq' ? "Cila është struktura e komisionit?" :
                 i18n.language === 'fr' ? "Quelle est la structure des commissions ?" :
                 i18n.language === 'de' ? "Wie ist die Provisionsstruktur?" :
                 i18n.language === 'tr' ? "Komisyon yapısı nedir?" :
                 i18n.language === 'pl' ? "Jaka jest struktura prowizji?" :
                 "What's the commission structure?"}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' ? "Start earning 5% commission and increase up to 15% based on your eSIM sales performance. The more you sell through our travel partner program, the higher your commission tier becomes!" : 
                 i18n.language === 'sq' ? "Filloni të fitoni 5% komision dhe rriteni deri në 15% bazuar në performancën tuaj të shitjeve eSIM. Sa më shumë të shisni përmes programit tonë të partnerëve të udhëtimit, aq më i lartë bëhet niveli juaj i komisionit!" :
                 i18n.language === 'fr' ? "Commencez à gagner 5% de commission et augmentez jusqu'à 15% selon vos performances de vente eSIM. Plus vous vendez via notre programme de partenaires de voyage, plus votre niveau de commission augmente !" :
                 i18n.language === 'de' ? "Beginnen Sie mit 5% Provision und steigern Sie diese auf bis zu 15% basierend auf Ihrer eSIM-Verkaufsleistung. Je mehr Sie über unser Reisepartner-Programm verkaufen, desto höher wird Ihre Provisionsstufe!" :
                 i18n.language === 'tr' ? "eSIM satış performansınıza göre %5 komisyon kazanmaya başlayın ve %15'e kadar artırın. Seyahat ortağı programımız aracılığıyla ne kadar çok satarsanız, komisyon seviyeniz o kadar yükselir!" :
                 i18n.language === 'pl' ? "Zacznij zarabiać 5% prowizji i zwiększ ją do 15% w zależności od wyników sprzedaży eSIM. Im więcej sprzedajesz za pośrednictwem naszego programu partnerskiego dla podróżnych, tym wyższy staje się Twój poziom prowizji!" :
                 "Start earning 5% commission and increase up to 15% based on your eSIM sales performance. The more you sell through our travel partner program, the higher your commission tier becomes!"}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {i18n.language === 'en' ? "How do I track my earnings?" : 
                 i18n.language === 'sq' ? "Si i gjurmoj fitimet e mia?" :
                 i18n.language === 'fr' ? "Comment suivre mes gains ?" :
                 i18n.language === 'de' ? "Wie verfolge ich meine Einnahmen?" :
                 i18n.language === 'tr' ? "Kazançlarımı nasıl takip ederim?" :
                 i18n.language === 'pl' ? "Jak śledzić moje zarobki?" :
                 "How do I track my earnings?"}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' ? "You'll get access to a comprehensive mobile connectivity partnership dashboard where you can track clicks, conversions, and earnings in real-time." : 
                 i18n.language === 'sq' ? "Do të keni qasje në një panel të plotë të partneritetit të lidhjes mobile ku mund të gjurmoni klikime, konvertime dhe fitime në kohë reale." :
                 i18n.language === 'fr' ? "Vous aurez accès à un tableau de bord complet de partenariat de connectivité mobile où vous pourrez suivre les clics, les conversions et les gains en temps réel." :
                 i18n.language === 'de' ? "Sie erhalten Zugriff auf ein umfassendes Dashboard für mobile Konnektivitätspartnerschaften, in dem Sie Klicks, Konversionen und Einnahmen in Echtzeit verfolgen können." :
                 i18n.language === 'tr' ? "Tıklamaları, dönüşümleri ve kazançları gerçek zamanlı olarak takip edebileceğiniz kapsamlı bir mobil bağlantı ortaklığı gösterge paneline erişim elde edeceksiniz." :
                 i18n.language === 'pl' ? "Otrzymasz dostęp do kompleksowego panelu partnerskiego łączności mobilnej, gdzie możesz śledzić kliknięcia, konwersje i zarobki w czasie rzeczywistym." :
                 "You'll get access to a comprehensive mobile connectivity partnership dashboard where you can track clicks, conversions, and earnings in real-time."}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-[#690d89]/5">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
              title={i18n.language === 'en' ? "eSIM Since" : 
                     i18n.language === 'sq' ? "eSIM që nga" :
                     i18n.language === 'fr' ? "eSIM Depuis" :
                     i18n.language === 'de' ? "eSIM seit" :
                     i18n.language === 'tr' ? "eSIM Başlangıcı" :
                     i18n.language === 'pl' ? "eSIM Od" :
                     "eSIM Since"}
              value="2018"
              description={i18n.language === 'en' ? "Pioneer in eSIM technology" : 
                          i18n.language === 'sq' ? "Pionier në teknologjinë eSIM" :
                          i18n.language === 'fr' ? "Pionnier en technologie eSIM" :
                          i18n.language === 'de' ? "Pionier in der eSIM-Technologie" :
                          i18n.language === 'tr' ? "eSIM teknolojisinde öncü" :
                          i18n.language === 'pl' ? "Pionier w technologii eSIM" :
                          "Pioneer in eSIM technology"}
            />
            <StatCard 
              title={i18n.language === 'en' ? "Connections" : 
                     i18n.language === 'sq' ? "Lidhje" :
                     i18n.language === 'fr' ? "Connexions" :
                     i18n.language === 'de' ? "Verbindungen" :
                     i18n.language === 'tr' ? "Bağlantılar" :
                     i18n.language === 'pl' ? "Połączenia" :
                     "Connections"}
              value="1M+"
              description={i18n.language === 'en' ? "Active eSIM connections worldwide" : 
                          i18n.language === 'sq' ? "Lidhje aktive eSIM në mbarë botën" :
                          i18n.language === 'fr' ? "Connexions eSIM actives dans le monde" :
                          i18n.language === 'de' ? "Aktive eSIM-Verbindungen weltweit" :
                          i18n.language === 'tr' ? "Dünya çapında aktif eSIM bağlantıları" :
                          i18n.language === 'pl' ? "Aktywne połączenia eSIM na całym świecie" :
                          "Active eSIM connections worldwide"}
            />
            <StatCard 
              title={i18n.language === 'en' ? "Service Provider" : 
                     i18n.language === 'sq' ? "Ofrues Shërbimi" :
                     i18n.language === 'fr' ? "Fournisseur de Service" :
                     i18n.language === 'de' ? "Dienstleister" :
                     i18n.language === 'tr' ? "Servis Sağlayıcı" :
                     i18n.language === 'pl' ? "Dostawca Usług" :
                     "Service Provider"}
              value={i18n.language === 'en' ? "Global" : 
                     i18n.language === 'sq' ? "Global" :
                     i18n.language === 'fr' ? "Global" :
                     i18n.language === 'de' ? "Global" :
                     i18n.language === 'tr' ? "Küresel" :
                     i18n.language === 'pl' ? "Globalny" :
                     "Global"}
              description={i18n.language === 'en' ? "Trusted by travel businesses worldwide" : 
                          i18n.language === 'sq' ? "I besuar nga bizneset e udhëtimit në mbarë botën" :
                          i18n.language === 'fr' ? "Approuvé par les entreprises de voyage du monde entier" :
                          i18n.language === 'de' ? "Vertrauenswürdig für Reiseunternehmen weltweit" :
                          i18n.language === 'tr' ? "Dünya çapında seyahat işletmeleri tarafından güvenilen" :
                          i18n.language === 'pl' ? "Zaufany przez firmy turystyczne na całym świecie" :
                          "Trusted by travel businesses worldwide"}
            />
            <StatCard 
              title={i18n.language === 'en' ? "Certified" : 
                     i18n.language === 'sq' ? "Certifikuar" :
                     i18n.language === 'fr' ? "Certifié" :
                     i18n.language === 'de' ? "Zertifiziert" :
                     i18n.language === 'tr' ? "Sertifikalı" :
                     i18n.language === 'pl' ? "Certyfikowany" :
                     "Certified"}
              value="GSMA"
              description={i18n.language === 'en' ? "Industry standard compliance" : 
                          i18n.language === 'sq' ? "Përputhshmëri me standardet e industrisë" :
                          i18n.language === 'fr' ? "Conformité aux normes de l'industrie" :
                          i18n.language === 'de' ? "Einhaltung der Branchenstandards" :
                          i18n.language === 'tr' ? "Endüstri standardı uyumluluğu" :
                          i18n.language === 'pl' ? "Zgodność ze standardami branżowymi" :
                          "Industry standard compliance"}
            />
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-20" id="join-now">
        <Container>
          <div className="bg-[#690d89] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {i18n.language === 'en' ? "Ready to join our eSIM affiliate program?" : 
               i18n.language === 'sq' ? "Gati për t'u bashkuar me programin tonë të afiluar eSIM?" :
               i18n.language === 'fr' ? "Prêt à rejoindre notre programme d'affiliation eSIM ?" :
               i18n.language === 'de' ? "Bereit, unserem eSIM-Partnerprogramm beizutreten?" :
               i18n.language === 'tr' ? "eSIM iş ortaklığı programımıza katılmaya hazır mısınız?" :
               i18n.language === 'pl' ? "Gotowy, aby dołączyć do naszego programu partnerskiego eSIM?" :
               "Ready to join our eSIM affiliate program?"}
            </h2>
            <a 
              href="#" 
              className="inline-block px-8 py-4 bg-white text-[#690d89] rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              {i18n.language === 'en' ? "Become a Travel Partner Today" : 
               i18n.language === 'sq' ? "Bëhuni Partner Udhëtimi Sot" :
               i18n.language === 'fr' ? "Devenez Partenaire de Voyage Aujourd'hui" :
               i18n.language === 'de' ? "Werden Sie noch heute Reisepartner" :
               i18n.language === 'tr' ? "Bugün Seyahat Ortağı Olun" :
               i18n.language === 'pl' ? "Zostań Partnerem Podróży Już Dziś" :
               "Become a Travel Partner Today"}
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}