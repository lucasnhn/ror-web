import type { Meta, StoryObj } from '@storybook/react'
import { Tag, TagProps } from '@ror/react/src/components/tag'
import { ComponentType } from 'react'

const meta = {
  title: 'ui/Tag',
  component: Tag as ComponentType<TagProps>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: { type: 'text' }, description: 'Specify an optional className to be applied to the container node' },
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] }, description: 'How large should the tag be?' },
    variant: { control: { type: 'select', options: ['readonly', 'dismissible', 'operational', 'selectable'] }, description: 'What style of the tag should be used?' },
    color: { control: { type: 'select', options: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'] }, description: 'What should the tag severity be? Affects the color of the tag.' },
    icon: { control: false, description: 'What icon should be used?' },
    children: { control: { type: 'text' }, description: 'What should the text for the tag be?' },
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
        color: 'blue',
        children: 'This is a default tag'
    },
}

/**
 * `sm` Tag story
 */
export const SmallTag: Story = {
    args: {
        size: 'sm',
        variant: 'readonly',
        color: 'blue',
        children: 'This is a small tag'
    },
}

/**
 * `lg` Tag story
 */
export const LargeTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'blue',
        children: 'This is a large tag'
    },
}

/**
 * `dismissible` Tag story
 */
export const DismissibleTag: Story = {
    args: {
        size: 'md',
        variant: 'dismissible',
        color: 'blue',
        children: 'This is a dismissible tag'
    },
}

// TODO: Implement operational tag
/**
 * `operational` Tag story
 */
export const OperationalTag: Story = {
    args: {
        size: 'md',
        variant: 'operational',
        color: 'blue',
        children: 'This is an operational tag'
    },
}

export const SelectableTag: Story = {
    args: {
        size: 'md',
        variant: 'selectable',
        color: 'blue',
        children: 'This is a selectable tag'
    },
}

/**
 * `error` Tag story
 */
export const ErrorTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'error',
        children: 'This is an error tag'
    },
}

/**
 * `success` Tag story
 */
export const SuccessTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'success',
        children: 'This is a success tag'
    },
}

/**
 * `warning` Tag story
 */
export const WarningTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'warning',
        children: 'This is a warning tag'
    },
}

/**
 * `info` Tag story
 */
export const InfoTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        severity: 'blue',
        children: 'This is an info tag'
    },
}

/**
 * `caution-minor` Tag story
 */
export const CautionMinorTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'caution-minor',
        children: 'This is a caution-minor tag'
    },
}

/**
 * `caution-major` Tag story
 */
export const CautionMajorTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'caution-major',
        children: 'This is a caution-major tag'
    },
}

/**
 * `caution-undefined` Tag story
 */
export const CautionUndefinedTag: Story = {
    args: {
        size: 'md',
        variant: 'readonly',
        color: 'caution-undefined',
        children: 'This is a caution-undefined tag'
    },
}

