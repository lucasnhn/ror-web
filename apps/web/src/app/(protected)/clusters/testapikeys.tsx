import { Button } from '@/components/shadcn/button'
import { fetchApiKeys } from '@/features/api-keys/services/fetch-api-keys'
/**
 * Display environment as a tag using consistent color for the different environments
 */
export function TestApiKeys() {
  return (
    <div>
      {/* <Button onClick={() => {

        }}>
            Create
        </Button> */}

      <Button
        onClick={() => {
          console.log(fetchApiKeys())
        }}
      >
        List
      </Button>

      {/* <Button onClick={() => {

        }}>
            Delete
        </Button> */}
    </div>
  )
}
