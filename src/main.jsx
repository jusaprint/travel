import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n' // Import i18n configuration
import { LanguageProvider } from './context/LanguageContext'
import { TranslationProvider } from './context/TranslationContext'

// Use createRoot API
const container = document.getElementById('root');
const root = createRoot(container);

// Render immediately without waiting for DOMContentLoaded
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </LanguageProvider>
  </React.StrictMode>
);

// Add performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Report web vitals
  const reportWebVitals = onPerfEntry => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  };

  // Log performance metrics
  reportWebVitals(console.log);
}

// Only register service worker if not in StackBlitz
const isStackBlitz = window.location.hostname.includes('stackblitz') || window.location.hostname.includes('webcontainer');
if ('serviceWorker' in navigator && !isStackBlitz) {
  window.addEventListener('load', async () => {
    try {
      // Unregister all existing service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('ServiceWorker unregistered');
      }
      
      // Clear caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
      console.log('Caches cleared');
      
      // Register a new service worker
      setTimeout(async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none' // Never use cache for updates
          });
          console.log('SW registered:', registration);
          
          // Force update check
          registration.update();
        } catch (error) {
          console.error('SW registration failed:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error managing service worker:', error);
    }
  });
  
  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('New service worker activated, reloading for fresh content');
    window.location.reload();
  });
}