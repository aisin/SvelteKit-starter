<script lang="ts">
	import Link from '$lib/components/ui/Link.svelte';
	import NavigationMenu from '$lib/components/ui/NavigationMenu.svelte';
	import NavigationMenuItem from '$lib/components/ui/NavigationMenuItem.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { cn } from '$lib/utils/cn';

	let { class: className = '' } = $props();
	let mobileOpen = $state(false);
</script>

<section id="header" class={cn('sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur', className)}>
	<div class="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-6">
		<!-- Left: logo -->
		<div class="flex items-center gap-2">
			<Link href="/" class="flex items-center gap-2 text-foreground">
				<Icon name="rocket" class="text-primary" />
				<span class="text-base font-semibold">Acme</span>
			</Link>
		</div>

		<!-- Center: nav (desktop) -->
		<NavigationMenu class="ml-6">
<NavigationMenuItem href="/" label="Home" active />
			<NavigationMenuItem href="/features" label="Features" />
			<NavigationMenuItem href="/pricing" label="Pricing" />
			<NavigationMenuItem href="/docs" label="Docs" />
			<NavigationMenuItem href="/blog" label="Blog" />
		</NavigationMenu>

		<!-- Right: actions -->
		<div class="hidden items-center gap-2 md:flex">
			<Button variant="ghost">Sign in</Button>
			<Button>Get started</Button>
		</div>

		<!-- Mobile menu toggle -->
		<div class="md:hidden">
			<button
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border"
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{#if mobileOpen}
					<Icon name="x" />
				{:else}
					<Icon name="menu" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile panel -->
	{#if mobileOpen}
		<div class="border-t bg-background md:hidden">
			<div class="mx-auto max-w-screen-xl px-4 py-3">
				<nav class="grid gap-1">
					<Link href="/" class="py-2">Home</Link>
					<Link href="/features" class="py-2">Features</Link>
					<Link href="/pricing" class="py-2">Pricing</Link>
					<Link href="/docs" class="py-2">Docs</Link>
					<Link href="/blog" class="py-2">Blog</Link>
					<div class="mt-2 flex gap-2">
						<Button variant="ghost" class="flex-1">Sign in</Button>
						<Button class="flex-1">Get started</Button>
					</div>
				</nav>
			</div>
		</div>
	{/if}
</section>
