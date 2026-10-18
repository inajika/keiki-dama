import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderToString } from 'hono/jsx/dom/server';
import { buildCells, JACKPOT_MIN_HITS, MAX_HITS, MIN_HITS } from '@/logics/roulette';
import { Wheel } from './wheel';

type WheelProps = Parameters<typeof Wheel>[0];

const meta: Meta<WheelProps> = {
  title: 'Roulette/Wheel',
  // Wheel は親の大きさいっぱいに広がるので、本番と同じ幅のラッパーに包んで表示する
  render: (args) =>
    renderToString(
      <div class="mx-auto aspect-square w-[min(100%,360px)]">
        <Wheel {...args} />
      </div>,
    ),
  args: { cells: buildCells(MIN_HITS), rotation: 0, transition: 'none', winIndex: null },
};

export default meta;

type Story = StoryObj<WheelProps>;

const jackpotCells = buildCells(JACKPOT_MIN_HITS);

export const OneHit: Story = {};
export const WithJackpot: Story = { args: { cells: jackpotCells } };
export const MaxHits: Story = { args: { cells: buildCells(MAX_HITS) } };
export const Won: Story = { args: { cells: jackpotCells, winIndex: jackpotCells.indexOf('jackpot') } };
export const Rotated: Story = { args: { cells: jackpotCells, rotation: 125 } };
