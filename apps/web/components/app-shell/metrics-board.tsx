import { Button, Tag, Tile } from "@ror/react";
import { FC, JSX } from "react";
import { DataCenter } from "./navigation/icons";
import MetricsWheel from "./metrics-wheel";

interface MetricsBoardProps {
    className?: string;
}

interface MetricsData {
    cpu: number;
    cpuConsumed: number;
    memory: number;
    memoryConsumed: number;
    clusterCount: number;
    nodeCount: number;
    nodePoolCount: number;
    workspaceCount: number;
    datacenterCount: number;
}

type DashboardItemType = "wheel" 

interface DashboardItem {
    title: string;
    icon?: JSX.Element; 
    description?: string;
    seeAll?: boolean;
    seeAllLink?: string;
    type: DashboardItemType;
    wheelPart?: number;
    wheelWhole?: number;
    wheelLabel?: string;
    wheelIndicator?: boolean ;
}

const dashboardItems: DashboardItem[] = [
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 5,
        wheelWhole: 6,
        wheelLabel: "5 of 6",
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 1,
        wheelWhole: 8,
        wheelLabel: "1 of 8",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 2,
        wheelWhole: 8,
        wheelLabel: "2 of 8",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 3,
        wheelWhole: 8,
        wheelLabel: "3 of 8",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 4,
        wheelWhole: 8,
        wheelLabel: "4 of 8",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 5,
        wheelWhole: 8,
        wheelLabel: "5 of 8",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 6,
        wheelWhole: 8,
        wheelLabel: "6 of 8",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 700,
        wheelWhole: 800,
        wheelLabel: "7000 of 8000",
        wheelIndicator: true,
    },
    {
        title: "DATA CENTERS",
        icon: DataCenter,
        description: "How many datacenters data is displayed from",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 8,
        wheelWhole: 8,
        wheelLabel: "8 of 8",
        wheelIndicator: true,
    }
]

const getChart = (type: DashboardItemType, wheelPart = 0, wheelWhole = 0, wheelLabel = "", wheelIndicator?: boolean) => {
    let chart;
    if (type === "wheel") {
        chart = <MetricsWheel part={wheelPart} whole={wheelWhole} label={wheelLabel} indicator={wheelIndicator} className="block mx-auto" /> 
    }
    return chart
}

const MetricsBoardProps: FC<MetricsBoardProps> = ({ className }) => {

    return (
        <div className={className}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                {dashboardItems.map(({title, icon, description, seeAll, seeAllLink, type, wheelPart, wheelWhole, wheelLabel, wheelIndicator}: DashboardItem) => (
                    <Tile className="rounded-md w-full min-w-80 max-w-[416px] p-3 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold">{title}</h3>
                                <p className="text-sm">{description}</p>
                                {seeAll && <p className="hover:underline"><a href={seeAllLink}>See all</a></p>}
                            </div>
                            {icon}
                        </div>
                        {getChart(type, wheelPart, wheelWhole, wheelLabel, wheelIndicator)}
                    </Tile>
                ))}
            </div>

        </div>
    )
}

export default MetricsBoardProps