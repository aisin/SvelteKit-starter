<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let checked = $state(false);

	// Initialize theme state on mount
	onMount(() => {
		// Check if dark mode is already applied by the script in app.html
		checked = document.documentElement.classList.contains('dark');
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
