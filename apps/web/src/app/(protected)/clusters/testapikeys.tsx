import { Button } from '@/components/shadcn/button'
import { createApiKey } from '@/features/api-keys/services/create-api-key'
import { deleteApiKey } from '@/features/api-keys/services/delete-api-key'
import { fetchApiKeys } from '@/features/api-keys/services/fetch-api-keys'
/**
 * Display environment as a tag using consistent color for the different environments
 */
export function TestApiKeys() {
  return (
    <div>
      <Button
        onClick={() => {
          console.log(createApiKey({ name: 'testiprod', ttl: 3600 }))
        }}
      >
        Create
      </Button>

      <Button
        onClick={() => {
          console.log(fetchApiKeys())
        }}
      >
        List
      </Button>

      <Button
        onClick={() => {
          console.log(deleteApiKey({ apikeyId: '699ed39ada2d5be061681605' }))
        }}
      >
        Delete
      </Button>
    </div>
  )
}
