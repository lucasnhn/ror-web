/**
 * FILE OVERVIEW
 * ----------------------
 * This file defines the main React component (`PageView`) responsible for displaying statistics
 * about Kubernetes clusters in the ROR web application.
 */

'use client'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { cn } from '@/utils/clsxm'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

/**
 * Props for the PageView component.
 *
 * @property {string} [className] - Optional CSS class name for styling the component.
 * @property {Record<string, number>} kubernetesVersions - Mapping of Kubernetes version strings to their counts.
 * @property {Record<string, number>} agentVersions - Mapping of agent version strings to their counts.
 * @property {Record<string, number>} nhnToolingVersion - Mapping of NHN tooling version strings to their counts.
 */
interface PageViewProps {
  className?: string
  topologyVersions?: Record<string, number>
  topologyControlPlaneVersions?: Record<string, number>
  kubernetesVersions: Record<string, number>
  agentVersions: Record<string, number>
  nhnToolingVersion: Record<string, number>
  providers: Record<string, number>
  datacenters: Record<string, number>
  regions: Record<string, number>
  projects: Record<string, number>
  workorders: Record<string, number>
  environments: Record<string, number>
}

/**
 * Props for a chart component.
 *
 * @property title - The title of the chart.
 * @property data - An object mapping string labels to numeric values to be displayed in the chart.
 */
interface ChartProps {
  title: string
  data: Record<string, number>
  className?: string
}

/**
 * Configuration object for chart display options.
 *
 * @property count - Configuration for the "Count" chart metric.
 * @property count.label - The display label for the count metric.
 * @property count.color - The color used to represent the count metric in the chart.
 */
const chartConfig = {
  count: {
    label: 'Count',
    color: '#0c8aca',
  },
} satisfies ChartConfig

/**
 * Renders a bar chart with version and count data.
 *
 * @param {ChartProps} props - The props for the Chart component.
 * @param {string} props.title - The title displayed above the chart.
 * @param {Record<string, number>} props.data - An object mapping version strings to their corresponding count values.
 *
 * @returns {JSX.Element} The rendered chart component.
 */
const Chart = ({ title, data, className }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }))

  return (
    <div className={className}>
      <h2 className='mb-4 text-lg font-medium'>{title}</h2>
      <ChartContainer config={chartConfig} className={cn('h-128 w-full')}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='version'
            tickLine={false}
            tickMargin={5}
            angle={-45}
            textAnchor='end'
            interval={0}
            height={220}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey='count' fill='var(--color-count)' radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

/**
 * Renders the statistics page view, displaying a welcome message and charts for various version data.
 *
 * @param className - Optional additional CSS class names to apply to the root container.
 * @param kubernetesVersions - An object containing data about Kubernetes versions.
 * @param agentVersions - An object containing data about agent versions.
 * @param nhnToolingVersion - An object containing data about NHN Tooling versions.
 */
export const PageView = ({
  className,
  topologyVersions,
  topologyControlPlaneVersions,
  kubernetesVersions,
  agentVersions,
  nhnToolingVersion,
  providers,
  datacenters,
  regions,
  projects,
  workorders,
  environments,
}: PageViewProps) => {
  // TODO: Remove logs when kubernetesVersions, agentVersions and nhnToolingVersion are used
  console.log('kubernetesVersions', kubernetesVersions)
  console.log('agentVersions', agentVersions)
  console.log('nhnToolingVersion', nhnToolingVersion)
  return (
    <div className={cn(className, '@container')}>
      <NotReadyMessage className='mx-12 my-6'>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but do not
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

      <div className='grid gap-x-8 px-12 my-6 grid-cols-32'>
        {topologyVersions && <Chart title='Topology versions' data={topologyVersions} className='col-span-8' />}
        {topologyControlPlaneVersions && (
          <Chart title='Control plane versions' data={topologyControlPlaneVersions} className='col-span-8' />
        )}
        {providers && <Chart title='Providers' data={providers} className='col-span-8' />}
        {datacenters && <Chart title='Datacenters' data={datacenters} className='col-span-8' />}
        {regions && <Chart title='Regions' data={regions} className='col-span-8' />}
        {environments && <Chart title='Environments' data={environments} className='col-span-8' />}
        {projects && <Chart title='Projects' data={projects} className='col-span-32' />}
        {workorders && <Chart title='Workorders' data={workorders} className='col-span-32' />}
      </div>

      {/* {kubernetesVersions && Object.keys(kubernetesVersions).length > 0 && <Chart title='Kubernetes Versions' data={kubernetesVersions} />}
          {agentVersions && Object.keys(agentVersions).length > 0 && <Chart title='Agent Versions' data={agentVersions} />}
          {nhnToolingVersion && Object.keys(nhnToolingVersion).length > 0 && <Chart title='NHN Tooling Version' data={nhnToolingVersion} />} */}
    </div>
  )
}
