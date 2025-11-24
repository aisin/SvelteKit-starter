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
	import { onMount } from 'svelte';
	import { useSession, signOut } from '$lib/auth-client';

	let { class: className = '' } = $props();
	const { t } = getI18nContext();
	const locale = $derived((($page.params.lang as string | undefined) ?? 'en').toLowerCase());

	const session = useSession();
	let mobileOpen = $state(false);
	let scrolled = $state(false);
	let userMenuOpen = $state(false);
	let userMenuRoot: HTMLDivElement | null = null;

	onMount(() => {
		const update = () => {
			scrolled = typeof window !== 'undefined' && window.scrollY > 0;
		};

		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});

	$effect(() => {
		if (!userMenuOpen || !userMenuRoot) return;

		function handleClickOutside(event: MouseEvent) {
			if (!userMenuRoot?.contains(event.target as Node)) {
				userMenuOpen = false;
			}
		}

		window.addEventListener('mousedown', handleClickOutside);
		return () => window.removeEventListener('mousedown', handleClickOutside);
	});
</script>

<section
	id="header"
	class={cn(
		'sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur dark:bg-background transition-shadow',
		scrolled && 'shadow-sm',
		className
	)}
>
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
				{#if !$session.data?.user}
					{#each (t('header.buttons') as unknown as any[] ?? []) as button}
						<Link href={localeHref(button.url, locale)} target={button.target}>
							<Button variant={button.variant}>{button.title}</Button>
						</Link>
					{/each}
				{:else}
					<div class="relative" bind:this={userMenuRoot}>
						<button
							type="button"
							aria-label="User menu"
							class="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							onclick={() => (userMenuOpen = !userMenuOpen)}
						>
							{#if $session.data?.user?.image}
								<img
									src={$session.data.user.image}
									alt={$session.data.user.name ?? 'User avatar'}
									class="h-7 w-7 rounded-md object-cover"
								/>
							{:else}
								<span class="text-sm font-medium">
									{($session.data?.user?.name ?? 'U').slice(0, 1).toUpperCase()}
								</span>
							{/if}
						</button>

						{#if userMenuOpen}
							<div
								class="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md"
								role="menu"
							>
								<div class="py-1">
									<button
										type="button"
										class="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-muted"
										onclick={() => {
											userMenuOpen = false;
											window.location.href = localeHref('/profile', locale);
										}}
									>
										<span class="truncate">{$session.data?.user?.name ?? t('header.userMenu.profile')}</span>
									</button>
									<button
										type="button"
										class="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-muted"
										onclick={() => {
											userMenuOpen = false;
											window.location.href = localeHref('/dashboard', locale);
										}}
									>
										<span>{t('header.userMenu.dashboard')}</span>
									</button>
									<button
										type="button"
										class="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm outline-none text-destructive transition-colors hover:bg-muted"
										onclick={async () => {
											userMenuOpen = false;
											await signOut();
											window.location.href = localeHref('/login', locale);
										}}
									>
										<span>{t('header.userMenu.signOut')}</span>
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/if}
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
		<div class="border-t border-border bg-background md:hidden">
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
							{#if !$session.data?.user}
								{#each (t('header.buttons') as unknown as any[] ?? []) as button}
									<Link href={localeHref(button.url, locale)} class="flex-1" target={button.target}>
										<Button variant={button.variant} class="w-full">{button.title}</Button>
									</Link>
								{/each}
							{:else}
								<button
									type="button"
									class="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									onclick={() => (mobileOpen = false, window.location.href = localeHref('/dashboard', locale))}
								>
									{#if $session.data?.user?.image}
										<img
											src={$session.data.user.image}
											alt={$session.data.user.name ?? 'User avatar'}
											class="h-full w-full object-cover"
										/>
									{:else}
										<span class="text-sm font-medium">
											{($session.data?.user?.name ?? 'U').slice(0, 1).toUpperCase()}
										</span>
									{/if}
								</button>
							{/if}
						{/if}
					</div>
				</nav>
			</div>
		</div>
	{/if}
</section>
