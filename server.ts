import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Supabase Service Role Client (Côté Serveur uniquement - Clé sécurisée)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rhsmxnpajesyhfzjyueu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoc214bnBhamVzeWhmemp5dWV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk1MzMzOCwiZXhwIjoyMTA0NTI5MzM4fQ.VJHwUFMbsmjsQJ7Ww-mKgCzf2C5yeNwrgvHf8w-OwgA';

let supabaseAdmin: any = null;
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return supabaseAdmin;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Santé du serveur
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Statut de connexion Supabase & vérification des tables
app.get('/api/supabase/status', async (req: Request, res: Response) => {
  try {
    const admin = getSupabaseAdmin();
    const { data: users, error: usersErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });

    const tables = {
      profiles: false,
      products: false,
      orders: false,
      order_items: false
    };

    const { error: profErr } = await admin.from('profiles').select('id').limit(1);
    tables.profiles = !profErr;

    const { error: prodErr } = await admin.from('products').select('id').limit(1);
    tables.products = !prodErr;

    const { error: ordErr } = await admin.from('orders').select('id').limit(1);
    tables.orders = !ordErr;

    const { error: itmErr } = await admin.from('order_items').select('id').limit(1);
    tables.order_items = !itmErr;

    res.json({
      connected: !usersErr,
      projectUrl: SUPABASE_URL,
      usersCount: users?.users?.length || 0,
      tables,
      authConfigured: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Liste des utilisateurs clients enregistrés (Auth Admin)
app.get('/api/admin/users', async (req: Request, res: Response) => {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) throw error;
    res.json(data.users || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Métriques pour le tableau de bord d'administration
app.get('/api/admin/metrics', async (req: Request, res: Response) => {
  try {
    const admin = getSupabaseAdmin();
    const { data: orders, error } = await admin.from('orders').select('*');

    if (error) {
      // Si la table orders n'existe pas encore dans Supabase
      return res.json({
        totalRevenueXOF: 1850000,
        totalOrdersCount: 4,
        pendingOrders: 1,
        source: 'local_preview'
      });
    }

    const totalRevenueXOF = (orders || []).reduce(
      (acc: number, curr: any) => acc + (Number(curr.total_xof) || 0),
      0
    );

    const pendingOrders = (orders || []).filter((o: any) =>
      ['pending_payment', 'paid', 'processing'].includes(o.status)
    ).length;

    res.json({
      totalRevenueXOF,
      totalOrdersCount: orders?.length || 0,
      pendingOrders,
      source: 'supabase'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Démarrage du serveur et montage de Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maison HERITAGE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
