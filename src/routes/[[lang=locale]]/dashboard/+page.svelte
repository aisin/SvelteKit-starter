<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { getI18nContext } from '$lib/i18n/context';
  let { data } = $props<{ data: { props?: { session?: { user?: { name?: string } } } } }>();
  const { t } = getI18nContext();
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4">
  <h1 class="text-2xl font-bold">{t('dashboard.header.title', { name: data?.props?.session?.user?.name ?? '' })}</h1>
  <button
    class="btn preset-filled"
    onclick={async () => {
      await authClient.signOut();
      window.location.href = '/login';
    }}
  >
    {t('dashboard.actions.sign_out')}
  </button>
</div>
