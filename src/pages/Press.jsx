import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/cms';
import SEO from '../components/SEO';

const PressCard = ({ article }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <a href={article.source_url} target="_blank" rel="noopener noreferrer">
      <div className="aspect-video overflow-hidden">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          width="1280"
          height="720"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">
            {new Date(article.publication_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-sm font-medium text-[#690d89]">
            {article.source_name}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 line-clamp-3">
          {article.description}
        </p>
        <div className="mt-4 flex items-center text-[#690d89] font-medium">
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </a>
  </motion.div>
);

export default function Press() {
  const { t } = useTranslation();
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPressReleases = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_press')
          .select('*')
          .order('publication_date', { ascending: false });

        if (error) throw error;
        setPressReleases(data || []);
      } catch (error) {
        console.error('Error loading press releases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPressReleases();
  }, []);

  return (
    <>
      <SEO 
        title="Press Coverage & Media Releases"
        description="Stay up to date with KudoSIM's latest press coverage, news, and media releases. Read what the media is saying about our global eSIM solutions."
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "KudoSIM Press Coverage & Media Releases",
          "description": "Latest press coverage and media releases about KudoSIM's global eSIM solutions",
          "publisher": {
            "@type": "Organization",
            "name": "KudoSIM",
            "logo": {
              "@type": "ImageObject",
              "url": "https://kudosim.com/kudosim-logo.svg"
            }
          }
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#690d89]/5 to-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              Press Coverage & Media Releases
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Stay up to date with our latest news and media coverage
            </motion.p>
          </div>

          {/* Featured Articles */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pressReleases
                .filter(article => article.featured)
                .map(article => (
                  <PressCard key={article.id} article={article} />
                ))}
            </div>
          </div>

          {/* All Press Coverage */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Press Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pressReleases
                .filter(article => !article.featured)
                .map(article => (
                  <PressCard key={article.id} article={article} />
                ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && pressReleases.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No press coverage yet</h3>
              <p className="mt-2 text-sm text-gray-500">Check back soon for updates</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}