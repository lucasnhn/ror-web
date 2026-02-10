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
  title?: string
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

const ROW_H = 22
const MIN_H = 140

const SmallerChart = ({ title, data, className }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({ version, count }))
  const rows = chartData.length
  const chartH = Math.max(MIN_H, rows * ROW_H)

  return (
    <div className={cn('flex flex-col', className)}>
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

const SmChart = ({ title, data, className }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({ version, count }))
  const rows = chartData.length
  const chartH = Math.max(MIN_H, rows * ROW_H)

  return (
    <div className={cn('flex flex-col', className)}>
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

const MdChart = ({ title, data, className }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({ version, count }))

  return (
    <div className={cn('min-w-0 w-full', className)}>
      <h2 className={cn('text-lg font-medium', 'mt-4 mb-2', 'sm:mt-4 sm:mb-4')}>{title}</h2>

      <div className='min-w-0 w-full max-w-full overflow-hidden'>
        <ChartContainer config={chartConfig} className={cn('h-128 w-full max-w-full overflow-hidden min-w-0')}>
          <BarChart accessibilityLayer layout='horizontal' data={chartData} margin={{ left: -33 }}>
            <CartesianGrid vertical />
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
      </div>
    </div>
  )
}

const LgChart = ({ title, data, className }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({ version, count }))

  return (
    <div className={cn('min-w-0 w-full', className)}>
      <h2 className={cn('text-lg font-medium', 'mt-4 mb-2', 'sm:mt-4 sm:mb-4')}>{title}</h2>
      <ChartContainer config={chartConfig} className={cn('h-128 w-full max-w-full overflow-hidden min-w-0')}>
        <BarChart accessibilityLayer layout='horizontal' data={chartData} margin={{ left: -33 }}>
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
    <div className={cn(className)}>
      <NotReadyMessage className={cn('my-6 mx-4', 'sm:mx-12')}>
        Welcome to the new ROR web! This site is currently under development, so feel free to look around, but do not
        expect finished functionality or that all data is present. The development team is working hard on delivering a
        complete product as quick as possible :)
      </NotReadyMessage>

      <div className={cn('my-6 px-4', 'sm:hidden')}>
        {topologyVersions && (
          <SmallerChart title='Topology versions' data={topologyVersions} className='w-80 mx-auto' />
        )}
        {topologyControlPlaneVersions && (
          <SmallerChart title='Control plane versions' data={topologyControlPlaneVersions} className='w-80 mx-auto' />
        )}
        {environments && <SmallerChart title='Environments' data={environments} className='w-80 mx-auto' />}
        {datacenters && <SmallerChart title='Datacenters' data={datacenters} className='w-80 mx-auto' />}
        {regions && <SmallerChart title='Regions' data={regions} className='w-80 mx-auto' />}
        {providers && <SmallerChart title='Providers' data={providers} className='w-80 mx-auto' />}
        {projects && <SmallerChart title='Projects' data={projects} className='w-80 mx-auto' />}
        {workorders && <SmallerChart title='Workorders' data={workorders} className='w-80 mx-auto' />}
      </div>

      <div className={cn('hidden sm:block md:hidden', 'sm:my-6 sm:px-12')}>
        {topologyVersions && <SmChart title='Topology versions' data={topologyVersions} className='w-lg mx-auto' />}
        {topologyControlPlaneVersions && (
          <SmChart title='Control plane versions' data={topologyControlPlaneVersions} className='w-lg mx-auto' />
        )}
        {environments && <SmChart title='Environments' data={environments} className='w-lg mx-auto' />}
        {datacenters && <SmChart title='Datacenters' data={datacenters} className='w-lg mx-auto' />}
        {regions && <SmChart title='Regions' data={regions} className='w-lg mx-auto' />}
        {providers && <SmChart title='Providers' data={providers} className='w-lg mx-auto' />}
        {projects && <SmChart title='Projects' data={projects} className='w-lg mx-auto' />}
        {workorders && <SmChart title='Workorders' data={workorders} className='w-lg mx-auto' />}
      </div>

      <div className={cn('hidden md:block lg:hidden', 'md:my-6 md:px-12 md:grid md:grid-cols-32')}>
        {topologyVersions && <MdChart title='Topology versions' data={topologyVersions} className='col-span-32' />}
        {topologyControlPlaneVersions && (
          <MdChart title='Control plane versions' data={topologyControlPlaneVersions} className='col-span-32' />
        )}
        {environments && <MdChart title='Environments' data={environments} className='col-span-32' />}
        {datacenters && <MdChart title='Datacenters' data={datacenters} className='col-span-16' />}
        {regions && <MdChart title='Regions' data={regions} className='col-span-16' />}
        {providers && <MdChart title='Providers' data={providers} className='col-span-16' />}
        {projects && <MdChart title='Projects' data={projects} className='col-span-32' />}
        {workorders && <MdChart title='Workorders' data={workorders} className='col-span-32' />}
      </div>

      <div className={cn('hidden lg:block xl:hidden', 'lg:my-6 lg:px-12')}>
        <div className='grid lg:grid-cols-32 lg:gap-x-6 lg:gap-y-8'>
          {topologyVersions && (
            <LgChart title='Topology versions' data={topologyVersions} className='col-span-16 min-w-0' />
          )}
          {topologyControlPlaneVersions && (
            <LgChart
              title='Control plane versions'
              data={topologyControlPlaneVersions}
              className='col-span-16 min-w-0'
            />
          )}
          {environments && <LgChart title='Environments' data={environments} className='col-span-16 min-w-0' />}
          {datacenters && <LgChart title='Datacenters' data={datacenters} className='col-span-8 min-w-0' />}
          {regions && <LgChart title='Regions' data={regions} className='col-span-8 min-w-0' />}
          {providers && <LgChart title='Providers' data={providers} className='col-span-8 min-w-0' />}
          {projects && <LgChart title='Projects' data={projects} className='col-span-32 min-w-0' />}
          {workorders && <LgChart title='Workorders' data={workorders} className='col-span-32 min-w-0' />}
        </div>
      </div>

      <div className={cn('hidden xl:block 3xl:hidden', 'xl:my-6 xl:px-12')}>
        <div className='grid xl:grid-cols-32 xl:gap-x-6 xl:gap-y-8'>
          {topologyVersions && (
            <LgChart title='Topology versions' data={topologyVersions} className='col-span-12 min-w-0' />
          )}
          {topologyControlPlaneVersions && (
            <LgChart
              title='Control plane versions'
              data={topologyControlPlaneVersions}
              className='col-span-12 min-w-0'
            />
          )}
          {regions && <LgChart title='Regions' data={regions} className='col-span-8 min-w-0' />}
          {environments && <LgChart title='Environments' data={environments} className='col-span-12 min-w-0' />}
          {datacenters && <LgChart title='Datacenters' data={datacenters} className='col-span-8 min-w-0' />}
          {providers && <LgChart title='Providers' data={providers} className='col-span-8 min-w-0' />}
          {projects && <LgChart title='Projects' data={projects} className='col-span-32 min-w-0' />}
          {workorders && <LgChart title='Workorders' data={workorders} className='col-span-32 min-w-0' />}
        </div>
      </div>

      <div className={cn('hidden 3xl:block 4xl:hidden', '3xl:my-6 3xl:px-12')}>
        <div className='grid 3xl:grid-cols-32 3xl:gap-x-6 3xl:gap-y-8'>
          {topologyVersions && (
            <LgChart title='Topology versions' data={topologyVersions} className='col-span-9 min-w-0' />
          )}
          {topologyControlPlaneVersions && (
            <LgChart
              title='Control plane versions'
              data={topologyControlPlaneVersions}
              className='col-span-9 min-w-0'
            />
          )}
          {environments && <LgChart title='Environments' data={environments} className='col-span-9 min-w-0' />}
          {regions && <LgChart title='Regions' data={regions} className='col-span-5 min-w-0' />}
          {projects && <LgChart title='Projects' data={projects} className='col-span-27 min-w-0' />}
          {datacenters && <LgChart title='Datacenters' data={datacenters} className='col-span-5 min-w-0' />}
          {workorders && <LgChart title='Workorders' data={workorders} className='col-span-27 min-w-0' />}
          {providers && <LgChart title='Providers' data={providers} className='col-span-5 min-w-0' />}
        </div>
      </div>

      <div className={cn('hidden 4xl:block', '4xl:my-6 4xl:px-12')}>
        <div className='grid 4xl:grid-cols-64 4xl:gap-x-6 4xl:gap-y-8'>
          {topologyVersions && (
            <LgChart title='Topology versions' data={topologyVersions} className='col-span-13 min-w-0' />
          )}
          {topologyControlPlaneVersions && (
            <LgChart
              title='Control plane versions'
              data={topologyControlPlaneVersions}
              className='col-span-13 min-w-0'
            />
          )}
          {environments && <LgChart title='Environments' data={environments} className='col-span-13 min-w-0' />}
          {regions && <LgChart title='Regions' data={regions} className='col-span-8 min-w-0' />}
          {datacenters && <LgChart title='Datacenters' data={datacenters} className='col-span-8 min-w-0' />}
          {providers && <LgChart title='Providers' data={providers} className='col-span-8 min-w-0' />}
          {projects && <LgChart title='Projects' data={projects} className='col-span-32 min-w-0' />}
          {workorders && <LgChart title='Workorders' data={workorders} className='col-span-32 min-w-0' />}
        </div>
      </div>

      {/* {kubernetesVersions && Object.keys(kubernetesVersions).length > 0 && <Chart title='Kubernetes Versions' data={kubernetesVersions} />}
          {agentVersions && Object.keys(agentVersions).length > 0 && <Chart title='Agent Versions' data={agentVersions} />}
          {nhnToolingVersion && Object.keys(nhnToolingVersion).length > 0 && <Chart title='NHN Tooling Version' data={nhnToolingVersion} />} */}
    </div>
  )
}
