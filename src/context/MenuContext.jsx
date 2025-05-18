import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMenuItems } from '../admin/services/dataService';

const MenuContext = createContext(null);

// Custom hook to use the menu context
const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

// Provider component
function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([
    { 
      name: 'Destinations', 
      href: '/destinations', 
      icon: 'globe',
      order: 1,
      submenu: []
    },
    { 
      name: 'For Business', 
      href: '/business', 
      icon: 'briefcase',
      order: 2,
      submenu: []
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: 'support',
      order: 3,
      submenu: []
    },
    { 
      name: 'My eSIMs', 
      href: '/my-esims', 
      icon: 'sim',
      order: 4,
      submenu: []
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMenuItems();
        if (data && data.length > 0) {
          setMenuItems(data);
        }
      } catch (err) {
        console.error('Error loading menu items:', err);
        setError('Failed to load menu items');
        // Keep using default menu items if there's an error
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      globe: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      briefcase: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      support: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      sim: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    };

    return icons[iconName] || icons.globe;
  };

  return (
    <MenuContext.Provider value={{ menuItems, loading, error, getIcon }}>
      {children}
    </MenuContext.Provider>
  );
}

export { MenuProvider,  };