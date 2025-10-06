import { Header } from '@/components/layout/app-shell/header'
import { getRorApi } from '@/services/ror-api'
import { Price } from '@/types/prices'
import { pricesColumns } from '@/features/economy/components/prices-columns'
import { DataTable } from '@/components/ui/data-table/data-table'

const PriceListPage = async () => {
  const api = await getRorApi()
  const res = await api.prices.list()

  console.log('Kubernetes res:', res) // Debug log to check the response

  const items: Price[] = Array.isArray(res) ? res : []

  return (
    <div className='w-full flex flex-col'>
      <Header title='Price list' />
      <div className='mx-6 my-8'>
        <DataTable columns={pricesColumns} data={items} />
      </div>
    </div>
  )
}

export default PriceListPage
