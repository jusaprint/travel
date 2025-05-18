import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';

// Optimized animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Reduced delay for faster rendering
      duration: 0.3,   // Shorter animation duration
      ease: [0.25, 0.1, 0.25, 1]
    }
  }),
  hover: {
    y: -5,
    boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)"
  },
  tap: { scale: 0.98 }
};

// Simplified pulse animation
const badgePulse = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Optimized shimmer effect
const shimmer = {
  hidden: { x: "-100%", opacity: 0.1 },
  visible: {
    x: "100%",
    opacity: 0.2,
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 2.5,
      ease: "linear"
    }
  }
};

// Memoized trigger card component for better performance
const TriggerCard = memo(({ index, color, icon, title, subtitle, badge, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className={`relative overflow-hidden rounded-2xl ${color} shadow-lg cursor-pointer`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      // Add hardware acceleration for smoother animations
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
    >
      {/* Shimmer effect overlay - optimized */}
      <motion.div 
        className="absolute inset-0 bg-white/20 w-1/3 h-full skew-x-12 pointer-events-none"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" />
      
      {/* Content */}
      <div className="relative p-4 sm:p-5 h-full flex flex-col">
        <div className="flex items-start gap-3">
          {/* Icon with badge */}
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
              {icon}
            </div>
            {badge && (
              <motion.div
                variants={badgePulse}
                initial="initial"
                animate="pulse"
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#4F46E5] flex items-center justify-center text-xs font-bold"
              >
                {badge}
              </motion.div>
            )}
          </div>
          
          {/* Text content */}
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">{title}</h3>
            <p className="text-xs sm:text-sm text-white/80">{subtitle}</p>
          </div>
        </div>
        
        {/* Animated arrow on hover - optimized */}
        <motion.div 
          className="mt-auto self-end"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
});

// Memoized live counter component
const LiveCounter = memo(({ value, label }) => {
  const [count, setCount] = useState(value);
  
  // Use useCallback to prevent recreation of the interval function
  const incrementCounter = useCallback(() => {
    if (Math.random() > 0.7) {
      setCount(prev => prev + 1);
    }
  }, []);
  
  useEffect(() => {
    // Use a less frequent interval to reduce performance impact
    const interval = setInterval(incrementCounter, 5000);
    return () => clearInterval(interval);
  }, [incrementCounter]);
  
  return (
    <div className="flex items-center gap-1 text-white/90 text-sm">
      <motion.span 
        className="font-bold"
        key={count}
        initial={{ opacity: 0.8, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {count}
      </motion.span>
      <span>{label}</span>
    </div>
  );
});

// Optimized expandable content component
const AnimatedExpandableContent = memo(({ isOpen, content, color }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`overflow-hidden rounded-xl ${color}`}
      style={{ willChange: 'height, opacity' }}
    >
      {content}
    </motion.div>
  );
});

const ConversionTriggers = () => {
  const { t, i18n } = useTranslation('conversion');
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Load the conversion namespace
  const { isLoading } = useTranslationLoader(['conversion']);
  
  // Memoize card data to prevent unnecessary re-renders
  const getCardData = useCallback(() => [
    {
      color: "bg-gradient-to-br from-[#4F46E5] to-[#9333EA]",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: t('live_views', 'Live Views'),
      subtitle: t('right_now', 'Right now'),
      badge: "8",
      content: (
        <div className="p-4">
          <h4 className="text-white font-semibold mb-3">{t('live_users', 'Live Users')}</h4>
          <div className="space-y-2">
            <LiveCounter value={12} label={t('browsing_plans', 'browsing plans')} />
            <LiveCounter value={8} label={t('viewing_this_page', 'viewing this page')} />
            <LiveCounter value={3} label={t('purchased_today', 'purchased today')} />
          </div>
        </div>
      )
    },
    {
      color: "bg-gradient-to-br from-[#059669] to-[#34D399]",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('bookings_today', 'Bookings Today'),
      subtitle: t('last_24h', 'Last 24h'),
      badge: "23",
      content: (
        <div className="p-4">
          <h4 className="text-white font-semibold mb-3">{t('recent_purchases', 'Recent Purchases')}</h4>
          <div className="space-y-2 text-white/90 text-sm">
            <div className="flex justify-between">
              <span>Europe 10GB</span>
              <span className="font-semibold">×12</span>
            </div>
            <div className="flex justify-between">
              <span>Asia 5GB</span>
              <span className="font-semibold">×7</span>
            </div>
            <div className="flex justify-between">
              <span>Global 20GB</span>
              <span className="font-semibold">×4</span>
            </div>
          </div>
        </div>
      )
    },
    {
      color: "bg-gradient-to-br from-[#D97706] to-[#FBBF24]",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('flash_sale', 'Flash Sale'),
      subtitle: t('free_activation', 'Free Activation'),
      badge: "24h",
      content: (
        <div className="p-4">
          <h4 className="text-white font-semibold mb-3">{t('limited_time_offer', 'Limited Time Offer')}</h4>
          <div className="bg-white/20 rounded-lg p-3 text-white">
            <p className="font-bold text-lg mb-1">{t('free_activation_promo', 'FREE ACTIVATION')}</p>
            <p className="text-sm">{t('promo_ends_in', 'Promotion ends in')} 23:59:42</p>
            <button className="mt-3 w-full py-2 bg-white text-[#D97706] rounded-lg font-medium">
              {t('claim_now', 'Claim Now')}
            </button>
          </div>
        </div>
      )
    },
    {
      color: "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('instant', 'Instant'),
      subtitle: t('connect_in_minutes', 'Connect in Minutes'),
      badge: "⚡",
      content: (
        <div className="p-4">
          <h4 className="text-white font-semibold mb-3">{t('instant_activation', 'Instant Activation')}</h4>
          <div className="space-y-2 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('no_physical_sim', 'No physical SIM needed')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('scan_qr_code', 'Just scan a QR code')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('connect_instantly', 'Connect instantly')}</span>
            </div>
          </div>
        </div>
      )
    }
  ], [t]);

  // Memoize cards data to prevent recalculation on every render
  const cards = useMemo(() => getCardData(), [getCardData]);

  // Handle card click with debounce to prevent multiple rapid clicks
  const handleCardClick = useCallback((index) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="w-6 h-6 border-2 border-[#690d89] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main grid of cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, index) => (
          <TriggerCard
            key={index}
            index={index}
            color={card.color}
            icon={card.icon}
            title={card.title}
            subtitle={card.subtitle}
            badge={card.badge}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {/* Expandable content */}
      <div className="mt-2 sm:mt-3">
        <AnimatedExpandableContent 
          isOpen={activeIndex !== null} 
          content={activeIndex !== null ? cards[activeIndex].content : null}
          color={activeIndex !== null ? cards[activeIndex].color : ''}
        />
      </div>
    </div>
  );
};

export default React.memo(ConversionTriggers);