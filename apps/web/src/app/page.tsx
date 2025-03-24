import { MetricsBoard } from './clusters/metrics-board'

export default function Home() {
  return (
    <div className='flex flex-col p-8 gap-16'>
      <MetricsBoard />
    </div>
  )
}
