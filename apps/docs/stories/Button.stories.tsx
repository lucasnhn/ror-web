import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button, ButtonProps } from '@ror/react/src/components/button'
import { ComponentType } from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Button',
  component: Button as ComponentType<ButtonProps>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
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
