export function localeHref(path: string, locale: string, defaultLocale = 'en') {
  if (!path.startsWith('/')) path = `/${path}`;
  return locale === defaultLocale ? path : `/${locale}${path}`;
}
