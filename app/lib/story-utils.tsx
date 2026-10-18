import type { StoryFn } from '@storybook/html-vite';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';

/**
 * Hono JSX のコンポーネントを Storybook (@storybook/html) で表示できる形に変換する。
 * hono/jsx はサーバーサイド向けのため、HTML 文字列にしてから渡す。
 * そのためイベントハンドラや状態は動作せず、args で渡した props の静的な見た目だけを確認できる。
 */
export function renderHtmlStory<P extends object>(Component: FC<P>): StoryFn<P> {
  return (args) => renderToString(<Component {...args} />);
}
