/*
  # Add Turkish translations to menu items
  
  1. Changes
    - Update existing menu items to include Turkish translations
    - Ensure all menu items have Turkish translation field
*/

-- Update main menu items with Turkish translations
UPDATE cms_menu_items
SET translations = jsonb_set(
  CASE 
    WHEN translations IS NULL THEN '{}'::jsonb
    ELSE translations
  END,
  '{tr}',
  jsonb_build_object('name',
    CASE 
      WHEN name = 'Destinations' THEN 'Destinasyonlar'
      WHEN name = 'For Business' THEN 'İş İçin'
      WHEN name = 'Support' THEN 'Destek'
      WHEN name = 'My eSIMs' THEN 'eSIM''lerim'
      WHEN name = 'Home' THEN 'Ana Sayfa'
      WHEN name = 'FAQ' THEN 'SSS'
      WHEN name = 'Contact Us' THEN 'Bize Ulaşın'
      WHEN name = 'Help Center' THEN 'Yardım Merkezi'
      WHEN name = 'Popular Destinations' THEN 'Popüler Destinasyonlar'
      WHEN name = 'By Region' THEN 'Bölgeye Göre'
      WHEN name = 'Enterprise Solutions' THEN 'Kurumsal Çözümler'
      WHEN name = 'Bulk Orders' THEN 'Toplu Siparişler'
      WHEN name = 'Partner Program' THEN 'İş Ortaklığı Programı'
      WHEN name = 'Success Stories' THEN 'Başarı Hikayeleri'
      ELSE name
    END
  )
)
WHERE name IN (
  'Destinations', 
  'For Business', 
  'Support', 
  'My eSIMs', 
  'Home', 
  'FAQ', 
  'Contact Us', 
  'Help Center', 
  'Popular Destinations', 
  'By Region', 
  'Enterprise Solutions', 
  'Bulk Orders', 
  'Partner Program', 
  'Success Stories'
);

-- Update submenu items with Turkish translations
UPDATE cms_menu_items
SET translations = jsonb_set(
  CASE 
    WHEN translations IS NULL THEN '{}'::jsonb
    ELSE translations
  END,
  '{tr}',
  jsonb_build_object('name',
    CASE 
      WHEN name = 'All Packages' THEN 'Tüm Paketler'
      WHEN name = 'Combo Packages' THEN 'Kombo Paketler'
      WHEN name = 'All Countries' THEN 'Tüm Ülkeler'
      WHEN name = 'Local Countries' THEN 'Yerel Ülkeler'
      WHEN name = 'Regions' THEN 'Bölgeler'
      WHEN name = 'All Reviews' THEN 'Tüm Değerlendirmeler'
      WHEN name = 'Video Stories' THEN 'Video Hikayeleri'
      WHEN name = 'Analytics' THEN 'Analitik'
      WHEN name = 'Settings' THEN 'Ayarlar'
      ELSE name
    END
  )
)
WHERE name IN (
  'All Packages', 
  'Combo Packages', 
  'All Countries', 
  'Local Countries', 
  'Regions', 
  'All Reviews', 
  'Video Stories', 
  'Analytics', 
  'Settings'
);

-- Insert translations for menu-related keys
INSERT INTO cms_translations (key, translations, category) VALUES
('menu.destinations', '{
  "en": "Destinations",
  "sq": "Destinacionet",
  "fr": "Destinations",
  "de": "Reiseziele",
  "tr": "Destinasyonlar"
}', 'menu'),

('menu.business', '{
  "en": "For Business",
  "sq": "Për Biznesin",
  "fr": "Pour Entreprises",
  "de": "Für Unternehmen",
  "tr": "İş İçin"
}', 'menu'),

('menu.support', '{
  "en": "Support",
  "sq": "Mbështetje",
  "fr": "Support",
  "de": "Support",
  "tr": "Destek"
}', 'menu'),

('menu.myesims', '{
  "en": "My eSIMs",
  "sq": "eSIM-et e Mia",
  "fr": "Mes eSIMs",
  "de": "Meine eSIMs",
  "tr": "eSIM''lerim"
}', 'menu'),

('menu.faq', '{
  "en": "FAQ",
  "sq": "Pyetjet e Shpeshta",
  "fr": "FAQ",
  "de": "FAQ",
  "tr": "SSS"
}', 'menu'),

('menu.contact', '{
  "en": "Contact Us",
  "sq": "Na Kontaktoni",
  "fr": "Contactez-nous",
  "de": "Kontaktieren Sie uns",
  "tr": "Bize Ulaşın"
}', 'menu'),

('menu.help', '{
  "en": "Help Center",
  "sq": "Qendra e Ndihmës",
  "fr": "Centre d''Aide",
  "de": "Hilfecenter",
  "tr": "Yardım Merkezi"
}', 'menu')

ON CONFLICT (key) DO UPDATE SET translations = EXCLUDED.translations;