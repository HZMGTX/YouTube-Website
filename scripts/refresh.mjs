#!/usr/bin/env node
/**
 * Re-fetch member, online and boost counts, plus icon/banner hashes and invite expiry,
 * for every listing that has an invite:
 *
 *   npm run refresh
 *   npm run refresh -- --dry
 *
 * The site is static and the pinned server's widget is disabled, so counts cannot be
 * read in the browser. This script (run weekly in CI) is what keeps them current.
 * Editorial fields — name, description, category, tags — are never overwritten.
 */
import { bannerUrl, boostCount, fetchInvite, iconUrl, inviteCode, readData, style, writeData } from './discord.mjs';

const DRY = process.argv.includes('--dry');
const PAUSE_MS = 1200; // Space requests out; the invite endpoint is rate limited.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const data = await readData();
  const changes = [];
  const failures = [];

  for (const community of data.communities) {
    if (!community.invite) continue;

    const code = inviteCode(community.invite);
    if (!code) {
      failures.push(`${community.name}: invite "${community.invite}" is not a Discord link`);
      continue;
    }

    try {
      const invite = await fetchInvite(code);
      const guild = invite.guild ?? {};
      const before = { members: community.members, online: community.online, boosts: community.boosts };

      community.members = Number(invite.approximate_member_count ?? community.members);
      community.online = Number(invite.approximate_presence_count ?? community.online);
      community.boosts = boostCount(guild) || community.boosts;
      community.inviteExpiresAt = invite.expires_at ?? null;
      if (guild.icon) community.icon = iconUrl(guild);
      if (guild.banner) community.banner = bannerUrl(guild);

      // Append one sample per day at most, so a re-run does not stack duplicates.
      const today = new Date().toISOString().slice(0, 10);
      community.history = Array.isArray(community.history) ? community.history : [];
      const existing = community.history.find((point) => point.date === today);
      if (existing) {
        existing.members = community.members;
        existing.online = community.online;
      } else {
        community.history.push({ date: today, members: community.members, online: community.online });
      }
      // Two years of weekly samples is plenty; drop anything older.
      if (community.history.length > 104) community.history = community.history.slice(-104);

      const delta = community.members - before.members;
      changes.push(
        `${community.name}: ${before.members.toLocaleString('en-US')} → ${community.members.toLocaleString('en-US')} members` +
          (delta ? ` (${delta > 0 ? '+' : ''}${delta.toLocaleString('en-US')})` : ' (no change)'),
      );
    } catch (error) {
      failures.push(`${community.name}: ${error.message}`);
    }

    await sleep(PAUSE_MS);
  }

  if (!DRY) await writeData(data);

  for (const line of changes) console.log(`  ${line}`);
  for (const line of failures) console.log(style.warn(`  ! ${line}`));

  console.log(
    `\n${style.ok(`${changes.length} refreshed`)}${failures.length ? style.warn(`, ${failures.length} failed`) : ''}` +
      (DRY ? style.dim(' (dry run — nothing written)') : ''),
  );

  // A dead invite is a broken Join button, so surface it as a failure for CI.
  if (failures.length) process.exit(1);
}

main().catch((error) => {
  console.error(style.fail(`\n${error.message}`));
  process.exit(1);
});
