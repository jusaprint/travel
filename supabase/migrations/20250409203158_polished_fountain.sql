/*
  # Add tab translations for all languages
  
  1. New Translations
    - Add translations for tab navigation labels in all supported languages
    - Includes English, German, French, Albanian, and Turkish
*/

-- Insert translations for tab navigation
INSERT INTO cms_translations (key, category, translations)
VALUES 
  ('tab.europe', 'navigation', '{
    "en": "Europe +",
    "de": "Europa +",
    "fr": "Europe +",
    "sq": "Evropa +",
    "tr": "Avrupa +"
  }'),
  
  ('tab.local', 'navigation', '{
    "en": "Local",
    "de": "Lokal",
    "fr": "Local",
    "sq": "Lokal",
    "tr": "Yerel"
  }'),
  
  ('tab.regions', 'navigation', '{
    "en": "Regions",
    "de": "Regionen",
    "fr": "Régions",
    "sq": "Rajonet",
    "tr": "Bölgeler"
  }')
ON CONFLICT (key) 
DO UPDATE SET translations = EXCLUDED.translations;