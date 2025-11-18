<script lang="ts">
	import Link from '$lib/components/ui/Link.svelte';
	import NavigationMenu from '$lib/components/ui/NavigationMenu.svelte';
	import NavigationMenuItem from '$lib/components/ui/NavigationMenuItem.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LightSwitch from '../../../routes/components/LightSwitch.svelte';
	import LocaleToggle from '$lib/components/LocaleToggle.svelte';
	import { localeHref } from '$lib/i18n/link';
	import { getI18nContext } from '$lib/i18n/context';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/cn';

	let { class: className = '' } = $props();
	const { t } = getI18nContext();
	const locale = $derived((($page.params.lang as string | undefined) ?? 'en').toLowerCase());
	let mobileOpen = $state(false);
</script>

<section id="header" class={cn('sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur', className)}>
	<div class="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-6">
		<!-- Left: logo -->
		<div class="flex items-center gap-2">
			<Link href={localeHref('/', locale)} class="flex items-center gap-2 text-foreground">
				<Icon name="rocket" class="text-primary" />
				<span class="text-base font-semibold">{t('header.brand.title') ?? 'Acme'}</span>
			</Link>
		</div>

		<!-- Center: nav (desktop) -->
		<NavigationMenu class="ml-6">
			{#each (t('header.nav.items') as unknown as any[] ?? []) as item, i}
				<NavigationMenuItem href={localeHref(item.url, locale)} label={item.title} active={i === 0} />
			{/each}
		</NavigationMenu>

		<!-- Right: actions -->
		<div class="hidden items-center gap-2 md:flex">
			{#if t('header.show_theme')}
				<LightSwitch />
			{/if}
			{#if t('header.show_locale')}
				<LocaleToggle />
			{/if}
			{#if t('header.show_sign')}
				{#each (t('header.buttons') as unknown as any[] ?? []) as button}
					<Link href={localeHref(button.url, locale)} target={button.target}>
						<Button variant={button.variant}>{button.title}</Button>
					</Link>
				{/each}
			{/if}
		</div>

		<!-- Mobile menu toggle -->
		<div class="md:hidden">
			<Button
				variant="outline"
				size="icon"
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{#if mobileOpen}
					<Icon name="x" />
				{:else}
					<Icon name="menu" />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Mobile panel -->
	{#if mobileOpen}
		<div class="border-t bg-background md:hidden">
			<div class="mx-auto max-w-screen-xl px-4 py-3">
				<nav class="grid gap-1">
					{#each (t('header.nav.items') as unknown as any[] ?? []) as item}
						<Link href={localeHref(item.url, locale)} class="py-2">{item.title}</Link>
					{/each}
					<div class="mt-2 flex items-center gap-2">
						{#if t('header.show_theme')}
							<LightSwitch />
						{/if}
						{#if t('header.show_locale')}
							<LocaleToggle />
						{/if}
					</div>
					<div class="mt-2 flex gap-2">
						{#if t('header.show_sign')}
							{#each (t('header.buttons') as unknown as any[] ?? []) as button}
								<Link href={localeHref(button.url, locale)} class="flex-1" target={button.target}>
									<Button variant={button.variant} class="w-full">{button.title}</Button>
								</Link>
							{/each}
						{/if}
					</div>
				</nav>
			</div>
		</div>
	{/if}
</section>
