exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-holded-key, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  const apiKey = event.headers['x-holded-key'];
  if (!apiKey) {
    return { statusCode: 401, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'API Key no proporcionada' }) };
  }

  // Build Holded URL from the path after /api/holded
  const subpath = event.path.replace(/^\/?api\/holded/, '') || '/';
  const query   = event.rawQuery ? '?' + event.rawQuery : '';
  const url     = `https://api.holded.com${subpath}${query}`;

  try {
    const resp = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: ['POST', 'PUT'].includes(event.httpMethod) ? event.body : undefined,
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return {
      statusCode: resp.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
