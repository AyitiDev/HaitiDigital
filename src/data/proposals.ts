import type { Proposal, ProposalCategory } from './types';
import { getLocalizedProposalContent, type SupportedLanguage } from '../i18n/utils';

export const PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    slug: 'digital-civil-registry',
    category: 'identity',
    status: 'complete',
    icon: 'id-card',
    hasCustomContent: true,
    title: 'Digital Civil Registry',
    summary:
      'A centralized, interoperable digital identity system to end under registration and allow citizens to handle official procedures securely from anywhere',
    detail: {
      leadTitle:
        "Haiti's Civil Registry: Why It Fails and How to Rebuild It from Scratch",
      author: 'Ayiti Dijital Team',
      publishDate: '2026-09-14',
      readingTime: '14',
      initialUpvotes: 0,
      initialDislikes: 0,
      commentsCount: 0,
    },
  },
];

export function getProposals(lang?: SupportedLanguage): Proposal[] {
  if (!lang) return PROPOSALS;
  return PROPOSALS.map((p) => {
    const loc = getLocalizedProposalContent(p.slug, lang);
    return {
      ...p,
      title: loc.title || p.title,
      summary: loc.summary || p.summary,
      detail: {
        ...p.detail,
        leadTitle: loc.leadTitle || p.detail.leadTitle,
      },
    };
  });
}

export function getProposalBySlug(slug: string, lang?: SupportedLanguage): Proposal | undefined {
  const p = PROPOSALS.find((item) => item.slug === slug);
  if (!p) return undefined;
  if (!lang) return p;
  const loc = getLocalizedProposalContent(p.slug, lang);
  return {
    ...p,
    title: loc.title || p.title,
    summary: loc.summary || p.summary,
    detail: {
      ...p.detail,
      leadTitle: loc.leadTitle || p.detail.leadTitle,
    },
  };
}

export const CATEGORIES_CONFIG: { id: ProposalCategory | 'all'; labelKey: string }[] = [
  { id: 'all', labelKey: 'categories.all' },
  { id: 'identity', labelKey: 'categories.identity' },
];

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {
    all: PROPOSALS.length,
  };
  for (const p of PROPOSALS) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}
