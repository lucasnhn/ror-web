import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from '@ror/react/components/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    className: '',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Click me',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Click me',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Click me',
  },
}

export const AsLink: Story = {
  args: {
    asChild: true,
    children: 'I am a link',
  },
  render: ({ children, ...rest }) => (
    <Button {...rest}>
      <a href='https://www.radix-ui.com/primitives/docs/utilities/slot' target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    </Button>
  ),
}
