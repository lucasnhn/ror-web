import type { Meta, StoryObj } from '@storybook/react'
import { MetricsCard, MetricsCardItem, MetricsCardProps, MetricType } from '@ror/react/src/components/metrics-card'
import { ComponentType } from 'react'
import { Button } from '@ror/react'

const meta = {
  title: 'ui/MetricsCard',
  component: MetricsCard as ComponentType<MetricsCardProps>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    item: {
      control: { type: 'object' },
      description: 'Specify the item for the metrics card. Item should conform to type MetricsCardItem.',
    },
    children: { control: false, description: 'Specify children if you want to override default layout.' },
    shouldEdit: { control: { type: 'boolean' }, description: 'Indicates whether the card is in edit mode.' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '416px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricsCard>

export default meta
type Story = StoryObj<typeof meta>

const dashboardItem: MetricsCardItem = {
  id: '1',
  typeId: 1,
  title: 'Data centers',
  description: 'Data centers with data',
  linkText: 'See all',
  linkPath: '#',
  type: 'wheel' as MetricType,
  wheelPart: 5,
  wheelWhole: 6,
  wheelLabel: '5 of 6',
}

const customContent = (
  <div>
    <div>
      <div>
        <h3>Add new metric</h3>
      </div>
      <p>What metric do you want to add?</p>
    </div>

    <form>
      <input></input> <br />
      <Button type='submit'>Add</Button>
    </form>
  </div>
)

/**
 * Default MetricsCard story
 */
export const Default: Story = {
  args: {
    item: dashboardItem,
  },
}

/**
 * MetricsCard with custom content
 */
export const WithCustomContent: Story = {
  args: {
    children: customContent,
  },
}

/**
 * MetricsCard with shouldEdit enabled
 */
export const WithShouldEdit: Story = {
  args: {
    item: dashboardItem,
    shouldEdit: true,
  },
}
