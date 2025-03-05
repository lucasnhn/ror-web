import type { Meta, StoryObj } from '@storybook/react'
import { IconIndicator } from '@ror/react/src/components/icon-indicator'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Icon Indicator',
  component: IconIndicator,
  parameters: {
    layout: 'centered',
  },
  args: {
    kind: 'succeeded',
    label: 'Label',
    size: 'md',
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    kind: {
      control: false,
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['md', 'lg'],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (props) => {
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          rowGap: '.5rem',
        }}
      >
        <IconIndicator {...props} kind='failed' label='Failed' />
        <IconIndicator {...props} kind='caution-major' label='Caution major' />
        <IconIndicator {...props} kind='caution-minor' label='Caution minor' />
        <IconIndicator {...props} kind='undefined' label='Undefined' />
        <IconIndicator {...props} kind='succeeded' label='Succeeded' />
        <IconIndicator {...props} kind='normal' label='Normal' />
        <IconIndicator {...props} kind='in-progress' label='In progress' />
        <IconIndicator {...props} kind='incomplete' label='Incomplete' />
        <IconIndicator {...props} kind='not-started' label='Not started' />
        <IconIndicator {...props} kind='pending' label='Pending' />
        <IconIndicator {...props} kind='unknown' label='Unknown' />
        <IconIndicator {...props} kind='informative' label='Informative' />
      </div>
    )
  },
}
