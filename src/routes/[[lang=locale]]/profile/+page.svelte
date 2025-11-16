<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { getI18nContext } from '$lib/i18n/context';
  let { data } = $props<{ data: { props?: { session?: { user?: { name?: string } } } } }>();
  const { t } = getI18nContext();
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-2">
  <h1 class="text-2xl font-bold">{t('profile.header.title')}</h1>
  {#if data?.props?.session}
    <div class="flex flex-col items-center">
      <h2>{t('profile.session.signed_in_as', { name: data.props.session.user.name })}</h2>
      <pre>{JSON.stringify(data.props?.session.user, null, 2)}</pre>
      <button
        class="btn preset-filled"
        onclick={async () => {
          await authClient.signOut();
          window.location.href = '/login';
        }}
      >
        {t('profile.session.sign_out')}
      </button>
    </div>
  {/if}
</div>
