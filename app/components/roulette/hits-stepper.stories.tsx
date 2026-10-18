import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderHtmlStory } from '@/lib/story-utils';
import { MAX_HITS, MIN_HITS } from '@/logics/roulette';
import { HitsStepper } from './hits-stepper';

type HitsStepperProps = Parameters<typeof HitsStepper>[0];

const meta: Meta<HitsStepperProps> = {
  title: 'Roulette/HitsStepper',
  render: renderHtmlStory(HitsStepper),
  args: { hits: 3, min: MIN_HITS, max: MAX_HITS, disabled: false, onChange: () => {} },
};

export default meta;

type Story = StoryObj<HitsStepperProps>;

export const Default: Story = {};
export const Minimum: Story = { args: { hits: MIN_HITS } };
export const Maximum: Story = { args: { hits: MAX_HITS } };
export const Disabled: Story = { args: { disabled: true } };
