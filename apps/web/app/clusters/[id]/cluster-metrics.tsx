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

	// const getMemoryFormat

	return (
		<div className={`flex gap-4 flex-wrap ${classes}`}>
			<MetricsCard>
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
			<MetricsCard>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-4'>
						<h3>Nodes</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>{metrics.nodeCount}</p>
							<Tag color="blue">{metrics.nodePoolCount}</Tag>
						</div>
					</div>
				</div>
			</MetricsCard>
			<MetricsCard>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-4'>
						<h3>CPU</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>{metrics.nodeCount}</p>
							<Tag color="blue">kr {metrics.nodePoolCount} per year</Tag>
						</div>
					</div>
				</div>
			</MetricsCard>
			<MetricsCard>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-4'>
						<h3>Memory</h3>
						<div className='flex flex-row items-center gap-4'>
							<p>{metrics.memory}</p>
							<p>{metrics.memoryConsumed}</p>
							<p>{metrics.memoryPercentage}</p>
							<Tag color="blue">kr {metrics.memoryConsumed} per year</Tag>
						</div>
					</div>
				</div>
			</MetricsCard>
		</div>
  	);
};
