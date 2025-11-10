import type { PageServerLoad } from './$types';
import { auth } from '../../lib/auth';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		throw redirect(302, '/login');
	}

	return {
		props: {
			session
		}
	};
}) satisfies PageServerLoad;
