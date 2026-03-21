/**
 * Suivi Bébé — Cloudflare Worker proxy pour l'API Grist
 * Résout les restrictions CORS de Safari iOS
 *
 * Déploiement :
 *   1. https://dash.cloudflare.com → Workers & Pages → Create Worker
 *   2. Coller ce code → Deploy
 *   3. Copier l'URL du worker (ex: suivi-bebe.moncompte.workers.dev)
 *   4. Entrer cette URL dans l'app au moment de la configuration
 */

const GRIST_BASE = 'https://docs.getgrist.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // Répondre au preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      const url      = new URL(request.url);
      const gristUrl = GRIST_BASE + url.pathname + url.search;

      const headers = {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type':  request.headers.get('Content-Type')  || 'application/json',
      };

      const body = ['GET', 'HEAD'].includes(request.method)
        ? undefined
        : await request.text();

      const resp = await fetch(gristUrl, { method: request.method, headers, body });
      const text = await resp.text();

      return new Response(text, {
        status: resp.status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  },
};
