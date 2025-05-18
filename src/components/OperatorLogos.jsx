import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Container from './Container';

// Operator logos data
const operatorLogos = [
  { id: 1, name: 'Vodafone', src: '/operators/Vodafone_esim.svg', alt: 'Vodafone eSIM' },
  { id: 2, name: 'T-Mobile', src: '/operators/t-mobile_esim.svg', alt: 'T-Mobile eSIM' },
  { id: 3, name: 'AT&T', src: '/operators/att_esim.svg', alt: 'AT&T eSIM' },
  { id: 4, name: 'Verizon', src: '/operators/verizon_esim.svg', alt: 'Verizon eSIM' },
  { id: 5, name: 'O2', src: '/operators/o2_esim.svg', alt: 'O2 eSIM' },
  { id: 6, name: 'Telefonica', src: '/operators/telefonica_esim.svg', alt: 'Telefonica' },
  { id: 7, name: 'Claro', src: '/operators/claro_esim.svg', alt: 'Claro eSIM' },
  { id: 8, name: 'Telkomsel', src: '/operators/telkomsel_esim.svg', alt: 'Telkomsel eSIM' },
];

// Trust badges data
const trustBadges = [
  { id: 1, name: 'GSMA Certified', badge: 'Certified', color: 'green' },
  { id: 2, name: 'Global Coverage', badge: '200+ Countries', color: 'blue' },
  { id: 3, name: 'Network Quality', badge: 'Tier 1', color: 'purple' },
  { id: 4, name: '5G Ready', badge: 'Where Available', color: 'orange' },
];

export default function OperatorLogos() {
  const { t } = useTranslation();
  const carouselRef = useRef(null);

  // Auto-scroll (omitted for brevity)

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('operator.title', 'Giving you access to top tier network partners')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('operator.subtitle', 'Connect with leading carriers worldwide')}
          </p>
        </motion.div>

        {/* Carousel controls */}
        <div className="relative mb-16">
          <button
            onClick={() => scrollCarousel('prev')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:shadow-lg transition">
            {/* left arrow */}
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo container */}
          <div
            ref={carouselRef}
            className="flex space-x-8 overflow-x-auto px-8 scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {operatorLogos.map((logo, idx) => (
              <motion.div
                key={logo.id}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center transition-transform duration-300"
                style={{ height: '100px' }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full"
                    loading="lazy"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scrollCarousel('next')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:shadow-lg transition">
            {/* right arrow */}
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900">
              {t('operator.heading', 'Our Network Partners')}
            </h3>
            <p className="text-gray-600 mt-2">
              {t('operator.subheading', 'Connecting you with leading carriers worldwide')}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center bg-white px-5 py-3 rounded-full shadow-sm text-gray-700"
              >
                <span className="mr-2 font-medium">{badge.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-${badge.color}-100 text-${badge.color}-800`}>
                  {badge.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}