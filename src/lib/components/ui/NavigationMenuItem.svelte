<script lang="ts">
	import Link from '$lib/components/ui/Link.svelte';
	import { cn } from '$lib/utils/cn';
let {
		href = undefined as string | undefined,
		label = undefined as string | undefined,
		active = false,
		class: className = '',
		children = undefined
	} = $props();
</script>

<li class={cn('list-none', className)}>
	{#if href && !children}
		<Link href={href} class={cn(active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
			{label}
		</Link>
	{:else}
		{@render children?.()}
	{/if}
</li>
