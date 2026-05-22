const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-app-password',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const appPassword = process.env.APP_PASSWORD || 'artsolucions2025';
  if ((event.headers['x-app-password'] || '') !== appPassword) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'No autorizado' }) };
  }

  try {
    const { action, key, data } = JSON.parse(event.body || '{}');
    const store = getStore('presupuestos');

    if (action === 'save') {
      await store.set(key, JSON.stringify(data), {
        metadata: { savedAt: new Date().toISOString(), numero: data?.info?.numero || key, cliente: data?.info?.cliente || '' }
      });
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
    if (action === 'load') {
      const value = await store.get(key);
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ data: value ? JSON.parse(value) : null }) };
    }
    if (action === 'list') {
      const { blobs } = await store.list({ includeMeta: true });
      const list = blobs
        .map(b => ({ key: b.key, savedAt: b.metadata?.savedAt || '', numero: b.metadata?.numero || b.key, cliente: b.metadata?.cliente || '' }))
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ list }) };
    }
    if (action === 'delete') {
      await store.delete(key);
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Acción desconocida' }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
