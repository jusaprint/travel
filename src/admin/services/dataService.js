import { 
  getCountriesFromDB, getCountryByIdFromDB, createCountryInDB, updateCountryInDB, deleteCountryFromDB,
  getPackagesFromDB, getPackageByIdFromDB, createPackageInDB, updatePackageInDB, deletePackageFromDB,
  getRegionsFromDB, getRegionByIdFromDB, createRegionInDB, updateRegionInDB, deleteRegionFromDB,
  getTestimonialsFromDB, getTestimonialByIdFromDB, createTestimonialInDB, updateTestimonialInDB, deleteTestimonialFromDB,
  getLanguagesFromDB, createLanguageInDB, updateLanguageInDB, deleteLanguageFromDB,
  getSettingsFromDB, updateSettingInDB, updateSettingsInDB,
  uploadMediaToDB, getMediaFromDB, deleteMediaFromDB,
  getPagesFromDB, getPageByIdFromDB, createPageInDB, updatePageInDB, deletePageFromDB,
  supabase
} from './supabaseService';

// Menu Items
export const getMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_menu_items')
      .select('*')
      .is('parent_id', null) // Get only top-level items
      .eq('status', 'active')
      .order('order', { ascending: true });
    
    if (error) throw error;

    // Get submenu items for each main menu item
    const menuWithSubmenu = await Promise.all(data.map(async (item) => {
      const { data: submenu } = await supabase
        .from('cms_menu_items')
        .select('*')
        .eq('parent_id', item.id)
        .eq('status', 'active')
        .order('order', { ascending: true });

      return {
        ...item,
        submenu: submenu || []
      };
    }));

    return menuWithSubmenu;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Return default menu items as fallback
    return [
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
    ];
  }
};

// Combo Packages
export const getComboPackages = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_combo_packages')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching combo packages:', error);
    throw error;
  }
};

export const createComboPackage = async (packageData) => {
  try {
    const { data, error } = await supabase
      .from('cms_combo_packages')
      .insert([packageData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating combo package:', error);
    throw error;
  }
};

export const updateComboPackage = async (id, packageData) => {
  try {
    const { data, error } = await supabase
      .from('cms_combo_packages')
      .update(packageData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating combo package:', error);
    throw error;
  }
};

export const deleteComboPackage = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_combo_packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting combo package:', error);
    throw error;
  }
};

export const updateComboPackageOrder = async (packages) => {
  try {
    const updates = packages.map(pkg => ({
      id: pkg.id,
      order: pkg.order
    }));

    const { error } = await supabase
      .from('cms_combo_packages')
      .upsert(updates);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating combo package order:', error);
    throw error;
  }
};

// Export all service functions
export {
  // Languages
  
  
  
  

  // Countries
  getCountriesFromDB as getCountries,
  getCountryByIdFromDB as getCountryById,
  createCountryInDB as createCountry,
  updateCountryInDB as updateCountry,
  deleteCountryFromDB as deleteCountry,

  // Packages
  getPackagesFromDB as getPackages,
  getPackageByIdFromDB as getPackageById,
  createPackageInDB as createPackage,
  updatePackageInDB as updatePackage,
  deletePackageFromDB as deletePackage,

  // Regions
  
  
  
  
  

  // Testimonials
  
  
  
  
  

  // Settings
  
  
  

  // Media
  uploadMediaToDB as uploadMedia,
  
  

  // Pages
  getPagesFromDB as getPages,
  getPageByIdFromDB as getPageById,
  createPageInDB as createPage,
  updatePageInDB as updatePage,
  deletePageFromDB as deletePage,

  // Destinations (using country functions)
  getCountriesFromDB as getDestinations,
  getCountryByIdFromDB as getDestinationById,
  createCountryInDB as createDestination,
  updateCountryInDB as updateDestination,
  deleteCountryFromDB as deleteDestination
};