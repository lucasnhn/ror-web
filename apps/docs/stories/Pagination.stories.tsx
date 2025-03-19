import { Meta, StoryObj } from '@storybook/react'
import { Pagination } from '@ror/react/src/components/pagination'
import { fn } from '@storybook/test'

const meta: Meta<typeof Pagination> = {
  title: 'ui/Pagination',
  component: Pagination,

  args: {
    itemRangeText: 'Showing 1-10 of 100 items',
    onPageSizeChange: fn(),
    onBackwards: fn(),
    onForwards: fn(),
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {}
