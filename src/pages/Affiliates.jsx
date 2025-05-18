import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const FeatureCard = ({ icon, title, description }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#690d89]/10 flex items-center justify-center text-[#690d89]">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{t(title)}</h3>
      </div>
      <p className="text-gray-600">{t(description)}</p>
    </motion.div>
  );
};

const TestimonialCard = ({ name, location, image, content, rating }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h4 className="font-semibold text-gray-900">{t(name)}</h4>
          <p className="text-sm text-gray-500">{t(location)}</p>
          <div className="flex gap-1 mt-1">
            {[...Array(rating)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{t(content)}</p>
    </motion.div>
  );
};

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <motion.div
      initial={false}
      className="border-b border-gray-200 py-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-gray-900">{t(question)}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0 text-[#690d89]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="mt-4 text-gray-600">{t(answer)}</p>
      </motion.div>
    </motion.div>
  );
};

export default function Affiliates() {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={t('affiliates.seo.title')}
        description={t('affiliates.seo.description')}
      />
      
      {/* Hero Section */}
      <div className="relative min-h-[70vh] bg-gradient-to-b from-[#690d89]/5 to-white pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#DDA0DD]/20 via-transparent to-transparent rounded-full opacity-[0.15] blur-xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#87CEEB]/20 via-transparent to-transparent rounded-full opacity-[0.15] blur-xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
                {t('affiliates.hero.title')} <span className="text-[#690d89]">{t('affiliates.hero.highlight')}</span>
              </h1>
              <p className="text-xl text-gray-600">
                {t('affiliates.hero.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/affiliate/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#690d89] hover:bg-[#8B5CF6] md:py-4 md:text-lg md:px-10"
              >
                {t('affiliates.hero.cta.join')}
              </Link>
              <Link
                to="/affiliate/learn-more"
                className="inline-flex items-center px-8 py-3 border border-[#690d89] text-base font-medium rounded-full text-[#690d89] hover:bg-[#690d89]/5 md:py-4 md:text-lg md:px-10"
              >
                {t('affiliates.hero.cta.learn')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('affiliates.features.title')}</h2>
            <p className="mt-4 text-xl text-gray-600">{t('affiliates.features.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              title="affiliates.features.free.title"
              description="affiliates.features.free.description"
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>}
              title="affiliates.features.setup.title"
              description="affiliates.features.setup.description"
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              title="affiliates.features.commission.title"
              description="affiliates.features.commission.description"
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('affiliates.benefits.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#98FB98] p-8 rounded-2xl text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('affiliates.benefits.flights.title')}</h3>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#FFD700] p-8 rounded-2xl text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('affiliates.benefits.events.title')}</h3>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#40E0D0] p-8 rounded-2xl text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('affiliates.benefits.features.title')}</h3>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('affiliates.testimonials.title')}</h2>
            <p className="mt-4 text-xl text-gray-600">{t('affiliates.testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="affiliates.testimonials.sarah.name"
              location="affiliates.testimonials.sarah.location"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              content="affiliates.testimonials.sarah.content"
              rating={5}
            />
            <TestimonialCard
              name="affiliates.testimonials.mirko.name"
              location="affiliates.testimonials.mirko.location"
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              content="affiliates.testimonials.mirko.content"
              rating={5}
            />
            <TestimonialCard
              name="affiliates.testimonials.emma.name"
              location="affiliates.testimonials.emma.location"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
              content="affiliates.testimonials.emma.content"
              rating={5}
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('affiliates.faq.title')}</h2>
          </div>

          <div className="space-y-8">
            <FAQ
              question="affiliates.faq.eligible.question"
              answer="affiliates.faq.eligible.answer"
            />
            <FAQ
              question="affiliates.faq.payment.question"
              answer="affiliates.faq.payment.answer"
            />
            <FAQ
              question="affiliates.faq.commission.question"
              answer="affiliates.faq.commission.answer"
            />
            <FAQ
              question="affiliates.faq.tracking.question"
              answer="affiliates.faq.tracking.answer"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-[#690d89] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">{t('affiliates.cta.title')}</h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/affiliate/register"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-[#690d89] bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              {t('affiliates.cta.button')}
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}