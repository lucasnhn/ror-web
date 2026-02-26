import { getRorApi } from '@/services/ror-api'
import { Tile } from '@ror/react/components/tile'
import { ApiKeysTable } from './api-keys-table'

export async function ApiKeysTile() {
  try {
    const api = await getRorApi()
    const keys = (await api.apiKey.list()).data ?? []

    return (
      <Tile className='p-5 mt-8'>
        <h3 className='r-heading-03 mb-4'>API keys</h3>

        {keys.length === 0 ? (
          <p className='px-2 py-3 text-sm text-muted-foreground'>No API keys</p>
        ) : (
          <ApiKeysTable keys={keys} />
        )}
      </Tile>
    )
  } catch (error) {
    console.error('Failed to fetch API keys', error)
    return (
      <Tile className='p-5 mt-8'>
        <h3 className='r-heading-03 mb-4'>API keys</h3>
        An unexpected error occurred. We could not fetch your API keys.
      </Tile>
    )
  }
}
