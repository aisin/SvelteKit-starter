<script lang="ts">
	import { cn } from '$lib/utils/cn';
let {
		href = '#',
		external = false,
		class: className = '',
		target = undefined as string | undefined,
		rel = undefined as string | undefined,
		children = undefined
	} = $props();

	const isExternal = external || /^https?:\/\//.test(href);
	const anchorTarget = target ?? (isExternal ? '_blank' : undefined);
	const anchorRel = rel ?? (isExternal ? 'noopener noreferrer' : undefined);
</script>

<a
	href={href}
	target={anchorTarget}
	rel={anchorRel}
	class={cn('text-sm font-medium text-muted-foreground hover:text-foreground transition-colors', className)}
>
	{@render children?.()}
</a>
