#!/usr/bin/env node
/**
 * Validate data/communities.json before it can reach the site:
 *
 *   npm run check                 # full check, asset fetches are warn-only
 *   npm run check -- --offline    # skip every network request
 *   npm run check -- --strict     # any invite expiry at all is an error (used by CI cron)
 *
 * Exits non-zero on an error so CI fails on bad data rather than shipping it.
 */
import { inviteCode, readData, style } from './discord.mjs';

const OFFLINE = process.argv.includes('--offline');
const STRICT = process.argv.includes('--strict');
const EXPIRY_WARNING_DAYS = 7;

const errors = [];
const warnings = [];
const notes = [];

const error = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

const REQUIRED_STRINGS = ['id', 'name', 'description', 'category', 'addedAt', 'accent'];
const REQUIRED_NUMBERS = ['members', 'online', 'boosts'];

async function reachable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return response.ok ? true : `HTTP ${response.status}`;
  } catch (cause) {
    return cause instanceof Error ? cause.message : 'request failed';
  }
}

async function main() {
  const data = await readData();

  if (!Array.isArray(data.communities)) {
    console.error(style.fail('communities must be an array.'));
    process.exit(1);
  }

  const seen = new Set();

  for (const community of data.communities) {
    const label = community.name ?? community.id ?? '(unnamed)';

    for (const field of REQUIRED_STRINGS) {
      if (typeof community[field] !== 'string' || !community[field].trim()) {
        error(`${label}: "${field}" must be a non-empty string.`);
      }
    }
    for (const field of REQUIRED_NUMBERS) {
      if (!Number.isFinite(community[field]) || community[field] < 0) {
        error(`${label}: "${field}" must be a number of 0 or more.`);
      }
    }

    if (community.id) {
      if (!/^[a-z0-9-]+$/.test(community.id)) {
        error(`${label}: id "${community.id}" may only contain lowercase letters, digits and hyphens.`);
      }
      if (seen.has(community.id)) error(`Duplicate id "${community.id}".`);
      seen.add(community.id);
    }

    if (!Array.isArray(community.tags) || community.tags.length === 0) {
      error(`${label}: needs at least one tag.`);
    }

    if (community.accent && !/^#[0-9a-f]{6}$/i.test(community.accent)) {
      error(`${label}: accent "${community.accent}" must be a 6-digit hex colour.`);
    }

    if (community.addedAt && Number.isNaN(new Date(`${community.addedAt}T00:00:00Z`).getTime())) {
      error(`${label}: addedAt "${community.addedAt}" is not a YYYY-MM-DD date.`);
    }

    if (typeof community.online === 'number' && typeof community.members === 'number') {
      if (community.online > community.members) {
        error(`${label}: online (${community.online}) is greater than members (${community.members}).`);
      }
    }

    // Example listings deliberately carry no invite; real ones must have a working link.
    if (community.example) {
      if (community.invite) error(`${label}: example listings must not carry an invite link.`);
    } else if (!community.invite) {
      error(`${label}: a real listing needs an invite link.`);
    } else if (!inviteCode(community.invite)) {
      error(`${label}: "${community.invite}" is not a Discord invite link.`);
    }

    if (community.inviteExpiresAt) {
      const expiry = new Date(community.inviteExpiresAt);
      const days = (expiry.getTime() - Date.now()) / 86_400_000;
      const when = expiry.toISOString().slice(0, 10);

      if (Number.isNaN(expiry.getTime())) {
        error(`${label}: inviteExpiresAt "${community.inviteExpiresAt}" is not a date.`);
      } else if (days < 0) {
        error(`${label}: the invite EXPIRED on ${when}. The Join button is dead — get a permanent invite.`);
      } else if (days < EXPIRY_WARNING_DAYS || STRICT) {
        error(
          `${label}: the invite expires on ${when} (${Math.floor(days)} days). ` +
            'Replace it with a permanent invite or a vanity URL.',
        );
      } else {
        warn(`${label}: temporary invite, expires ${when} (${Math.floor(days)} days). Ask for a permanent one.`);
      }
    }
  }

  if (data.pinnedId && !seen.has(data.pinnedId)) {
    error(`pinnedId "${data.pinnedId}" does not match any listing, so nothing is featured.`);
  }
  if (!data.pinnedId) {
    warn('pinnedId is unset, so no community holds the featured slot.');
  }

  const examples = data.communities.filter((community) => community.example);
  if (examples.length) {
    notes.push(
      `${examples.length} example ${examples.length === 1 ? 'listing is' : 'listings are'} still present. ` +
        'They render with an "Example" chip; delete them from data/communities.json once real listings replace them.',
    );
  }

  if (!OFFLINE) {
    const assets = data.communities.flatMap((community) =>
      [
        community.icon && { label: `${community.name} icon`, url: community.icon },
        community.banner && { label: `${community.name} banner`, url: community.banner },
      ].filter(Boolean),
    );

    for (const asset of assets) {
      const result = await reachable(asset.url);
      // Network flakiness must not fail the build; a genuinely dead asset still shows up.
      if (result !== true) warn(`${asset.label} did not load (${result}).`);
    }
  }

  const total = data.communities.length;
  console.log(style.bold(`\nChecked ${total} ${total === 1 ? 'listing' : 'listings'}\n`));

  for (const note of notes) console.log(style.dim(`  note  ${note}`));
  for (const message of warnings) console.log(style.warn(`  warn  ${message}`));
  for (const message of errors) console.log(style.fail(`  fail  ${message}`));

  if (errors.length) {
    console.log(style.fail(`\n${errors.length} ${errors.length === 1 ? 'error' : 'errors'}.\n`));
    process.exit(1);
  }
  console.log(style.ok(`\nData is valid${warnings.length ? ` (${warnings.length} warnings)` : ''}.\n`));
}

main().catch((cause) => {
  console.error(style.fail(`\n${cause.message}`));
  process.exit(1);
});
