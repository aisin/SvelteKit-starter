import { getContext as _getContext, setContext as _setContext } from 'svelte';

export type TFunc = (key: string, vars?: Record<string, any>) => string;
export type I18nContext = { t: TFunc; locale: string };

export const I18N_CTX = Symbol('i18n');

export function setI18nContext(value: I18nContext) {
  _setContext(I18N_CTX, value);
}

export function getI18nContext(): I18nContext {
  return _getContext<I18nContext>(I18N_CTX);
}
