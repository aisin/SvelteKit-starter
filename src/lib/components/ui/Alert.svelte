<script lang="ts">
	import { cn } from '$lib/utils/cn';
	let { class: className = '', children } = $props();
</script>

<div
	role="alert"
	class={cn(
		'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
		className
	)}
>
	{@render children?.()}
</div>
