import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Plans from '../components/Plans';
import Features from '../components/Features';
import OperatorLogos from '../components/OperatorLogos';
import Testimonials from '../components/Testimonials';
import AppDownload from '../components/AppDownload';
import TabNavigation from '../components/TabNavigation';
import LocalCountriesGrid from '../components/LocalCountriesGrid';
import RegionsGrid from '../components/RegionsGrid';
import { useLocation } from 'react-router-dom';
import Container from '../components/Container';

function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Determine which tab to show based on the URL
  const getActiveTab = () => {
    if (location.pathname.includes('/local')) {
      return 'local';
    } else if (location.pathname.includes('/regions')) {
      return 'regions';
    }
    return 'europe';
  };

  // Prepare schema markup for SEO
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "KudoSIM Global eSIM",
    "description": "Digital eSIM cards for international travel with instant activation",
    "brand": {
      "@type": "Brand",
      "name": "KudoSIM"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "9.99",
      "highPrice": "29.99",
      "offerCount": "10+"
    }
  };

  // Define tabs for navigation
  const tabs = [
    { name: 'Europe +', path: '/', translationKey: 'tab.europe' },
    { name: 'Local', path: '/local', translationKey: 'tab.local' },
    { name: 'Regions', path: '/regions', translationKey: 'tab.regions' }
  ];

  // Get active tab
  const activeTab = getActiveTab();

  return (
    <>
      <SEO 
        title="Global eSIM Data Plans for International Travel"
        description="Stay connected worldwide with KudoSIM's instant digital eSIM cards. No physical SIM needed, just scan and connect. Available in 200+ countries."
        schema={homeSchema}
      />
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Tab Navigation - No margin/padding */}
        <TabNavigation tabs={tabs} />
        
        {/* Tab Content - Reduced vertical spacing */}
        <div className="bg-gradient-to-b from-white via-white/80 to-transparent pt-0">
          <Container className="py-4">
            {activeTab === 'europe' && <Plans />}
            {activeTab === 'local' && <LocalCountriesGrid />}
            {activeTab === 'regions' && <RegionsGrid />}
          </Container>
        </div>
        
        {/* Features Section - Reduced top margin */}
        <div className="mt-4">
          <Features />
        </div>
        
        {/* Operator Logos */}
        <OperatorLogos />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* App Download Section - Now full width */}
        <AppDownload />
      </main>
    </>
  );
}

export default HomePage;