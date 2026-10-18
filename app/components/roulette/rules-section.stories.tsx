import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderHtmlStory } from '@/lib/story-utils';
import { buildCells, formatSimulation, JACKPOT_MIN_HITS, simulate } from '@/logics/roulette';
import { RulesSection } from './rules-section';

type RulesSectionProps = Parameters<typeof RulesSection>[0];

/** 表示が毎回変わらないよう、乱数を固定してシミュレーションする */
const fixedRandom = () => 0.5;

const meta: Meta<RulesSectionProps> = {
  title: 'Roulette/RulesSection',
  render: renderHtmlStory(RulesSection),
  args: { simOut: '', onSimulate: () => {} },
};

export default meta;

type Story = StoryObj<RulesSectionProps>;

export const Default: Story = {};
export const WithSimulation: Story = {
  args: { simOut: formatSimulation(simulate(buildCells(JACKPOT_MIN_HITS), 10000, fixedRandom)) },
};
