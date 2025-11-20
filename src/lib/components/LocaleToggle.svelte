<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Select from '$lib/components/ui/Select.svelte';

  const localeNames: Record<string, string> = { en: 'English', zh: '中文' };
  const SUPPORTED = ['en', 'zh'] as const;
  const DEFAULT = 'en';

  const options = Object.entries(localeNames).map(([value, label]) => ({ value, label }));
  const currentLocale = $derived((($page.params.lang as string | undefined) ?? DEFAULT).toLowerCase());

  function stripLeadingLocale(pathname: string) {
    return pathname.replace(/^\/(en|zh)(?=\/|$)/i, '') || '/';
  }

  async function switchLocale(value: string) {
    const current = $page.params.lang ?? DEFAULT;
    if (value === current) return;

    const rest = stripLeadingLocale($page.url.pathname);
    const search = $page.url.search ?? '';
    const hash = $page.url.hash ?? '';

    const target = value === DEFAULT ? `${rest}${search}${hash}` : `/${value}${rest}${search}${hash}`;
    await goto(target, { replaceState: true, invalidateAll: true });
  }
</script>

<Select
  items={options}
  value={currentLocale}
  aria-label="Language selector"
  onValueChange={switchLocale}
/>
