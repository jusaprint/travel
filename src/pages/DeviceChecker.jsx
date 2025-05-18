import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Container from '../components/Container';
import confetti from 'canvas-confetti';

// Device data - only brands with phone models
const deviceBrands = [
  'Apple', 'Samsung', 'Google', 'Motorola', 'OnePlus', 
  'Xiaomi', 'OPPO', 'Honor', 'Nokia', 'Sony', 
  'Huawei', 'ASUS', 'Microsoft', 'Lenovo', 'TCL'
];

// Sample device models by brand (this would be expanded with real data)
const deviceModels = {
  'Apple': [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
    'iPhone SE (2nd generation)', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
    'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
    'iPad Pro 12.9-inch (3rd generation or later)', 'iPad Pro 11-inch (1st generation or later)',
    'iPad Air (3rd generation or later)', 'iPad (7th generation or later)', 'iPad mini (5th generation or later)'
  ],
  'Samsung': [
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
    'Galaxy S21 Ultra 5G', 'Galaxy S21+ 5G', 'Galaxy S21 5G',
    'Galaxy S20 Ultra 5G', 'Galaxy S20+ 5G', 'Galaxy S20 5G',
    'Galaxy Note 20 Ultra 5G', 'Galaxy Note 20 5G',
    'Galaxy Z Fold5', 'Galaxy Z Fold4', 'Galaxy Z Fold3 5G', 'Galaxy Z Fold2 5G',
    'Galaxy Z Flip5', 'Galaxy Z Flip4', 'Galaxy Z Flip3 5G', 'Galaxy Z Flip 5G',
    'Galaxy A54 5G', 'Galaxy A53 5G', 'Galaxy A52 5G', 'Galaxy A51 5G',
    'Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9',
    'Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8',
    'Galaxy Tab S7+ 5G', 'Galaxy Tab S7 5G'
  ],
  'Google': [
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
    'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a', 'Pixel 5', 'Pixel 4a (5G)', 'Pixel 4a',
    'Pixel 4 XL', 'Pixel 4', 'Pixel 3a XL', 'Pixel 3a', 'Pixel 3 XL', 'Pixel 3'
  ],
  'Motorola': [
    'Razr 40 Ultra', 'Razr 40', 'Edge 40 Pro', 'Edge 40', 'Edge 30 Ultra',
    'Edge 30 Pro', 'Edge 30 Neo', 'Edge 30 Fusion', 'Edge 30', 'Edge+ (2022)',
    'Moto G Stylus 5G (2022)', 'Moto G 5G (2022)', 'Moto G Power 5G'
  ],
  'OnePlus': [
    'OnePlus 11 5G', 'OnePlus 10 Pro 5G', 'OnePlus 10T 5G', 'OnePlus 9 Pro 5G',
    'OnePlus 9 5G', 'OnePlus 8 Pro', 'OnePlus 8T', 'OnePlus 8', 'OnePlus Nord 3 5G',
    'OnePlus Nord 2T 5G', 'OnePlus Nord 2 5G', 'OnePlus Nord CE 3 Lite 5G'
  ],
  'Xiaomi': [
    'Xiaomi 13 Ultra', 'Xiaomi 13 Pro', 'Xiaomi 13', 'Xiaomi 13 Lite',
    'Xiaomi 12 Pro', 'Xiaomi 12', 'Xiaomi 12 Lite', 'Xiaomi 12T Pro', 'Xiaomi 12T',
    'Xiaomi 11T Pro', 'Xiaomi 11T', 'Xiaomi 11 Lite 5G NE', 'Xiaomi 11i',
    'Redmi Note 12 Pro+ 5G', 'Redmi Note 12 Pro 5G', 'Redmi Note 12 5G'
  ],
  'OPPO': [
    'Find X6 Pro', 'Find X6', 'Find X5 Pro', 'Find X5', 'Find X5 Lite',
    'Find X3 Pro', 'Find X3 Neo', 'Find X3 Lite', 'Reno10 Pro+ 5G',
    'Reno10 Pro 5G', 'Reno10 5G', 'Reno8 Pro 5G', 'Reno8 5G'
  ],
  'Honor': [
    'Magic5 Pro', 'Magic5', 'Magic4 Pro', 'Magic4', 'Magic V2',
    'Magic Vs', 'Magic Vs2', '90', '90 Pro', '80 Pro', '80', '70'
  ],
  'Nokia': [
    'G60 5G', 'X30 5G', 'XR20', 'X20', 'G50'
  ],
  'Sony': [
    'Xperia 1 V', 'Xperia 1 IV', 'Xperia 1 III', 'Xperia 5 V', 'Xperia 5 IV', 'Xperia 5 III',
    'Xperia 10 V', 'Xperia 10 IV', 'Xperia 10 III'
  ],
  'Huawei': [
    'Mate 50 Pro', 'Mate 50', 'Mate 40 Pro', 'Mate 40', 'P50 Pro', 'P50',
    'P40 Pro+', 'P40 Pro', 'P40', 'Nova 10 Pro', 'Nova 10', 'Nova 9 Pro', 'Nova 9'
  ],
  'ASUS': [
    'ROG Phone 7 Ultimate', 'ROG Phone 7', 'ROG Phone 6 Pro', 'ROG Phone 6',
    'Zenfone 10', 'Zenfone 9', 'Zenfone 8 Flip', 'Zenfone 8'
  ],
  'Microsoft': [
    'Surface Duo 2', 'Surface Duo'
  ],
  'Lenovo': [
    'Legion Phone Duel 2', 'Legion Phone Duel', 'ThinkPhone'
  ],
  'TCL': [
    '40 NXTPAPER 5G', '40 XE 5G', '40 XL 5G', '30 5G', '20 Pro 5G'
  ]
};

// Step component for the wizard
const Step = ({ children, isActive }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Brand button component with enhanced design
const BrandButton = ({ brand, onClick, isSelected }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(105, 13, 137, 0.2)" }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onClick(brand)}
    className={
      isSelected 
        ? 'w-full py-4 px-6 rounded-2xl text-center transition-all duration-300 bg-gradient-to-r from-[#690d89] to-[#8B5CF6] text-white font-medium shadow-lg border-2 border-[#690d89]/20'
        : 'w-full py-4 px-6 rounded-2xl text-center transition-all duration-300 bg-white hover:bg-gray-50 text-gray-800 font-medium border-2 border-gray-200 hover:border-[#690d89]/30 shadow-md hover:shadow-xl'
    }
  >
    {brand}
  </motion.button>
);

// Back button component
const BackButton = ({ onClick, text }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.05, x: -5 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex items-center gap-2 text-[#690d89] font-medium py-2 px-4 rounded-lg hover:bg-[#690d89]/5 transition-all duration-300 mb-6"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    {text}
  </motion.button>
);

// Search input component
const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#690d89] focus:ring-2 focus:ring-[#690d89]/20 transition-all duration-300"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// App Store Button component
const AppStoreButton = ({ type, url }) => {
  const { t } = useTranslation('device_checker');
  
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        type === 'apple' 
          ? 'bg-black text-white' 
          : 'bg-[#690d89] text-white'
      }`}
    >
      {type === 'apple' ? (
        <>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.3,2.5C16.7,3,17,3.7,17,4.6c0,1.1-0.6,2.1-1.5,2.7c-0.9,0.5-1.9,0.5-2.9,0.3c-0.1-1,0.3-2,0.9-2.7 C14.2,4,15.3,3.5,16.3,2.5z M20.8,17.8c0.1,0.2,0.2,0.3,0.2,0.5c0,0.1-0.1,0.3-0.2,0.4c-0.8,1.1-1.7,2.2-2.7,3.1 c-0.5,0.5-1.2,0.5-1.8,0.1c-0.7-0.4-1.4-0.9-2.1-1.3c-0.7-0.4-1.4-0.4-2.1,0c-0.7,0.4-1.4,0.9-2.1,1.3c-0.6,0.4-1.3,0.4-1.8-0.1 c-1-0.9-1.9-2-2.7-3.1c-0.8-1.1-1.5-2.3-1.9-3.6c-0.4-1.3-0.5-2.7-0.3-4c0.2-1.5,0.8-2.9,1.8-4c1-1.1,2.3-1.6,3.8-1.6 c0.7,0,1.4,0.2,2.1,0.4c0.6,0.2,1.2,0.4,1.8,0.4c0.5,0,1.1-0.1,1.6-0.3c0.7-0.2,1.3-0.4,2-0.5c1.3-0.1,2.5,0.2,3.5,0.9 c-0.3,0.2-0.6,0.4-0.8,0.6c-0.8,0.8-1.3,1.7-1.3,2.8c0,1.2,0.5,2.1,1.3,2.9c0.5,0.5,1.1,0.8,1.8,0.9c-0.2,0.6-0.4,1.2-0.6,1.8 C20.9,15.4,20.6,16.6,20.8,17.8z"/>
          </svg>
          <span>{t('download_app_store', 'Download on the App Store')}</span>
        </>
      ) : (
        <>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.423-.29.684v-.369c0-.261.109-.513.29-.684L13.402 12 3.609 2.198c-.181-.181-.29-.423-.29-.684v.3c0 .261.109.513.29.684zm10.831 9.326l2.274-1.276-2.274-1.276-1.969 1.276 1.969 1.276zM5.83 1.497L14.217 6.2l2.265-1.272c1.388-.779 1.887-.651 2.327-.241.23.215.357.506.357.809 0 .545-.357 1.078-1.009 1.445l-1.259.704 1.25.704c.652.368 1.018.9 1.018 1.446 0 .303-.126.594-.357.809-.441.41-.939.539-2.327-.241l-2.265-1.272-8.387 4.702c1.258.704 2.516 0 2.516 0L16.56 8.991v6.182l-5.92-3.326-5.022 2.816c0 .001 1.46.823 2.769.107L16.56 8.992V2.811L8.338 7.133 5.83 5.648v-4.15z"/>
          </svg>
          <span>{t('get_on_google_play', 'Get it on Google Play')}</span>
        </>
      )}
    </motion.a>
  );
};

// Success animation component
const SuccessAnimation = ({ onComplete }) => {
  const { t } = useTranslation('device_checker');
  
  useEffect(() => {
    // Trigger confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 500);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, times: [0, 0.8, 1] }}
        className="w-32 h-32 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg"
      >
        <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 mb-4 text-center"
      >
        {t('success_title', 'Great News! Your Device Supports eSIM')}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-600 text-center max-w-md mb-8"
      >
        {t('success_message', "You're ready to enjoy seamless global connectivity with KudoSIM's eSIM technology.")}
      </motion.p>
      
      {/* App Store Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <AppStoreButton 
          type="apple" 
          url="https://apps.apple.com/app/kudosim"
        />
        <AppStoreButton 
          type="google" 
          url="https://play.google.com/store/apps/details?id=com.kudosim"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          to="/destinations"
          className="px-6 py-3 bg-gradient-to-r from-[#690d89] to-[#8B5CF6] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {t('shop_esim', 'Shop eSIM Plans')}
        </Link>
        <button
          type="button"
          onClick={onComplete}
          className="px-6 py-3 bg-white text-[#690d89] font-medium rounded-xl border-2 border-[#690d89]/20 shadow-md hover:shadow-lg transition-all duration-300"
        >
          {t('check_another', 'Check Another Device')}
        </button>
      </motion.div>
    </motion.div>
  );
};

// Not compatible component
const NotCompatible = ({ onReset }) => {
  const { t } = useTranslation('device_checker');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-8"
      >
        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 mb-4 text-center"
      >
        {t('not_compatible', "Sorry, Your Device Doesn't Support eSIM")}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-600 text-center max-w-md mb-8"
      >
        {t('china_restriction', "Devices purchased in Mainland China, Hong Kong, or Macao typically don't support eSIM functionality due to regional restrictions.")}
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onReset}
        className="px-6 py-3 bg-gradient-to-r from-[#690d89] to-[#8B5CF6] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {t('check_another', 'Check Another Device')}
      </motion.button>
    </motion.div>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openItem, setOpenItem] = useState(null);
  const { t } = useTranslation('device_checker');
  
  const faqs = [
    {
      question: t('what_is_esim', "What is an eSIM?"),
      answer: t('esim_description', "An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan from your carrier without having to use a physical SIM card. It's built into your device and can't be removed.")
    },
    {
      question: t('how_to_know', "How do I know if my device supports eSIM?"),
      answer: t('know_description', "Most newer smartphones and tablets support eSIM technology. You can check your device's specifications or use our device checker above to confirm compatibility.")
    },
    {
      question: t('dual_sim', "Can I use both a physical SIM and an eSIM?"),
      answer: t('dual_sim_description', "Yes, most eSIM-compatible devices allow you to use both a physical SIM and an eSIM simultaneously, giving you two active phone numbers on one device.")
    },
    {
      question: t('china_question_faq', "Why don't devices from China support eSIM?"),
      answer: t('china_answer', "Due to regulatory requirements, most devices manufactured for the Chinese market don't include eSIM functionality, even if the same model sold elsewhere does support it.")
    }
  ];
  
  return (
    <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('faq_title', 'Frequently Asked Questions')}</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setOpenItem(openItem === index ? null : index)}
              className="flex justify-between items-center w-full text-left font-medium text-gray-900 py-2 focus:outline-none"
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 text-[#690d89] transition-transform duration-300 ${openItem === index ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {openItem === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="py-3 text-gray-600">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DeviceChecker() {
  const { t, i18n } = useTranslation('device_checker');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompatible, setIsCompatible] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedInChina, setPurchasedInChina] = useState(null);

  // Filter brands based on search term
  const filteredBrands = deviceBrands.filter(brand => 
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter models based on search term
  const filteredModels = selectedBrand && deviceModels[selectedBrand] 
    ? deviceModels[selectedBrand].filter(model => 
        model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Reset search when changing steps
  useEffect(() => {
    setSearchTerm('');
  }, [currentStep]);

  // Handle brand selection
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setCurrentStep(2);
  };

  // Handle model selection
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    
    // If the device was purchased in China, we need to check that first
    if (purchasedInChina === null) {
      setCurrentStep(3);
    } else {
      checkCompatibility(model, purchasedInChina);
    }
  };

  // Handle China purchase response
  const handleChinaPurchase = (purchased) => {
    setPurchasedInChina(purchased);
    checkCompatibility(selectedModel, purchased);
  };

  // Check if the device is compatible
  const checkCompatibility = (model, fromChina) => {
    // In a real app, this would check against a database
    // For now, we'll assume all listed models are compatible unless from China
    const compatible = !fromChina;
    setIsCompatible(compatible);
    setCurrentStep(4);
    
    if (compatible) {
      // Show success animation after a short delay
      setTimeout(() => {
        setShowSuccess(true);
      }, 500);
    }
  };

  // Reset the checker
  const resetChecker = () => {
    setCurrentStep(1);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSearchTerm('');
    setIsCompatible(null);
    setShowSuccess(false);
    setPurchasedInChina(null);
  };

  // Go back to previous step
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      
      // Reset relevant state based on the step we're going back to
      if (currentStep === 3) {
        setSelectedModel(null);
      } else if (currentStep === 2) {
        setSelectedBrand(null);
      }
    }
  };

  return (
    <>
      <SEO 
        title={t('seo.title', 'eSIM Device Compatibility Checker - KudoSIM')}
        description={t('seo.description', "Check if your device supports eSIM technology. Find out if your smartphone or tablet is compatible with KudoSIM's global eSIM data plans.")}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-[#690d89]/5 to-white pt-32 pb-24">
        <Container>
          {/* Header Section */}
          <div className="relative mb-16">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#690d89]/5 rounded-full blur-3xl opacity-70 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-[#8B5CF6]/5 rounded-full blur-3xl opacity-70 z-0 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-[#690d89] to-[#8B5CF6] bg-clip-text text-transparent"
                >
                  {t('title', 'Can my device use eSIM?')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-700"
                >
                  {t('subtitle', 'Select your device brand and model to see if it supports eSIM technology.')}
                </motion.p>
              </div>
              
              {/* Illustrative image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-xs"
              >
                <img 
                  src="/esimcards.png" 
                  alt="eSIM Cards" 
                  className="w-full h-auto drop-shadow-xl"
                />
              </motion.div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-1 bg-gray-200 rounded"></div>
              </div>
              <div className="relative flex justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-[#690d89] to-[#8B5CF6] text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                    } font-medium text-sm`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back Button - Only show on steps 2-4 */}
          {currentStep > 1 && !showSuccess && (
            <BackButton onClick={goBack} text={t('back', 'Back')} />
          )}

          {/* Wizard Steps */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Step 1: Choose Brand */}
            <Step isActive={currentStep === 1}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('select_brand', 'Select your device brand')}</h2>
              
              <SearchInput 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t('search_brands', 'Search brands...')}
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredBrands.map((brand) => (
                  <BrandButton
                    key={brand}
                    brand={brand}
                    onClick={handleBrandSelect}
                    isSelected={selectedBrand === brand}
                  />
                ))}
              </div>
              
              {filteredBrands.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('no_brands_found', 'No brands found matching')} "{searchTerm}"</p>
                </div>
              )}
            </Step>

            {/* Step 2: Choose Model */}
            <Step isActive={currentStep === 2}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('select_model', 'Select your device model').replace('{brand}', selectedBrand)}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('select_model_subtitle', 'Choose your specific device model to check eSIM compatibility')}
              </p>
              
              <SearchInput 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t('search_models', 'Search models...')}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <BrandButton
                      key={model}
                      brand={model}
                      onClick={handleModelSelect}
                      isSelected={selectedModel === model}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm 
                        ? t('no_models_found', 'No models found matching') + ` "${searchTerm}"`
                        : t('no_models_available', 'No models available for') + ` ${selectedBrand}`
                      }
                    </p>
                  </div>
                )}
              </div>
            </Step>

            {/* Step 3: China purchase question */}
            <Step isActive={currentStep === 3}>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('one_more_question', 'One more question about your device')}
                </h2>
                
                <p className="text-lg text-gray-700 mb-8">
                  {t('china_question', 'Was your device purchased in Mainland China, Hong Kong, or Macao?')}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChinaPurchase(true)}
                    className="py-4 px-8 bg-white text-red-500 font-medium rounded-xl border-2 border-red-200 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {t('yes', 'Yes')}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChinaPurchase(false)}
                    className="py-4 px-8 bg-white text-green-500 font-medium rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {t('no', 'No')}
                  </motion.button>
                </div>
                
                <p className="text-sm text-gray-500 mt-8">
                  {t('china_note', 'Note: Devices purchased in these regions may have eSIM functionality disabled due to local regulations.')}
                </p>
              </div>
            </Step>

            {/* Step 4: Results */}
            <Step isActive={currentStep === 4}>
              {isCompatible ? (
                showSuccess ? (
                  <SuccessAnimation onComplete={resetChecker} />
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-medium"
                  >
                    {t('checking', 'Checking compatibility...')}
                  </motion.p>
                )
              ) : (
                <NotCompatible onReset={resetChecker} />
              )}
            </Step>
          </div>
          
          {/* FAQ Section */}
          <FAQSection />
          
          {/* App Store Buttons Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('download_app', 'Download Our App')}</h2>
            <p className="text-lg text-gray-600 mb-8">{t('download_app_description', 'Get the KudoSIM app for easy eSIM management, data usage tracking, and instant top-ups.')}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <AppStoreButton 
                type="apple" 
                url="https://apps.apple.com/app/kudosim"
              />
              <AppStoreButton 
                type="google" 
                url="https://play.google.com/store/apps/details?id=com.kudosim"
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}