export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { token, database_id, properties } = req.body;
  if (!token || !database_id || !properties) return res.status(400).json({ error: '缺少必要參數' });
  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({ parent: { database_id }, properties })
    });
    const data = await notionRes.json();
    if (notionRes.ok) return res.status(200).json({ ok: true });
    else return res.status(400).json({ ok: false, error: data.message || data.code });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
