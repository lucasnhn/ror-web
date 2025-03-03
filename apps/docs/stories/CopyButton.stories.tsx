import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from '@ror/react/src/components/copy-button'
import { TooltipProvider } from '@ror/react/src/components/tooltip'
import { Layer } from '@ror/react/src/components/layer'

const meta = {
  title: 'ui/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <TooltipProvider>
      <Layer>
        <CopyButton {...args} />
      </Layer>
    </TooltipProvider>
  ),
}
