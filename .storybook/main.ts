import type { StorybookConfig } from '@storybook/html-vite';
import type { PluginOption } from 'vite';

/** アプリ本体のビルド用で、Storybook では不要なプラグインの名前 (前方一致) */
const APP_ONLY_PLUGIN_PREFIXES = ['honox', 'hono', 'vite-plugin-honox'];

/** 名前が `APP_ONLY_PLUGIN_PREFIXES` のいずれかで始まるプラグインか判定する */
const isAppOnlyPlugin = (plugin: unknown): boolean => {
  const name = (plugin as { name?: unknown } | null | undefined)?.name;
  return typeof name === 'string' && APP_ONLY_PLUGIN_PREFIXES.some((prefix) => name.startsWith(prefix));
};

/**
 * ネストしたプラグイン配列を平坦化する。
 * `Array.prototype.flat(Infinity)` は PluginOption の再帰型により型のインスタンス化が深くなりすぎるため、自前で再帰する。
 */
const flattenPlugins = (plugins: PluginOption[]): PluginOption[] =>
  plugins.flatMap((plugin) => (Array.isArray(plugin) ? flattenPlugins(plugin) : [plugin]));

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/html-vite',
  // vite.config.ts を Storybook も読み込むが、HonoX・Workers 用のプラグインはブラウザ上のプレビューに不要なので外す
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = flattenPlugins(viteConfig.plugins ?? []).filter((plugin) => !isAppOnlyPlugin(plugin));
    return viteConfig;
  },
};

export default config;
