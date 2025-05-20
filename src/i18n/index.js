import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import Cookies from 'js-cookie';

// Import static translations for core UI elements
import enCommon from './locales/en/common.json';
import sqCommon from './locales/sq/common.json';
import frCommon from './locales/fr/common.json';
import deCommon from './locales/de/common.json';
import trCommon from './locales/tr/common.json';

// Import feature translations
import enFeatures from './locales/en/features.json';
import sqFeatures from './locales/sq/features.json';
import frFeatures from './locales/fr/features.json';
import deFeatures from './locales/de/features.json';
import trFeatures from './locales/tr/features.json';
import hrFeatures from './locales/hr/features.json';
import mkFeatures from './locales/mk/features.json';

// Import component translations
import enComponents from './locales/en/components.json';
import sqComponents from './locales/sq/components.json';
import frComponents from './locales/fr/components.json';
import deComponents from './locales/de/components.json';
import trComponents from './locales/tr/components.json';

// Import balance translations
import enBalance from './locales/en/balance.json';
import deBalance from './locales/de/balance.json';
import frBalance from './locales/fr/balance.json';
import sqBalance from './locales/sq/balance.json';
import trBalance from './locales/tr/balance.json';

// Import popup translations
import enPopup from './locales/en/popup.json';
import dePopup from './locales/de/popup.json';
import frPopup from './locales/fr/popup.json';
import sqPopup from './locales/sq/popup.json';
import trPopup from './locales/tr/popup.json';

// Import conversion translations
import enConversion from './locales/en/conversion.json';
import deConversion from './locales/de/conversion.json';
import frConversion from './locales/fr/conversion.json';
import sqConversion from './locales/sq/conversion.json';
import trConversion from './locales/tr/conversion.json';

// Import device checker translations
import enDeviceChecker from './locales/en/device_checker.json';
import deDeviceChecker from './locales/de/device_checker.json';
import frDeviceChecker from './locales/fr/device_checker.json';
import sqDeviceChecker from './locales/sq/device_checker.json';
import trDeviceChecker from './locales/tr/device_checker.json';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        features: enFeatures,
        components: enComponents,
        balance: enBalance,
        popup: enPopup,
        conversion: enConversion,
        device_checker: enDeviceChecker,
        support: {
          "24h.title": "24-hour Live Chat and Email Support",
          "24h.description": "Get instant help from our expert support team, available 24/7 to assist you with any questions or concerns.",
          "24h.button": "Contact support",
          "guarantee.title": "Industry-first Money Back Guarantee",
          "guarantee.description": "Try our service with confidence. If you're not satisfied, we'll refund your purchase - no questions asked.",
          "guarantee.button": "Shop eSIM data"
        },
        app: {
          "download.title": "Shop on the web or use the KudoSIM app",
          "download.description": "Download SIM cards for 200+ countries worldwide, and instantly enjoy reliable, prepaid mobile data. No contracts, no hidden fees, and no roaming charges.",
          "store.ios": "Download on the App Store",
          "store.android": "Get it on Google Play"
        },
        package: {
          "valid.for": "Valid for",
          "days": "days",
          "hotspot": "Hotspot",
          "allowed": "Allowed",
          "speed": "Speed",
          "no.limit": "No Limit",
          "european.coverage": "European Coverage",
          "balkan.coverage": "Balkan Coverage",
          "other.coverage": "Other Coverage",
          "get.started": "Get Started",
          "most.popular": "Most Popular",
          "best.value": "Best Value",
          "checkout.url": "Checkout URL"
        }
      },
      sq: {
        common: sqCommon,
        features: sqFeatures,
        components: sqComponents,
        balance: sqBalance,
        popup: sqPopup,
        conversion: sqConversion,
        device_checker: sqDeviceChecker,
        support: {
          "24h.title": "Chat dhe Email Mbështetje 24-orë",
          "24h.description": "Merrni ndihmë të menjëhershme nga ekipi ynë ekspert i mbështetjes, i disponueshëm 24/7 për t'ju ndihmuar me çdo pyetje ose shqetësim.",
          "24h.button": "Kontakto mbështetjen",
          "guarantee.title": "Garanci Kthimi Parash e Para në Industri",
          "guarantee.description": "Provoni shërbimin tonë me besim. Nëse nuk jeni të kënaqur, do t'ju kthejmë paratë - pa pyetje.",
          "guarantee.button": "Blej të dhëna eSIM"
        },
        app: {
          "download.title": "Blini në web ose përdorni aplikacionin KudoSIM",
          "download.description": "Shkarkoni karta SIM për më shumë se 200 vende në mbarë botën dhe gëzoni menjëherë të dhëna mobile të besueshme të parapaguara. Pa kontrata, pa tarifa të fshehura dhe pa tarifa roaming.",
          "store.ios": "Shkarkoni në App Store",
          "store.android": "Merreni në Google Play"
        },
        package: {
          "valid.for": "E vlefshme për",
          "days": "ditë",
          "hotspot": "Hotspot",
          "allowed": "I lejuar",
          "speed": "Shpejtësia",
          "no.limit": "Pa Limit",
          "european.coverage": "Mbulimi Evropian",
          "balkan.coverage": "Mbulimi i Ballkanit",
          "other.coverage": "Mbulim Tjetër",
          "get.started": "Fillo Tani",
          "most.popular": "Më i Popullarizuar",
          "best.value": "Vlera më e Mirë",
          "checkout.url": "URL e Pagesës"
        }
      },
      fr: {
        common: frCommon,
        features: frFeatures,
        components: frComponents,
        balance: frBalance,
        popup: frPopup,
        conversion: frConversion,
        device_checker: frDeviceChecker,
        support: {
          "24h.title": "Support Chat et Email 24h/24",
          "24h.description": "Obtenez une aide instantanée de notre équipe de support expert, disponible 24h/24 et 7j/7 pour vous aider avec toutes vos questions ou préoccupations.",
          "24h.button": "Contacter le support",
          "guarantee.title": "Garantie de Remboursement Unique dans l'Industrie",
          "guarantee.description": "Essayez notre service en toute confiance. Si vous n'êtes pas satisfait, nous vous remboursons votre achat - sans poser de questions.",
          "guarantee.button": "Acheter des données eSIM"
        },
        app: {
          "download.title": "Achetez sur le web ou utilisez l'application KudoSIM",
          "download.description": "Téléchargez des cartes SIM pour plus de 200 pays dans le monde et profitez instantanément de données mobiles prépayées fiables. Pas de contrats, pas de frais cachés et pas de frais d'itinérance.",
          "store.ios": "Télécharger sur l'App Store",
          "store.android": "Disponible sur Google Play"
        },
        package: {
          "valid.for": "Valable pour",
          "days": "jours",
          "hotspot": "Point d'accès",
          "allowed": "Autorisé",
          "speed": "Vitesse",
          "no.limit": "Sans Limite",
          "european.coverage": "Couverture Européenne",
          "balkan.coverage": "Couverture des Balkans",
          "other.coverage": "Autre Couverture",
          "get.started": "Commencer",
          "most.popular": "Plus Populaire",
          "best.value": "Meilleur Rapport Qualité-Prix",
          "checkout.url": "URL de Paiement"
        }
      },
      de: {
        common: deCommon,
        features: deFeatures,
        components: deComponents,
        balance: deBalance,
        popup: dePopup,
        conversion: deConversion,
        device_checker: deDeviceChecker,
        support: {
          "24h.title": "24-Stunden Live-Chat und E-Mail-Support",
          "24h.description": "Erhalten Sie sofortige Hilfe von unserem Experten-Support-Team, das rund um die Uhr für Sie da ist, um Ihnen bei allen Fragen oder Anliegen zu helfen.",
          "24h.button": "Support kontaktieren",
          "guarantee.title": "Branchenweit erste Geld-zurück-Garantie",
          "guarantee.description": "Testen Sie unseren Service mit Vertrauen. Wenn Sie nicht zufrieden sind, erstatten wir Ihren Kauf - ohne Fragen zu stellen.",
          "guarantee.button": "eSIM-Daten kaufen"
        },
        app: {
          "download.title": "Kaufen Sie im Web oder nutzen Sie die KudoSIM-App",
          "download.description": "Laden Sie SIM-Karten für über 200 Länder weltweit herunter und genießen Sie sofort zuverlässige, vorausbezahlte mobile Daten. Keine Verträge, keine versteckten Gebühren und keine Roaming-Kosten.",
          "store.ios": "Laden im App Store",
          "store.android": "Jetzt bei Google Play"
        },
        package: {
          "valid.for": "Gültig für",
          "days": "Tage",
          "hotspot": "Hotspot",
          "allowed": "Erlaubt",
          "speed": "Geschwindigkeit",
          "no.limit": "Unbegrenzt",
          "european.coverage": "Europa-Abdeckung",
          "balkan.coverage": "Balkan-Abdeckung",
          "other.coverage": "Andere Abdeckung",
          "get.started": "Jetzt starten",
          "most.popular": "Am Beliebtesten",
          "best.value": "Bestes Angebot",
          "checkout.url": "Checkout-URL"
        }
      },
      tr: {
        common: trCommon,
        features: trFeatures,
        components: trComponents,
        balance: trBalance,
        popup: trPopup,
        conversion: trConversion,
        device_checker: trDeviceChecker,
        support: {
          "24h.title": "24 Saat Canlı Sohbet ve E-posta Desteği",
          "24h.description": "Uzman destek ekibimizden anında yardım alın, herhangi bir soru veya endişenizde size yardımcı olmak için 7/24 hizmetinizdeyiz.",
          "24h.button": "Desteğe ulaşın",
          "guarantee.title": "Sektörde İlk Para İade Garantisi",
          "guarantee.description": "Hizmetimizi güvenle deneyin. Memnun kalmazsanız, satın alma bedelinizi iade ederiz - soru sormadan.",
          "guarantee.button": "eSIM verisi satın al"
        },
        app: {
          "download.title": "Web'de alışveriş yapın veya KudoSIM uygulamasını kullanın",
          "download.description": "Dünya çapında 200'den fazla ülke için SIM kartları indirin ve anında güvenilir, ön ödemeli mobil verinin keyfini çıkarın. Sözleşme yok, gizli ücret yok ve dolaşım ücreti yok.",
          "store.ios": "App Store'dan İndir",
          "store.android": "Google Play'den Edinin"
        },
        package: {
          "valid.for": "Geçerlilik süresi",
          "days": "gün",
          "hotspot": "Hotspot",
          "allowed": "İzin Verilir",
          "speed": "Hız",
          "no.limit": "Limit Yok",
          "european.coverage": "Avrupa Kapsamı",
          "balkan.coverage": "Balkan Kapsamı",
          "other.coverage": "Diğer Kapsam",
          "get.started": "Hemen Başla",
          "most.popular": "En Popüler",
          "best.value": "En İyi Değer",
          "checkout.url": "Ödeme URL'si"
        }
      },
      hr: {
        features: hrFeatures
      },
      mk: {
        features: mkFeatures
      }
    },
    fallbackLng: 'en',
    ns: ['common', 'features', 'components', 'support', 'app', 'package', 'balance', 'popup', 'conversion', 'device_checker'],
    defaultNS: 'common',
    
    // Preload languages for better performance
    preload: ['en', 'sq', 'fr', 'de', 'tr'],
    
    // Cache settings
    cache: {
      enabled: true,
      expirationTime: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    
    // Load missing translations from backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      lookupCookie: 'kudosim_language',
      lookupLocalStorage: 'kudosim_language',
      caches: ['cookie', 'localStorage']
    }
  });

// Function to load translations from database
const loadTranslationsFromDatabase = async (language, namespace) => {
  try {
    // This function will be implemented to load translations from the database
    // For now, we'll use the static translations
    return i18n.getResourceBundle(language, namespace) || {};
  } catch (error) {
    console.error(`Failed to load ${language}/${namespace} from database`, error);
    return {};
  }
};

// Function to change language
const changeLanguage = async (language) => {
  // Save language preference
  Cookies.set('kudosim_language', language, { expires: 365 });
  
  return i18n.changeLanguage(language);
};

// Lazy load additional namespaces when needed
const loadNamespace = async (namespace, language = i18n.language) => {
  if (!i18n.hasResourceBundle(language, namespace)) {
    const resources = await loadTranslationsFromDatabase(language, namespace);
    i18n.addResourceBundle(language, namespace, resources);
  }
  
  return namespace;
};

export default i18n;