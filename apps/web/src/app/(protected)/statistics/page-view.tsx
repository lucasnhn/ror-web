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
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

/**
 * Props for the PageView component.
 *
 * @property {string} [className] - Optional CSS class name for styling the component.
 * @property {Record<string, number>} kubernetesVersions - Mapping of Kubernetes version strings to their counts.
 * @property {Record<string, number>} agentVersions - Mapping of agent versions strings to their counts.
 * @property {Record<string, number>} nhnToolingVersion - Mapping of agent versions strings to their counts.
 * @property {Record<string, number>} topologyVersions - Mapping of topology versions strings to their counts.
 * @property {Record<string, number>} topologyControlPlaneVersions - Mapping of control plane versions strings to their counts.
 * @property {Record<string, number>} providers - Mapping of provider versions strings to their counts.
 * @property {Record<string, number>} datacenters - Mapping of datacenters versions strings to their counts.
 * @property {Record<string, number>} regions - Mapping of region versions strings to their counts.
 * @property {Record<string, number>} projects - Mapping of project versions strings to their counts.
 * @property {Record<string, number>} workorders - Mapping of workorder versions strings to their counts.
 * @property {Record<string, number>} environments - Mapping of environment versions strings to their counts.
 */
interface PageViewProps {
  className?: string
  kubernetesVersions: Record<string, number>
  agentVersions: Record<string, number>
  nhnToolingVersion: Record<string, number>
  topologyVersions?: Record<string, number>
  topologyControlPlaneVersions?: Record<string, number>
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

function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(false)

  useEffect(() => {
    // sm breakpoint = 640px
    const mq = window.matchMedia('(min-width: 640px)')
    const onChange = () => setIsSmUp(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isSmUp
}

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false)

  useEffect(() => {
    // md breakpoint = 768px
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => setIsMdUp(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMdUp
}

function useIsLgUp() {
  const [isLgUp, setIsLgUp] = useState(false)

  useEffect(() => {
    // lg breakpoint = 1024px
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsLgUp(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isLgUp
}

const ROW_H = 22
const MIN_H = 140

const SmallerChart = ({ title, data }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }))

  const rows = chartData.length
  const chartH = Math.max(MIN_H, rows * ROW_H)

  return (
    <div className='flex flex-col'>
      <h2 className={cn('text-lg font-medium', 'mt-4 mb-2')}>{title}</h2>
      <div className={cn('bg-gray-100 rounded-lg w-full min-w-0')}>
        <ChartContainer config={chartConfig} className='w-full' style={{ height: chartH }}>
          <BarChart accessibilityLayer data={chartData} layout='vertical' margin={{ left: -54 }}>
            <XAxis type='number' dataKey='count' hide />
            <YAxis type='category' tickLine axisLine tickFormatter={() => ''} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='count' fill='var(--color-count)' radius={4} barSize={36}>
              <LabelList
                dataKey='version'
                position='insideLeft'
                className='fill-black'
                fontSize={12}
                formatter={(v: unknown) => String(v).replaceAll(' ', '\u00A0')}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

const SmChart = ({ title, data }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({ version, count }))
  const rows = chartData.length
  const chartH = Math.max(MIN_H, rows * ROW_H)

  return (
    <div className='flex flex-col'>
      <h2 className={cn('text-lg font-medium', 'mt-4 mb-2')}>{title}</h2>
      <div className={cn('bg-gray-100 rounded-lg w-full min-w-0')}>
        <ChartContainer config={chartConfig} className='w-full min-w-0' style={{ height: chartH }}>
          <BarChart accessibilityLayer data={chartData} layout='vertical' margin={{ left: -54 }}>
            <XAxis type='number' dataKey='count' hide />
            <YAxis type='category' tickLine axisLine tickFormatter={() => ''} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='count' fill='var(--color-count)' radius={4} barSize={36}>
              <LabelList
                dataKey='version'
                position='insideLeft'
                className='fill-black'
                fontSize={12}
                formatter={(v: unknown) => String(v).replaceAll(' ', '\u00A0')}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

const MdChart = ({ title, data }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }))

  return (
    <>
      <h2 className={cn('text-lg font-medium', 'mt-4 mb-2', 'sm:mt-4 sm:mb-4')}>{title}</h2>
      <ChartContainer config={chartConfig} className={cn('h-128 w-full')}>
        <BarChart accessibilityLayer layout='horizontal' data={chartData} margin={{ left: -33 }}>
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey='version'
            tickLine={false}
            tickMargin={5}
            angle={-90}
            textAnchor='end'
            interval={0}
            height={80}
            fontSize={10}
            scale={Object.keys(data).length > 36 ? 'band' : 'auto'}
            tickFormatter={(v: string) => (v.length > 7 ? `${v.slice(0, 7)}…` : v)}
          />
          <YAxis tickMargin={0} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey='count' fill='var(--color-count)' radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  )
}

const LgChart = ({ title, data }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }))

  return (
    <>
      <h2 className={cn('text-lg font-medium', 'mt-4 mb-2', 'sm:mt-4 sm:mb-4')}>{title}</h2>
      <ChartContainer config={chartConfig} className={cn('h-128 w-full')}>
        <BarChart accessibilityLayer layout='horizontal' data={chartData} margin={{ left: -20 }}>
          <CartesianGrid vertical={true} />
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
    </>
  )
}

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
  const isSmUp = useIsSmUp()
  const isMdUp = useIsMdUp()
  const isLgUp = useIsLgUp()

  return (
    <div className={className}>
      {isLgUp ? (
        <LgChart title={title} data={data} />
      ) : isMdUp ? (
        <MdChart title={title} data={data} />
      ) : isSmUp ? (
        <SmChart title={title} data={data} />
      ) : (
        <SmallerChart title={title} data={data} />
      )}
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
      <NotReadyMessage className={cn('my-6', 'mx-4', 'sm:mx-12')}>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but do not
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

      <div
        className={cn(
          'my-6',
          'px-4',
          'sm:px-12',
          'md:grid md:grid-cols-16 md:gap-8 ',
          'lg:grid-cols-32',
          'xl:grid-cols-32'
        )}
      >
        {topologyVersions && (
          <Chart
            title='Topology versions'
            data={topologyVersions}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-8',
              'lg:col-span-16',
              'xl:col-span-16'
            )}
          />
        )}
        {topologyControlPlaneVersions && (
          <Chart
            title='Control plane versions'
            data={topologyControlPlaneVersions}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-8',
              'lg:col-span-16',
              'xl:col-span-16'
            )}
          />
        )}
        {environments && (
          <Chart
            title='Environments'
            data={environments}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-8',
              'lg:col-span-16',
              'xl:col-span-16'
            )}
          />
        )}
        {datacenters && (
          <Chart
            title='Datacenters'
            data={datacenters}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-8',
              'lg:col-span-8',
              'xl:col-span-8'
            )}
          />
        )}
        {regions && (
          <Chart
            title='Regions'
            data={regions}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-8',
              'lg:col-span-8',
              'xl:col-span-8'
            )}
          />
        )}
        {providers && (
          <Chart
            title='Providers'
            data={providers}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-8',
              'lg:col-span-8',
              'xl:col-span-8'
            )}
          />
        )}
        {projects && (
          <Chart
            title='Projects'
            data={projects}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-16',
              'lg:col-span-32',
              'xl:col-span-32'
            )}
          />
        )}
        {workorders && (
          <Chart
            title='Workorders'
            data={workorders}
            className={cn(
              'w-80 mx-auto',
              'sm:w-lg',
              'md:w-full md:mx-0 md:col-span-16',
              'lg:col-span-32',
              'xl:col-span-32'
            )}
          />
        )}
      </div>

      {/* {kubernetesVersions && Object.keys(kubernetesVersions).length > 0 && <Chart title='Kubernetes Versions' data={kubernetesVersions} />}
          {agentVersions && Object.keys(agentVersions).length > 0 && <Chart title='Agent Versions' data={agentVersions} />}
          {nhnToolingVersion && Object.keys(nhnToolingVersion).length > 0 && <Chart title='NHN Tooling Version' data={nhnToolingVersion} />} */}
    </div>
  )
}
