import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderHtmlStory } from '@/lib/story-utils';
import { buildCells, JACKPOT_MIN_HITS } from '@/logics/roulette';
import { ResultPanel } from './result-panel';

type ResultPanelProps = Parameters<typeof ResultPanel>[0];

// 大当たり・当たり・ハズレをすべて含む構成
const cells = buildCells(JACKPOT_MIN_HITS);

const meta: Meta<ResultPanelProps> = {
  title: 'Roulette/ResultPanel',
  render: renderHtmlStory(ResultPanel),
  args: { cells, result: { kind: 'idle' } },
};

export default meta;

type Story = StoryObj<ResultPanelProps>;

export const Idle: Story = {};
export const Spinning: Story = { args: { result: { kind: 'spinning' } } };
export const Jackpot: Story = { args: { result: { kind: 'done', index: cells.indexOf('jackpot') } } };
export const Hit: Story = { args: { result: { kind: 'done', index: cells.indexOf('hit') } } };
export const Miss: Story = { args: { result: { kind: 'done', index: cells.indexOf('miss') } } };
