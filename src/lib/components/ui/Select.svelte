<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Icon from '$lib/components/ui/Icon.svelte';

	type Option = {
		value: string;
		label?: string;
		disabled?: boolean;
	};

	let allProps = $props();
	let {
		items = [] as Option[],
		value = '' as string,
		placeholder = '' as string,
		name = undefined as string | undefined,
		disabled = false,
		// 回调形式的变更通知，便于在逻辑组件里使用（如 LocaleToggle）
		onValueChange = undefined as ((value: string) => void) | undefined,
		class: className = '',
		...restProps
	} = allProps;

	// 内部受控值，支持通过 props 传入当前选中项
	let internalValue = $state(value ?? '');
	let open = $state(false);
	let highlightedIndex = $state(-1);

	let rootEl: HTMLDivElement | null = null;

	const selectedOption = $derived(items.find((item) => item.value === internalValue));
	const displayLabel = $derived(
		selectedOption?.label ?? selectedOption?.value ?? placeholder ?? ''
	);

	$effect(() => {
		internalValue = value ?? '';
	});

	$effect(() => {
		if (!open) highlightedIndex = -1;
	});

	$effect(() => {
		if (!open || !rootEl) return;

		function handleClickOutside(event: MouseEvent) {
			if (!rootEl?.contains(event.target as Node)) {
				open = false;
			}
		}

		window.addEventListener('mousedown', handleClickOutside);
		return () => window.removeEventListener('mousedown', handleClickOutside);
	});

	function selectValue(option: Option) {
		if (option.disabled) return;
		internalValue = option.value;
		onValueChange?.(option.value);
		open = false;
	}

	function handleTriggerKeyDown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'Enter' || event.key === ' ') {
			// 打开/选择
			if (open && highlightedIndex >= 0 && highlightedIndex < items.length) {
				selectValue(items[highlightedIndex]!);
			} else {
				open = !open;
				if (open) {
					highlightedIndex = Math.max(
						0,
						items.findIndex((item) => item.value === internalValue)
					);
				}
			}
			event.preventDefault();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!open) {
				open = true;
				highlightedIndex = 0;
			} else if (items.length > 0) {
				highlightedIndex = (highlightedIndex + 1 + items.length) % items.length;
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!open) {
				open = true;
				highlightedIndex = items.length - 1;
			} else if (items.length > 0) {
				highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
			}
		} else if (event.key === 'Escape') {
			if (open) {
				open = false;
				(event.currentTarget as HTMLElement)?.blur();
			}
		}
	}
</script>

<div
	class={cn('relative inline-flex w-fit', className)}
	bind:this={rootEl}
>
	<button
		type="button"
		class={cn(
			'flex h-9 min-w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			!selectedOption && 'text-muted-foreground'
		)}
		aria-haspopup="listbox"
		aria-expanded={open}
		disabled={disabled}
		on:click={() => (open = !open)}
		on:keydown={handleTriggerKeyDown}
		{...restProps}
	>
		<span class="mr-2 truncate">
			{#if selectedOption}
				{displayLabel}
			{:else}
				{placeholder}
			{/if}
		</span>
		<Icon name="chevronDown" class="h-4 w-4 text-muted-foreground" size={16} />
	</button>

	{#if name}
		<input type="hidden" name={name} value={internalValue} />
	{/if}

	{#if open}
		<div
			class="absolute left-0 z-50 mt-1 w-full min-w-36 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
			role="listbox"
		>
			<div class="max-h-56 overflow-y-auto p-1">
				{#each items as item, index (item.value)}
					<button
						type="button"
						class={cn(
							'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
							internalValue === item.value && 'bg-accent text-accent-foreground',
							highlightedIndex === index && internalValue !== item.value && 'bg-accent/40 text-foreground',
							item.disabled && 'opacity-50 cursor-not-allowed'
						)}
						role="option"
						aria-selected={internalValue === item.value}
						on:click={() => selectValue(item)}
						on:mouseenter={() => (highlightedIndex = index)}
					>
						<span class="truncate">{item.label ?? item.value}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
