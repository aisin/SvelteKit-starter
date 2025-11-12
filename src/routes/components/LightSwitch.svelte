<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';

	let checked = $state(false);

	$effect(() => {
		const isDarkMode = document.documentElement.classList.contains('dark');
		checked = isDarkMode;
	});

	const toggle = () => {
		checked = !checked;
		if (checked) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};
</script>

<svelte:head>
	<script>
		if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

<button
	type="button"
	onclick={toggle}
	class="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	aria-label={checked ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if checked}
		<Moon class="h-5 w-5" />
	{:else}
		<Sun class="h-5 w-5" />
	{/if}
</button>
