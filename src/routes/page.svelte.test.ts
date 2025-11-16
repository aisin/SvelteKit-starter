import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from '../routes/[[lang=locale]]/+page.svelte';
import Layout from '../routes/[[lang=locale]]/+layout.svelte';

// Mount Page through the i18n layout so that context is provided

describe('[[lang=locale]]/+page.svelte', () => {
  test('should render h1', () => {
    const result = render(Layout, {
      data: {
        locale: 'en',
        messages: {
          header: {
            brand: { title: 'Acme', logo: { src: '/logo.svg', alt: 'Acme logo' } },
            nav: { items: [] },
            buttons: [],
            show_sign: false,
            show_theme: false,
            show_locale: false
          },
          home: {
            header: {
              title: 't',
              description: 'd'
            }
          }
        }
      },
      // provide children snippet to render the Page
      children: () => Page
    });

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    result.unmount();
  });
});
