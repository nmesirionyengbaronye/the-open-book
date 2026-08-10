// Sets up the Telegram bot for the Rewards Mini App:
// 1. Registers the webhook (for receiving contact shares via requestContact)
// 2. Sets the bot's menu button web_app URL (this is CRITICAL — without a
//    full HTTPS web_app URL, window.Telegram.WebApp is unavailable and the
//    Share Phone Number button won't work)
//
// Run AFTER deploy to production:
//
//   node scripts/set-webhook.mjs          # register webhook + set menu button
//   node scripts/set-webhook.mjs status   # check webhook + menu button
//   node scripts/set-webhook.mjs webhook  # webhook only
//   node scripts/set-webhook.mjs menu     # menu button only
//   node scripts/set-webhook.mjs delete   # remove webhook
//
// Reads BOT_TOKEN / TELEGRAM_WEBHOOK_SECRET / NEXT_PUBLIC_SITE_URL from
// the environment, or from a local .env file if present.
//
// NOTE: setMyMenuButton returns 404 for some bots — we use setChatMenuButton
// with the bot's own user ID instead (set via getMe). This is the reliable
// way to configure the bot's menu button.

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
const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;

if (!token) {
  console.error('Missing BOT_TOKEN (set it in the environment or a local .env)');
  process.exit(1);
}

const api = (method, params = {}) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then((r) => r.json());

const cmd = process.argv[2] || 'set';

async function setWebhook() {
  if (!base) {
    console.error('Missing NEXT_PUBLIC_SITE_URL (your deployed app URL, e.g. https://waitlist.uniui.com.ng)');
    process.exit(1);
  }
  if (!secret) {
    console.error('Missing TELEGRAM_WEBHOOK_SECRET');
    process.exit(1);
  }
  const url = `${base.replace(/\/$/, '')}/api/telegram/webhook`;
  console.log('Registering webhook:', url);
  console.log(await api('setWebhook', { url, secret_token: secret, drop_pending_updates: true }));
}

async function setMenuButton() {
  if (!base) {
    console.error('Missing NEXT_PUBLIC_SITE_URL (your deployed app URL, e.g. https://waitlist.uniui.com.ng)');
    process.exit(1);
  }
  const webAppUrl = `${base.replace(/\/$/, '')}/rewards`;
  console.log('Setting menu button web_app URL:', webAppUrl);

  // Get the bot's user ID — setChatMenuButton requires it to set the bot's
  // own menu button (chat_id = bot user ID, NOT 0).
  const me = await api('getMe');
  if (!me.ok) {
    console.error('✗ Could not get bot info:', me.description);
    process.exit(1);
  }
  const botUserId = me.result.id;
  console.log('Bot user ID:', botUserId);

  // setMyMenuButton returns 404 for some bots — use setChatMenuButton instead.
  const result = await api('setChatMenuButton', {
    chat_id: botUserId,
    menu_button: {
      type: 'web_app',
      text: '🎁 Rewards',
      web_app: { url: webAppUrl },
    },
  });
  console.log(result);
  if (result.ok) {
    console.log('✓ Menu button configured. Tap "🎁 Rewards" in the bot menu to launch the Mini App.');
  } else {
    console.error('✗ Failed to set menu button:', result.description);
  }
}

async function showStatus() {
  const me = await api('getMe');
  const botUserId = me.ok ? me.result.id : 0;
  console.log('Bot:', me.result?.username || 'unknown', '(ID:', botUserId + ')');
  console.log('has_main_web_app:', me.result?.has_main_web_app);

  console.log('\nWebhook info:');
  console.log(await api('getWebhookInfo'));
  console.log('\nMenu button:');
  console.log(await api('getChatMenuButton', { chat_id: botUserId }));
}

if (cmd === 'status') {
  showStatus();
} else if (cmd === 'delete') {
  console.log(await api('deleteWebhook'));
} else if (cmd === 'webhook') {
  await setWebhook();
  console.log('\nVerify with: node scripts/set-webhook.mjs status');
} else if (cmd === 'menu') {
  await setMenuButton();
} else {
  // Default: set both webhook and menu button
  await setWebhook();
  console.log('---');
  await setMenuButton();
  console.log('\nVerify with: node scripts/set-webhook.mjs status');
}
