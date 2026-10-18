import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderHtmlStory } from '@/lib/story-utils';
import { SiteHeader } from './site-header';

const meta = {
  title: 'Layout/SiteHeader',
  render: renderHtmlStory(SiteHeader),
} satisfies Meta;

export default meta;

export const Default: StoryObj = {};
