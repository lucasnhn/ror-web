/**
 *
 * FILE OVERVIEW
 * ----------------------
 */

'use client'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart'
import { NotReadyMessage } from '@/components/ui/not-ready-message'
import { cn } from '@/utils/clsxm'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

/**

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
  kubernetesVersions: Record<string, number>
  agentVersions: Record<string, number>
  nhnToolingVersion: Record<string, number>
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
}

const data: Record<string, number> = {
  'v1.24.9': 7,
  'v1.25.3': 12,
  'v1.25.13': 61,
  'v1.26.2': 4,
  'v1.26.13': 18,
  'v1.27.5': 9,
  'v1.27.10': 3,
  'v1.27.11': 5,
  'v1.28.4': 14,
  'v1.28.7': 184,
  'v1.29.2': 22,
  'v1.30.0': 6,
  'v1.30.3': 15,
  'v1.31.1': 2,
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
const Chart = ({ title, data }: ChartProps) => {
  const chartData = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }))

  return (
    <div>
      <h2 className='mb-4 text-lg font-medium'>{title}</h2>
      <ChartContainer config={chartConfig} className='h-96 w-[560px]'>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='version'
            tickLine={false}
            tickMargin={10}
            axisLine={true}
            angle={-45}
            textAnchor='end'
            interval={0}
            height={70}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey='count' fill='var(--color-count)' radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export const PageView = ({ className, kubernetesVersions, agentVersions, nhnToolingVersion }: PageViewProps) => {
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

      <div className='flex flex-row flex-wrap gap-6 mx-12 my-6'>
        <Chart title='Kubernetes versions (mock)' data={data} />
        <Chart title='Agent versions (mock)' data={data} />
        <Chart title='NHN Tooling versions (mock)' data={data} />
      </div>

      {/* {kubernetesVersions && Object.keys(kubernetesVersions).length > 0 && <Chart title='Kubernetes Versions' data={kubernetesVersions} />}
            {agentVersions && Object.keys(agentVersions).length > 0 && <Chart title='Agent Versions' data={agentVersions} />}
            {nhnToolingVersion && Object.keys(nhnToolingVersion).length > 0 && <Chart title='NHN Tooling Version' data={nhnToolingVersion} />} */}
    </div>
  )
}
