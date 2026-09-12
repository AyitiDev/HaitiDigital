import type { Proposal, ProposalCategory } from './types';

export const PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    slug: 'digital-civil-registry',
    category: 'identity',
    status: 'in_development',
    icon: 'id-card',
    title: 'Digital Civil Registry',
    summary:
      'Centralized, interoperable digital identity system to eliminate under-registration and enable secure remote citizen procedures',
    detail: {
      leadTitle:
        'Towards a Digital Civil Registry: the first step of technological sovereignty',
      author: 'Unnamed Team',
      initialUpvotes: 0,
      initialDislikes: 0,
      commentsCount: 0,
    },
  },
];

export function getProposals(): Proposal[] {
  return PROPOSALS;
}

export function getProposalBySlug(slug: string): Proposal | undefined {
  return PROPOSALS.find((p) => p.slug === slug);
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
