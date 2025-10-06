import { Header } from '@/components/layout/app-shell/header'
import { getRorApi } from '@/services/ror-api'
import { Price } from '@/types/prices'
import { PageView } from './page-view'

const PriceListPage = async () => {
  const api = await getRorApi()
  const res = await api.prices.list()

  console.log('Kubernetes res:', res) // Debug log to check the response

  const items: Price[] = Array.isArray(res) ? res : []

  return (
    <div className='w-full flex flex-col'>
      <Header title='Price list' />
      <PageView simplePrices={items} />
    </div>
  )
}

export default PriceListPage
