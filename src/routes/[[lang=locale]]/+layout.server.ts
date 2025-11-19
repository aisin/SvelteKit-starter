import type { LayoutServerLoad } from './$types';

const SUPPORTED = ['en', 'zh'] as const;
const DEFAULT_LOCALE = 'en';

type Supported = (typeof SUPPORTED)[number];

function normalizeLocale(input?: string): Supported {
  if (!input) return DEFAULT_LOCALE as Supported;
  const v = input.toLowerCase();
  return (SUPPORTED as readonly string[]).includes(v as Supported) ? (v as Supported) : (DEFAULT_LOCALE as Supported);
}

async function loadMessages(locale: Supported) {
  const header = (await import(`$lib/i18n/components/header/${locale}.json`)).default;
  const home = (await import(`$lib/i18n/pages/home/${locale}.json`)).default;
  const dashboard = (await import(`$lib/i18n/pages/dashboard/${locale}.json`)).default;
  const login = (await import(`$lib/i18n/pages/login/${locale}.json`)).default;
  const profile = (await import(`$lib/i18n/pages/profile/${locale}.json`)).default;
  const footer = (await import(`$lib/i18n/components/footer/${locale}.json`)).default;

  return {
    header,
    home,
    dashboard,
    login,
    profile,
    footer
  } satisfies Record<string, any>;
}

export const load: LayoutServerLoad = async ({ params, setHeaders }) => {
  let locale = normalizeLocale(params.lang);

  setHeaders({ 'Content-Language': locale });

  let messages: Record<string, any>;
  try {
    messages = await loadMessages(locale);
  } catch {
    messages = await loadMessages(DEFAULT_LOCALE as Supported);
    locale = DEFAULT_LOCALE as Supported;
  }

  return { locale, messages };
};
