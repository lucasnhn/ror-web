"use client"

import { clsx } from 'clsx';
import type { Cluster } from '@ror/js-api-client'
import { MetricsCard, Tag } from '@ror/react';

export interface ClusterMetricsProps {
  	cluster: Cluster;
  	className?: string;
}

export function ClusterMetrics({
  	className, cluster
}: ClusterMetricsProps) {

	const classes = clsx('r-cluster-metrics', className);

	const metrics = cluster.metrics;

	const getMemoryFormat = (memory: number) => {
		const endings = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
		let temp = memory;
		let memoryWithEnding = temp + endings[0];

		while (temp > 1024) {
			temp = temp / 1024;
			endings.shift();
			memoryWithEnding = temp.toFixed(2) + " " + endings[0];
		}

		return memoryWithEnding;
	};

	return (
		<div className={`flex gap-4 w-full ${classes}`}>
			<MetricsCard className='min-w-3xs! max-w-7xl!'>
				<div className='flex flex-col gap-8'>
					<div className='flex flex-col gap-4'>
						<h3>Price per month</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>kr {metrics.priceMonth}</p>
							<Tag color="blue">kr {metrics.priceYear} per year</Tag>
						</div>
					</div>
					<p className=''>All prices are estimates</p>
				</div>
			</MetricsCard>
			<MetricsCard className='min-w-3xs! max-w-7xl!'>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-4'>
						<h3>Nodes</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>{metrics.nodeCount} node{metrics.nodeCount > 1 ? "s" : ""}</p>
							<Tag color="blue">{metrics.nodePoolCount} node pool{metrics.nodePoolCount > 1 ? "s" : ""} </Tag>
						</div>
					</div>
				</div>
			</MetricsCard>
			<MetricsCard className='min-w-3xs! max-w-7xl!'>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-4'>
						<h3>CPU</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>{metrics.cpuPercentage}%</p>
							<Tag color="blue">{metrics.cpu} cores</Tag>
						</div>
					</div>
				</div>
			</MetricsCard>
			<MetricsCard className='min-w-3xs! max-w-7xl!'>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-4'>
						<h3>Memory</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>{getMemoryFormat(metrics.memoryConsumed)} of {getMemoryFormat(metrics.memory)}</p>
							<Tag color="blue">{metrics.memoryPercentage}% usage</Tag>
						</div>
					</div>
				</div>
			</MetricsCard>
		</div>
  	);
};
