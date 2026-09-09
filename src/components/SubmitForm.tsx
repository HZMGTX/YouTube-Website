'use client';

import { useMemo, useState } from 'react';
import { SITE } from '@/lib/site';

const CATEGORIES = ['Gaming', 'Art', 'Music', 'Tech', 'Anime', 'Roleplay', 'Study', 'Content Creator', 'Community'];

/**
 * There is no backend. The form composes a prefilled GitHub issue against the template
 * in .github/ISSUE_TEMPLATE, which a maintainer turns into a listing with `npm run add`.
 * Field names below must match the template's field ids.
 */
export default function SubmitForm() {
  const [invite, setInvite] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Community');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  const inviteLooksValid = /^(https?:\/\/)?(discord\.gg|discord\.com\/invite)\/[\w-]+$/i.test(invite.trim());

  const href = useMemo(() => {
    const params = new URLSearchParams({
      template: 'community-submission.yml',
      title: name ? `Add ${name}` : 'Add a community',
      invite: invite.trim(),
      name: name.trim(),
      category,
      tags: tags.trim(),
      description: description.trim(),
    });
    return `${SITE.repo}/issues/new?${params.toString()}`;
  }, [category, description, invite, name, tags]);

  const field =
    'h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-line-strong';

  return (
    <form
      className="panel flex flex-col gap-5 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }}
    >
      <div>
        <label htmlFor="invite" className="mb-1.5 block text-sm font-medium text-ink">
          Discord invite <span className="text-accent">*</span>
        </label>
        <input
          id="invite"
          required
          value={invite}
          onChange={(event) => setInvite(event.target.value)}
          placeholder="https://discord.gg/…"
          aria-describedby="invite-help"
          className={field}
        />
        <p id="invite-help" className="mt-1.5 text-xs text-ink-3">
          {invite && !inviteLooksValid
            ? 'That does not look like a Discord invite link.'
            : 'Use a permanent invite that never expires, or the listing will break.'}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Server name
          </label>
          <input id="name" value={name} onChange={(event) => setName(event.target.value)} className={field} />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={field}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-ink">
          Tags
        </label>
        <input
          id="tags"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="Art, Feedback, Events"
          className={field}
        />
        <p className="mt-1.5 text-xs text-ink-3">Up to four, separated by commas.</p>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
          What is the server for?
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="One or two sentences a stranger could read and know whether to join."
          className="w-full resize-y rounded-lg border border-line bg-surface p-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-line-strong"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={!invite.trim()}
          className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Open submission on GitHub
        </button>
        <p className="text-xs text-ink-3">
          Opens a prefilled issue. Nothing is sent from this page — you review and post it yourself.
        </p>
      </div>
    </form>
  );
}
