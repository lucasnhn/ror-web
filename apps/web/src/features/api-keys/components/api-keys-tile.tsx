import { getRorApi } from '@/services/ror-api'
import { Tile } from '@ror/react/components/tile'
import { ApiKeysTable } from './api-keys-table'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { CreateApiKeyForm } from './create-api-key-form'

export async function ApiKeysTile() {
  try {
    const api = await getRorApi()
    const keys = (await api.apiKey.list()).data ?? []

    return (
      <Tile className='p-5 mt-8'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='r-heading-03'>API keys</h3>
          <Button>
            <Plus /> Create new API key
          </Button>
        </div>

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
        <div className='flex justify-between items-center mb-4'>
          <h3 className='r-heading-03'>API keys</h3>
          <Button>
            <Plus /> Create new API key
          </Button>
        </div>
        <hr />
        <CreateApiKeyForm />
        <hr />
        An unexpected error occurred. We could not fetch your API keys.
      </Tile>
    )
  }
}
