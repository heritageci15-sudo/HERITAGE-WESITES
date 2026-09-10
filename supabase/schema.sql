-- ==============================================================================
-- MAISON HERITAGE — SCHEMA SUPABASE OFFICIEL (POSTGRESQL + RLS)
-- Projet Supabase : https://rhsmxnpajesyhfzjyueu.supabase.co
-- À exécuter dans : https://supabase.com/dashboard/project/rhsmxnpajesyhfzjyueu/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES PROFILS CLIENTS & ADMINISTRATEURS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  commune TEXT,
  delivery_address TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. TABLE DES PRODUITS HORLOGERS (CATALOGUE & STOCKS)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  reference TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Tissot',
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'montres',
  price_xof NUMERIC NOT NULL CHECK (price_xof >= 0),
  stock_status TEXT NOT NULL DEFAULT 'En stock',
  stock_count INTEGER NOT NULL DEFAULT 1 CHECK (stock_count >= 0),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  primary_image TEXT NOT NULL,
  additional_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_description TEXT,
  value_story_title TEXT,
  value_story_text TEXT,
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  provenance_summary TEXT,
  warranty_summary TEXT,
  delivery_summary TEXT,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- 4. TABLE DES COMMANDES
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_commune TEXT NOT NULL,
  customer_delivery_address TEXT NOT NULL,
  customer_notes TEXT,
  delivery_mode TEXT NOT NULL DEFAULT 'livraison_abidjan',
  status TEXT NOT NULL DEFAULT 'pending_payment',
  subtotal_xof NUMERIC NOT NULL,
  delivery_cost_xof NUMERIC NOT NULL DEFAULT 0,
  total_xof NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 5. TABLE DES ARTICLES COMMANDÉS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_sku TEXT,
  product_name TEXT NOT NULL,
  product_reference TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_xof NUMERIC NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. DÉCLENCHEUR POUR CRÉATION AUTOMATIQUE DU PROFIL À L'INSCRIPTION AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.phone,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. ACTIVATION DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- POLITIQUES SUR PROFILES
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
CREATE POLICY "Public can view basic profiles"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- POLITIQUES SUR PRODUCTS
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
CREATE POLICY "Anyone can view published products"
  ON public.products FOR SELECT
  USING (status = 'published' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role manages products" ON public.products;
CREATE POLICY "Service role manages products"
  ON public.products FOR ALL
  USING (auth.role() = 'service_role');

-- POLITIQUES SUR ORDERS
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their orders" ON public.orders;
CREATE POLICY "Users can view their orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt()->>'email' = customer_email
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Service role manages orders" ON public.orders;
CREATE POLICY "Service role manages orders"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role');

-- POLITIQUES SUR ORDER_ITEMS
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view order items" ON public.order_items;
CREATE POLICY "Users can view order items"
  ON public.order_items FOR SELECT
  USING (true);

-- 8. PEUPLEMENT INITIAL DES 6 MODÈLES TISSOT DE LA MAISON HERITAGE
INSERT INTO public.products (
  id, sku, reference, brand, name, slug, category, price_xof, stock_status, stock_count, status,
  primary_image, short_description, value_story_title, value_story_text, attributes,
  provenance_summary, warranty_summary, delivery_summary
)
VALUES
(
  'prod-tissot-le-locle-01',
  'T006.407.11.033.00',
  'T006.407.11.033.00',
  'Tissot',
  'Tissot Le Locle Powermatic 80',
  'tissot-le-locle-powermatic-80',
  'montres',
  460000,
  'En stock',
  3,
  'published',
  '/assets/products/tissot-le-locle.jpg',
  'Montre habillée emblématique suisse avec mouvement automatique Powermatic 80 et cadran guilloché Clous de Paris.',
  'La Signature Horlogère du Berceau Suisse',
  'Nommée d''après la commune berceau de Tissot dans les montagnes du Jura suisse, la Le Locle incarne l''héritage intemporel.',
  '{"modele": "Tissot Le Locle Powermatic 80", "reference": "T006.407.11.033.00", "diametre": "39,3 mm", "boitier": "Acier inoxydable 316L", "verre": "Saphir inrayable avec traitement antireflet", "fondDeBoite": "Transparent gravé, mouvement apparent", "mouvement": "Automatique", "reserveDeMarche": "Jusqu''à 80 heures (Powermatic 80)", "bracelet": "Acier inoxydable 316L, boucle déployante papillon avec boutons-poussoirs", "etancheite": "Jusqu''à 3 bar (30 m / 100 ft)", "cadran": "Argenté guilloché Clous de Paris", "indexAiguilles": "Chiffres romains et aiguilles feuilles en acier bleui", "guichetDate": "À 3 heures", "fabrication": "Swiss Made"}'::jsonb,
  'Pièce authentifiée et certifiée provenant des distributeurs officiels suisses.',
  'Garantie internationale fabricant de 2 ans + prise en charge personnalisée par HERITAGE à Abidjan.',
  'Livraison sécurisée sous pli scellé à Abidjan sous 24h à 48h ou retrait sur rendez-vous à la Maison HERITAGE.'
),
(
  'prod-tissot-pr516-blue-02',
  'T149.417.11.041.00',
  'T149.417.11.041.00',
  'Tissot',
  'Tissot PR516 Chronographe Bleu',
  'tissot-pr516-chronographe-bleu',
  'montres',
  380000,
  'En stock',
  2,
  'published',
  '/assets/products/tissot-pr516-blue.jpg',
  'Chronographe mécanique d''inspiration sportive vintage des années 1970 au cadran soleillé bleu nuit.',
  'L''Énergie Vintage du Sport Automobile',
  'Hommage vibrant au chronographe légendaire de 1970, associant précision chronométrique suisse et cadran de caractère.',
  '{"modele": "Tissot PR516 Chronographe Quartz", "reference": "T149.417.11.041.00", "diametre": "40,0 mm", "boitier": "Acier inoxydable 316L brossé et poli", "verre": "Verre saphir bombé résistant aux rayures", "mouvement": "Quartz", "bracelet": "Acier inoxydable multi-maillons racing", "etancheite": "Jusqu''à 10 bar (100 m / 330 ft)", "cadran": "Bleu soleillé intense avec compteurs argentés", "fabrication": "Swiss Made"}'::jsonb,
  'Pièce authentifiée et certifiée provenant des distributeurs officiels suisses.',
  'Garantie internationale fabricant de 2 ans + prise en charge personnalisée par HERITAGE à Abidjan.',
  'Livraison sécurisée sous pli scellé à Abidjan sous 24h à 48h ou retrait sur rendez-vous à la Maison HERITAGE.'
),
(
  'prod-tissot-seastar-black-03',
  'T120.410.11.051.00',
  'T120.410.11.051.00',
  'Tissot',
  'Tissot Seastar 1000 Noir & Acier',
  'tissot-seastar-1000-noir',
  'montres',
  350000,
  'En stock',
  4,
  'published',
  '/assets/products/tissot-seastar-black.jpg',
  'Montre de plongée professionnelle étanche jusqu''à 30 bar (300 m) avec lunette tournante unidirectionnelle.',
  'L''Alliance de la Haute Mer et de l''Élégance Urbaine',
  'Performance aquatique absolue et design résolu pour le poignet contemporain à Abidjan.',
  '{"modele": "Tissot Seastar 1000", "reference": "T120.410.11.051.00", "diametre": "40,0 mm", "boitier": "Acier inoxydable 316L, couronne vissée", "verre": "Saphir inrayable avec traitement antireflet double face", "mouvement": "Quartz", "bracelet": "Acier inoxydable avec rallonge de plongée", "etancheite": "Jusqu''à 30 bar (300 m / 1000 ft)", "cadran": "Noir soleillé profond, index Super-LumiNova", "fabrication": "Swiss Made"}'::jsonb,
  'Pièce authentifiée et certifiée provenant des distributeurs officiels suisses.',
  'Garantie internationale fabricant de 2 ans + prise en charge personnalisée par HERITAGE à Abidjan.',
  'Livraison sécurisée sous pli scellé à Abidjan sous 24h à 48h ou retrait sur rendez-vous à la Maison HERITAGE.'
),
(
  'prod-tissot-chemin-gold-04',
  'T099.407.22.038.00',
  'T099.407.22.038.00',
  'Tissot',
  'Tissot Chemin des Tourelles Or & Acier',
  'tissot-chemin-des-tourelles-bicolore',
  'montres',
  620000,
  'Stock limité',
  1,
  'published',
  '/assets/products/tissot-chemin-gold.jpg',
  'Pièce de haute horlogerie suisse bicolore or rose et acier, cadran argenté soleillé et mouvement Powermatic 80.',
  'Le Symbole de l''Accomplissement et du Prestige',
  'La Chemin des Tourelles tire son nom de la rue où Tissot a établi son siège en 1907. Une présence d''exception.',
  '{"modele": "Tissot Chemin des Tourelles Powermatic 80 Bicolore", "reference": "T099.407.22.038.00", "diametre": "42,0 mm", "boitier": "Acier inoxydable 316L avec revêtement PVD or rose", "verre": "Saphir inrayable bombé avec traitement antireflet", "mouvement": "Automatique", "reserveDeMarche": "Jusqu''à 80 heures (Powermatic 80 Nivachron)", "bracelet": "Bicolore acier et PVD or rose, fermoir papillon", "etancheite": "Jusqu''à 5 bar (50 m / 165 ft)", "cadran": "Argenté opalin avec chiffres romains dorés", "fabrication": "Swiss Made"}'::jsonb,
  'Pièce authentifiée et certifiée provenant des distributeurs officiels suisses.',
  'Garantie internationale fabricant de 2 ans + prise en charge personnalisée par HERITAGE à Abidjan.',
  'Livraison sécurisée sous pli scellé à Abidjan sous 24h à 48h ou retrait sur rendez-vous à la Maison HERITAGE.'
),
(
  'prod-tissot-pr100-classic-05',
  'T101.410.11.031.00',
  'T101.410.11.031.00',
  'Tissot',
  'Tissot PR100 Classic Argentée',
  'tissot-pr100-classic-argent',
  'montres',
  240000,
  'En stock',
  5,
  'published',
  '/assets/products/tissot-pr100.jpg',
  'L''archétype du garde-temps suisse du quotidien : robuste, précis, étanche à 100 mètres et doté d''un verre saphir.',
  'Précision et Robustesse pour Tous les Instants',
  'La PR100 incarne la fiabilité éprouvée de la manufacture suisse : un design épuré convenant à toute occasion.',
  '{"modele": "Tissot PR100 Quartz", "reference": "T101.410.11.031.00", "diametre": "39,0 mm", "boitier": "Acier inoxydable 316L massif", "verre": "Verre saphir inrayable", "mouvement": "Quartz", "bracelet": "Acier inoxydable 316L à boucle déployante", "etancheite": "Jusqu''à 10 bar (100 m / 330 ft)", "cadran": "Argenté soleillé satiné avec guichet date à 6 heures", "fabrication": "Swiss Made"}'::jsonb,
  'Pièce authentifiée et certifiée provenant des distributeurs officiels suisses.',
  'Garantie internationale fabricant de 2 ans + prise en charge personnalisée par HERITAGE à Abidjan.',
  'Livraison sécurisée sous pli scellé à Abidjan sous 24h à 48h ou retrait sur rendez-vous à la Maison HERITAGE.'
),
(
  'prod-tissot-seastar-red-06',
  'T120.417.17.051.01',
  'T120.417.17.051.01',
  'Tissot',
  'Tissot Seastar 1000 Édition Rouge Rubis',
  'tissot-seastar-1000-rouge',
  'montres',
  395000,
  'En stock',
  2,
  'published',
  '/assets/products/tissot-seastar-red.jpg',
  'Chronographe de plongée 300 mètres avec lunette rouge rubis céramique et bracelet technique haute durabilité.',
  'Caractère Affirmé et Performance Extrême',
  'Une déclinaison énergique et prestigieuse avec un contraste saisissant entre le cadran noir mat et la lunette rouge rubis.',
  '{"modele": "Tissot Seastar 1000 Chronograph", "reference": "T120.417.17.051.01", "diametre": "45,5 mm", "boitier": "Acier inoxydable 316L, poussoirs et couronne vissés", "verre": "Saphir inrayable avec traitement antireflet", "mouvement": "Quartz", "bracelet": "Caoutchouc texturé résistant avec boucle ardillon", "etancheite": "Jusqu''à 30 bar (300 m / 1000 ft)", "cadran": "Noir avec compteurs de chronographe précis au 1/10e de seconde", "fabrication": "Swiss Made"}'::jsonb,
  'Pièce authentifiée et certifiée provenant des distributeurs officiels suisses.',
  'Garantie internationale fabricant de 2 ans + prise en charge personnalisée par HERITAGE à Abidjan.',
  'Livraison sécurisée sous pli scellé à Abidjan sous 24h à 48h ou retrait sur rendez-vous à la Maison HERITAGE.'
)
ON CONFLICT (id) DO NOTHING;
