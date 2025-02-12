import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipProps, TooltipProvider } from '@ror/react/src/components/tooltip'
import { fn } from '@storybook/test'
import { ComponentType } from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Tooltip',
  component: Tooltip as ComponentType<TooltipProps>,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  args: {
    children: <p style={{ borderBottom: '1px dotted #ccc', cursor: 'help' }}>Hover me</p>,
    content: (
      <span>
        I&apos;m a <em>tooltip</em>
      </span>
    ),
    delayDuration: 700,
    onOpenChange: fn(),
  },
  argTypes: {
    children: {
      control: false,
      description: 'The trigger element for the tooltip.',
    },
    content: {
      control: false,
      description: 'The content to display in the tooltip.',
    },
    defaultOpen: {
      type: 'boolean',
      description:
        'The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state.',
    },
    delayDuration: {
      type: 'number',
      description: 'The duration from when the mouse enters a tooltip trigger until the tooltip opens.',
    },
    open: {
      type: 'boolean',
      description: 'The controlled open state of the tooltip. Must be used in conjunction with onOpenChange.',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Event handler called when the open state of the tooltip changes.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '500px', display: 'grid', placeContent: 'center' }}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    open: true,
  },
}
