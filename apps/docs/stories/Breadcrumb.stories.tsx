import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb, BreadcrumbItem } from '@ror/react/src/components/breadcrumb'
import type { BreadcrumbProps } from '@ror/react/src/components/breadcrumb'
import { ComponentType } from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Breadcrumb',
  component: Breadcrumb as ComponentType<BreadcrumbProps>,
  // @ts-expect-error - Storybook does not do a good job of inferring types for subcomponents
  subcomponents: { BreadcrumbItem },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>About</BreadcrumbItem>
      <BreadcrumbItem>Team</BreadcrumbItem>
      <BreadcrumbItem isCurrentPage={true} asChild>
        <a href='#0'>Team A</a>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
}

export const NoTrailingSlash: Story = {
  render: () => (
    <Breadcrumb noTrailingSlash>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>About</BreadcrumbItem>
      <BreadcrumbItem>Team</BreadcrumbItem>
      <BreadcrumbItem isCurrentPage={true} asChild>
        <a href='#0'>Team A</a>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
}
