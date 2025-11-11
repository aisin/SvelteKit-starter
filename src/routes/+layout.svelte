<script lang="ts">
	import '../theme.css';
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';

	let { children } = $props();
</script>

<Header />
{@render children()}
