# SvelteKit i18n 技术方案

本文档提供一个在 SvelteKit 项目中实现多语言（i18n）的最小可行方案：不引入第三方 i18n 库，使用“可选语言路由段 + JSON 动态加载 + 极简 t 函数”，实现默认语言不带前缀、其他语言带前缀、规范化 locale 与回退机制。该方案与 Next/next-intl 的常见实践等效，落地简单、稳健。

## 目标与特性

- 默认语言不带前缀（as-needed）：/（默认 en）、/zh/...
- locale 规范化，非法 locale 统一回退 en
- UI 消息与“富内容/工具文案”分治
- 动态导入 JSON，失败回退 en
- 极简 t(key, vars) 翻译函数（支持点路径与变量替换）
- 语言切换保留 query/hash，不产生双重前缀
- 无新增依赖，保持可维护性



## 目录结构建议

将 i18n 资源放在 src/lib/i18n（示例如下，可按实际调整）：

```
src/lib/i18n/
├─ messages/
│  ├─ en.json
│  └─ zh.json
├─ pages/
│  ├─ landing/
│  │  ├─ en.json
│  │  └─ zh.json
│  ├─ home/
│  │  ├─ en.json
│  │  └─ zh.json
│  └─ pricing/
│     ├─ en.json
│     └─ zh.json
└─ login/
   ├─ en.json
   └─ zh.json
```


## 路由与参数匹配

使用“可选参数 + 自定义匹配器”让 / 与 /zh/... 共存，等效 as-needed。
```
// src/params/locale.ts
export function match(value: string) {
  return ['en', 'zh'].includes(value.toLowerCase());
}
```

采用根级可选语言段路由容器：

- 路由目录：src/routes/[[lang=locale]]/
  - +layout.server.ts：解析 locale、加载 UI 消息
  - +layout.svelte：提供 t 函数
  - 各页面放在该目录下，使之继承 locale 与 t

## 服务器端加载（+layout.server.ts）

- 规范化 locale
- 加载 messages/{locale}.json，失败回退 en
- 设置 Content-Language 响应头

```
// src/routes/[[lang=locale]]/+layout.server.ts
import type { LayoutServerLoad } from './$types';

const SUPPORTED = ['en', 'zh'] as const;
const DEFAULT_LOCALE = 'en';

function normalizeLocale(input?: string) {
  if (!input) return DEFAULT_LOCALE;
  const v = input.toLowerCase();
  return (SUPPORTED as readonly string[]).includes(v) ? (v as 'en' | 'zh') : DEFAULT_LOCALE;
}

export const load: LayoutServerLoad = async ({ params, setHeaders }) => {
  let locale = normalizeLocale(params.lang);

  setHeaders({ 'Content-Language': locale });

  let messages: Record<string, any>;
  try {
    messages = (await import(`$lib/i18n/messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`$lib/i18n/messages/${DEFAULT_LOCALE}.json`)).default;
    locale = DEFAULT_LOCALE;
  }

  return { locale, messages };
};
```

## 客户端布局与 t 函数（+layout.svelte）

在布局中构造 t(key, vars)，通过 slot props 或 context 提供给子页面与组件。以下示例采用 slot props，简单直观。
```
<!-- src/routes/[[lang=locale]]/+layout.svelte -->
<script lang="ts">
  export let data: { locale: string; messages: Record<string, any> };

  function get(obj: any, path: string) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function format(s: string, vars?: Record<string, string | number>) {
    return s && vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')) : s;
  }

  const t = (key: string, vars?: Record<string, any>) => {
    const v = get(data.messages, key);
    return typeof v === 'string' ? format(v, vars) : v ?? key;
  };
</script>

<svelte:head>
  <meta http-equiv="content-language" content={data.locale} />
</svelte:head>

<slot {t} />
```
在页面中接收 t 并使用：
```
<!-- 示例：src/routes/[[lang=locale]]/+page.svelte -->
<script lang="ts">
  export let data: { locale: string };
  export let t: (key: string, vars?: Record<string, any>) => string;
</script>

<h1>{t('tools.title')}</h1>
<p>{t('tools.description')}</p>
```


## 语言切换组件（LocaleToggle）

- 识别并剥离当前 URL 的语言前缀
- 拼接目标语言前缀（默认语言不加前缀）
- 保留 search/hash

```
<!-- src/lib/components/LocaleToggle.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const localeNames: Record<string, string> = { en: 'English', zh: '中文' };
  const SUPPORTED = ['en', 'zh'] as const;
  const DEFAULT = 'en';

  function stripLeadingLocale(pathname: string) {
    return pathname.replace(/^\/(en|zh)(?=\/|$)/i, '') || '/';
  }

  async function switchLocale(value: string) {
    const current = $page.params.lang ?? DEFAULT;
    if (value === current) return;

    const rest = stripLeadingLocale($page.url.pathname);
    const search = $page.url.search ?? '';
    const hash = $page.url.hash ?? '';

    const target = value === DEFAULT ? `${rest}${search}${hash}` : `/${value}${rest}${search}${hash}`;
    await goto(target, { replaceState: true, invalidateAll: true });
  }
</script>

<select on:change={(e) => switchLocale((e.target as HTMLSelectElement).value)}>
  {#each Object.keys(localeNames) as key}
    <option value={key} selected={key === ($page.params.lang ?? DEFAULT)}>{localeNames[key]}</option>
  {/each}
</select>
```

在头部或任意位置引用该组件即可。



## 页面“富内容”与“工具文案”的动态导入

与 UI 消息分离，保持内容文件可由非工程人员维护。提供服务函数并在页面 load 中使用。

```
// src/lib/services/page.ts
const DEFAULT = 'en';
export async function getPageData(name: string, locale: string) {
  const lc = locale.toLowerCase();
  try {
    return (await import(`$lib/i18n/pages/${name}/${lc}.json`)).default;
  } catch {
    return (await import(`$lib/i18n/pages/${name}/${DEFAULT}.json`)).default;
  }
}
```

```
// src/lib/services/tool.ts
const DEFAULT = 'en';
export async function getToolI18n(toolId: string, locale: string) {
  const lc = locale.toLowerCase();
  try {
    return (await import(`$lib/i18n/tools/${toolId}/${lc}.json`)).default;
  } catch {
    try {
      return (await import(`$lib/i18n/tools/${toolId}/${DEFAULT}.json`)).default;
    } catch {
      return {};
    }
  }
}
```

页面端使用（示例）：

```
// src/routes/[[lang=locale]]/+page.server.ts
import type { PageServerLoad } from './$types';
import { getPageData } from '$lib/services/page';

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  const page = await getPageData('landing', locale);
  return { page };
};
```


## 链接本地化助手（可选）

统一构造本地化链接，默认语言不加前缀：
```
// src/lib/i18n/link.ts
export function localeHref(path: string, locale: string, defaultLocale = 'en') {
  if (!path.startsWith('/')) path = `/${path}`;
  return locale === defaultLocale ? path : `/${locale}${path}`;
}
```


## SEO（可选增强）

•  已通过 Content-Language 提示语言
•  如需 hreflang，可在 Layout 或页面 head 输出所有可用语言的 alternate 链接（结合你的站点基准 URL）

```
<!-- 在 +layout.svelte 或页面 -->
<svelte:head>
  <!-- 示例：根据你的站点 URL 与 SUPPORTED locales 动态生成 -->
  <!-- <link rel="alternate" hrefLang="en" href="https://example.com/" /> -->
  <!-- <link rel="alternate" hrefLang="zh" href="https://example.com/zh/" /> -->
  <!-- <link rel="alternate" hrefLang="x-default" href="https://example.com/" /> -->
</svelte:head>
```


## 快速落地步骤

1) 创建 JSON 资源
   在 src/lib/i18n/ 目录创建对应页面/组件的多语言内容 json

2) 路由容器  
   创建目录 src/routes/[[lang=locale]]/ 并添加：
- src/params/locale.ts
- +layout.server.ts（加载 locale 与 messages）
- +layout.svelte（提供 t 函数）

3) 语言切换组件与工具方法  
- src/lib/components/LocaleToggle.svelte  
- src/lib/services/page.ts、src/lib/services/tool.ts  
  -（可选）src/lib/i18n/link.ts

4) 页面改造  
- 将原页面移入 [[lang=locale]]/ 下，使其获得 locale 与 t。  
- 页面/组件中使用 t('path.to.key')。  
- 需要富内容的页面，通过 getPageData(name, locale) 加载。



## 注意事项（避免出错）

- 可选路由段 [[lang=locale]] 是关键，避免为每种语言复制页面。
- 不要把函数（如 t）直接放入 load 返回（不可序列化）；在布局组件中构造，并通过 slot/context 传递。
- 动态导入路径使用 $lib 别名，确保构建可解析；打包器会包含可能的 JSON 变体以支持动态导入。
- 始终规范化，避免资源缺失。
- 语言切换要剥离旧前缀再拼新前缀，避免 /{lang}/{lang}/...。
- 切换时建议保留 search/hash，避免用户状态丢失。



## 自测清单

- / 与 /zh/ 页面均可访问，UI 文案正确
- 切换语言后路径正确、query/hash 保留
- 删除某 locale 的某个 JSON key：是否正确回退到 en 或显示 key
- 页面富内容与工具文案在不同语言下正确加载
- 搜索引擎可抓取（可选检查 Content-Language 与 hreflang）



## 增强

- 将 t 放入 context 避免每页 export let t（换用 setContext/getContext）



附：示例 messages.json 片段
```
{
  "tools": {
    "title": "Tools Collection",
    "description": "Explore our collection of useful tools"
  }
}
```

```
{
  "tools": {
    "title": "工具集合",
    "description": "探索我们的实用工具集合"
  }
}
```
