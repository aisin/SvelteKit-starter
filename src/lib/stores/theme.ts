import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>('light');

	return {
		subscribe,
		// 初始化为当前 document 的主题；多次调用也是安全的
		initFromDocument() {
			if (typeof document === 'undefined') return;
			const isDark = document.documentElement.classList.contains('dark');
			set(isDark ? 'dark' : 'light');
		},
		// 切换主题，并同步到 <html> 元素和 localStorage
		toggle() {
			update((current) => {
				const next: Theme = current === 'dark' ? 'light' : 'dark';

				if (typeof document !== 'undefined') {
					if (next === 'dark') {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
					localStorage.setItem('theme', next);
				}

				return next;
			});
		}
	};
}

export const theme = createThemeStore();
