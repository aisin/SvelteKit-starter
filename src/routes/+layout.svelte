<script lang="ts">
	import '../theme.css';
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';
	import LightSwitch from './components/LightSwitch.svelte';

	let { children } = $props();
</script>

<Header />
<LightSwitch />
{@render children()}
