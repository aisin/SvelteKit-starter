<script lang="ts">
	import { cn } from '$lib/utils/cn';
	let { class: className = '', children } = $props();
</script>

<nav class={cn('hidden md:flex items-center', className)}>
	<ul class="flex items-center gap-6">
		{@render children?.()}
	</ul>
</nav>
