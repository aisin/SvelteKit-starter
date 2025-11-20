<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Menu, X, ChevronDown, Sun, Moon, Github, ExternalLink, Rocket } from '@lucide/svelte';
	let {
		name = 'menu' as 'menu' | 'x' | 'chevronDown' | 'sun' | 'moon' | 'github' | 'externalLink' | 'rocket',
		size = 20,
		strokeWidth = 2,
		class: className = ''
	} = $props();

	const map = {
		menu: Menu,
		x: X,
		chevronDown: ChevronDown,
		sun: Sun,
		moon: Moon,
		github: Github,
		externalLink: ExternalLink,
		rocket: Rocket
	} as const;

	const IconComp = map[name] ?? Menu;
</script>

<IconComp size={size} strokeWidth={strokeWidth} class={cn('h-5 w-5 text-foreground', className)} />
