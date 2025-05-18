import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

export default function SEO({ 
  title, 
  description, 
  image, 
  article = false,
  alternateLanguages = [],
  schema
}) {
  const { settings } = useSettings();
  const { i18n } = useTranslation();
  const location = useLocation();

  const siteTitle = settings?.site?.title || 'KudoSIM';
  const siteDescription = settings?.site?.tagline || 'Global Connectivity for Modern Travelers';
  const siteUrl = 'https://kudosim.com'; // Replace with your actual domain

  const seo = {
    title: title ? `${title} | ${siteTitle}` : siteTitle,
    description: description || siteDescription,
    image: image || `${siteUrl}/og-image.jpg`, // Default social sharing image
    url: `${siteUrl}${location.pathname}`,
    canonical: `${siteUrl}${location.pathname}`
  };

  // Generate hreflang links for all supported languages
  const hrefLangLinks = alternateLanguages.map(lang => ({
    rel: 'alternate',
    hrefLang: lang,
    href: `${siteUrl}/${lang}${location.pathname}`
  }));

  // Add x-default hreflang
  hrefLangLinks.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: `${siteUrl}${location.pathname}`
  });

  // Default schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteTitle,
    "url": siteUrl,
    "logo": `${siteUrl}/kudosim-logo.svg`,
    "sameAs": [
      "https://facebook.com/kudosim",
      "https://twitter.com/kudosim",
      "https://instagram.com/kudosim",
      "https://linkedin.com/company/kudosim"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={i18n.language} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:locale" content={i18n.language} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kudosim" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Alternate Language Links */}
      {hrefLangLinks.map((link, index) => (
        <link key={index} {...link} />
      ))}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>

      {/* Mobile Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#690d89" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
    </Helmet>
  );
}