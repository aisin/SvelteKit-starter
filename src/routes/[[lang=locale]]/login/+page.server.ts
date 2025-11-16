import type { PageServerLoad } from './$types';
import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import { localeHref } from '$lib/i18n/link';

export const load = (async ({ request, parent }) => {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (session) {
    const { locale } = await parent();
    throw redirect(302, localeHref('/dashboard', locale));
  }

  return {};
}) satisfies PageServerLoad;
