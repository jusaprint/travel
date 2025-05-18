/*
  # Add popup settings table
  
  1. New Migrations
    - Add popup settings to cms_settings table
    - Set default values for popup configuration
    
  2. Security
    - Uses existing RLS policies for cms_settings table
    
  3. Changes
    - Adds a new record to cms_settings with key 'popup'
    - Includes default configuration for the popup
*/

-- Insert default popup settings if they don't exist
INSERT INTO cms_settings (key, value)
VALUES (
  'popup',
  '{
    "enabled": false,
    "delay": 3000,
    "background_image": "",
    "translations": {
      "en": {
        "title": "Get 1GB Free Internet!",
        "description": "Download our app now and enjoy 1GB of free data."
      },
      "sq": {
        "title": "Merrni 1GB Internet Falas!",
        "description": "Shkarkoni aplikacionin tonë tani dhe shijoni 1GB të dhëna falas."
      },
      "fr": {
        "title": "Obtenez 1GB d''Internet Gratuit!",
        "description": "Téléchargez notre application maintenant et profitez de 1GB de données gratuites."
      },
      "de": {
        "title": "Erhalte 1GB kostenloses Internet!",
        "description": "Lade jetzt unsere App herunter und genieße 1GB kostenlose Daten."
      },
      "tr": {
        "title": "1GB Ücretsiz İnternet Alın!",
        "description": "Şimdi uygulamamızı indirin ve 1GB ücretsiz veri keyfini çıkarın."
      }
    },
    "app_store_url": "https://apps.apple.com/app/kudosim",
    "play_store_url": "https://play.google.com/store/apps/details?id=com.kudosim"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;