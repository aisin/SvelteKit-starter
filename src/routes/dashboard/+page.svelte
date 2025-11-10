<script lang="ts">
	import { authClient } from '../../lib/auth-client';
	let { data } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4">
	<h1 class="text-2xl font-bold">Welcome, {data?.props?.session?.user?.name}</h1>
	<button
		class="btn preset-filled"
		onclick={async () => {
			await authClient.signOut();
			window.location.href = '/login';
		}}
	>
		Sign Out
	</button>
</div>
