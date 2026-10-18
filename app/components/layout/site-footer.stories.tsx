import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderHtmlStory } from '@/lib/story-utils';
import { SiteFooter } from './site-footer';

const meta = {
  title: 'Layout/SiteFooter',
  render: renderHtmlStory(SiteFooter),
} satisfies Meta;

export default meta;

export const Default: StoryObj = {};
