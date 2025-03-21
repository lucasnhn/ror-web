"use client"

import { clsx } from 'clsx';
import type { Cluster } from '@ror/js-api-client';
import { Tile } from '@ror/react';
import { convertBytes } from '@/utils/bytes';

export interface ClusterMetricsProps {
  	cluster: Cluster;
  	className?: string;
}

export function ClusterMetrics({
  	className, cluster
}: ClusterMetricsProps) {

	const classes = clsx('w-full', 'p-5', className);

	const metrics = cluster.metrics;

	return (
			<Tile className={classes}>
				<h3 className='heading-01 pb-3 mb-5 border-b border-b-(--r-border-subtle)'>Cluster metrics</h3>
				<div className='@container'>
					<div className='grid grid-cols-1 @[405px]:grid-cols-2 @[1005px]:grid-cols-4 gap-6 @[1005px]:gap-0'>
						<div className='col-span-1'>
							<h4 className='text-sm font-semibold'>Price estimate per month</h4>
							<div className='flex flex-col @[515px]:flex-row @[515px]:items-center gap-2 @[515px]:gap-4 mt-3'>
								<p className='@[515px]:border-r @[515px]:border-r-(--r-border-subtle) @[515px]:pr-4'>
									<span className='text-3xl'>kr {metrics.priceMonth}</span>
								</p>
								<p>kr {metrics.priceYear} per year</p>
							</div>
						</div>
						
						<div className='col-span-1'>
							<h4 className='text-sm font-semibold'>Nodes</h4>
							<div className='flex flex-col @[515px]:flex-row @[515px]:items-center gap-2 @[515px]:gap-4 mt-3'>
								<p className='@[515px]:border-r @[515px]:border-r-(--r-border-subtle) @[515px]:pr-4'>
									<span className='text-3xl'>{metrics.nodeCount}</span> <span className='mb-1'>node{metrics.nodeCount > 1 ? "s" : ""}</span>
								</p>
								<p>{metrics.nodePoolCount} node pool{metrics.nodePoolCount > 1 ? "s" : ""}</p>
							</div>
						</div>
						<div className='col-span-1'>
							<h4 className='text-sm font-semibold'>CPU</h4>
							<div className='flex flex-col @[515px]:flex-row @[515px]:items-center gap-2 @[515px]:gap-4 mt-3'>
								{/* TODO: Figure out why cpu and cpuConsumed doesn't give right % and the numbers 
									doesn't make sense in accordance to each other (maybe just mock data)*/}
								<p className='@[515px]:border-r @[515px]:border-r-(--r-border-subtle) @[515px]:pr-4'>
									<span className='text-3xl'>
										{metrics.cpu}
									</span> <span className='mb-1'>
										of {metrics.cpuConsumed} cores
									</span>
								</p>
								<p><span className='text-3xl'>{metrics.cpuPercentage}%</span> <span className='mb-1'>usage</span></p>
							</div>
						</div>
						<div className='col-span-1'>
							<h4 className='text-sm font-semibold'>Memory</h4>
							<div className='flex flex-col @[515px]:flex-row @[515px]:items-center gap-2 @[515px]:gap-4 mt-3'>
								<p className='@[515px]:border-r @[515px]:border-r-(--r-border-subtle) @[515px]:pr-4'>
									<span className='text-3xl'>
										{convertBytes(metrics.memoryConsumed, { useBinaryUnits: true })}
									</span> <span className='mb-1'>
										of {convertBytes(metrics.memory, { useBinaryUnits: true })}
									</span>
								</p>
								<p><span className='text-3xl'>{metrics.memoryPercentage}%</span> <span className='mb-1'>usage</span></p>
							</div>
						</div>
					</div>
				</div>
			</Tile>
  	);
};
