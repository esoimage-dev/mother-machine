-- DEADLINE · le tabelle su Cloudflare D1 (database collegato al sito con il nome DL_DB).
-- Si incolla tutto nella console del database (Cloudflare -> Storage & Databases -> D1 -> il database -> Console).
-- Si puo' rilanciare: non cancella niente.

-- i punteggi: una riga per partita (run), anche se respinta (cosi' una partita manda una volta sola)
CREATE TABLE IF NOT EXISTS dl_scores (
  run TEXT PRIMARY KEY,            -- id della partita, firmato dal server all'inizio
  initials TEXT NOT NULL,          -- tre caratteri A-Z 0-9, gia' filtrati
  score INTEGER NOT NULL,          -- HOURS SAVED
  day INTEGER NOT NULL,            -- giorno raggiunto: 0 = TUE ... 6 = MON
  boss INTEGER NOT NULL DEFAULT 0, -- 1 = MONDAY battuto
  duration INTEGER NOT NULL,       -- secondi giocati
  created INTEGER NOT NULL,        -- ms
  verified INTEGER NOT NULL,       -- 1 = passa i controlli, entra in classifica
  why TEXT                         -- se respinta: il controllo che non torna
);
CREATE INDEX IF NOT EXISTS dl_scores_top ON dl_scores (verified, score DESC, created);

-- le insegne dei vincitori: in attesa finche' Eso non le approva
CREATE TABLE IF NOT EXISTS dl_signs (
  id TEXT PRIMARY KEY,             -- 24 cifre esadecimali; il PNG sta su R2 in signs/<id>.png
  run TEXT NOT NULL UNIQUE,        -- una insegna per partita vinta
  initials TEXT NOT NULL,
  name TEXT NOT NULL,              -- nome dell'attivita'
  name_key TEXT NOT NULL,          -- nome semplificato, per "una insegna per attivita'"
  link TEXT NOT NULL,              -- https://... o Instagram
  link_key TEXT NOT NULL,
  line TEXT NOT NULL,              -- cosa fanno, max 60
  kind TEXT NOT NULL,              -- food, fashion, shop, beauty, hotel, services
  email TEXT,                      -- solo per scrivere al vincitore; NULL dopo la decisione di Eso
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created INTEGER NOT NULL,
  decided INTEGER
);
CREATE INDEX IF NOT EXISTS dl_signs_status ON dl_signs (status, decided DESC);
CREATE INDEX IF NOT EXISTS dl_signs_name ON dl_signs (name_key, status);
CREATE INDEX IF NOT EXISTS dl_signs_link ON dl_signs (link_key, status);

-- il limite di tentativi: una riga per (rotta, impronta dell'IP), si azzera a ogni finestra
CREATE TABLE IF NOT EXISTS dl_rate (
  k TEXT PRIMARY KEY,
  win INTEGER NOT NULL,            -- inizio della finestra, in secondi
  n INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS dl_rate_win ON dl_rate (win);
