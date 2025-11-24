<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { cn } from '$lib/utils/cn';

  const localeNames: Record<string, string> = { en: 'English', zh: '中文' };
  const SUPPORTED = ['en', 'zh'] as const;
  const DEFAULT = 'en';

  const options = Object.entries(localeNames).map(([value, label]) => ({ value, label }));
  const currentLocale = $derived((($page.params.lang as string | undefined) ?? DEFAULT).toLowerCase());

  let open = $state(false);
  let rootEl: HTMLDivElement | null = null;

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
    open = false;
  }

  $effect(() => {
    if (!open || !rootEl) return;

    function handleClickOutside(event: MouseEvent) {
      if (!rootEl?.contains(event.target as Node)) {
        open = false;
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  });
</script>

<div class="relative" bind:this={rootEl}>
  <button
    type="button"
    aria-label="Language selector"
    aria-haspopup="menu"
    aria-expanded={open}
    class="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    onclick={() => (open = !open)}
  >
    <Icon name="languages" class="h-4 w-4" size={18} />
  </button>

  {#if open}
    <div
      class="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md"
      role="menu"
    >
      <div class="py-1">
        {#each options as item}
          <button
            type="button"
            class={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-muted',
              currentLocale === item.value && 'font-medium'
            )}
            role="menuitem"
            onclick={() => switchLocale(item.value)}
          >
            <span>{item.label}</span>
            {#if currentLocale === item.value}
              <Icon name="check" class="ml-2 h-4 w-4" size={16} />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
