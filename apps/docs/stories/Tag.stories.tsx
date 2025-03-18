import type { Meta, StoryObj } from '@storybook/react'
import { Tag, TagProps } from '@ror/react/src/components/tag'
import { ComponentType } from 'react'
import { CheckIcon } from 'lucide-react'

const meta = {
    title: 'ui/Tag',
    component: Tag as ComponentType<TagProps>,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        className: { control: { type: 'text' } },
        size: { control: { type: 'select', options: ['sm', 'md', 'lg'] } },
        variant: { control: { type: 'select', options: ['readonly', 'dismissible', 'operational', 'selectable'] } },
        color: { control: { type: 'select', options: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'] } },
        icon: { control: false},
        children: { control: { type: 'text' } },
    },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Tag story
 */
export const Default: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'neutral',
        children: 'This is a default tag'
    },
}

/**
 * Story with `sm`, `md`, and `lg` sizes
 */
export const SizesTags: Story = {
    render: () => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
            >
                <Tag size="sm">This is a small tag</Tag>
                <Tag size="md">This is a medium tag</Tag>
                <Tag size="lg">This is a large tag</Tag>
            </div>
        )
    }
}

/**
 * `dismissible` Tag story
 */
export const DismissibleTag: Story = {
    args: {
        variant: 'dismissible',
        children: 'This is a dismissible tag'
    },
}

// TODO: Implement operational tag

/**
 * `selectable` Tag story
 */
export const SelectableTag: Story = {
    args: {
        size: 'md',
        variant: 'selectable',
        children: 'This is a selectable tag'
    },
}

/**
 * Icon Tag story
 */
export const SuccessTag: Story = {
    args: {
        icon: <CheckIcon />,
        children: 'This is a tag with an icon'
    },
}


/**
 * Story with tags with different colors
 */
export const ColorTags: Story = {
    render: () => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                }}
            >
                <Tag color="red">This is a red tag</Tag>
                <Tag color="orange">This is an orange tag</Tag>
                <Tag color="yellow">This is a yellow tag</Tag>
                <Tag color="green">This is a green tag</Tag>
                <Tag color="blue">This is a blue tag</Tag>
                <Tag color="purple">This is a purple tag</Tag>
                <Tag color="pink">This is a pink tag</Tag>
                <Tag color="gray">This is a gray tag</Tag>
                <Tag color="neutral">This is a neutral tag</Tag>
            </div>
        )
    }
}