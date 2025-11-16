const DEFAULT = 'en';

export async function getPageData(name: string, locale: string) {
  const lc = locale.toLowerCase();
  try {
    return (await import(`$lib/i18n/pages/${name}/${lc}.json`)).default;
  } catch {
    return (await import(`$lib/i18n/pages/${name}/${DEFAULT}.json`)).default;
  }
}
