import { Header } from '@/components/layout/app-shell/header'
import { PageView } from './page-view'
import { getRorApi } from '@/services/ror-api'

export default async function ClustersPage() {
  const api = await getRorApi()
  const res = await api.projects.list()
  const projects = res.data

  return (
    <div className='w-full flex flex-col'>
      <Header title='New Cluster' />
      <PageView projects={projects} />
    </div>
  )
}
