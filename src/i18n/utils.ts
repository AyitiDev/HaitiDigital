import homeEn from './home/en.json';
import homeFr from './home/fr.json';
import homeHt from './home/ht.json';

import propUiEn from './proposals-ui/en.json';
import propUiFr from './proposals-ui/fr.json';
import propUiHt from './proposals-ui/ht.json';

import dcrEn from './proposals/digital-civil-registry/en.json';
import dcrFr from './proposals/digital-civil-registry/fr.json';
import dcrHt from './proposals/digital-civil-registry/ht.json';

export type SupportedLanguage = 'en' | 'fr' | 'ht';

export const defaultLang: SupportedLanguage = 'en';

export const activeLanguages: SupportedLanguage[] = ['en', 'fr', 'ht'];

export const languages: Record<SupportedLanguage, { label: string; flag: string }> = {
  en: { label: 'English', flag: 'EN' },
  fr: { label: 'Français', flag: 'FR' },
  ht: { label: 'Kreyòl', flag: 'HT' },
};

type HomeDict = typeof homeEn;
type ProposalsUiDict = typeof propUiEn;

const homeDicts: Record<SupportedLanguage, Record<string, any>> = {
  en: homeEn,
  fr: homeFr,
  ht: homeHt,
};

const proposalsUiDicts: Record<SupportedLanguage, Record<string, any>> = {
  en: propUiEn,
  fr: propUiFr,
  ht: propUiHt,
};

const proposalContentDicts: Record<string, Record<SupportedLanguage, Record<string, any>>> = {
  'digital-civil-registry': {
    en: dcrEn,
    fr: dcrFr,
    ht: dcrHt,
  },
};

function resolveValue(obj: Record<string, any>, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return typeof current === 'string' && current.length > 0 ? current : undefined;
}

type NestedKeyOf<T extends object> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];

export type UiKey = NestedKeyOf<HomeDict>;
export type ProposalsKey = NestedKeyOf<ProposalsUiDict>;

export function useUi(lang: SupportedLanguage = defaultLang) {
  const target = homeDicts[lang] ?? homeDicts[defaultLang];
  const fallback = homeDicts[defaultLang];
  return function t(key: UiKey, override?: string): string {
    const val = resolveValue(target, key);
    if (val !== undefined) return val;
    const fb = resolveValue(fallback, key);
    return fb ?? override ?? key;
  };
}

export function useProposals(lang: SupportedLanguage = defaultLang) {
  const target = proposalsUiDicts[lang] ?? proposalsUiDicts[defaultLang];
  const fallback = proposalsUiDicts[defaultLang];
  return function t(key: ProposalsKey, override?: string): string {
    const val = resolveValue(target, key);
    if (val !== undefined) return val;
    const fb = resolveValue(fallback, key);
    return fb ?? override ?? key;
  };
}

export interface LocalizedProposalContent {
  title: string;
  leadTitle: string;
  summary: string;
}

export function getLocalizedProposalContent(
  slug: string,
  lang: SupportedLanguage = defaultLang
): LocalizedProposalContent {
  const slugDicts = proposalContentDicts[slug];
  if (!slugDicts) {
    return { title: '', leadTitle: '', summary: '' };
  }
  const target = slugDicts[lang];
  const fallback = slugDicts[defaultLang] ?? {};

  const title = (target?.title && target.title.length > 0) ? target.title : (fallback.title ?? '');
  const leadTitle = (target?.leadTitle && target.leadTitle.length > 0) ? target.leadTitle : (fallback.leadTitle ?? '');
  const summary = (target?.summary && target.summary.length > 0) ? target.summary : (fallback.summary ?? '');

  return { title, leadTitle, summary };
}

export function getProposalFullContent(
  slug: string,
  lang: SupportedLanguage = defaultLang
): Record<string, any> {
  const slugDicts = proposalContentDicts[slug];
  if (!slugDicts) return {};
  const target = slugDicts[lang] ?? {};
  const fallback = slugDicts[defaultLang] ?? {};
  return (target && target.sections) ? target : fallback;
}

export function getLocalizedPath(path: string, lang: SupportedLanguage = defaultLang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const stripped = clean.replace(/^\/(en|fr|ht)(\/|$)/, '/');
  const base = stripped === '/' ? '' : stripped;
  return `/${lang}${base}`;
}
