"use client"

import { Button, Tag, Tile, MetricsWheel} from "@ror/react";
import { FC, JSX } from "react";
import { BriefcaseBusinessIcon, DataCenterIcon, BoxesIcon, BoxIcon, CpuIcon, HardDriveIcon } from "./navigation/icons";

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
    wheelPercentage?: number;
    wheelLabel?: string;
    wheelIndicator?: boolean;
    inverted?: boolean;
}

const dashboardItems: DashboardItem[] = [
    {
        title: "DATA CENTERS",
        icon: DataCenterIcon,
        description: "Data centers with data",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 5,
        wheelWhole: 6,
        wheelLabel: "5 of 6",
    },
    {
        title: "WORKSPACES",
        icon: BriefcaseBusinessIcon,
        description: "Workspaces with data",
        seeAll: true,
        seeAllLink: "#",
        type: "wheel",
        wheelPart: 142,
        wheelWhole: 172,
        wheelLabel: "142 of 172",
        wheelIndicator: true,
    },
    {
        title: "CLUSTERS",
        icon: BoxesIcon,
        description: "Active clusters",
        type: "wheel",
        wheelPart: 255,
        wheelWhole: 255,
        wheelLabel: "255 of 255",
        wheelIndicator: true,
    },
    {
        title: "NODES",
        icon: BoxIcon,
        description: "Active nodes",
        type: "wheel",
        wheelPart: 838,
        wheelWhole: 838,
        wheelLabel: "838 of 838",
        wheelIndicator: true,
    },
    {
        title: "CPU",
        icon: CpuIcon,
        description: "Utilized CPU power",
        type: "wheel",
        wheelPercentage: 13,
        wheelLabel: "13% - 2948",
        wheelIndicator: true,
        inverted: true,
    },
    {
        title: "MEMORY",
        icon: HardDriveIcon,
        description: "Utilized memory",
        type: "wheel",
        wheelPercentage: 37,
        wheelLabel: "37% - 13.96 TiB",
        wheelIndicator: true,
        inverted: true,
    },
]

const getChart = (type: DashboardItemType, wheelPart = 0, wheelWhole = 0, wheelPercentage = 0, wheelLabel = "", wheelIndicator?: boolean, inverted?: boolean) => {
    let chart;
    if (type === "wheel") {
        chart = <MetricsWheel part={wheelPart} whole={wheelWhole} percentage={wheelPercentage} label={wheelLabel} indicator={wheelIndicator} className="block mx-auto" inverted={inverted} /> 
    }
    return chart
}

const MetricsBoardProps: FC<MetricsBoardProps> = ({ className }) => {

    return (
        <div className={className}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                {dashboardItems.map(({title, icon, description, seeAll, seeAllLink, type, wheelPart, wheelWhole, wheelPercentage, wheelLabel, wheelIndicator, inverted}: DashboardItem, i) => (
                    <Tile key={i} className="rounded-md w-full min-w-80 max-w-[416px] p-3 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold">{title}</h3>
                                <p className="text-sm">{description}</p>
                                {seeAll && <p className="hover:underline"><a href={seeAllLink}>See all</a></p>}
                            </div>
                            {icon}
                        </div>
                        {getChart(type, wheelPart, wheelWhole, wheelPercentage, wheelLabel, wheelIndicator, inverted)}
                    </Tile>
                    
                ))}
            </div>
        </div>
    )
}

export default MetricsBoardProps