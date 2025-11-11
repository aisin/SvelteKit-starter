<script lang="ts">
	import '../app.css';
	import '../theme.css';
	import Header from '$lib/components/header/Header.svelte';

	let { children } = $props();
</script>

<Header />
{@render children()}
