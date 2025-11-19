<script lang="ts">
	import { Twitter, Github, Mail } from '@lucide/svelte';
	import Link from '$lib/components/ui/Link.svelte';
	import { localeHref } from '$lib/i18n/link';
	import { getI18nContext } from '$lib/i18n/context';

	interface FooterLink {
		label: string;
		href: string;
	}

	interface Column {
		title: string;
		links: FooterLink[];
	}

	interface FooterData {
		brand: {
			description: string;
			social?: {
				twitter?: string;
				github?: string;
				mail?: string;
			};
		};
		navSections: Column[];
		legalLinks: FooterLink[];
		copyright: string;
	}

	let { data }: { data: FooterData } = $props();
	const { locale } = getI18nContext();
</script>

<footer class="bg-background text-foreground py-12 border-t border-border">
	<div class="mx-auto max-w-screen-xl px-4 md:px-6">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
			<!-- Brand Column -->
			<div class="md:col-span-2 lg:col-span-4">
				<a href={localeHref('/', locale)} class="text-2xl font-bold mb-4 block">SvelteKit-starter</a>
				<p class="text-muted-foreground mb-6 max-w-sm">
					{data.brand.description}
				</p>
				<div class="flex space-x-4">
					{#if data.brand.social?.twitter}
						<Link href={data.brand.social.twitter}>
							<Twitter size={20} />
						</Link>
					{/if}
					{#if data.brand.social?.github}
						<Link href={data.brand.social.github}>
							<Github size={20} />
						</Link>
					{/if}
					{#if data.brand.social?.mail}
						<Link href={data.brand.social.mail}>
							<Mail size={20} />
						</Link>
					{/if}
				</div>
			</div>

			<!-- Links Columns -->
			{#each data.navSections as column}
				<div class="lg:col-span-1">
					<h3 class="font-semibold text-lg mb-4">{column.title}</h3>
					<ul class="flex flex-wrap gap-4 lg:block lg:space-y-2">
						{#each column.links as link}
							<li>
								<Link href={link.href.startsWith('http') ? link.href : localeHref(link.href, locale)}>
									{link.label}
								</Link>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
			<p class="text-muted-foreground text-sm text-center md:text-left">
				{data.copyright}
			</p>
			<div class="flex gap-4">
				{#each data.legalLinks as link}
					<Link
						href={link.href.startsWith('http') ? link.href : localeHref(link.href, locale)}
						class="text-sm font-normal text-muted-foreground hover:text-foreground"
					>
						{link.label}
					</Link>
				{/each}
			</div>
		</div>
	</div>
</footer>
