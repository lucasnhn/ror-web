import type { Meta, StoryObj } from '@storybook/react'
import { SeverityIcon } from '@ror/react/src/components/severity-icon'

const meta = {
  title: 'ui/SeverityIcon',
  component: SeverityIcon,
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 'md',
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    score: { control: { type: 'number', min: 1, max: 10, step: 0.1 } },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeverityIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (props) => {
    return <SeverityIcon {...props} />
  },
}

export const AllIcons: Story = {
  render: (props) => {
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          rowGap: '.5rem',
        }}
      >
        <SeverityIcon {...props} score={10} />
        <SeverityIcon {...props} score={8} />
        <SeverityIcon {...props} score={5} />
        <SeverityIcon {...props} score={2} />
        <SeverityIcon {...props} score={0} />
      </div>
    )
  },
}
