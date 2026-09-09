#!/usr/bin/env node
/**
 * Add a community from a Discord invite:
 *
 *   npm run add -- https://discord.gg/abc123
 *   npm run add -- abc123 --category Gaming --tags "Gaming,Events" --pin
 *
 * Everything the directory needs (name, description, icon, banner, member and boost
 * counts, invite expiry) comes from Discord's public invite endpoint, so a listing is
 * never typed by hand.
 */
import {
  bannerUrl,
  boostCount,
  fetchInvite,
  iconUrl,
  inviteCode,
  readData,
  slugify,
  style,
  writeData,
} from './discord.mjs';

const ACCENTS = ['#8b5cf6', '#0ea5e9', '#22c55e', '#f97316', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1'];

function flag(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith('--') ? value : true;
}

async function main() {
  const input = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  if (!input) {
    console.error(style.fail('Usage: npm run add -- <discord invite> [--category X] [--tags "A,B"] [--pin]'));
    process.exit(1);
  }

  const code = inviteCode(input);
  if (!code) {
    console.error(style.fail(`Could not read an invite code from "${input}".`));
    process.exit(1);
  }

  console.log(style.dim(`Fetching invite ${code}…`));
  const invite = await fetchInvite(code);
  const guild = invite.guild;
  if (!guild) throw new Error('That invite does not point at a server.');

  const data = await readData();
  const id = slugify(guild.name) || guild.id;

  if (data.communities.some((community) => community.id === id)) {
    console.error(style.fail(`"${guild.name}" is already listed (id: ${id}).`));
    process.exit(1);
  }

  const tags = String(flag('tags', '') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const entry = {
    id,
    name: guild.name,
    guildId: guild.id,
    description: guild.description ?? `Join ${guild.name} on Discord.`,
    invite: `https://discord.gg/${code}`,
    inviteExpiresAt: invite.expires_at ?? null,
    icon: iconUrl(guild),
    banner: bannerUrl(guild),
    members: Number(invite.approximate_member_count ?? 0),
    online: Number(invite.approximate_presence_count ?? 0),
    boosts: boostCount(guild),
    verified: Boolean(guild.features?.includes('VERIFIED') || guild.features?.includes('PARTNERED')),
    category: String(flag('category', 'Community')),
    tags: tags.length ? tags : ['Community'],
    addedAt: new Date().toISOString().slice(0, 10),
    accent: ACCENTS[data.communities.length % ACCENTS.length],
  };

  data.communities.push(entry);
  if (flag('pin')) data.pinnedId = id;

  await writeData(data);

  console.log(style.ok(`\nAdded ${guild.name}`));
  console.log(`  id        ${entry.id}`);
  console.log(`  members   ${entry.members.toLocaleString('en-US')} (${entry.online.toLocaleString('en-US')} online)`);
  console.log(`  category  ${entry.category}`);
  console.log(`  tags      ${entry.tags.join(', ')}`);
  if (flag('pin')) console.log(style.ok(`  pinned    yes — now holds the featured slot`));
  if (entry.inviteExpiresAt) {
    console.log(style.warn(`  warning   this invite expires ${entry.inviteExpiresAt}; ask for a permanent one`));
  }
  console.log(style.dim('\nReview data/communities.json, then run: npm run check'));
}

main().catch((error) => {
  console.error(style.fail(`\n${error.message}`));
  process.exit(1);
});
