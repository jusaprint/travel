import { supabase } from '../../lib/cms';

// Re-export supabase instance
export { supabase };

// Countries
export const getCountriesFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_countries')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const getCountryByIdFromDB = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cms_countries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching country:', error);
    throw error;
  }
};

export const createCountryInDB = async (countryData) => {
  try {
    const { data, error } = await supabase
      .from('cms_countries')
      .insert([countryData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating country:', error);
    throw error;
  }
};

export const updateCountryInDB = async (id, countryData) => {
  try {
    const { data, error } = await supabase
      .from('cms_countries')
      .update(countryData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating country:', error);
    throw error;
  }
};

export const deleteCountryFromDB = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_countries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting country:', error);
    throw error;
  }
};

// Packages
export const getPackagesFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

export const getPackageByIdFromDB = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cms_packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};

export const createPackageInDB = async (packageData) => {
  try {
    const { data, error } = await supabase
      .from('cms_packages')
      .insert([packageData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const updatePackageInDB = async (id, packageData) => {
  try {
    const { data, error } = await supabase
      .from('cms_packages')
      .update(packageData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

export const deletePackageFromDB = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

// Media
export const getMediaFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
};

export const deleteMediaFromDB = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_media')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};

export const uploadMediaToDB = async (file, metadata = {}) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `media/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('cms_media')
      .insert([{
        filename: fileName,
        url: publicUrl,
        mime_type: file.type,
        size: file.size,
        metadata
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

// Pages
export const getPagesFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
};

export const getPageByIdFromDB = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
};

export const createPageInDB = async (pageData) => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .insert([pageData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

export const updatePageInDB = async (id, pageData) => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .update(pageData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

export const deletePageFromDB = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

// Settings
export const getSettingsFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_settings')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettingInDB = async (key, value) => {
  try {
    const { data, error } = await supabase
      .from('cms_settings')
      .upsert({ key, value })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating setting:', error);
    throw error;
  }
};

export const updateSettingsInDB = async (settings) => {
  try {
    const { error } = await supabase
      .from('cms_settings')
      .upsert(settings);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// Languages
export const getLanguagesFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_languages')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

export const createLanguageInDB = async (langData) => {
  try {
    const { data, error } = await supabase
      .from('cms_languages')
      .insert([langData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating language:', error);
    throw error;
  }
};

export const updateLanguageInDB = async (code, langData) => {
  try {
    const { data, error } = await supabase
      .from('cms_languages')
      .update(langData)
      .eq('code', code)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating language:', error);
    throw error;
  }
};

export const deleteLanguageFromDB = async (code) => {
  try {
    const { error } = await supabase
      .from('cms_languages')
      .delete()
      .eq('code', code);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting language:', error);
    throw error;
  }
};

// Testimonials
export const getTestimonialsFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const getTestimonialByIdFromDB = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cms_testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    throw error;
  }
};

export const createTestimonialInDB = async (testimonialData) => {
  try {
    const { data, error } = await supabase
      .from('cms_testimonials')
      .insert([testimonialData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const updateTestimonialInDB = async (id, testimonialData) => {
  try {
    const { data, error } = await supabase
      .from('cms_testimonials')
      .update(testimonialData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonialFromDB = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

// Regions
export const getRegionsFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('cms_regions')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getRegionByIdFromDB = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cms_regions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching region:', error);
    throw error;
  }
};

export const createRegionInDB = async (regionData) => {
  try {
    const { data, error } = await supabase
      .from('cms_regions')
      .insert([regionData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

export const updateRegionInDB = async (id, regionData) => {
  try {
    const { data, error } = await supabase
      .from('cms_regions')
      .update(regionData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
};

export const deleteRegionFromDB = async (id) => {
  try {
    const { error } = await supabase
      .from('cms_regions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting region:', error);
    throw error;
  }
};