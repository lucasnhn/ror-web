import type { Meta, StoryObj } from '@storybook/react'
import { ContentSwitch, Switch } from '@ror/react/src/components/content-switch/index'
import { fn } from '@storybook/test'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Content Switch',
  component: ContentSwitch,
  // @ts-expect-error - Ignore type error for subcomponents
  subcomponents: { Switch },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    defaultSelected: 'panel-1',
    size: 'md',
    onChange: fn(),
  },
} satisfies Meta<typeof ContentSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ContentSwitch {...args}>
      <Switch name='panel-1'>Panel 1</Switch>
      <Switch name='panel-2'>Panel 2</Switch>
    </ContentSwitch>
  ),
}
