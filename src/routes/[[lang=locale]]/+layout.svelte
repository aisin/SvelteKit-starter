<script lang="ts">
  export let data: { locale: string; messages: Record<string, any> };
  export let children: any;
  import Header from '$lib/components/header/Header.svelte';
  import { setI18nContext } from '$lib/i18n/context';

  function get(obj: any, path: string) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function format(s: string, vars?: Record<string, string | number>) {
    return s && vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')) : s;
  }

  const t = (key: string, vars?: Record<string, any>) => {
    const v = get(data.messages, key);
    return typeof v === 'string' ? format(v, vars) : v ?? key;
  };

  setI18nContext({ t, locale: data.locale });
</script>

<Header />
{@render children()}
