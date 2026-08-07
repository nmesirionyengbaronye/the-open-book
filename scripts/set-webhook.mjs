// Registers the Telegram bot webhook so contact shares (requestContact) are
// delivered to /api/telegram/webhook. Run AFTER deploy and after setting
// BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in the environment.
//
//   node scripts/set-webhook.mjs
//
// To inspect the current webhook:  node scripts/set-webhook.mjs status
// To remove it:                    node scripts/set-webhook.mjs delete

const token = process.env.BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const base = process.env.NEXT_PUBLIC_APP_URL;

if (!token) {
  console.error('Missing BOT_TOKEN');
  process.exit(1);
}

const api = (method, params = {}) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then((r) => r.json());

const cmd = process.argv[2] || 'set';

if (cmd === 'status') {
  console.log(await api('getWebhookInfo'));
} else if (cmd === 'delete') {
  console.log(await api('deleteWebhook'));
} else {
  if (!base) {
    console.error('Missing NEXT_PUBLIC_APP_URL');
    process.exit(1);
  }
  if (!secret) {
    console.error('Missing TELEGRAM_WEBHOOK_SECRET (set it before registering the webhook)');
    process.exit(1);
  }
  const url = `${base.replace(/\/$/, '')}/api/telegram/webhook`;
  console.log(await api('setWebhook', { url, secret_token: secret, drop_pending_updates: true }));
}
