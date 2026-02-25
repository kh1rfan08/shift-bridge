ALTER TABLE magic_links ADD COLUMN code TEXT;
CREATE INDEX IF NOT EXISTS idx_magic_links_code ON magic_links(code);
