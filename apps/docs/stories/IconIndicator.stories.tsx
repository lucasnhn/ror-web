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
      options: ['sm', 'md', 'lg'],
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
        <IconIndicator kind='failed' label='Failed' {...props} />
        <IconIndicator kind='caution-major' label='Caution major' {...props} />
        <IconIndicator kind='caution-minor' label='Caution minor' {...props} />
        <IconIndicator kind='undefined' label='Undefined' {...props} />
        <IconIndicator kind='succeeded' label='Succeeded' {...props} />
        <IconIndicator kind='normal' label='Normal' {...props} />
        <IconIndicator kind='in-progress' label='In progress' {...props} />
        <IconIndicator kind='incomplete' label='Incomplete' {...props} />
        <IconIndicator kind='not-started' label='Not started' {...props} />
        <IconIndicator kind='pending' label='Pending' {...props} />
        <IconIndicator kind='unknown' label='Unknown' {...props} />
        <IconIndicator kind='informative' label='Informative' {...props} />
      </div>
    )
  },
}
