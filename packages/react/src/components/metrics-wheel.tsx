"use client"

import clsx from "clsx";
import { AriaAttributes, HTMLAttributes } from "react";

export interface MetricsWheelProps extends HTMLAttributes<HTMLElement> {
    /**
     * Specify the label for the breadcrumb container
     */
    'aria-label'?: AriaAttributes['aria-label']

    /**
     * Specify an optional className to be applied to the container node
     * @default ""
     */
    className?: string

    /**
     * What should the "part" number be?
     */
    part?: number

    /**
     * What should the "whole"/full number be?
     */
    whole?: number

    /**
     * Wheel is decided by a percentage instead
     */
    percentage?: number

    /**
     * What should the label be?
     * @default ""
     */
    label?: string

    /**
     * Should it be an indicator (and change color based on how "full")?
     * @default false
     */
    indicator?: boolean

    /**
     * Should the indicator be "inverted" (aka small ratio being positive)
     * @default false
     */
    inverted?: boolean
}

/**
 * 
 * @param r 
 * @returns 
 */
const getCircumference = (r: number) => 2 * Math.PI * r

const getRatio = (part = 0, whole = 0, percentage = 0) => percentage === 0 ? part / whole : percentage / 100

const getText = (label: string) => {
    const text = label.split(" ")
    const midIndex = Math.ceil(text.length / 2);
    const firstLine = text.slice(0, midIndex).join(" ");
    const secondLine = text.slice(midIndex).join(" ");
    if (label.length > 10) {
        return [
            <text key="line1" x="50" y="45" fontSize={10} textAnchor="middle" dominantBaseline="middle" fill="currentColor">
                {firstLine}
            </text>,
            <text key="line2" x="50" y="55" fontSize={10} textAnchor="middle" dominantBaseline="middle" fill="currentColor">
                {secondLine}
            </text>
        ]
    } else {
        return <text x="50" y="50" fontSize={Math.max(10, 20 - label.length)} textAnchor="middle" dominantBaseline="middle" fill="currentColor">{label}</text>
    }
}

const getColor = (ratio: number, inverted = false) => {
    const thresholds: [number, string][] = inverted
        ? [
              [6 / 7, "red"],
              [5 / 7, "orange"],
              [4 / 7, "amber"],
              [3 / 7, "yellow"],
              [2 / 7, "lime"],
              [1 / 7, "green"],
          ]
        : [
              [6 / 7, "emerald"],
              [5 / 7, "green"],
              [4 / 7, "lime"],
              [3 / 7, "yellow"],
              [2 / 7, "amber"],
              [1 / 7, "orange"],
          ];

    return thresholds.find(([threshold]) => ratio > threshold)?.[1] ?? (inverted ? "emerald" : "red");
};
export function MetricsWheel({ part, whole, percentage, label="", indicator=false, inverted=false, className="", ...rest }: MetricsWheelProps) {
    const classes = clsx (
        `r-metrics-wheel`, 
        className, 
        {...rest}
    )
    const ratio = getRatio(part, whole, percentage)
    const radius = 40
    const color = indicator ? getColor(ratio, inverted) : "blue"
    const circumference = getCircumference(radius)
    return (
        <div className={classes} {...rest}>
            <svg className={`w-28 h-28 ${className}`} viewBox="0 0 100 100">
                <circle
                    className={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * ratio)}
                    transform="rotate(-90 50 50)"
                ></circle>
                {getText(label)}
            </svg>
        </div>
    )
}