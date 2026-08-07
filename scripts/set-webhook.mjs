// Registers the Telegram bot webhook so contact shares (requestContact) are
// delivered to /api/telegram/webhook. Run AFTER deploy.
//
//   node scripts/set-webhook.mjs          # register the webhook
//   node scripts/set-webhook.mjs status   # show current webhook info
//   node scripts/set-webhook.mjs delete   # remove the webhook
//
// Reads BOT_TOKEN / TELEGRAM_WEBHOOK_SECRET / NEXT_PUBLIC_APP_URL from the
// environment, or from a local .env file if present.

import { readFileSync } from 'node:fs';

// Minimal .env loader (no dependencies).
try {
  const env = readFileSync('.env', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  /* no .env file — rely on real environment */
}

const token = process.env.BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const base = process.env.NEXT_PUBLIC_APP_URL;

const api = (method, params = {}) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then((r) => r.json());

if (!token) {
  console.error('Missing BOT_TOKEN (set it in the environment or a local .env)');
  process.exit(1);
}

const cmd = process.argv[2] || 'set';

if (cmd === 'status') {
  console.log(await api('getWebhookInfo'));
} else if (cmd === 'delete') {
  console.log(await api('deleteWebhook'));
} else {
  if (!base) {
    console.error('Missing NEXT_PUBLIC_APP_URL (your deployed app URL)');
    process.exit(1);
  }
  if (!secret) {
    console.error('Missing TELEGRAM_WEBHOOK_SECRET (set it before registering the webhook)');
    process.exit(1);
  }
  const url = `${base.replace(/\/$/, '')}/api/telegram/webhook`;
  console.log('Registering webhook:', url);
  console.log(await api('setWebhook', { url, secret_token: secret, drop_pending_updates: true }));
  console.log('\nVerify with: node scripts/set-webhook.mjs status');
}
