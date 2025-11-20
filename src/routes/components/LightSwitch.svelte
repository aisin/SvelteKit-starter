<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import type { Theme } from '$lib/stores/theme';

	let current = $state<Theme>('light');
	let unsubscribe: (() => void) | undefined;

	onMount(() => {
		// 与 app.html 里预先设置的 .dark 同步一次
		theme.initFromDocument();

		// 订阅全局 theme store，保持多个 LightSwitch 实例状态一致
		unsubscribe = theme.subscribe((value) => {
			current = value;
		});

		return () => {
			unsubscribe?.();
		};
	});

	const toggle = () => {
		theme.toggle();
	};
</script>

<button
	type="button"
	onclick={toggle}
	class="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	aria-label={current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if current === 'dark'}
		<Moon class="h-5 w-5" />
	{:else}
		<Sun class="h-5 w-5" />
	{/if}
</button>
