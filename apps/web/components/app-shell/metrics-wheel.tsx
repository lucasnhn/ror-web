// "use client"

// import React from "react";
// import "react-circular-progressbar/dist/styles.css";

// interface MetricsWheelProps {
//   part: number;
//   whole: number;
//   indicator?: boolean;
//   label?: string;
//   className?: string;
// }

// const getRatio = (part: number, whole: number) => part / whole;

// const getColor = (part: number, whole: number) => {
//     const ratio = getRatio(part, whole);
//     const thresholds: [number, string][] = [
//         [6 / 7, "emerald-500"],
//         [5 / 7, "green-500"],
//         [4 / 7, "lime-500"],
//         [3 / 7, "yellow-500"],
//         [2 / 7, "amber-500"],
//         [1 / 7, "orange-500"],
//     ];

//     for (const [threshold, color] of thresholds) {
//         if (ratio > threshold) return color;
//     }

//     return "red-500";
// };

// const colorMap: Record<string, string> = {
//     "emerald-500": "text-emerald-500",
//     "green-500": "text-green-500",
//     "lime-500": "text-lime-500",
//     "yellow-500": "text-yellow-500",
//     "amber-500": "text-amber-500",
//     "orange-500": "text-orange-500",
//     "red-500": "text-red-500",
// };

// const getTextColor = (part: number, whole: number) => {
//     return colorMap[getColor(part, whole)];
// };

// const getCircumference = (r: number) => {
//     return 2 * Math.PI * r
// }

// const getText = (label: string) => {
//     let text = label.split(" ")
//     const midIndex = Math.ceil(text.length / 2);
//     const firstLine = text.slice(0, midIndex).join(" ");
//     const secondLine = text.slice(midIndex).join(" ");
//     if (label.length > 10) {
//         return [
//             <text key="line1" x="50" y="45" fontSize={10} textAnchor="middle" dominantBaseline="middle" className="fill-current font-semibold">
//                 {firstLine}
//             </text>,
//             <text key="line2" x="50" y="55" fontSize={10} textAnchor="middle" dominantBaseline="middle" className="fill-current font-semibold">
//                 {secondLine}
//             </text>
//         ]
//     } else {
//         return <text x="50" y="50" fontSize={Math.max(10, 20 - label.length)} textAnchor="middle" dominantBaseline="middle" className="fill-current font-semibold">{label}</text>
//     }
// }

// const MetricsWheel: React.FC<MetricsWheelProps> = ({ part, whole, indicator = false, label="", className }) => {
//     const percentage = (part / whole)
//     const radius = 40
//     const color = indicator ? getTextColor(part, whole) : "text-blue-500"
//     const circumference = getCircumference(radius)

//     return (
//         <svg className={`w-28 h-28 ${className}`} viewBox="0 0 100 100">
//             <circle
//                 className={`${color} progress-ring__circle stroke-current`}
//                 strokeWidth="10"
//                 strokeLinecap="round"
//                 cx="50"
//                 cy="50"
//                 r={radius}
//                 fill="transparent"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={circumference - (circumference * percentage)}
//                 transform="rotate(-90 50 50)"
//             ></circle>
//             {getText(label)}
//         </svg>
//     );
// };

// export default MetricsWheel;

/**
 * TODO: Figure out why no styling works when this file is deleted or edited
 */
