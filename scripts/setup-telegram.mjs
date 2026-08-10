// Sets up the Telegram bot for the Rewards Mini App:
// 1. Registers the webhook (for receiving contact shares)
// 2. Sets the bot's menu button web_app URL (for launching the Mini App)
//
// Both must point to your production domain. The web_app URL MUST be a
// full HTTPS URL — relative paths like "/rewards" won't give the page
// access to window.Telegram.WebApp.
//
//   BOT_TOKEN=xxx TELEGRAM_WEBHOOK_SECRET=xxx NEXT_PUBLIC_SITE_URL=https://waitlist.uniui.com.ng node scripts/setup-telegram.mjs
//   node scripts/setup-telegram.mjs webhook      # set webhook only
//   node scripts/setup-telegram.mjs menu        # set menu button only

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
if (!base) {
  console.error('Missing NEXT_PUBLIC_SITE_URL (your deployed app URL, e.g. https://waitlist.uniui.com.ng)');
  process.exit(1);
}

const cleanBase = base.replace(/\/$/, '');
const webhookUrl = `${cleanBase}/api/telegram/webhook`;
const webAppUrl = `${cleanBase}/rewards`;

const api = (method, params = {}) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then((r) => r.json());

const cmd = process.argv[2] || 'all';

async function setWebhook() {
  if (!secret) {
    console.error('Missing TELEGRAM_WEBHOOK_SECRET (set it before registering the webhook)');
    process.exit(1);
  }
  console.log('Registering webhook:', webhookUrl);
  const result = await api('setWebhook', {
    url: webhookUrl,
    secret_token: secret,
    drop_pending_updates: true,
  });
  console.log(result);
  console.log('\nVerify with: node scripts/setup-telegram.mjs webhook');
}

async function setMenuButton() {
  console.log('Setting menu button web_app URL:', webAppUrl);
  const result = await api('setMyMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'My Rewards',
      web_app: { url: webAppUrl },
    },
  });
  console.log(result);
  if (result.ok) {
    console.log('✓ Menu button configured. Users will see "My Rewards" in the bot menu.');
  } else {
    console.error('✗ Failed to set menu button. Check your bot token and try again.');
  }
}

async function main() {
  if (cmd === 'webhook') {
    await setWebhook();
  } else if (cmd === 'menu') {
    await setMenuButton();
  } else if (cmd === 'status') {
    console.log(await api('getWebhookInfo'));
  } else {
    await setWebhook();
    console.log('---');
    await setMenuButton();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
