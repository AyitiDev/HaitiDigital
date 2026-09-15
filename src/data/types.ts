export type ProposalCategory =
  | 'identity'
  | 'elections'
  | 'health'
  | 'education'
  | 'security'
  | 'infrastructure';

export type ProposalStatus = 'complete' | 'in_development';

export interface ArchitectureItem {
  label: string;
  value: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  description: string;
}

export interface ProposalDetail {
  leadTitle: string;
  author: string;
  initialUpvotes: number;
  initialDislikes: number;
  commentsCount?: number;
  readingTime?: string;
  publishDate?: string;
  executiveSummary?: string;
  problem?: string;
  technicalArchitecture?: {
    title: string;
    items: ArchitectureItem[];
  };
  internationalBenchmark?: string;
  roadmap?: RoadmapPhase[];
}

export interface Proposal {
  id: string;
  slug: string;
  category: ProposalCategory;
  status: ProposalStatus;
  icon: string;
  title: string;
  summary: string;
  detail: ProposalDetail;
  /** When true, [slug].astro delegates body rendering to a dedicated content component */
  hasCustomContent?: boolean;
}
