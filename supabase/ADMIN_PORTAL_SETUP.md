# Portail d’administration HERITAGE — mise en service Supabase

Ce guide est la procédure de mise en service du portail. Exécutez **uniquement** la migration `migrations/20260910_admin_portal.sql` : l’ancien fichier `schema.sql` est un bootstrap historique et ne doit pas être relancé après cette migration.

## 1. Révoquer la clé exposée auparavant

Une clé `service_role` figurait dans une version précédente du serveur. Dans Supabase : **Project Settings → API → Reset service_role key**, révoquez-la avant toute mise en production.

Ne mettez jamais cette clé dans une variable `VITE_*`, dans Git ou dans le navigateur.

## 2. Configurer les variables locales et de déploiement

Copiez `.env.example` vers `.env`, puis renseignez :

```dotenv
SUPABASE_URL=https://VOTRE_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=VOTRE_NOUVELLE_CLE_SERVICE_ROLE
VITE_SUPABASE_URL=https://VOTRE_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_PUBLIQUE
```

`SUPABASE_SERVICE_ROLE_KEY` est une variable serveur uniquement. Sur l’hébergeur, ajoutez les quatre variables dans les secrets/environnements du service Node avant de redémarrer l’application.

## 3. Exécuter le SQL principal

Dans **Supabase Dashboard → SQL Editor → New query**, copiez-collez puis exécutez entièrement :

[`migrations/20260910_admin_portal.sql`](./migrations/20260910_admin_portal.sql)

Cette migration crée et protège les profils, catalogue enrichi, variantes, médias, avis, blogs, F.A.Q., pages légales, métadonnées, coordonnées, pixels, codes d’invitation, journal d’audit et le bucket `heritage-media`.

## 4. Créer le premier administrateur

1. Dans **Authentication → Users → Add user**, créez le premier compte avec son adresse et un mot de passe fort. Activez la confirmation e-mail immédiate si l’option est proposée.
2. Exécutez ensuite ce SQL, en remplaçant l’adresse :

```sql
insert into public.profiles (id, email, full_name, role, is_active)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'full_name', ''),
  'admin',
  true
from auth.users
where lower(email) = lower('admin@votre-domaine.com')
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = 'admin',
    is_active = true;
```

3. Contrôlez le résultat :

```sql
select email, full_name, role, is_active, created_at
from public.profiles
where lower(email) = lower('admin@votre-domaine.com');
```

## 5. Recréer les profils d’utilisateurs existants si nécessaire

À exécuter une seule fois si des utilisateurs existaient déjà dans **Authentication** mais n’apparaissent pas dans `public.profiles` :

```sql
insert into public.profiles (id, email, full_name, role, is_active)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'full_name', ''),
  'customer',
  true
from auth.users
on conflict (id) do update
set email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);
```

## 6. Réglages Auth à confirmer dans Supabase

- **Authentication → Providers** : activez Email.
- **Authentication → URL Configuration** : ajoutez `http://localhost:3000` pour le développement et l’URL HTTPS finale du site dans **Site URL** et les **Redirect URLs** autorisées.
- Conservez la confirmation e-mail pour les comptes clients si vous l’utilisez. Les comptes administrateurs créés avec un code sont confirmés par le serveur seulement après validation du code.
- Configurez une longueur minimale de mot de passe d’au moins 12 caractères dans les réglages Auth si votre projet propose ce paramètre. Le formulaire admin l’impose déjà.

## 7. Démarrage et contrôle

```powershell
npm run dev
```

Puis ouvrez :

- Connexion : `http://localhost:3000/admin/login`
- Création d’un admin avec code : `http://localhost:3000/admin/create`

Après connexion avec le premier administrateur :

1. Ouvrez **Administrateurs** et générez un code.
2. Transmettez ce code au membre du personnel par un canal privé.
3. Il crée son compte sur `/admin/create` avec un mot de passe de 12 caractères minimum.
4. Le code est haché en base, est utilisable une seule fois et expire au plus tard une heure après sa création.
5. Désactivez un compte de test : sa session est refusée par le portail et son utilisateur Auth est banni jusqu’à réactivation.

## Limites de périmètre

Le portail gère déjà les données Supabase de toutes les interfaces demandées. Les contenus éditoriaux créés dans le portail (blogs, avis, F.A.Q., légales, coordonnées, métadonnées et pixels) ne sont pas encore rendus dynamiquement dans les pages publiques : cette connexion du front public serait une tâche distincte, volontairement non modifiée ici.
