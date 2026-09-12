import enUi from './en/ui.json';
import enProposals from './en/proposals.json';

export type SupportedLanguage = 'en' | 'fr' | 'ht';

export const defaultLang: SupportedLanguage = 'en';

export const languages: Record<SupportedLanguage, { label: string; flag: string }> = {
  en: { label: 'English', flag: 'EN' },
  fr: { label: 'Français', flag: 'FR' },
  ht: { label: 'Kreyòl', flag: 'HT' },
};

type UiDict = typeof enUi;
type ProposalsDict = typeof enProposals;

const uiDicts: Record<SupportedLanguage, UiDict> = {
  en: enUi,
  fr: enUi,
  ht: enUi,
};

const proposalsDicts: Record<SupportedLanguage, ProposalsDict> = {
  en: enProposals,
  fr: enProposals,
  ht: enProposals,
};

function resolveValue(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

type NestedKeyOf<T extends object> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];

export type UiKey = NestedKeyOf<UiDict>;
export type ProposalsKey = NestedKeyOf<ProposalsDict>;

export function useUi(lang: SupportedLanguage = defaultLang) {
  const target = uiDicts[lang] ?? uiDicts[defaultLang];
  const fallback = uiDicts[defaultLang];
  return function t(key: UiKey, override?: string): string {
    const val = resolveValue(target, key);
    if (val !== undefined) return val;
    const fb = resolveValue(fallback, key);
    return fb ?? override ?? key;
  };
}

export function useProposals(lang: SupportedLanguage = defaultLang) {
  const target = proposalsDicts[lang] ?? proposalsDicts[defaultLang];
  const fallback = proposalsDicts[defaultLang];
  return function t(key: ProposalsKey, override?: string): string {
    const val = resolveValue(target, key);
    if (val !== undefined) return val;
    const fb = resolveValue(fallback, key);
    return fb ?? override ?? key;
  };
}

export function getLocalizedPath(path: string, lang: SupportedLanguage = defaultLang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const stripped = clean.replace(/^\/(en|fr|ht)(\/|$)/, '/');
  const base = stripped === '/' ? '' : stripped;
  return `/${lang}${base}`;
}
