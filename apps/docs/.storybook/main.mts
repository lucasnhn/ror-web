import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-mdx-gfm'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {},
}

export default config
