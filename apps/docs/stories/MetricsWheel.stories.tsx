import type { Meta, StoryObj } from '@storybook/react';
import { MetricsWheel, MetricsWheelProps } from '@ror/react/src/components/metrics-wheel';
import { ComponentType } from 'react';

const meta = {
    title: "ui/MetricsWheel",
    component: MetricsWheel as ComponentType<MetricsWheelProps>,
    parameters: {
        layout: "centered",
    },
    tags: ['autodocs'],
    argTypes: {
        part: { control: { type: 'number' }, description: 'Numerator value for the wheel ratio' },
        whole: { control: { type: 'number' }, description: 'Denominator value for the wheel ratio' },
        percentage: { control: { type: 'number', min: 0, max: 100 }, description: 'Direct percentage override' },
        label: { control: { type: 'text' }, description: 'Text label inside the wheel' },
        indicator: { control: { type: 'boolean' }, description: 'Enables color-based indicators' },
        inverted: { control: { type: 'boolean' }, description: 'Inverts the indicator color logic' },
        className: { control: { type: 'text' }, description: 'Custom CSS class' },
    }

} satisfies Meta<typeof MetricsWheel>

export default meta
type Story = StoryObj<typeof meta>


/**
 * Default MetricsWheel story
 */
export const Default: Story = {
    args: {
        part: 3,
        whole: 5,
        percentage: 0,
        label: '3 of 5',
        indicator: false,
        inverted: false,
        className: '',
    },
};

/**
 * MetricsWheel with exact `part` and `whole`
 */
export const WithPartWhole: Story = {
    args: {
        part: 2,
        whole: 7,
        label: '2 of 7',
    },
};
  
/**
 * MetricsWheel using `percentage`
 */
export const PercentageBased: Story = {
    args: {
        percentage: 75,
        label: '75%',
    },
};
  
  /**
   * Indicator Mode ON
   */
  export const IndicatorEnabled: Story = {
    args: {
      part: 2,
      whole: 7,
      label: '4 of 7',
      indicator: true,
    },
  };
  
/**
 * Inverted Indicator Mode
 */
export const InvertedIndicator: Story = {
    args: {
        part: 2,
        whole: 7,
        label: '4 of 7',
        indicator: true,
        inverted: true,
    },
};
  
/**
 * Custom Label Example
 */
export const CustomLabel: Story = {
    args: {
        part: 2,
        whole: 7,
        label: 'Custom Label',
    },
};