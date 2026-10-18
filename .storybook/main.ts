import type { StorybookConfig } from '@storybook/html-vite';

/** アプリ本体のビルド用で、Storybook では不要なプラグインの名前 (前方一致) */
const APP_ONLY_PLUGIN_PREFIXES = ['honox', 'hono', 'vite-plugin-honox'];

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/html-vite',
  // vite.config.ts を Storybook も読み込むが、HonoX・Workers 用のプラグインはブラウザ上のプレビューに不要なので外す
  viteFinal: async (viteConfig) => {
    const isAppOnly = (name: string) => APP_ONLY_PLUGIN_PREFIXES.some((prefix) => name.startsWith(prefix));
    const flatten = (plugins: unknown[]): unknown[] => plugins.flat(Number.POSITIVE_INFINITY);
    viteConfig.plugins = (flatten(viteConfig.plugins ?? []) as { name?: string }[]).filter(
      (plugin) => !(plugin && typeof plugin.name === 'string' && isAppOnly(plugin.name)),
    );
    return viteConfig;
  },
};

export default config;
