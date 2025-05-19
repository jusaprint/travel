import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import { supabase } from '../lib/cms';
import Container from './Container';

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Testimonial card component
const TestimonialCard = ({ testimonial }) => {
  const { t, i18n } = useTranslation('testimonials');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 h-full flex flex-col min-w-[280px] sm:min-w-[350px] flex-shrink-0"
    >
      <div className="mb-6">
        <StarRating rating={testimonial.rating} />
      </div>
      
      <p className="text-gray-700 flex-grow mb-6 text-lg leading-relaxed">
        &quot;{testimonial.content}&quot;
      </p>
      
      <div className="flex items-center mt-auto">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover"
            width="48"
            height="48"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#690d89] text-white flex items-center justify-center font-bold text-lg">
            {testimonial.author.charAt(0)}
          </div>
        )}
        
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <span>{testimonial.location}</span>
            {testimonial.flag && <span className="ml-1">{testimonial.flag}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Navigation buttons for carousel
const CarouselButton = ({ direction, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute top-1/2 -translate-y-1/2 z-10 ${
      direction === 'prev' ? 'left-0 -ml-4' : 'right-0 -mr-4'
    } bg-white rounded-full p-3 shadow-lg text-[#690d89] hover:bg-[#690d89] hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <svg 
      className="w-6 h-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={direction === 'prev' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
      />
    </svg>
  </button>
);

// Trust badge component
const TrustBadge = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
  >
    <div className="mb-4 w-16 h-16 rounded-full bg-[#690d89]/10 flex items-center justify-center">
      <div className="text-[#690d89]">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

export default function Testimonials() {
  const { t, i18n } = useTranslation('testimonials');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  
  // Load the testimonials namespace to ensure translations are available
  const { isLoading: translationsLoading } = useTranslationLoader(['testimonials']);

  // Load testimonials from database
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        // Fetch testimonials from the database, filtering by approved status
        const { data, error: fetchError } = await supabase
          .from('cms_testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error loading testimonials:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Scroll to next/previous testimonials
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 400; // Adjust based on card width + gap
    const currentScroll = carouselRef.current.scrollLeft;
    
    if (direction === 'next') {
      carouselRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(prev => Math.min(prev + 1, testimonials.length - 1));
    } else {
      carouselRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  if (loading || translationsLoading) {
    return (
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24 w-full">
        <Container>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
          </div>
        </Container>
      </section>
    );
  }

  // If no testimonials found, show a message
  if (testimonials.length === 0) {
    return (
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24 w-full">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {i18n.language === 'en' ? "What Our Happy Customers Say" : 
               i18n.language === 'sq' ? "Çfarë Thonë Klientët Tanë të Kënaqur" :
               i18n.language === 'fr' ? "Ce que Disent Nos Clients Satisfaits" :
               i18n.language === 'de' ? "Was Unsere Zufriedenen Kunden Sagen" :
               i18n.language === 'tr' ? "Mutlu Müşterilerimiz Ne Diyor" :
               "What Our Happy Customers Say"}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'en' ? "Real experiences from travelers like you" : 
               i18n.language === 'sq' ? "Përvoja të vërteta nga udhëtarë si ju" :
               i18n.language === 'fr' ? "Expériences réelles de voyageurs comme vous" :
               i18n.language === 'de' ? "Echte Erfahrungen von Reisenden wie Ihnen" :
               i18n.language === 'tr' ? "Sizin gibi gezginlerden gerçek deneyimler" :
               "Real experiences from travelers like you"}
            </p>
          </motion.div>
          
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600">Add testimonials from the admin panel to display them here.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24 w-full">
      {/* Full width background */}
      <div className="absolute left-0 right-0 h-[500px] bg-gradient-to-b from-white to-gray-50 -z-10"></div>
      
      <Container className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            {i18n.language === 'en' ? "Why Customers Trust Us" : 
             i18n.language === 'sq' ? "Pse Klientët Na Besojnë" :
             i18n.language === 'fr' ? "Pourquoi Les Clients Nous Font Confiance" :
             i18n.language === 'de' ? "Warum Kunden Uns Vertrauen" :
             i18n.language === 'tr' ? "Müşteriler Neden Bize Güveniyor" :
             "Why Customers Trust Us"}
          </h2>
          <p className="text-xl text-gray-600">
            {i18n.language === 'en' ? "Real experiences from travelers like you" : 
             i18n.language === 'sq' ? "Përvoja të vërteta nga udhëtarë si ju" :
             i18n.language === 'fr' ? "Expériences réelles de voyageurs comme vous" :
             i18n.language === 'de' ? "Echte Erfahrungen von Reisenden wie Ihnen" :
             i18n.language === 'tr' ? "Sizin gibi gezginlerden gerçek deneyimler" :
             "Real experiences from travelers like you"}
          </p>
        </motion.div>
      </Container>

      {/* Full width carousel */}
      <div className="w-full overflow-hidden px-4 mb-16">
        <div className="max-w-[1400px] mx-auto relative">
          {/* Navigation Buttons */}
          <CarouselButton 
            direction="prev" 
            onClick={() => scrollCarousel('prev')}
            disabled={currentIndex === 0}
          />
          
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="snap-start">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
          
          <CarouselButton 
            direction="next" 
            onClick={() => scrollCarousel('next')}
            disabled={currentIndex >= testimonials.length - 1}
          />
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (carouselRef.current) {
                  const cardWidth = 400; // Approximate width of a card including gap
                  carouselRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                  });
                  setCurrentIndex(index);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-[#690d89] scale-100' : 'bg-gray-300 scale-75 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Container>
        {/* Trust Indicators - Redesigned */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Customers Trust Us</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Secure Payments */}
            <TrustBadge
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Secure Payments"
              description="Your transactions are protected with bank-level security and 256-bit SSL encryption."
            />
            
            {/* Money-Back Guarantee */}
            <TrustBadge
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Money-Back Guarantee"
              description="Not satisfied? Get a full refund within 30 days, no questions asked."
            />
            
            {/* 24/7 Support */}
            <TrustBadge
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              title="24/7 Global Support"
              description="Our expert team is available around the clock to assist you wherever you are."
            />
          </div>
          
          {/* Payment Methods */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-4">Trusted Payment Methods</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {/* Visa */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <svg className="h-8 w-auto" viewBox="0 0 48 16" fill="#1434CB">
                  <path d="M17.014 0L13.818 15.19H9.237L12.433 0H17.014ZM32.528 9.852C32.528 4.702 25.657 4.571 25.657 2.693C25.657 1.892 26.428 1.603 27.714 1.603C29.91 1.603 31.595 2.148 32.847 2.627L33.714 0.289C32.396 -0.0965123 30.591 -0.482512 28.583 -0.482512C24.197 -0.482512 21.68 1.537 21.68 4.505C21.68 8.575 27.714 8.771 27.714 10.846C27.714 11.78 26.494 12.134 25.272 12.134C22.88 12.134 20.88 11.328 19.497 10.717L18.597 13.121C20.014 13.732 22.111 14.275 24.33 14.275C29.009 14.275 31.724 12.321 31.724 9.255L32.528 9.852ZM44.99 15.19H48.99L45.148 0H41.345C40.157 0 39.165 0.614977 38.677 1.57L32.528 15.19H37.108L37.952 13.121H44.079L44.99 15.19ZM39.198 10.717L41.752 4.505L43.275 10.717H39.198ZM0 0L4.515 15.19H9.096L13.611 0H9.03L6.28 10.717L4.187 1.57C3.894 0.614977 3.031 0 2.036 0H0Z" fill="#1434CB"/>
                </svg>
              </div>
              
              {/* Mastercard */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 relative">
                    <div className="absolute left-0 top-0 w-5 h-8 bg-[#EB001B] rounded-full"></div>
                    <div className="absolute right-0 top-0 w-5 h-8 bg-[#F79E1B] rounded-full"></div>
                    <div className="absolute left-1/2 top-0 w-3 h-8 bg-[#FF5F00] mix-blend-multiply transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Apple Pay */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <svg className="h-8 w-auto" viewBox="0 0 38 16" fill="#000000">
                  <path d="M7.42699 2.67517C7.02841 3.15771 6.37684 3.54826 5.72526 3.48266C5.65272 2.80477 5.96688 2.08483 6.33334 1.63743C6.73192 1.12151 7.44962 0.760343 8.02332 0.730957C8.08462 1.43803 7.82545 2.1286 7.42699 2.67517ZM8.02332 3.71809C7.07846 3.65249 6.25397 4.22941 5.80791 4.22941C5.34729 4.22941 4.62959 3.74687 3.86426 3.7762C2.85828 3.80571 1.92455 4.38263 1.41656 5.28848C0.341937 7.10018 1.14317 9.79875 2.17127 11.2879C2.67914 12.0177 3.28334 12.8351 4.06001 12.8056C4.79893 12.7762 5.09185 12.3267 5.97873 12.3267C6.88673 12.3267 7.14602 12.8056 7.91511 12.7909C8.71836 12.7762 9.24758 12.0472 9.74433 11.3102C10.3119 10.4781 10.5467 9.67603 10.5712 9.63682C10.5467 9.62213 8.89897 8.88751 8.87451 6.82584C8.85017 5.10443 10.1311 4.23082 10.1923 4.18692C9.47461 3.13399 8.36863 3.04901 8.02332 3.71809ZM14.4772 1.01563V12.7123H16.1669V8.83401H18.4864C20.6602 8.83401 22.1517 7.36527 22.1517 4.91729C22.1517 2.46932 20.6847 1.01563 18.5486 1.01563H14.4772ZM16.1669 2.48401H18.1656C19.7085 2.48401 20.4262 3.35762 20.4262 4.92729C20.4262 6.49697 19.7085 7.37527 18.1534 7.37527H16.1669V2.48401ZM25.6489 12.8349C26.6794 12.8349 27.6376 12.3414 28.1334 11.5338H28.1701V12.7123H29.7252V7.00439C29.7252 5.13659 28.3459 3.95664 26.1843 3.95664C24.1734 3.95664 22.6696 5.15597 22.6207 6.77175H24.1367C24.2724 5.99351 25.0246 5.44694 26.1232 5.44694C27.3802 5.44694 28.1089 6.04321 28.1089 7.10083V7.81608L25.6367 7.97077C23.3294 8.11577 22.0602 9.02162 22.0602 10.5913C22.0602 12.1707 23.5029 12.8349 25.6489 12.8349ZM26.0842 11.3741C24.9904 11.3741 23.7334 10.9933 23.7334 10.0874C23.7334 9.13766 24.6903 8.7861 26.1721 8.69643L28.1089 8.55612V9.33436C28.1089 10.5231 27.2098 11.3741 26.0842 11.3741ZM31.7239 16C33.4014 16 34.2394 15.2803 34.9172 13.1938L38 3.99585H36.2981L34.1887 11.2272H34.152L32.0426 3.99585H30.2918L33.2902 12.7859L33.1056 13.3716C32.8219 14.2384 32.3383 14.5386 31.4781 14.5386C31.3302 14.5386 31.0343 14.5239 30.9243 14.5093V15.9561C31.0343 15.9854 31.5179 16 31.7239 16Z" fill="black"/>
                </svg>
              </div>
              
              {/* Google Pay */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <svg className="h-8 w-auto" viewBox="0 0 80 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.79 10.17C3.79 9.47 3.73 8.79 3.61 8.13H19.38V12.6H10.6C10.93 13.87 11.71 14.97 12.82 15.71V18.71H8.05C5.87 16.99 3.79 13.86 3.79 10.17Z" fill="#4285F4"/>
                  <path d="M19.38 24.93C15.74 24.93 12.66 23.67 10.6 21.61L15.37 18.61C16.69 19.57 17.98 20.17 19.38 20.17C22.08 20.17 24.29 18.38 25.09 15.93L29.86 18.93C28.06 22.47 24.13 24.93 19.38 24.93Z" fill="#34A853"/>
                  <path d="M29.86 18.93C30.66 17.47 31.14 15.81 31.14 14C31.14 12.19 30.66 10.53 29.86 9.07L25.09 12.07C25.89 14.52 25.89 16.48 25.09 18.93L29.86 18.93Z" fill="#FBBC04"/>
                  <path d="M19.38 7.83C21.98 7.83 24.29 8.79 26.09 10.47L30.86 7.47C28.06 3.93 24.13 1.47 19.38 1.47C12.66 1.47 6.97 5.01 3.79 10.17L8.56 13.17C10.12 10.11 14.05 7.83 19.38 7.83Z" fill="#EA4335"/>
                </svg>
              </div>
              
              {/* PayPal */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <svg className="h-8 w-auto" viewBox="0 0 124 33" fill="#253B80">
                  <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                  <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/>
                  <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill="#253B80"/>
                  <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
                  <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
                  <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Trust Certifications */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-sm">SSL Secured</span>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">GDPR Compliant</span>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium text-sm">PCI DSS Certified</span>
            </div>
          </div>
          
          {/* TrustIndex Widget Container */}
          <div id="trustindex-widget-container" className="mt-8">
            {/* TrustIndex widget will be injected here by external script */}
          </div>
        </div>
      </Container>

      {/* Add custom styles for hiding scrollbar */}
      <style jsx="true">{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}