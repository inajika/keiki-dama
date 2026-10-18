import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderToString } from 'hono/jsx/dom/server';
import { Pointer } from './pointer';

const meta: Meta = {
  title: 'Roulette/Pointer',
  // Pointer は absolute 配置なので、基準になる relative なラッパーに包んで表示する
  render: () =>
    renderToString(
      <div class="relative mx-auto mt-4 h-10 w-28">
        <Pointer />
      </div>,
    ),
};

export default meta;

export const Default: StoryObj = {};
