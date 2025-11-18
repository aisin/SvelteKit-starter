<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils/cn';

	const buttonVariants = cva(
		'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
		{
			variants: {
				variant: {
					default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
					destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
					outline:
						'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
					secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
					ghost: 'hover:bg-accent hover:text-accent-foreground',
					link: 'text-primary underline-offset-4 hover:underline'
				},
				size: {
					default: 'h-9 px-4 py-2',
					sm: 'h-8 rounded-md px-3',
					lg: 'h-10 rounded-md px-8',
					icon: 'h-9 w-9'
				}
			},
			defaultVariants: {
				variant: 'default',
				size: 'default'
			}
		}
	);

	type ButtonVariants = VariantProps<typeof buttonVariants>;

	// Pull out known props and forward the rest (events, ARIA, etc.) to the native button
	let allProps = $props();
	let {
		class: className = '',
		type: btnType = 'button' as 'button' | 'submit' | 'reset',
		disabled = false,
		variant = 'default' as ButtonVariants['variant'],
		size = 'default' as ButtonVariants['size'],
		children,
		...restProps
	} = allProps;
</script>

<button
	class={cn(buttonVariants({ variant, size }), className)}
	type={btnType}
	disabled={disabled}
	{...restProps}
>
	{@render children?.()}
</button>
