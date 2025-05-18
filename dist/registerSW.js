// This script handles service worker registration
if('serviceWorker' in navigator) {
  // Only register service worker if not in StackBlitz or WebContainer
  const isStackBlitz = window.location.hostname.includes('stackblitz') || window.location.hostname.includes('webcontainer');
  
  if (!isStackBlitz) {
    window.addEventListener('load', () => {
      // First, unregister any existing service workers
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister().then(() => {
            console.log('ServiceWorker unregistered');
          }).catch(error => {
            console.error('ServiceWorker unregistration failed: ', error);
          });
        }
        
        // Clear all caches
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              return caches.delete(cacheName);
            })
          );
        }).then(() => {
          console.log('Caches cleared');
        }).catch(error => {
          console.error('Error clearing caches:', error);
        });
        
        // Then register the new service worker
        setTimeout(() => {
          navigator.serviceWorker.register('/sw.js', { 
            scope: '/',
            updateViaCache: 'none' // Never use cache for updates
          })
            .then(registration => {
              console.log('SW registered: ', registration);
              
              // Check for updates immediately
              registration.update();
              
              // Set up periodic updates
              setInterval(() => {
                registration.update();
                console.log('Checking for SW updates');
              }, 60 * 60 * 1000); // Check every hour
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        }, 2000); // Delay registration to ensure page loads first
      });
    });
    
    // Handle service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker activated, reloading for fresh content');
      window.location.reload();
    });
  }
}