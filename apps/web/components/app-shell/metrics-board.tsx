import { Button, Tag, Tile } from "@ror/react";
import { FC } from "react";
import { DataCenter } from "./navigation/icons";

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

const MetricsBoardProps: FC<MetricsBoardProps> = ({ className }) => {
    return (
        <div className={className}>
            <p>MetricsBoardProps</p>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 justify-center">
                    <Tile className="rounded-md flex-1">
                        <div className="flex justify-between">
                            <h3 className="text-base font-bold">DATA CENTERS</h3>
                            {DataCenter}
                        </div>
                        <p className="text-lg"><b className="text-2xl">5</b> (of 6)</p>
                        <Tag>Hei</Tag>
                        
                        <p></p>
                    </Tile>

                    <Tile className="rounded-md flex-1">
                        <h3 className="text-base font-bold">WORKSPACES</h3>
                        <p></p>
                    </Tile>

                    <Tile className="rounded-md flex-1">
                        <h3 className="text-base font-bold">CLUSTERS</h3>
                        <p></p>
                    </Tile>
                </div>
                
                <div className="flex gap-4 justify-center">
                    <Tile className="rounded-md flex-1">
                        <h3 className="text-base font-bold">NODE</h3>
                        <p></p>
                    </Tile>

                    <Tile className="rounded-md flex-1">
                        <h3 className="text-base font-bold">CPU</h3>
                    </Tile>

                    <Tile className="rounded-md flex-1">
                        <h3 className="text-base font-bold">MEMORY</h3>
                    </Tile>
                </div>
            </div>
        </div>
    )
}

export default MetricsBoardProps