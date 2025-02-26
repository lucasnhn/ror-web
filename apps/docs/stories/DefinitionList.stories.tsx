import type { Meta, StoryObj } from '@storybook/react'
import { DefinitionDescription, DefinitionList, DefinitionTerm } from '@ror/react/src/components/definition-list'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ui/Definition List',
  component: DefinitionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof DefinitionList>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => (
    <DefinitionList {...args}>
      <DefinitionTerm>Term</DefinitionTerm>
      <DefinitionDescription>Description</DefinitionDescription>
    </DefinitionList>
  ),
}
