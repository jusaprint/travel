/*
  # Add Turkish language to cms_languages table
  
  1. Changes
    - Add Turkish language to cms_languages table
    - Set proper language code, name and flag
    - Ensure it's not set as default
*/

INSERT INTO cms_languages (
  code,
  name,
  flag,
  is_default
)
VALUES 
  ('tr', 'Türkçe', 'TR', false)
ON CONFLICT (code) 
DO UPDATE SET
  name = EXCLUDED.name,
  flag = EXCLUDED.flag,
  is_default = EXCLUDED.is_default;