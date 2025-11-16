<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const localeNames: Record<string, string> = { en: 'English', zh: '中文' };
  const SUPPORTED = ['en', 'zh'] as const;
  const DEFAULT = 'en';

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

<select on:change={(e) => switchLocale((e.target as HTMLSelectElement).value)}>
  {#each Object.keys(localeNames) as key}
    <option value={key} selected={key === ($page.params.lang ?? DEFAULT)}>{localeNames[key]}</option>
  {/each}
</select>
