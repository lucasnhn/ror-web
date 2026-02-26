import { getRorApi } from '@/services/ror-api'
import { Tile } from '@ror/react/components/tile'
import { Button } from '@/components/shadcn/button'
import { Trash } from 'lucide-react'
import { format } from 'date-fns'

export async function ApiKeysTile() {
  try {
    const api = await getRorApi()
    const keys = (await api.apiKey.list()).data ?? []

    return (
      <Tile className='p-5 mt-8'>
        <h3 className='r-heading-03 mb-4'>API keys</h3>

        <div className='overflow-hidden rounded-lg border'>
          <table className='w-full table table-auto'>
            <thead>
              <tr>
                <th className='border border-t-0 border-l-0 px-2 py-1'>Name</th>
                <th className='border border-t-0 px-2 py-1'>Created</th>
                <th className='border border-t-0 px-2 py-1'>Expires</th>
                <th className='border border-t-0 border-r-0 px-2 py-1'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className='last:[&>td]:border-b-0'>
                  <td className='border border-l-0 px-2 py-1'>{k.displayName}</td>
                  <td className='border px-2 py-1'>{format(new Date(k.created), 'dd.MM.yy, HH:mm')}</td>
                  <td className='border px-2 py-1'>
                    {k.expires ? format(new Date(k.expires), 'dd.MM.yy, HH:mm') : 'No expiration'}
                  </td>
                  <td className='border border-r-0 px-2 py-1 text-center'>
                    <Button variant='destructive' type='button' disabled>
                      <Trash />
                    </Button>
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={4} className='px-2 py-3 text-sm text-muted-foreground'>
                    No API keys
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
