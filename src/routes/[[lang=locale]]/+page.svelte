<script lang="ts">
  import { getI18nContext } from '$lib/i18n/context';
  const { t } = getI18nContext();
</script>

<h1 class="text-2xl font-bold">{t('home.header.title')}</h1>
<p>{t('home.header.description')}</p>
