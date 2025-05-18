import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { TranslationProvider } from './context/TranslationContext';
import { MotionConfigProvider } from './components/motion-config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Destinations from './pages/Destinations';
import CountryPage from './pages/CountryPage';
import PopularDestinations from './pages/destinations/PopularDestinations';
import RegionsOverview from './pages/destinations/RegionsOverview';
import About from './pages/About';
import Business from './pages/Business';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Press from './pages/Press';
import Affiliates from './pages/Affiliates';
import CheckBalance from './pages/CheckBalance';
import DeviceChecker from './pages/DeviceChecker';
import LocalCountriesGrid from './components/LocalCountriesGrid';
import RegionsGrid from './components/RegionsGrid';
import Popup from './components/Popup';

// Import Admin Routes
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <SettingsProvider>
          <LanguageProvider>
            <TranslationProvider>
              <MotionConfigProvider>
                {/* Global Popup Component */}
                <Popup />
                
                {/* Admin Routes */}
                <Routes>
                  {/* Admin section */}
                  <Route path="/admin/*" element={<AdminRoutes />} />
                  
                  {/* Public website routes */}
                  <Route path="*" element={
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/local" element={<HomePage />} />
                          <Route path="/regions" element={<HomePage />} />
                          <Route path="/destinations" element={<Destinations />} />
                          <Route path="/country/:countryCode" element={<CountryPage />} />
                          <Route path="/popular-destinations" element={<PopularDestinations />} />
                          <Route path="/regions-overview" element={<RegionsOverview />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/business" element={<Business />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/press" element={<Press />} />
                          <Route path="/affiliates" element={<Affiliates />} />
                          <Route path="/check-balance" element={<CheckBalance />} />
                          <Route path="/device-checker" element={<DeviceChecker />} />
                          
                          {/* Language prefixed routes */}
                          <Route path="/:lang">
                            <Route index element={<HomePage />} />
                            <Route path="local" element={<HomePage />} />
                            <Route path="regions" element={<HomePage />} />
                            <Route path="destinations" element={<Destinations />} />
                            <Route path="country/:countryCode" element={<CountryPage />} />
                            <Route path="popular-destinations" element={<PopularDestinations />} />
                            <Route path="regions-overview" element={<RegionsOverview />} />
                            <Route path="about" element={<About />} />
                            <Route path="business" element={<Business />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="faq" element={<FAQ />} />
                            <Route path="press" element={<Press />} />
                            <Route path="affiliates" element={<Affiliates />} />
                            <Route path="check-balance" element={<CheckBalance />} />
                            <Route path="device-checker" element={<DeviceChecker />} />
                          </Route>
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  } />
                </Routes>
              </MotionConfigProvider>
            </TranslationProvider>
          </LanguageProvider>
        </SettingsProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;