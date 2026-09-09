import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_PATH = path.join(ROOT, 'data', 'communities.json');

const API = 'https://discord.com/api/v10';

/** Accepts a bare code, discord.gg/<code> or discord.com/invite/<code>. */
export function inviteCode(input) {
  const trimmed = String(input ?? '').trim();
  const match = trimmed.match(/(?:discord\.gg|discord\.com\/invite)\/([\w-]+)/i);
  if (match) return match[1];
  if (/^[\w-]{2,64}$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Reads public invite metadata. This endpoint needs no bot token, which is what lets
 * `add` and `refresh` run in CI without a secret. It is rate limited, so callers space
 * their requests out.
 */
export async function fetchInvite(code) {
  const url = `${API}/invites/${encodeURIComponent(code)}?with_counts=true&with_expiration=true`;
  const response = await fetch(url, { headers: { accept: 'application/json' } });

  if (response.status === 404) throw new Error(`Invite ${code} is invalid or has expired.`);
  if (response.status === 429) {
    const retry = Number(response.headers.get('retry-after') ?? 5);
    throw new Error(`Rate limited by Discord. Retry in ${retry}s.`);
  }
  if (!response.ok) throw new Error(`Discord returned ${response.status} for invite ${code}.`);

  return response.json();
}

const ext = (hash) => (hash?.startsWith('a_') ? 'gif' : 'webp');

export function iconUrl(guild, size = 512) {
  if (!guild?.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext(guild.icon)}?size=${size}`;
}

export function bannerUrl(guild, size = 1280) {
  if (!guild?.banner) return null;
  const animated = guild.banner.startsWith('a_') ? '&animated=true' : '';
  return `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.webp?size=${size}${animated}`;
}

/** Discord exposes boost count as premium_subscription_count on the guild object. */
export function boostCount(guild) {
  return Number(guild?.premium_subscription_count ?? 0);
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function readData() {
  return JSON.parse(await readFile(DATA_PATH, 'utf8'));
}

export async function writeData(data) {
  await writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export const style = {
  ok: (text) => `\x1b[32m${text}\x1b[0m`,
  warn: (text) => `\x1b[33m${text}\x1b[0m`,
  fail: (text) => `\x1b[31m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};
